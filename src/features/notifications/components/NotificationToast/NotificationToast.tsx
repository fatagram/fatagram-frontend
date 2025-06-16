import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { NotifyOnChangeProps } from "@tanstack/react-query";
import NotificationFactory from "../NotificationFactory";
import { useNavigate } from "react-router-dom";

interface NotificationProps {
    className?: string;
    notification: NotificationDto
}

const NotificationToast: React.FC<NotificationProps> = ({
    className,
    notification
}) => {

    const navigate = useNavigate();

    return (
        <div className={`py-4 px-8 bg-[var(--main-bg-color)] rounded-lg
            ${className}
        `}>
            <NotificationFactory
                notificationDto={notification}
                onClick={() => {
                    navigate(notification.link);
                    console.log("Notification clicked:", notification);
                }}/>
        </div>
    )
}

export default NotificationToast;