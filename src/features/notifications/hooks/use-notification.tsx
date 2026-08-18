import { notificationService } from "@/api/notification/notification.api";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useResultFetcher } from "@/hooks/use-fetcher";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts";

const notificationQueryKey = (userId: string, queryParams?: Omit<CursorQuery<string>, "cursor">) =>
  ["notifications", userId, queryParams] as const;

export const useNotifications = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  return useSafeInfiniteQueryResult({
    queryKey: notificationQueryKey(userId!, queryParams),
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
  return useResultFetcher(notificationService.markAllAsRead);
};

export const useDeleteAllNotifications = () => {
  const qc = useQueryClient();
  return useResultFetcher(notificationService.deleteAll, {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useResultFetcher((notificationId: string) => notificationService.delete(notificationId), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useDeleteBatchNotifications = () => {
  return useResultFetcher(
    (notificationIds: string[]) => notificationService.deleteBatch(notificationIds),
    // No onSuccess invalidation: optimistic removal in removeNotificationsFromCache
    // handles the UI. Invalidation on error is handled at the call-site.
  );
};
