import { NotificationDto } from "@/api/notification/dto/notification.dto"
import NewFriendRequestCard from "./NotificationCards/NewFriendRequestCard";
import AcceptedFriendRequestCard from "./NotificationCards/AcceptedFriendRequestCard";
import { useNavigate } from "react-router-dom";

// NotificationFactoryProps defines the props for the NotificationFactory component
export interface NotificationFactoryProps {
    notificationDto: NotificationDto;
    onClick?: () => void;
}

// NotificationFactory is a factory component that creates the appropriate notification card based on the notification type
const NotificationFactory: React.FC<NotificationFactoryProps> = ({
    notificationDto,
    onClick = () => {},
}) => {

    switch (notificationDto.type) {
        case "NewFriendRequest": // New friend request notification
            return <NewFriendRequestCard notificationDto={notificationDto} onClick={(onClick)}/>

        case "FriendRequestAccepted": // Friend request accepted notification
            return <AcceptedFriendRequestCard notificationDto={notificationDto} onClick={onClick}/>
        
        default:
            return <div>Unknown Notification</div>
    }
}

export default NotificationFactory;
