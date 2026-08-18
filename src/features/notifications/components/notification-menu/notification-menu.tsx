import { NotificationDto } from "@/api/notification/dto/notification.dto";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import NotificationFactory from "../notification-factory";
import { useLocation, useNavigate } from "react-router";
import { notificationService } from "@/api/notification/notification.api";
import NotificationSkeletonLoading from "../notification-items/notification-skeleton";
import { Checkbox, Text } from "@/components/atoms";
import clsx from "clsx";
import {
  useDeleteBatchNotifications,
  useMarkNotificationAsRead,
  useNotifications,
} from "../../hooks/use-notification";
import {
  useNotificationCacheMutations,
  useNotificationUiState,
  useUnreadCount,
} from "../../hooks/use-notification-store";
import InfiniteScrollGrid from "@/components/ui/utils/infinite-scroll-grid";
import { NotFound } from "@/features/components/not-found";
import ClientOnly from "@/features/components/client-only";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faTrashCan,
  faArrowUpRightFromSquare,
  faXmark,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useDialog } from "@/contexts";
import { useLongPress } from "@/hooks/use-long-press";
import { useMobile } from "@/hooks/use-mobile";

interface NotificationItemRowProps {
  notification: NotificationDto;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onLongPressSelect: (id: string) => void;
  onItemClick: (notification: NotificationDto) => void;
}

const NotificationItemRow: React.FC<NotificationItemRowProps> = ({
  notification,
  isSelectionMode,
  isSelected,
  onToggleSelect,
  onLongPressSelect,
  onItemClick,
}) => {
  const isMobile = useMobile();
  const isLongPressedRef = useRef(false);
  const lastLongPressTimeRef = useRef(0);

  const longPressHandlers = useLongPress(() => {
    if (!isSelectionMode && isMobile) {
      isLongPressedRef.current = true;
      lastLongPressTimeRef.current = Date.now();
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(40);
      }
      onLongPressSelect(notification.id);
    }
  }, 450);

  const handleClickCapture = (e: React.MouseEvent) => {
    // If long press was just triggered on mobile, cancel click event so it never causes navigation
    if (isLongPressedRef.current || Date.now() - lastLongPressTimeRef.current < 600) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressedRef.current = false;
      return;
    }

    // In selection mode, clicking the item toggles selection and never navigates
    if (isSelectionMode) {
      e.preventDefault();
      e.stopPropagation();
      onToggleSelect(notification.id);
    }
  };

  return (
    <div
      {...(isMobile ? longPressHandlers : {})}
      onClickCapture={handleClickCapture}
      className={clsx(
        "group relative flex items-center px-3 py-2.5 rounded-xl select-none cursor-pointer",
        "hover:bg-bg-fourth transition-colors duration-150 active:scale-[0.99]",
      )}
    >
      {/* Animated Checkbox Container */}
      <div
        className={clsx(
          "shrink-0 flex items-center justify-center transition-all duration-250 ease-out overflow-hidden",
          isSelectionMode
            ? "w-6 opacity-100 mr-2 scale-100 translate-x-0"
            : "w-0 opacity-0 mr-0 scale-75 -translate-x-3 pointer-events-none",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={() => onToggleSelect(notification.id)}
        />
      </div>

      <div className="flex-1 min-w-0">
        <NotificationFactory
          notificationDto={notification}
          onClick={() => {
            if (
              isLongPressedRef.current ||
              Date.now() - lastLongPressTimeRef.current < 600 ||
              isSelectionMode
            ) {
              return;
            }
            onItemClick(notification);
          }}
        />
      </div>
    </div>
  );
};

type NotificationMenuProps = {
  className?: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
};

const NotificationMenu: React.FC<NotificationMenuProps> = ({ className, ref, onClick }) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialog();

  const { data, fetchNextPage, hasNextPage, isFetching, isPending } = useNotifications({
    limit: 20,
  });

  const { fetch: deleteBatch } = useDeleteBatchNotifications();
  const { fetch: markAsRead } = useMarkNotificationAsRead();

  const isInNotificationPage = useLocation().pathname === "/notifications";
  const { isShowNotification, setShowNotification } = useNotificationUiState();
  const { unreadCount, setUnreadCount } = useUnreadCount();
  const {
    markAsReadInCache,
    markAllAsReadInCache,
    removeNotificationsFromCache,
    invalidateNotifications,
  } = useNotificationCacheMutations();

  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const allSelected =
    notifications.length > 0 && selectedIds.size === notifications.length;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleLongPressSelect = (id: string) => {
    setIsSelectionMode(true);
    setSelectedIds(new Set([id]));
  };

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
    }
  };

  const handleMarkAllAsRead = async () => {
    markAllAsReadInCache();
    setUnreadCount(0);
    await notificationService.markAllAsRead();
    invalidateNotifications();
  };

  const handleItemClick = (notification: NotificationDto) => {
    if (isShowNotification) {
      setShowNotification(false);
    }
    onClick?.();
    if (!notification.isRead) {
      markAsReadInCache(notification.id);
      setUnreadCount((prev: number) => Math.max(prev - 1, 0));
      markAsRead(notification.id);
    }
  };

  const handleBatchDeleteConfirm = () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    const count = idsToDelete.length;

    openDialog({
      title: t("notifications:notifications.delete-selected-title"),
      content: (
        <Text sz="md" color="secondary" className="leading-relaxed">
          {t("notifications:notifications.delete-selected-confirm", { count })}
        </Text>
      ),
      primaryButton: {
        text: t("notifications:notifications.delete-confirm-btn"),
        onClick: async () => {
          closeDialog();
          const unreadDeletedCount = notifications.filter(
            (n) => selectedIds.has(n.id) && !n.isRead,
          ).length;

          removeNotificationsFromCache(idsToDelete);
          if (unreadDeletedCount > 0) {
            setUnreadCount((prev: number) => Math.max(prev - unreadDeletedCount, 0));
          }
          setSelectedIds(new Set());
          setIsSelectionMode(false);

          await deleteBatch(idsToDelete, {
            onError: () => {
              invalidateNotifications();
            },
          });
        },
      },
      secondaryButton: {
        text: t("notifications:notifications.cancel-btn"),
        onClick: () => {
          closeDialog();
        },
      },
      onClose: () => {
        closeDialog();
      },
    });
  };

  return (
    <div
      className={clsx(
        "bg-bg-main border-2 border-bg-fourth/80 shadow-none rounded-xl flex flex-col gap-2 select-none min-h-0",
        "animate-dropdown-slide origin-top scrollbar-hide",
        className,
      )}
      ref={ref}
    >
      {/* Animated Header */}
      <div className="relative flex items-center justify-between px-5 pt-4 pb-1 min-h-[44px] shrink-0 overflow-hidden">
        {isSelectionMode ? (
          <div className="flex items-center justify-between w-full animate-opacity-in transition-all duration-200">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={allSelected}
                onChange={handleToggleSelectAll}
                label={
                  <span className="text-xs font-medium text-text-secondary hover:text-text-main transition-colors">
                    {allSelected
                      ? t("notifications:notifications.deselect-all")
                      : t("notifications:notifications.select-all")}
                  </span>
                }
              />
              <Text sz="sm" color="secondary" className="text-xs whitespace-nowrap">
                {t("notifications:notifications.selected-count", { count: selectedIds.size })}
              </Text>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={selectedIds.size === 0}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 select-none",
                  selectedIds.size > 0
                    ? "bg-error text-white hover:bg-error/90 active:scale-95 shadow-sm cursor-pointer"
                    : "bg-bg-fourth text-text-third opacity-50 cursor-not-allowed",
                )}
                onClick={handleBatchDeleteConfirm}
                title={t("notifications:notifications.delete-selected", { count: selectedIds.size })}
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-xs text-white" />
                <span className="text-white font-medium">
                  {t("notifications:notifications.delete-selected", { count: selectedIds.size })}
                </span>
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:bg-bg-fourth text-text-secondary hover:text-text-main transition-colors cursor-pointer"
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedIds(new Set());
                }}
                title={t("notifications:notifications.exit-select")}
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full animate-opacity-in transition-all duration-200">
            <Text sz="lg" weight="bold">
              {t("notifications:notifications.title")}
            </Text>
            <ClientOnly>
              {notifications.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      className="p-2 rounded-lg hover:bg-bg-fourth text-text-secondary hover:text-text-main transition-colors cursor-pointer"
                      onClick={handleMarkAllAsRead}
                      title={t("notifications:notifications.mark-all-read")}
                    >
                      <FontAwesomeIcon icon={faCheckDouble} className="text-sm" />
                    </button>
                  )}
                  {/* Select button for desktop & mobile */}
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-bg-fourth text-xs font-medium text-text-secondary hover:text-text-main transition-colors cursor-pointer"
                    onClick={() => setIsSelectionMode(true)}
                    title={t("notifications:notifications.select")}
                  >
                    <FontAwesomeIcon icon={faListCheck} className="text-xs" />
                    <span>{t("notifications:notifications.select")}</span>
                  </button>
                </div>
              )}
            </ClientOnly>
          </div>
        )}
      </div>

      <div className="relative px-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <ClientOnly fallback={<NotificationSkeletonLoading />}>
          <InfiniteScrollGrid
            itemMinWidth={"300px"}
            items={notifications}
            onLoadMore={fetchNextPage}
            className="gap-0 scrollbar-hide w-full"
            itemTemplate={(item: any) => {
              const notification = item as NotificationDto;
              const isSelected = selectedIds.has(notification.id);
              return (
                <NotificationItemRow
                  key={notification.id}
                  notification={notification}
                  isSelectionMode={isSelectionMode}
                  isSelected={isSelected}
                  onToggleSelect={handleToggleSelect}
                  onLongPressSelect={handleLongPressSelect}
                  onItemClick={handleItemClick}
                />
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
            onClick={() => {
              if (isShowNotification) {
                setShowNotification(false);
              }
              onClick?.();
              navigate("/notifications");
            }}
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
