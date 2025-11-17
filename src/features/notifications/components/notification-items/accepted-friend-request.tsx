import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { TimeUnit, TimeUnitTranslateMap } from "@/types/time-unit";
import { useTranslation } from "react-i18next";
import { renderContent } from "../../helper/render-content";
import { Avatar, Text } from "@/components/atoms";
import clsx from "clsx";

interface AcceptedFriendRequestProps {
  notificationDto: NotificationDto;
  onClick?: () => void;
}

const AcceptedFriendRequest: React.FC<AcceptedFriendRequestProps> = ({
  notificationDto,
  onClick = () => {},
}) => {
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };

  return (
    <div className="flex gap-2" onClick={onClick}>
      <div className="flex items-start">
        <Avatar src={notificationDto.actorImageUrl} alt="Avatar" sz="sm-1" />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <Text sz="sm-2" className={clsx({ "opacity-60": notificationDto.isRead })}>
          {renderContent(notificationDto.content ?? "", {
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
          className={clsx({ "opacity-60": notificationDto.isRead })}
        >
          {notificationDto.timeDistance.unit === TimeUnit.Seconds ||
          notificationDto.timeDistance.unit === TimeUnit.Miliseconds
            ? t("times:just_now")
            : `${t(
                `${TimeUnitTranslateMap[notificationDto.timeDistance.unit]}.${
                  notificationDto.timeDistance.value === 1 ? "one" : "other"
                }`,
                { count: notificationDto.timeDistance.value },
              )} 
                                                ${t("times:ago")}`}
        </Text>
      </div>
      <div className="flex items-center">
        {!notificationDto.isRead && <div className="w-2 h-2 bg-single-main rounded-full"></div>}
      </div>
    </div>
  );
};

export default AcceptedFriendRequest;
