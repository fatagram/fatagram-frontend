import { notificationService } from "@/api/notification/notification.api";
import { useSafeInfiniteQueryResult } from "@/hooks/use-safe-query";
import { CursorQuery } from "@/types/query";
import { useAuth } from "@/hooks/contexts/use-auth";

export const useNotifications = (queryParams?: Omit<CursorQuery<string>, "cursor">) => {
  const { userId } = useAuth();

  return useSafeInfiniteQueryResult({
    queryKey: ["notifications", userId, queryParams],
    fn: async (cursor?: string) => {
      return await notificationService.getNotifications({ ...queryParams, cursor });
    },
    enabled: !!userId,
  });
};
