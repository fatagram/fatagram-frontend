import { NotificationDto } from '@/api/notification/dto/notification.dto';
import { friendshipService } from '@/api/user/friendship.api';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import { TimeUnit, TimeUnitTranslateMap } from '@/utils/TimeUnit';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { renderContent } from '../../helper/renderContent';
import BaseNotification from './BaseNotification';

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
        <BaseNotification notificationDto={notificationDto} onClick={onClick}>
            { !message ? <div className='flex gap-1 mt-1 justify-start'>
                    <Button size='sm-1' variant='primary' onClick={handleAccept}>
                        {t("user:profileHeader.acceptButton")}
                    </Button>
                    <Button size='sm-1' variant='secondary' onClick={handleDelete}>
                        {t("user:profileHeader.declineButton")}
                    </Button>
                </div> : <Text size='sm-2' className='opacity-70'>{message}</Text> }
        </BaseNotification>
    )
}

export default NewFriendRequestCard;