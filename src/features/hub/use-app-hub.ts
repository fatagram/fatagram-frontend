import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { authEvents } from "@/events/auth-event";
import { useAuth } from "@/contexts";
import { createSignalRConnection } from "../../api/socket/app-hub-client";
import { SocketMessage } from "@/api/common/socket-message";

const MAX_RETRY = 5;

export function useAppHub<T>(
  onReceiveMessage: (message: SocketMessage<T>) => void,
  onReconnect?: () => void,
) {
  const connectionRef = useRef<HubConnection | null>(null);
  const onReceiveMessageRef = useRef(onReceiveMessage);
  const onReconnectRef = useRef(onReconnect);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    onReceiveMessageRef.current = onReceiveMessage;
    onReconnectRef.current = onReconnect;
  }, [onReceiveMessage, onReconnect]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const receiveMessageHandler = (message: SocketMessage<T>) => {
      if (isMounted) {
        onReceiveMessageRef.current(message);
      }
    };

    const tryConnect = async (retry: number = 0, isReconnectingEvent: boolean = false) => {
      const conn = connectionRef.current;
      if (!conn) return;

      try {
        if (conn.state === HubConnectionState.Disconnected) {
          await conn.start();
          conn.off("ReceiveMessage", receiveMessageHandler);
          conn.on("ReceiveMessage", receiveMessageHandler);

          if (isReconnectingEvent && onReconnectRef.current) {
            onReconnectRef.current();
          }
        }
      } catch (err: any) {
        if (err?.message?.includes("ONBOARDING_NOT_COMPLETED")) {
          authEvents.emit("redirectToOnboarding");
          return;
        }
        console.error("SignalR connection error: ", err);
        if (retry < MAX_RETRY) {
          reconnectTimer = setTimeout(() => tryConnect(retry + 1, isReconnectingEvent), 500);
        }
      }
    };

    const handleSignalRReconnected = () => {
      if (onReconnectRef.current) {
        onReconnectRef.current();
      }
    };

    const startConnection = async () => {
      connectionRef.current = createSignalRConnection();

      connectionRef.current.onreconnected(handleSignalRReconnected);

      await tryConnect();
    };

    startConnection();

    const handleOnboardingCompleted = async () => {
      await tryConnect(0, true);
    };

    const handleNetworkOrVisibilityChange = async () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        const conn = connectionRef.current;
        if (conn?.state === HubConnectionState.Disconnected) {
          await tryConnect(0, true);
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
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveMessage", receiveMessageHandler);
        connectionRef.current.onreconnected(() => {});
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      authEvents.off("onboardingCompleted", handleOnboardingCompleted);
      window.removeEventListener("online", handleNetworkOrVisibilityChange);
      document.removeEventListener("visibilitychange", handleNetworkOrVisibilityChange);
    };
  }, [isAuthenticated]);
}
