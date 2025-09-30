import NotificationMenu from "@/features/notifications/components/notification-menu/notification-menu";
import {
  setInNotificationPage,
  setShowNotification,
} from "@/features/notifications/stores/notification-slice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

type NotificationsPageProps = {};

const NotificationsPage: React.FC<NotificationsPageProps> = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setInNotificationPage(true));
    return () => {
      dispatch(setInNotificationPage(false));
      dispatch(setShowNotification(false));
    };
  }, []);

  return (
    <div className="relative flex items-start justify-center w-full h-full">
      <NotificationMenu className="h-full max-w-[600px] w-full px-2 py-4 pb-2 mx-4" />
    </div>
  );
};

export default NotificationsPage;
