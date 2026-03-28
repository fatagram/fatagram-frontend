import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { useSafeQueryResult } from "@/hooks/use-safe-query";
import { notificationService } from "@/api/notification/notification.api";
import { useAuth } from "@/contexts";

export const notificationKeys = {
  list: (userId?: string, params?: any) => ["notifications", userId, params] as const,
  unreadCount: (userId?: string) => ["notifications-unread-count", userId] as const,
  uiState: () => ["notifications-ui-state"] as const,
};

interface NotificationUiState {
  isShowNotification: boolean;
  isInNotificationPage: boolean;
}

const DEFAULT_UI_STATE: NotificationUiState = {
  isShowNotification: false,
  isInNotificationPage: false,
};

export function useNotificationUiState() {
  const queryClient = useQueryClient();

  const { data: uiState = DEFAULT_UI_STATE } = useQuery<NotificationUiState>({
    queryKey: notificationKeys.uiState(),
    queryFn: () => DEFAULT_UI_STATE,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const setShowNotification = useCallback(
    (value: boolean) => {
      queryClient.setQueryData<NotificationUiState>(notificationKeys.uiState(), (old) => ({
        ...(old ?? DEFAULT_UI_STATE),
        isShowNotification: value,
      }));
    },
    [queryClient],
  );

  const setInNotificationPage = useCallback(
    (value: boolean) => {
      queryClient.setQueryData<NotificationUiState>(notificationKeys.uiState(), (old) => ({
        ...(old ?? DEFAULT_UI_STATE),
        isInNotificationPage: value,
      }));
    },
    [queryClient],
  );

  return {
    isShowNotification: uiState.isShowNotification,
    isInNotificationPage: uiState.isInNotificationPage,
    setShowNotification,
    setInNotificationPage,
  };
}

export function useUnreadCount() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  const { data: unreadCount = 0 } = useSafeQueryResult<number>({
    queryKey: notificationKeys.unreadCount(userId),
    fn: async () => await notificationService.getUnreadCount(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!userId,
  });

  const setUnreadCount = useCallback(
    (value: number | ((prev: number) => number)) => {
      queryClient.setQueryData<number>(notificationKeys.unreadCount(userId), (old = 0) =>
        typeof value === "function" ? value(old) : value,
      );
    },
    [queryClient, userId],
  );

  const incrementUnread = useCallback(
    (by = 1) => setUnreadCount((prev) => prev + by),
    [setUnreadCount],
  );

  const decrementUnread = useCallback(
    (by = 1) => setUnreadCount((prev) => Math.max(prev - by, 0)),
    [setUnreadCount],
  );

  return { unreadCount, setUnreadCount, incrementUnread, decrementUnread };
}

type NotificationPages = {
  pages: Array<{ items: NotificationDto[]; nextCursor?: string; hasNext: boolean }>;
  pageParams: any[];
};

export function useNotificationCacheMutations() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const addNotificationToCache = useCallback(
    (notification: NotificationDto) => {
      queryClient.setQueriesData<NotificationPages>(
        { queryKey: ["notifications", userId] },
        (oldData) => {
          if (!oldData?.pages?.length) {
            return {
              pages: [{ items: [notification], nextCursor: undefined, hasNext: false }],
              pageParams: [undefined],
            };
          }

          const firstPage = oldData.pages[0];
          // Avoid duplicates
          if (firstPage.items.some((n) => n.id === notification.id)) return oldData;

          return {
            ...oldData,
            pages: [
              { ...firstPage, items: [notification, ...firstPage.items] },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );
    },
    [queryClient, userId],
  );

  const removeNotificationFromCache = useCallback(
    (notificationId: string) => {
      queryClient.setQueriesData<NotificationPages>(
        { queryKey: ["notifications", userId] },
        (oldData) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((n) => n.id !== notificationId),
            })),
          };
        },
      );
    },
    [queryClient, userId],
  );

  const markAsReadInCache = useCallback(
    (notificationId: string) => {
      queryClient.setQueriesData<NotificationPages>(
        { queryKey: ["notifications", userId] },
        (oldData) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
            })),
          };
        },
      );
    },
    [queryClient, userId],
  );

  const markAllAsReadInCache = useCallback(() => {
    queryClient.setQueriesData<NotificationPages>(
      { queryKey: ["notifications", userId] },
      (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((n) => ({ ...n, isRead: true })),
          })),
        };
      },
    );
  }, [queryClient, userId]);

  const clearAllFromCache = useCallback(() => {
    queryClient.setQueriesData<NotificationPages>(
      { queryKey: ["notifications", userId] },
      (oldData) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: [],
          })),
        };
      },
    );
  }, [queryClient, userId]);

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
  }, [queryClient, userId]);

  return {
    addNotificationToCache,
    removeNotificationFromCache,
    markAsReadInCache,
    markAllAsReadInCache,
    clearAllFromCache,
    invalidateNotifications,
  };
}
