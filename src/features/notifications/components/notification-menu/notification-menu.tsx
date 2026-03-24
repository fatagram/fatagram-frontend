import { NotificationDto } from "@/api/notification/dto/notification.dto";
import React from "react";
import { useTranslation } from "react-i18next";
import NotificationFactory from "../notification-factory";
import { useNavigate } from "react-router";
import { notificationService } from "@/api/notification/notification.api";
import NotificationSkeletonLoading from "../notification-items/notification-skeleton";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import {
  useDeleteAllNotifications,
  useMarkNotificationAsRead,
  useNotifications,
} from "../../hooks/use-notification";
import InfiniteScroll from "@/components/ui/utils/infinite-scroll";
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

const NotificationMenu: React.FC<NotificationMenuProps> = ({ className, ref }) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetching } = useNotifications({
    limit: 20,
  });
  const { fetch: deleteAll } = useDeleteAllNotifications();

  const { isInNotificationPage } = useNotificationUiState();
  const { unreadCount, setUnreadCount } = useUnreadCount();
  const { markAsReadInCache, markAllAsReadInCache, clearAllFromCache, invalidateNotifications } =
    useNotificationCacheMutations();

  const { fetch: markAsRead } = useMarkNotificationAsRead();

  const notifications = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const handleMarkAllAsRead = async () => {
    markAllAsReadInCache();
    setUnreadCount(0);
    await notificationService.markAllAsRead();
    invalidateNotifications();
  };

  const handleDeleteAll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteAll({
      onSuccess: () => {
        clearAllFromCache();
        setUnreadCount(0);
        invalidateNotifications();
      },
      onError: () => {
        console.error("Failed to delete all notifications");
      },
    });
  };

  return (
    <div
      className={clsx(
        "bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide",
        className,
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between px-2 pt-2">
        <Text sz="lg-1" weight="bold">
          {t("notifications:notifications.title")}
        </Text>
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer"
                onClick={handleMarkAllAsRead}
                title={t("notifications:notifications.mark-all-read")}
              >
                <Text sz="md-1" color="secondary">
                  <i className="fa-solid fa-check-double"></i>
                </Text>
              </button>
            )}
            <button
              className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer"
              onClick={handleDeleteAll}
              title={t("notifications:notifications.delete-all")}
            >
              <Text sz="md-1" color="secondary">
                <i className="fa-solid fa-trash-can"></i>
              </Text>
            </button>
          </div>
        )}
      </div>
      <div className="relative py-1 max-h-[500px]">
        <InfiniteScroll
          itemInRow={1}
          items={notifications}
          onLoadMore={fetchNextPage}
          className="gap-0 scrollbar-hide"
          itemTemplate={(item: any) => {
            const notification = item as NotificationDto;
            return (
              <div
                className={clsx(
                  "px-2 py-3 hover:bg-bg-fourth rounded-lg cursor-pointer",
                  "transition-all duration-200 hover:scale-[1.01]",
                  "active:scale-[0.99]",
                )}
              >
                <NotificationFactory
                  notificationDto={notification}
                  onClick={async () => {
                    markAsRead(notification.id, {
                      onSuccess: () => {
                        markAsReadInCache(notification.id);
                        setUnreadCount((prev: number) => Math.max(prev - 1, 0));
                      },
                    });
                  }}
                />
              </div>
            );
          }}
          itemKey={(item: any, index: number) => (item as NotificationDto).id + "-" + index}
          hasMore={!!hasNextPage}
          isLoading={isFetching}
          loadingSkeleton={<NotificationSkeletonLoading />}
          numberOfSkeletons={2}
          emptyComponent={
            <div className="flex items-center justify-center h-40">
              {t("notifications:notifications.no-notifications")}
            </div>
          }
        />
      </div>

      {!isInNotificationPage && (
        <div className="flex justify-center border-t border-text-main/10 pt-2 pb-1 px-2">
          <button
            className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/notifications")}
            title={t("notifications:notifications.open-notifications")}
          >
            <Text sz="sm-1" color="secondary">
              {t("notifications:notifications.open-notifications")}
            </Text>
            <Text sz="sm-1" color="secondary">
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
