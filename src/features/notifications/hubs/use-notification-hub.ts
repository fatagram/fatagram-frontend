import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { createSignalRConnection } from "./notification-hub-client";

export function useNotificationHub(onReceiveNotification: (data: NotificationDto) => void) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    useEffect(() => {
        const conn = createSignalRConnection();

        conn.start()
            .then(() => {
                setConnection(conn);
            })
            .catch((err) => console.error("Error while starting SignalR connection: ", err));
        
        return () => {
            conn.stop();
            setConnection(null);
        }
    }, []);

    useEffect(() => {
        if (!connection) return;

        connection.on("ReceiveNotification", (data: NotificationDto) => {
            onReceiveNotification(data);
        });

        return () => {
            if (connection) {
                connection.off("ReceiveNotification");
            }
        }
    }, [connection, onReceiveNotification]);
}