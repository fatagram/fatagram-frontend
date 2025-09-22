import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { Text, Avatar } from "@/components/atoms";
import { renderContent } from "../../helper/render-content";
import { TimeUnit, TimeUnitTranslateMap } from "@/utils/time-unit";
import { useTranslation } from "react-i18next";

interface BaseNotificationProps {
    notificationDto: NotificationDto;
    children?: React.ReactNode;
    onClick?: () => void;
}

const BaseNotification: React.FC<BaseNotificationProps> = ({
    notificationDto,
    children,
    onClick
}) => {
    const { t } = useTranslation() as { t: (key: string, options?: any) => string };
    
    return (
        <div className='flex gap-2 select-none' onClick={onClick}>
            <div className='flex items-start'>
                <Avatar src={notificationDto.actorImageUrl} alt='Avatar' size='small_1' />
            </div>
            <div className='flex flex-col gap-1 flex-1'>
                <Text size='sm-2' className={notificationDto.isRead ? "opacity-60" : ""}>
                    {
                        renderContent(notificationDto.content ?? "", {
                            actorName: <Text key={notificationDto.actorId} size='sm-2' weight='bold'>{notificationDto.actorName}</Text>
                        })
                    }
                </Text>
                <Text size='sm-1' color={notificationDto.isRead ? "primary" : "secondary"} className={notificationDto.isRead ? "opacity-60" : ""}>
                    {notificationDto.timeDistance.unit === TimeUnit.Seconds || notificationDto.timeDistance.unit === TimeUnit.Miliseconds
                                                ? t("times:just_now")
                                                : `${t(`${TimeUnitTranslateMap[notificationDto.timeDistance.unit]}.${
                                                    notificationDto.timeDistance.value === 1 ? "one" : "other"}`, { count: notificationDto.timeDistance.value })} 
                                                ${t("times:ago")}`}
                </Text>
                {children}
            </div>
            <div className='flex items-center'>
                {!notificationDto.isRead && (
                    <div className="w-2 h-2 bg-single-main rounded-full"></div>
                )}
            </div>
        </div>
    )
}

export default BaseNotification;