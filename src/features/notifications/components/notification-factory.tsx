import {
  NotificationDefault,
  NotificationDto,
  NotificationType,
} from "@/api/notification/dto/notification.dto";
import NewFriendRequestCard from "./notification-items/new-friend-request";
import CanceledFriendRequest from "./notification-items/canceled-friend-request";
import BaseNotification from "./notification-items/base-notification";
import { FriendRequestAccepted } from "./notification-items";

// NotificationFactoryProps defines the props for the NotificationFactory component
export type NotificationFactoryProps = {
  notificationDto: NotificationDto;
  onClick?: () => void;
};

// NotificationFactory is a factory component that creates the appropriate notification card based on the notification type
const NotificationFactory: React.FC<NotificationFactoryProps> = ({
  notificationDto,
  onClick = () => {},
}) => {
  switch (notificationDto.type) {
    case NotificationType.NewFriendRequest:
      return <NewFriendRequestCard notificationDto={notificationDto} onClick={onClick} />;

    case NotificationType.FriendRequestAccepted:
      return <FriendRequestAccepted notificationDto={notificationDto} onClick={onClick} />;

    case NotificationType.FriendRequestCanceled:
      return <CanceledFriendRequest notificationDto={notificationDto} onClick={onClick} />;

    case NotificationType.System:
      return <BaseNotification notificationDto={notificationDto} onClick={onClick} />;

    default:
      return <BaseNotification notificationDto={NotificationDefault} onClick={onClick} />;
  }
};

export default NotificationFactory;
