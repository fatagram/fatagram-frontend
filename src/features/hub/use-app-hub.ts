import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { authEvents } from "@/events/auth-event";
import { useAuth } from "@/contexts";
import { createSignalRConnection } from "../../api/socket/app-hub-client";
import { SocketMessage } from "@/api/common/socket-message";

export function useAppHub<T>(onReceiveMessage: (message: SocketMessage<T>) => void) {
  const connectionRef = useRef<HubConnection | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    const startConnection = async () => {
      const conn = createSignalRConnection();
      connectionRef.current = conn;

      const tryConnect = async (retry: number = 0) => {
        try {
          await conn.start();
          conn.on("ReceiveMessage", (message: SocketMessage<T>) => {
            if (isMounted) {
              onReceiveMessage(message);
            }
          });
        } catch (err: any) {
          if (err?.message?.includes("ONBOARDING_NOT_COMPLETED")) {
            authEvents.emit("redirectToOnboarding");
            return;
          }
          console.error("SignalR connection error: ", err);
          if (retry < 5) {
            setTimeout(() => tryConnect(retry + 1), 500);
          }
        }
      };
      tryConnect();
    };

    startConnection();

    const handleOnboardingCompleted = async () => {
      console.log("Onboarding completed, attempting to connect to App Hub...");
      const conn = connectionRef.current;
      if (!conn) return;
      try {
        if (conn.state === HubConnectionState.Disconnected) {
          await conn.start();
          conn.on("ReceiveMessage", (message: SocketMessage<T>) => {
            if (isMounted) {
              onReceiveMessage(message as any);
            }
          });
        }
      } catch (err) {
        // ignore: will let existing retry logic handle further attempts
        console.error("SignalR reconnect after onboarding error:", err);
      }
    };

    authEvents.on("onboardingCompleted", handleOnboardingCompleted);

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      authEvents.off("onboardingCompleted", handleOnboardingCompleted);
    };
  }, [isAuthenticated]);
}
