import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { HubConnection } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { createSignalRConnection } from "./notification-hub-client";
import { useAuth } from "@/contexts/auth/auth-context";
import { on } from "events";

export function useNotificationHub(onReceiveNotification: (data: NotificationDto) => void) {
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
          conn.on("ReceiveNotification", (data: NotificationDto) => {
            if (isMounted) {
              onReceiveNotification(data);
            }
          });
        } catch (err) {
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
