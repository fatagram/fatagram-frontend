import { NotificationDto } from "@/api/notification/dto/notification.dto";
import NotificationFactory from "../notification-factory";
import { useNavigate } from "react-router-dom";

type NotificationProps = {
    className?: string;
    notification: NotificationDto
};

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
                }}/>
        </div>
    )
}

export default NotificationToast;