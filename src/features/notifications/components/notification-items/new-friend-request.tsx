import { NotificationDto } from "@/api/notification/dto/notification.dto";
import { friendshipService } from "@/api/user/friendship.api";
import clsx from "clsx";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import BaseNotification from "./base-notification";
import { Button, Text } from "@/components/atoms";
import { useNavigate } from "react-router";

interface NewFriendRequestProps {
  notificationDto: NotificationDto;
  onClick?: () => void;
}

const messageMap: Record<string, string> = {};

// Define the props for the NewFriendRequestCard component here
const NewFriendRequest: React.FC<NewFriendRequestProps> = ({
  notificationDto,
  onClick = () => {},
}) => {
  const [message, setMessage] = React.useState<string | null>(
    messageMap[notificationDto.id] || null,
  );
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    onClick();
    navigate("/" + notificationDto.actorId);
  }, [onClick, navigate, notificationDto.actorId]);

  const handleAccept = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const acceptFriendRequest = async () => {
      const response = await friendshipService.AcceptAddFriendRequest(notificationDto.actorId);
      if (response.success) {
        setMessage(t("notifications:notifications.accepted"));
        messageMap[notificationDto.id] = t("notifications:notifications.accepted");
      }
    };
    acceptFriendRequest();
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const deleteFriendRequest = async () => {
      const response = await friendshipService.DeclineAddFriendRequest(notificationDto.actorId);
      if (response.success) {
        setMessage(t("notifications:notifications.declined"));
        messageMap[notificationDto.id] = t("notifications:notifications.declined");
      }
    };
    deleteFriendRequest();
  };

  return (
    <BaseNotification notificationDto={notificationDto} onClick={handleClick}>
      {!message ? (
        <div className={clsx("flex", "gap-1", "mt-1", "justify-start")}>
          <Button sz="sm" variant="primary" onClick={handleAccept}>
            {t("user:profileHeader.acceptButton")}
          </Button>
          <Button
            sz="sm"
            variant="secondary"
            onClick={handleDelete}
            className="border-[1.5px] border-primary-500"
          >
            {t("user:profileHeader.declineButton")}
          </Button>
        </div>
      ) : (
        <Text sz="sm" className={clsx("opacity-70")}>
          {message}
        </Text>
      )}
    </BaseNotification>
  );
};

export default NewFriendRequest;
