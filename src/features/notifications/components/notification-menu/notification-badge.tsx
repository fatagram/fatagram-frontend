import useClickOutside from "@/hooks/use-click-outside";
import React, { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import NotificationMenu from "./notification-menu";
import { useNotificationUiState, useUnreadCount } from "../../hooks/use-notification-store";
import clsx from "clsx";
import { Text, Badge } from "@/components/atoms";

interface NotificationButtonProps {}

const NotificationBadge: React.FC<NotificationButtonProps> = ({}) => {
  const navigate = useNavigate();

  const { unreadCount } = useUnreadCount();
  const { isShowNotification, isInNotificationPage, setShowNotification } =
    useNotificationUiState();

  console.debug("NotificationBadge render - isShowNotification:", isShowNotification, "isInNotificationPage:", isInNotificationPage, "unreadCount:", unreadCount);

  // Refs for the menu and button
  const menuRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close the menu
  useClickOutside(menuRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLDivElement>, () => {
    if (isShowNotification) setShowNotification(false);
  });

  // Toggle notifications menu visibility
  const handleToggleNotifications = () => {
    if (window.innerWidth < 640 && !isShowNotification) {
      navigate("/notifications");
      return;
    }
    setShowNotification(!isShowNotification);
  };

  const isActive = isShowNotification || isInNotificationPage;

  return (
    <div className="relative flex items-center justify-center">
      <Badge
        count={unreadCount}
        onClick={handleToggleNotifications}
        ref={btnRef}
        className={clsx({
          "!bg-primary-500/30": isActive,
        })}
      >
        <Text
          className={clsx({
            "!text-primary-500": isActive,
          })}
        >
          <i className="fa-solid fa-bell"></i>
        </Text>
      </Badge>
      {isShowNotification && !isInNotificationPage && (
        <div onClick={() => setShowNotification(false)}>
          <NotificationMenu
            className={clsx(
              "!absolute max-h-[600px] z-10 min-w-[350px] min-h-[100px]",
              "sm:top-[120%] sm:right-0 sm:w-auto sm:h-auto sm:p-2",
              "top-[108%] -right-[70px] w-screen h-screen p-6",
            )}
            onClick={() => setShowNotification(!isShowNotification)}
            ref={menuRef}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;
