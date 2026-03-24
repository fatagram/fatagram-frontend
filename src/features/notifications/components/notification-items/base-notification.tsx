import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { Text, Avatar } from "@/components/atoms";
import { renderContent } from "../../helper/render-content";
import { getNotificationContent } from "../../helper/get-notification-content";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useFormatTime } from "../../../../utils/format-time";

interface BaseNotificationProps {
  notificationDto: NotificationDto;
  children?: React.ReactNode;
  onClick?: () => void;
}

const BaseNotification: React.FC<BaseNotificationProps> = ({
  notificationDto,
  children,
  onClick,
}) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };

  const content = getNotificationContent(notificationDto.type, notificationDto.content, t);
  const { formatTime } = useFormatTime();

  return (
    <div className="flex gap-2 select-none" onClick={onClick}>
      <div className="flex items-start">
        <Avatar border={0} src={notificationDto.actorImageUrl} alt="Avatar" sz="sm-1" />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <Text
          sz="sm-2"
          className={clsx({ "opacity-60": notificationDto.isRead })}
          wrap="whitespace-normal"
        >
          {renderContent(content, {
            actorName: (
              <Text key={notificationDto.actorId} sz="sm-2" weight="bold">
                {notificationDto.actorName}
              </Text>
            ),
          })}
        </Text>
        <Text
          sz="sm-1"
          color={notificationDto.isRead ? "primary" : "secondary"}
          className={clsx({ "opacity-70": notificationDto.isRead })}
        >
          {formatTime(notificationDto.createdAt)}
        </Text>
        {children}
      </div>
      <div className="flex items-center">
        {!notificationDto.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full"></div>}
      </div>
    </div>
  );
};

export default BaseNotification;
