import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { authEvents } from "@/events/auth-event";
import { useAuth } from "@/contexts";
import { createSignalRConnection } from "../../api/socket/app-hub-client";
import { SocketMessage } from "@/api/common/socket-message";

const MAX_RETRY = 5;

let _sharedConnection: HubConnection | null = null;
const _stateListeners = new Set<(state: HubConnectionState) => void>();

function broadcastState(state: HubConnectionState) {
  _stateListeners.forEach((fn) => fn(state));
}

interface AppHubReturn {
  invoke: (methodName: string, ...args: any[]) => Promise<any>;
  connectionState?: HubConnectionState;
}

export function useAppHub<T>(
  onReceiveMessage?: (message: SocketMessage<T>) => void,
  onConnected?: () => void,
): AppHubReturn {
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    _sharedConnection?.state ?? HubConnectionState.Disconnected,
  );
  const onReceiveMessageRef = useRef(onReceiveMessage);
  const onConnectedRef = useRef(onConnected);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    onReceiveMessageRef.current = onReceiveMessage;
    onConnectedRef.current = onConnected;
  }, [onReceiveMessage, onConnected]);

  useEffect(() => {
    const listener = (state: HubConnectionState) => setConnectionState(state);
    _stateListeners.add(listener);
    if (_sharedConnection) {
      setConnectionState(_sharedConnection.state);
    }
    return () => {
      _stateListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !onReceiveMessage) return;

    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const receiveMessageHandler = (message: SocketMessage<T>) => {
      if (isMounted) {
        onReceiveMessageRef.current?.(message);
      }
    };

    const tryConnect = async (retry: number = 0, isTriggerConnectedCallback: boolean = false) => {
      const conn = _sharedConnection;
      if (!conn) return;

      try {
        if (conn.state === HubConnectionState.Disconnected) {
          await conn.start();
          broadcastState(conn.state);

          conn.off("ReceiveMessage", receiveMessageHandler);
          conn.on("ReceiveMessage", receiveMessageHandler);

          if (isTriggerConnectedCallback && onConnectedRef.current) {
            onConnectedRef.current();
          }
        }
      } catch (err: any) {
        if (err?.message?.includes("ONBOARDING_NOT_COMPLETED")) {
          authEvents.emit("redirectToOnboarding");
          return;
        }
        console.error("SignalR connection error: ", err);
        if (retry < MAX_RETRY) {
          reconnectTimer = setTimeout(() => tryConnect(retry + 1, isTriggerConnectedCallback), 500);
        }
      }
    };

    const handleSignalRReconnected = () => {
      broadcastState(HubConnectionState.Connected);
      if (onConnectedRef.current) {
        onConnectedRef.current();
      }
    };

    const startConnection = async () => {
      _sharedConnection = createSignalRConnection();
      _sharedConnection.onreconnected(handleSignalRReconnected);
      await tryConnect(0, true);
    };

    startConnection();

    const handleOnboardingCompleted = async () => {
      await tryConnect(0, true);
    };

    const handleNetworkOrVisibilityChange = async () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        const conn = _sharedConnection;

        if (conn?.state === HubConnectionState.Disconnected) {
          await tryConnect(0, true);
        } else if (conn?.state === HubConnectionState.Reconnecting) {
          await conn.stop();
          await tryConnect(0, true);
        } else if (conn?.state === HubConnectionState.Connected) {
          if (onConnectedRef.current) {
            onConnectedRef.current();
          }
        }
      }
    };

    authEvents.on("onboardingCompleted", handleOnboardingCompleted);
    window.addEventListener("online", handleNetworkOrVisibilityChange);
    document.addEventListener("visibilitychange", handleNetworkOrVisibilityChange);

    return () => {
      isMounted = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (_sharedConnection) {
        _sharedConnection.off("ReceiveMessage", receiveMessageHandler);
        _sharedConnection.onreconnected(() => {});
        _sharedConnection.stop();
        _sharedConnection = null;
        broadcastState(HubConnectionState.Disconnected);
      }
      authEvents.off("onboardingCompleted", handleOnboardingCompleted);
      window.removeEventListener("online", handleNetworkOrVisibilityChange);
      document.removeEventListener("visibilitychange", handleNetworkOrVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const invoke = async (methodName: string, ...args: any[]) => {
    const conn = _sharedConnection;
    if (conn && conn.state === HubConnectionState.Connected) {
      try {
        await conn.invoke("HandleAction", methodName, args[0], args[1] || null);
      } catch (err) {
        console.error(`Error invoking ${methodName}:`, err);
      }
    } else {
      console.warn("SignalR: Connection is not in Connected state.");
    }
  };

  return {
    invoke,
    connectionState,
  };
}
