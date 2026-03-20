import { HubConnection } from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { authEvents } from "@/events/auth-event";
import { useAuth } from "@/contexts";
import { createSignalRConnection } from "./message-hub-client";
import { MessageResponseDto } from "@/api/message/dto/message.dto";

export function useMessageHub(onReceiveMessage: (data: MessageResponseDto) => void) {
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
          conn.on("ReceiveMessage", (data: MessageResponseDto) => {
            if (isMounted) {
              onReceiveMessage(data);
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

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [isAuthenticated]);
}
