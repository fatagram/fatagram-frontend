import useClickOutside from "@/hooks/use-click-outside";
import React, { RefObject } from "react";
import useNotifications from "../../hooks/use-notification";
import { useNavigate } from "react-router-dom";
import NotificationMenu from "./notification-menu";
import { useDispatch, useSelector } from "react-redux";
import { setShowNotification } from "../../stores/notification-slice";
import Badge from "@/components/atoms/badge";
import Text from "@/components/atoms/text";

interface NotificationButtonProps {}

const NotificationButton: React.FC<NotificationButtonProps> = ({}) => {
  // const [showNotifications, setShowNotifications] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { unreadCount, isShowNotification, isInNotificationPage } = useSelector(
    (state: any) => state.notifications,
  );

  // Refs for the menu and button
  const menuRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close the menu
  useClickOutside(menuRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLDivElement>, () => {
    if (isShowNotification) dispatch(setShowNotification(false));
  });

  useNotifications();

  // Toggle notifications menu visibility
  const handleToggleNotifications = () => {
    if (window.innerWidth < 640 && !isShowNotification) {
      navigate("/notifications");
      return;
    }
    dispatch(setShowNotification(!isShowNotification));
  };

  return (
    <div className="relative flex items-center justify-center">
      <Badge
        count={unreadCount}
        onClick={handleToggleNotifications}
        ref={btnRef}
        className={isShowNotification || isInNotificationPage ? "!bg-single-main/30" : ""}
      >
        <Text className={isShowNotification || isInNotificationPage ? "text-single-main" : ""}>
          <i className="fa-solid fa-bell"></i>
        </Text>
      </Badge>
      {isShowNotification && !isInNotificationPage && (
        <NotificationMenu
          className="!absolute max-h-[600px] sm:top-[120%] top-[108%] -right-[70px] sm:right-0
                        sm:w-auto w-screen sm:h-auto h-screen z-10 sm:p-2 p-6 min-w-[350px] 
                        min-h-[100px]"
          onClick={() => dispatch(setShowNotification(!isShowNotification))}
          ref={menuRef}
        />
      )}
    </div>
  );
};

export default NotificationButton;
