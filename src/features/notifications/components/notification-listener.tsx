import { NotificationDto, NotificationType } from "@/api/notification/dto/notification.dto";
import { useCallback } from "react";
import { useNotificationCacheMutations, useUnreadCount } from "../hooks/use-notification-store";
import { useToast } from "@/contexts";
import { SocketMessage } from "@/api/common/socket-message";

export type NotificationHubEvent = SocketMessage<NotificationDto>;

export function useNotificationListenerHandler() {
  const { pushToast } = useToast();
  const { incrementUnread, decrementUnread } = useUnreadCount();
  const { addNotificationToCache, removeNotificationFromCache } = useNotificationCacheMutations();

  return useCallback(
    (message: SocketMessage<NotificationDto>) => {
      if (message.event !== "NewNotification") return;
      const data: NotificationDto = message.payload;

      if (data.type === NotificationType.CancelNotification) {
        const notificationIdToCancel = data.data.notificationId;

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
}

export default useNotificationListenerHandler;
