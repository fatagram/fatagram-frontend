import { NotificationDto } from "@/api/notification/dto/notification.dto"
import NewFriendRequestCard from "./NotificationCards/NewFriendRequestCard";
import AcceptedFriendRequestCard from "./NotificationCards/AcceptedFriendRequestCard";
import { useNavigate } from "react-router-dom";

// NotificationFactoryProps defines the props for the NotificationFactory component
export interface NotificationFactoryProps {
    notificationDto: NotificationDto;
    onClick?: () => void;
    key?: string | number;
}

// NotificationFactory is a factory component that creates the appropriate notification card based on the notification type
const NotificationFactory: React.FC<NotificationFactoryProps> = ({
    notificationDto,
    onClick = () => {},
    key
}) => {


    switch (notificationDto.type) {
        case "NewFriendRequest": // New friend request notification
            return <NewFriendRequestCard key={key} notificationDto={notificationDto} onClick={(onClick)}/>

        case "FriendRequestAccepted": // Friend request accepted notification
            return <AcceptedFriendRequestCard key={key} notificationDto={notificationDto} onClick={onClick}/>
        
        default:
            return <div>Unknown Notification</div>
    }
}

export default NotificationFactory;
