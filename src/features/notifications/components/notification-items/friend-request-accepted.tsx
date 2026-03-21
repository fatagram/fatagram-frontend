import { NotificationDto } from "@/api/notification/dto/notification.dto";
import BaseNotification from "./base-notification";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface FriendRequestAcceptedProps {
  notificationDto: NotificationDto;
  onClick?: () => void;
}

export const FriendRequestAccepted: React.FC<FriendRequestAcceptedProps> = ({
  notificationDto,
  onClick,
}) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    onClick?.();
    navigate("/" + notificationDto.actorId);
  }, [navigate, onClick, notificationDto.actorId]);

  return <BaseNotification notificationDto={notificationDto} onClick={handleClick} />;
};

export default FriendRequestAccepted;
