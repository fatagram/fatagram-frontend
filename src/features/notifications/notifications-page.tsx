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
    <div className="flex flex-col items-center justify-start w-full flex-1 min-h-0 sm:py-3 px-0 sm:px-4 overflow-hidden h-full">
      <NotificationMenu
        className="sm:max-w-[600px] w-full px-2 py-2 sm:mx-4 sm:!rounded-lg h-full flex-1 sm:flex-initial sm:h-auto sm:max-h-[calc(100dvh-var(--header-height,56px)-24px)] !rounded-none border-0 sm:border-2"
      />
    </div>
  );
};

export default NotificationsPage;
