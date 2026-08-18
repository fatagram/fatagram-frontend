import useClickOutside from "@/hooks/use-click-outside";
import React, { RefObject, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationMenu from "./notification-menu";
import { useNotificationUiState, useUnreadCount } from "../../hooks/use-notification-store";
import clsx from "clsx";
import { Text, Badge } from "@/components/atoms";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

interface NotificationButtonProps {}

const NotificationBadge: React.FC<NotificationButtonProps> = ({}) => {
  const navigate = useNavigate();

  const { unreadCount } = useUnreadCount();
  const { isShowNotification, setShowNotification } = useNotificationUiState();
  const isInNotificationPage = useLocation().pathname === "/notifications";

  // Refs for the menu and butto
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

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
          <FontAwesomeIcon icon={faBell} />
        </Text>
      </Badge>
      <Transition
        show={isShowNotification && !isInNotificationPage}
        animation={AnimationLib.DropdownSlide}
        duration={150}
        className={clsx(
          "!absolute z-50 min-w-[340px] sm:w-[420px] max-h-[min(600px,calc(100dvh-var(--header-height,56px)-20px))] flex flex-col",
          "top-[120%] right-0",
        )}
      >
        <NotificationMenu
          className="w-full flex-1 shadow-2xl max-h-[min(580px,calc(100dvh-var(--header-height,56px)-28px))]"
          onClick={() => setShowNotification(false)}
          ref={menuRef}
        />
      </Transition>
    </div>
  );
};

export default NotificationBadge;
