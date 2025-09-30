import { useToast } from "@/contexts/common/toast-context";
import { useDispatch } from "react-redux";
import { useNotificationHub } from "../hubs/use-notification-hub";
import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { addNewNotification, deleteNotification } from "../stores/notification-slice";

const NotificationListener = () => {
  const dispatch = useDispatch();
  const { pushToast } = useToast();

  const handleNewNotification = (data: NotificationDto) => {
    // console.log("New notification received:", data);
    if (data.type === "CancelNotification") {
      // If notification type is CancelNotification, remove it from the list
      // setNotification(prevNotifications => prevNotifications.filter(n => n.id !== data.data.noticationId));
      dispatch(deleteNotification(data.data.noticationId));
      return;
    } else {
      dispatch(addNewNotification(data));
    }
    pushToast({
      id: data.id,
      type: "notification",
      payload: {
        notificationDto: data,
      },
      duration: 5000,
    });
  };

  useNotificationHub(handleNewNotification);

  return null;
};

export default NotificationListener;
