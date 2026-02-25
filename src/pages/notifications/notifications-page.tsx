import NotificationMenu from "@/features/notifications/components/notification-menu/notification-menu";
import { useNotificationUiState } from "@/features/notifications/hooks/use-notification-store";
import React, { useEffect } from "react";
import clsx from "clsx";

type NotificationsPageProps = {};

const NotificationsPage: React.FC<NotificationsPageProps> = () => {
  const { setInNotificationPage, setShowNotification } = useNotificationUiState();

  useEffect(() => {
    setInNotificationPage(true);
    return () => {
      setInNotificationPage(false);
      setShowNotification(false);
    };
  }, []);

  return (
    <div className={clsx("relative flex items-start justify-center w-full h-full mt-1")}>
      <NotificationMenu className={clsx("h-full max-w-[600px] w-full px-2 py-4 pb-2 mx-4")} />
    </div>
  );
};

export default NotificationsPage;
