import { NotificationDto } from "@/api/notification/dto/notification.dto";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import NotificationFactory from "../notification-factory";
import { useLocation, useNavigate } from "react-router";
import { notificationService } from "@/api/notification/notification.api";
import NotificationSkeletonLoading from "../notification-items/notification-skeleton";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import {
  useDeleteAllNotifications,
  useMarkNotificationAsRead,
  useNotifications,
} from "../../hooks/use-notification";
import { useNotificationCacheMutations, useUnreadCount } from "../../hooks/use-notification-store";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { NotFound } from "@/features/components/not-found";
import ClientOnly from "@/features/components/client-only";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faTrashCan,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

type NotificationMenuProps = {
  className?: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
};

const NotificationMenu: React.FC<NotificationMenuProps> = ({ className, ref }) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } = useNotifications({
    limit: 20,
  });
  const { fetch: deleteAll } = useDeleteAllNotifications();
  const isInNotificationPage = useLocation().pathname === "/notifications";

  const { unreadCount, setUnreadCount } = useUnreadCount();
  const { markAsReadInCache, markAllAsReadInCache, clearAllFromCache, invalidateNotifications } =
    useNotificationCacheMutations();

  const { fetch: markAsRead } = useMarkNotificationAsRead();

  const notifications = useMemo(() => {
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
        "bg-bg-main border-2 border-bg-fourth/80 shadow-none rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top scrollbar-hide",
        className,
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <Text sz="lg" weight="bold">
          {t("notifications:notifications.title")}
        </Text>
        <ClientOnly>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer"
                  onClick={handleMarkAllAsRead}
                  title={t("notifications:notifications.mark-all-read")}
                >
                  <Text sz="md" color="secondary">
                    <FontAwesomeIcon icon={faCheckDouble} />
                  </Text>
                </button>
              )}
              <button
                className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer"
                onClick={handleDeleteAll}
                title={t("notifications:notifications.delete-all")}
              >
                <Text sz="md" color="secondary">
                  <FontAwesomeIcon icon={faTrashCan} />
                </Text>
              </button>
            </div>
          )}
        </ClientOnly>
      </div>
      <div className="relative px-3 max-h-[650px] overflow-y-auto scrollbar-hide">
        <ClientOnly fallback={<NotificationSkeletonLoading />}>
          <InfiniteScrollGrid
            itemMinWidth={"300px"}
            items={notifications}
            onLoadMore={fetchNextPage}
            className="gap-0 scrollbar-hide w-full"
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
            isLoading={isFetching || isPending}
            loadingSkeleton={<NotificationSkeletonLoading />}
            numberOfSkeletons={2}
            emptyComponent={
              <NotFound
                icon="fa-regular fa-bell-slash"
                title={t("notifications:notifications.no-notifications")}
                description="When you have new updates, they will appear here."
              />
            }
          />
        </ClientOnly>
      </div>

      {isInNotificationPage || (
        <div className="flex justify-center border-t border-text-main/10 pt-2 pb-2 px-3">
          <button
            className="p-2 rounded-lg hover:bg-bg-fourth transition-colors cursor-pointer flex items-center gap-2"
            onClick={() => navigate("/notifications")}
            title={t("notifications:notifications.open-notifications")}
          >
            <Text sz="sm" color="secondary">
              {t("notifications:notifications.open-notifications")}
            </Text>
            <Text sz="sm" color="secondary">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Text>
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
