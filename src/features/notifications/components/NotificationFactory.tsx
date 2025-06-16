import { NotificationDto } from "@/api/notification/dto/notification.dto"
import NewFriendRequestCard from "./NotificationCards/NewFriendRequestCard";
import AcceptedFriendRequestCard from "./NotificationCards/AcceptedFriendRequestCard";
import { useNavigate } from "react-router-dom";

export interface NotificationFactoryProps {
    notificationDto: NotificationDto;
    onClick?: () => void;
    key?: string | number;
}

const NotificationFactory: React.FC<NotificationFactoryProps> = ({
    notificationDto,
    onClick = () => {},
    key
}) => {


    switch (notificationDto.type) {
        case "NewFriendRequest":
            return <NewFriendRequestCard key={key} notificationDto={notificationDto} onClick={(onClick)}/>
        case "FriendRequestAccepted":
            return <AcceptedFriendRequestCard key={key} notificationDto={notificationDto} onClick={onClick}/>
        default:
            return <div>Unknown Notification</div>
    }
}

export default NotificationFactory;
