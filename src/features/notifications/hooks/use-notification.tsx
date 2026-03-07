import { notificationService } from "@/api/notification/notification.api";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useAuth } from "@/hooks/contexts/use-auth";
import { useResultFetcher } from "@/hooks/use-fetcher";

export const useNotifications = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  return useSafeInfiniteQueryResult({
    queryKey: ["notifications", userId, queryParams],
    fn: async (cursor?: string) =>
      await notificationService.getNotifications({ ...queryParams, cursor }),
    enabled: !!userId,
  });
};

export const useMarkNotificationAsRead = () => {
  return useResultFetcher((notificationId: string) =>
    notificationService.markAsRead(notificationId),
  );
};

export const useMarkAllNotificationsAsRead = () => {
  return useResultFetcher(() => notificationService.markAllAsRead());
};

export const useDeleteAllNotifications = () => {
  return useResultFetcher(() => notificationService.deleteAll());
};

export const useDeleteNotification = () => {
  return useResultFetcher((notificationId: string) => notificationService.delete(notificationId));
};
