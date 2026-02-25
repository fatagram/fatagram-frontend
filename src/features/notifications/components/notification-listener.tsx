import { useNotificationHub } from "../hubs/use-notification-hub";
import { NotificationDto, NotificationType } from "@/api/notification/dto/notification.dto";
import { useCallback } from "react";
import { useToast } from "@/hooks/contexts/use-toast";
import { useNotificationCacheMutations, useUnreadCount } from "../hooks/use-notification-store";

export function NotificationListener() {
  const { pushToast } = useToast();
  const { incrementUnread, decrementUnread } = useUnreadCount();
  const { addNotificationToCache, removeNotificationFromCache } = useNotificationCacheMutations();

  const handleNewNotification = useCallback(
    (data: NotificationDto) => {
      console.log("Received CancelNotification with data:", data);

      if (data.type === NotificationType.CancelNotification) {
        const notificationIdToCancel = data.data.notificationId;
        console.log("12 Canceling notification with ID:", notificationIdToCancel);

        // Remove from notification list AND decrement unread count
        removeNotificationFromCache(notificationIdToCancel);
        decrementUnread();
        return;
      }

      // Add to notification list AND increment unread count
      addNotificationToCache(data);
      incrementUnread();

      pushToast({
        id: data.id,
        type: "notification",
        payload: {
          notificationDto: data,
        },
        duration: 5000,
      });
    },
    [
      pushToast,
      addNotificationToCache,
      removeNotificationFromCache,
      incrementUnread,
      decrementUnread,
    ],
  );

  useNotificationHub(handleNewNotification);

  return null;
}

export default NotificationListener;
