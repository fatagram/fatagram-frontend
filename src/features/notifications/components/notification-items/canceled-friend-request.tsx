import { NotificationDto } from "@/api/notification/dto/notification.dto";
import BaseNotification from "./base-notification";

interface CanceledFriendRequestProps {
  notificationDto: NotificationDto;
  onClick?: () => void;
}

const CanceledFriendRequest: React.FC<CanceledFriendRequestProps> = ({
  notificationDto,
  onClick = () => {},
}) => {
  return <BaseNotification notificationDto={notificationDto} onClick={onClick} />;
};

export default CanceledFriendRequest;
