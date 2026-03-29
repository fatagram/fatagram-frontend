import NotificationMenu from "@/features/notifications/components/notification-menu/notification-menu";
import { useNotificationUiState } from "@/features/notifications/hooks/use-notification-store";
import React, { useLayoutEffect } from "react";
import clsx from "clsx";

type NotificationsPageProps = {};

const NotificationsPage: React.FC<NotificationsPageProps> = () => {
  const { setInNotificationPage, setShowNotification } = useNotificationUiState();

  useLayoutEffect(() => {
    setInNotificationPage(true);
    return () => {
      setInNotificationPage(false);
      setShowNotification(false);
    };
  }, []);

  return (
    <div
      className={clsx(
        "relative flex items-start justify-center w-full h-[calc(100dvh-var(--header-height))] sm:mt-1",
      )}
    >
      <NotificationMenu
        className={clsx(
          "sm:max-w-[600px] w-full px-2 py-2 sm:mx-4 sm:!rounded-lg h-full sm:h-auto !rounded-none",
        )}
      />
    </div>
  );
};

export default NotificationsPage;
