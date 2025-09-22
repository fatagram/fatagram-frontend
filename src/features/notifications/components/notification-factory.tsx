import { NotificationDefault, NotificationDto } from "@/api/notification/dto/notification.dto"
import NewFriendRequestCard from "./notification-items/new-friend-request";
import BaseNotification from "./notification-items/base-notification";

// NotificationFactoryProps defines the props for the NotificationFactory component
export type NotificationFactoryProps = {
    notificationDto: NotificationDto;
    onClick?: () => void;
}

// NotificationFactory is a factory component that creates the appropriate notification card based on the notification type
const NotificationFactory: React.FC<NotificationFactoryProps> = ({
    notificationDto,
    onClick = () => {}
}) => {

    switch (notificationDto.type) {
        case "NewFriendRequest":
            return <NewFriendRequestCard notificationDto={notificationDto} onClick={(onClick)}/>

        case "FriendRequestAccepted": // Friend request accepted notification
            return <BaseNotification notificationDto={notificationDto} onClick={onClick}/>
        
        default:
            return <BaseNotification notificationDto={NotificationDefault} onClick={onClick}/>;
    }
}

export default NotificationFactory;
