import { NotificationDto } from "@/api/notification/dto/notification.dto";
import React, { use, useEffect } from "react";
import { useTranslation } from "react-i18next";
import NotificationFactory from "../notification-factory";
import { useNavigate } from "react-router";
import { notificationService } from "@/api/notification/notification.api";
import NotificationSkeletonLoading from "../notification-items/notification.skeleton";
import { useDispatch, useSelector } from "react-redux";
import { markAsRead, setShowFull } from "../../stores/notification-slice";
import { Text, Button } from "@/components/atoms";
import clsx from "clsx";
import { useNotifications } from "../../hooks/use-notification";

type NotificationMenuProps = {
  className?: string;
  onClick?: () => void;
  ref?: React.RefObject<HTMLDivElement | null>;
};

const NotificationMenu: React.FC<NotificationMenuProps> = ({ className, onClick, ref }) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, refetch } = useNotifications();

  const { notifications, isInNotificationPage, isFull, isShowFull } = useSelector(
    (state: any) => state.notifications,
  );

  const loaderRef = React.useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!loaderRef.current || isFull) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        await refetch();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, isShowFull, isFull, refetch]);

  return (
    <div
      className={clsx(
        "bg-bg-second shadow-xl rounded-xl flex flex-col gap-2 select-none",
        "animate-dropdown-slide origin-top",
        className,
      )}
      ref={ref}
    >
      <Text sz="lg-1" weight="bold" className="px-2 pt-2">
        {t("notifications:notifications.title")}
      </Text>
      {notifications && notifications.length > 0 ? (
        <ul className="relative py-1 overflow-y-scroll scrollbar-none">
          {isShowFull
            ? notifications.map((notification: NotificationDto) => (
                <li
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
                      dispatch(markAsRead(notification.id));
                      await notificationService.markAsRead(notification.id);
                      onClick?.();
                    }}
                  />
                </li>
              ))
            : notifications.slice(0, 5).map((notification: NotificationDto) => (
                <li
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
                      dispatch(markAsRead(notification.id));
                      await notificationService.markAsRead(notification.id);
                      onClick?.();
                    }}
                  />
                </li>
              ))}
          {isLoading &&
            [...Array(2)].map((_, i) => (
              <li key={`skeleton-${i}`} className="mt-1">
                <NotificationSkeletonLoading />
              </li>
            ))}
          {!isShowFull ? (
            <li className="mt-2">
              <Button
                sz="sm-1"
                variant="fourth"
                className="w-full"
                onClick={() => {
                  dispatch(setShowFull(true));
                }}
              >
                {t("notifications:notifications.showMore")}
              </Button>
            </li>
          ) : (
            <li ref={loaderRef} />
          )}
        </ul>
      ) : (
        <>
          {!isLoading ? (
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
            Mở thông báo
          </Text>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
