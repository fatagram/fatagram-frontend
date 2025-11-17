import { NotificationDto } from "@/api/notification/dto/notification.dto";
import NotificationFactory from "../notification-factory";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

type NotificationProps = {
  className?: string;
  notification: NotificationDto;
};

const NotificationToast: React.FC<NotificationProps> = ({ className, notification }) => {
  const navigate = useNavigate();

  return (
    <div className={clsx("py-4 px-8 bg-bg-second rounded-lg", className)}>
      <NotificationFactory
        notificationDto={notification}
        onClick={() => {
          navigate(notification.link);
        }}
      />
    </div>
  );
};

export default NotificationToast;
