import { NotificationDto } from "@/api/notification/dto/notification.dto";
import React from "react";
import { useTranslation } from "react-i18next";
import NotificationFactory from "../notification-factory";
import { useNavigate } from "react-router";
import { notificationService } from "@/api/notification/notification.api";
import NotificationSkeletonLoading from "../notification-items/notification.skeleton";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import { useNotifications } from "../../hooks/use-notification";
import InfiniteScroll from "@/components/utils/infinite-scroll";
import {
  useNotificationCacheMutations,
  useNotificationUiState,
  useUnreadCount,
} from "../../hooks/use-notification-store";

type NotificationMenuProps = {
  className?: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
};

const NotificationMenu: React.FC<NotificationMenuProps> = ({ className, onClick, ref }) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetching } = useNotifications({
    limit: 20,
  });

  const { isInNotificationPage } = useNotificationUiState();
  const { unreadCount, setUnreadCount } = useUnreadCount();
  const { markAsReadInCache, markAllAsReadInCache, clearAllFromCache, invalidateNotifications } =
    useNotificationCacheMutations();

  const notifications = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const handleMarkAllAsRead = async () => {
    markAllAsReadInCache();
    setUnreadCount(0);
    await notificationService.markAllAsRead();
    invalidateNotifications();
  };

  const handleDeleteAll = async () => {
    clearAllFromCache();
    setUnreadCount(0);
    await notificationService.deleteAllNotifications();
    invalidateNotifications();
  };

  return (
    <div
      className={clsx(
        "bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top",
        className,
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between px-2 pt-2">
        <Text sz="lg-1" weight="bold">
          {t("notifications:notifications.title")}
        </Text>
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Text
                sz="sm-1"
                color="secondary"
                className="cursor-pointer hover:underline"
                onClick={handleMarkAllAsRead}
              >
                {t("notifications:notifications.mark-all-read")}
              </Text>
            )}
            <Text
              sz="sm-1"
              color="secondary"
              className="cursor-pointer hover:underline"
              onClick={handleDeleteAll}
            >
              {t("notifications:notifications.delete-all")}
            </Text>
          </div>
        )}
      </div>
      {notifications.length > 0 ? (
        <div className="relative py-1 overflow-y-scroll scrollbar-none max-h-[500px]">
          <InfiniteScroll
            itemInRow={1}
            items={notifications}
            onLoadMore={fetchNextPage}
            className="gap-0"
            itemTemplate={(item: any) => {
              const notification = item as NotificationDto;
              return (
                <div
                  key={notification.id}
                  className={clsx(
                    "px-2 py-3 hover:bg-bg-fourth rounded-lg cursor-pointer",
                    "transition-all duration-200 hover:scale-[1.01]",
                    "active:scale-[0.99]",
                  )}
                >
                  <NotificationFactory
                    notificationDto={notification}
                    onClick={async () => {
                      navigate(notification.link || "/");
                      if (!notification.isRead) {
                        markAsReadInCache(notification.id);
                        setUnreadCount((prev: number) => Math.max(prev - 1, 0));
                      }
                      await notificationService.markAsRead(notification.id);
                      onClick?.();
                    }}
                  />
                </div>
              );
            }}
            hasMore={!!hasNextPage}
            isLoading={isFetching}
            loadingSkeleton={<NotificationSkeletonLoading />}
            numberOfSkeletons={2}
          />
        </div>
      ) : (
        <>
          {!isFetching ? (
            <div className="flex items-center justify-center h-40">
              {t("notifications:notifications.no-notifications")}
            </div>
          ) : (
            <div className="flex flex-col px-2 py-2 gap-3">
              <NotificationSkeletonLoading />
              <NotificationSkeletonLoading />
              <NotificationSkeletonLoading />
              <NotificationSkeletonLoading />
              <NotificationSkeletonLoading />
            </div>
          )}
        </>
      )}

      {!isInNotificationPage && (
        <div className="absolute right-4" onClick={() => navigate("/notifications")}>
          <Text sz="sm-1" color="secondary" className={clsx("cursor-pointer underline")}>
            {t("notifications:notifications.open-notifications")}
          </Text>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
