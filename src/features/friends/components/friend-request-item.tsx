import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Text } from "@/components/atoms";
import clsx from "clsx";
import { timeDistance } from "@/utils/time";

type FriendRequestItemProps = {
  avatar?: string;
  name?: string;
  time?: Date;
  onAccept?: () => void;
  onCancel?: () => void;
  path?: string;
};

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  avatar,
  name,
  time,
  onAccept,
  onCancel,
  path = "",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const timeDist = time ? timeDistance(time) : { text: "" };

  const handleNavigate = () => {
    navigate(path);
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-start bg-bg-main",
        "h-auto",
        "rounded-2xl shadow-lg p-4 gap-1",
      )}
    >
      <div className="w-full cursor-pointer" onClick={handleNavigate}>
        <Avatar src={avatar} alt="avatar" shape="rounded" className="w-full h-full" />
      </div>
      <Text
        sz="md"
        weight="bold"
        onClick={handleNavigate}
        className={clsx(
          "truncate overflow-hidden w-full mt-1 hover:text-primary-500 cursor-pointer",
        )}
      >
        {name}
      </Text>
      <Text sz="sm" weight="light">
        {timeDist.count && t(timeDist.unit || "", { count: timeDist.count })} {t(timeDist.text)}
      </Text>
      <Button variant="primary" sz="sm" className={clsx("w-full mt-2 mb-1")} onClick={onAccept}>
        {t("user:profileHeader:acceptButton")}
      </Button>
      <Button variant="fourth" sz="sm" className={clsx("w-full mt-2r")} onClick={onCancel}>
        {t("user:profileHeader:declineButton")}
      </Button>
    </div>
  );
};

export default FriendRequestItem;
