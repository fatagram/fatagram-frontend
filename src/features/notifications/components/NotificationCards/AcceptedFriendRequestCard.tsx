import { NotificationDto } from "@/api/notification/dto/notification.dto";
import Avatar from "@/components/common/display/Avatar";
import Button from "@/components/common/ui/Button";
import Text from "@/components/common/ui/Text";
import { TimeUnit, TimeUnitTranslateMap } from "@/utils/time_unit";
import { Trans, useTranslation } from "react-i18next";
import { renderContent } from "../../helper/renderContent";

interface AcceptedFriendRequestCardProps {
    notificationDto: NotificationDto;
    onClick?: () => void;
}

const AcceptedFriendRequestCard: React.FC<AcceptedFriendRequestCardProps> = ({
    notificationDto,
    onClick = () => {}
}) => {
    const { t } = useTranslation() as { t: (key: string, options?: any) => string };
    
    return (
        <div className='flex gap-2' onClick={onClick}>
            <div className='flex items-start'>
                <Avatar src={notificationDto.actorImageUrl} alt='Avatar' size='small_1' />
            </div>
            <div className='flex flex-col gap-1 flex-1'>
                <Text size='sm-2'>
                    {
                        renderContent(notificationDto.content ?? "", {
                            actorName: <Text key={notificationDto.actorId} size='sm-2' weight='bold'>{notificationDto.actorName}</Text>
                        })
                    }
                </Text>
                <Text size='sm-1' color='secondary'>
                    {notificationDto.timeDistance.unit === TimeUnit.Seconds || notificationDto.timeDistance.unit === TimeUnit.Miliseconds
                                                ? t("times:just_now")
                                                : `${t(`${TimeUnitTranslateMap[notificationDto.timeDistance.unit]}.${
                                                    notificationDto.timeDistance.value === 1 ? "one" : "other"}`, { count: notificationDto.timeDistance.value })} 
                                                ${t("times:ago")}`}
                </Text>
            </div>
            <div className='flex items-center'>
                {!notificationDto.isRead && (
                    <div className="w-2 h-2 bg-[var(--main-single-color)] rounded-full"></div>
                )}
            </div>
        </div>
    )
}

export default AcceptedFriendRequestCard;