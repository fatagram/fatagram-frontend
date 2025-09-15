import { NotificationDto } from '@/api/notification/dto/notification.dto';
import { friendshipService } from '@/api/user/friendship.api';
import Avatar from '@/components/common/display/Avatar';
import Button from '@/components/common/ui/Button';
import Text from '@/components/common/ui/Text';
import { TimeUnit, TimeUnitTranslateMap } from '@/utils/time_unit';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { renderContent } from '../../helper/renderContent';

interface NewFriendRequestCardProps {
    notificationDto: NotificationDto;
    onClick?: () => void;
}

const messageMap: Record<string, string> = {}

// Define the props for the NewFriendRequestCard component here
const NewFriendRequestCard: React.FC<NewFriendRequestCardProps> = ({
    notificationDto,
    onClick = () => {}
}) => {
    const [message, setMessage] = React.useState<string | null>(messageMap[notificationDto.id] || null);
    const { t } = useTranslation() as { t: (key: string, options?: any) => string };

    const handleAccept = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        const acceptFriendRequest = async () => {
            const response = await friendshipService.AcceptAddFriendRequest(notificationDto.actorId);
            if (response.success) {
                setMessage(t("notifications:notifications.accepted"));
                messageMap[notificationDto.id] = t("notifications:notifications.accepted");
                // console.log(message);
            }
        }
        acceptFriendRequest();
    }

    const handleDelete = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        const deleteFriendRequest = async () => {
            const response = await friendshipService.DeclineAddFriendRequest(notificationDto.actorId);
            if (response.success) {
                setMessage(t("notifications:notifications.declined"));
                messageMap[notificationDto.id] = t("notifications:notifications.declined");
            }
        }
        deleteFriendRequest();
    }

    return (
        <div className='flex gap-2' onClick={onClick}>
            <div className='flex items-start'>
                <Avatar src={notificationDto.actorImageUrl} alt='Avatar' size='small_1' />
            </div>
            <div className='flex flex-col gap-1'>
                <Text size='sm-2'>
                    {renderContent(notificationDto.content ?? "", {
                        actorName: <Text key={notificationDto.actorId} size='sm-2' weight='bold'>{notificationDto.actorName}</Text>
                    })}
                </Text>
                <Text size='sm-1' color='secondary'>
                    {notificationDto.timeDistance.unit === TimeUnit.Seconds || notificationDto.timeDistance.unit === TimeUnit.Miliseconds
                                    ? t("times:just_now")
                                    : `${t(`${TimeUnitTranslateMap[notificationDto.timeDistance.unit]}.${
                                        notificationDto.timeDistance.value === 1 ? "one" : "other"}`, { count: notificationDto.timeDistance.value })} 
                                    ${t("times:ago")}`}
                </Text>
                { !message ? <div className='flex gap-1 mt-1 justify-start'>
                    <Button size='sm-1' variant='primary' onClick={handleAccept}>
                        {t("user:profileHeader.acceptButton")}
                    </Button>
                    <Button size='sm-1' variant='secondary' onClick={handleDelete}>
                        {t("user:profileHeader.declineButton")}
                    </Button>
                </div> : <Text size='sm-2' className='opacity-70'>{message}</Text> }
            </div>
            <div className='flex items-center ml-auto'>
                {!notificationDto.isRead && (
                    <div className="w-2 h-2 bg-single-main rounded-full"></div>
                )}
            </div>
        </div>
    )
}

export default NewFriendRequestCard;