import { useEffect } from "react";
import { connection } from "./notificationHubClient";

export function useNotificationHub() {
    useEffect(() => {
        connection.start()
            .then(() => {
                console.log("Notification Hub connected");
            })
            .catch((err) => {
                console.error("Error connecting to Notification Hub: ", err);
            })

        connection.on("ReceiveNotification", (notification) => {
            console.log("Notification received: ", notification);
            // Handle the notification here, e.g., show a toast or update state
        });

        return () => {
            connection.stop()
                .then(() => {
                    console.log("Notification Hub disconnected");
                })
                .catch((err) => {
                    console.error("Error disconnecting from Notification Hub: ", err);
                });
        }
    }, []);
}