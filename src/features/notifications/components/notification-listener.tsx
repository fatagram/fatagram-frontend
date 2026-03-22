import { NotificationDto, NotificationType } from "@/api/notification/dto/notification.dto";
import { useCallback } from "react";
import { useNotificationCacheMutations, useUnreadCount } from "../hooks/use-notification-store";
import { useToast } from "@/contexts";
import { useAppHub } from "@/features/hub/use-app-hub";
import { SocketMessage } from "@/api/common/socket-message";

export function NotificationListener() {
  const { pushToast } = useToast();
  const { incrementUnread, decrementUnread } = useUnreadCount();
  const { addNotificationToCache, removeNotificationFromCache } = useNotificationCacheMutations();

  const handleNewNotification = useCallback(
    (message: SocketMessage<NotificationDto>) => {
      if (message.event !== "NewNotification") return;
      const data: NotificationDto = message.payload;
      console.log("Received CancelNotification with data:", data);

      if (data.type === NotificationType.CancelNotification) {
        const notificationIdToCancel = data.data.notificationId;
        console.log("Canceling notification with ID:", notificationIdToCancel);

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

  useAppHub<NotificationDto>(handleNewNotification);

  return null;
}

export default NotificationListener;
