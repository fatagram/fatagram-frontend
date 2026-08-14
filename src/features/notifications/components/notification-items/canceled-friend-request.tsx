import { NotificationDto } from "@/api/notification/dto/notification.dto";
import BaseNotification from "./base-notification";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface CanceledFriendRequestProps {
  notificationDto: NotificationDto;
  onClick?: () => void;
}

const CanceledFriendRequest: React.FC<CanceledFriendRequestProps> = ({
  notificationDto,
  onClick = () => {},
}) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    onClick();
    if (notificationDto.actorId) {
      navigate("/" + notificationDto.actorId);
    }
  }, [onClick, navigate, notificationDto.actorId]);

  return <BaseNotification notificationDto={notificationDto} onClick={handleClick} />;
};

export default CanceledFriendRequest;
