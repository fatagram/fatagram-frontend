import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { authEvents } from "@/events/auth-event";
import { useAuth } from "@/contexts";
import { createSignalRConnection } from "../../api/socket/app-hub-client";
import { SocketMessage } from "@/api/common/socket-message";

export function useAppHub<T>(onReceiveMessage: (message: SocketMessage<T>) => void) {
  const connectionRef = useRef<HubConnection | null>(null);
  const onReceiveMessageRef = useRef(onReceiveMessage);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    onReceiveMessageRef.current = onReceiveMessage;
  }, [onReceiveMessage]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    const receiveMessageHandler = (message: SocketMessage<T>) => {
      if (isMounted) {
        onReceiveMessageRef.current(message);
      }
    };

    const startConnection = async () => {
      const conn = createSignalRConnection();
      connectionRef.current = conn;

      const tryConnect = async (retry: number = 0) => {
        try {
          await conn.start();
          conn.off("ReceiveMessage", receiveMessageHandler);
          conn.on("ReceiveMessage", receiveMessageHandler);
        } catch (err: any) {
          if (err?.message?.includes("ONBOARDING_NOT_COMPLETED")) {
            authEvents.emit("redirectToOnboarding");
            return;
          }
          console.error("SignalR connection error: ", err);
          if (retry < 5) {
            reconnectTimer = setTimeout(() => tryConnect(retry + 1), 500);
          }
        }
      };
      tryConnect();
    };

    startConnection();

    const handleOnboardingCompleted = async () => {
      const conn = connectionRef.current;
      if (!conn) return;
      try {
        if (conn.state === HubConnectionState.Disconnected) {
          await conn.start();
          conn.off("ReceiveMessage", receiveMessageHandler);
          conn.on("ReceiveMessage", receiveMessageHandler);
        }
      } catch (err) {
        // ignore: will let existing retry logic handle further attempts
        console.error("SignalR reconnect after onboarding error:", err);
      }
    };

    authEvents.on("onboardingCompleted", handleOnboardingCompleted);

    return () => {
      isMounted = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveMessage", receiveMessageHandler);
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      authEvents.off("onboardingCompleted", handleOnboardingCompleted);
    };
  }, [isAuthenticated]);
}
