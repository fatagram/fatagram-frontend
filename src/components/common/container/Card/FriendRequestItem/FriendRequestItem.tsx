import Avatar from "@/components/common/display/Avatar";
import Button from "@/components/common/ui/Button";
import Text from "@/components/common/ui/Text";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FriendRequestItemProps {
    avatar?: string;
    name?: string;
    time?: string;
    onAccept?: () => void;
    onCancel?: () => void;
    path?: string
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
    avatar,
    name,
    time,
    onAccept,
    onCancel,
    path = ""
}) => {
    const { t } = useTranslation() as { t: (key: string) => string };
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(path);
    }

    return (
        <div className="flex flex-col items-start bg-[var(--bg-color-secondary)] 
                sm:w-[calc(25%-6px)] 
                w-[calc(50%-4px)]
                sm:min-w-[220px] h-auto
                rounded-2xl shadow-lg p-4 gap-1">
            <div className="w-full cursor-pointer" onClick={handleNavigate}>
                <Avatar src={avatar} alt="avatar" shape="rounded" className="w-full"/>
            </div>
            <Text size="md-2" weight="bold" onClick={handleNavigate} 
                className="truncate overflow-hidden w-full">{name}</Text>
            <Text size="sm" weight="light">{time}</Text>
            <Button variant="primary" size="small" className="w-full mt-2 mb-1" onClick={onAccept}>
                {t("user:profileHeader:acceptButton")}
            </Button>
            <Button variant="secondary" size="small" className="w-full mt-2r" onClick={onCancel}>
                {t("user:profileHeader:declineButton")}
            </Button>
        </div>
    )
}

export default FriendRequestItem;