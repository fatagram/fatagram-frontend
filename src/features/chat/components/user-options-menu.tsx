import React from "react";
import { Avatar, Text } from "@/components/atoms";
import { Menu, MenuItem } from "@/components/ui/menu";
import FriendButton from "@/features/profile/components/friend-button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useOpenChat } from "../hooks/use-open-chat";
import clsx from "clsx";

interface UserOptionsMenuProps {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  isSheet?: boolean;
  showMessagePrivately?: boolean;
  onClose: () => void;
}

export const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({
  userId,
  fullName,
  avatarUrl,
  isSheet = false,
  showMessagePrivately = true,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openChatWithTarget } = useOpenChat();

  return (
    <div className={clsx("flex flex-col", isSheet ? "gap-4 pb-10" : "gap-4")}>
      <div
        className={clsx(
          "flex flex-col items-center text-center",
          isSheet ? "p-4" : "p-8 bg-bg-second rounded-3xl",
        )}
      >
        <Avatar
          src={avatarUrl}
          alt="Avatar"
          sz={isSheet ? "lg" : "xl"}
          className="mb-3 shadow-xl ring-4 ring-bg-main transition-transform hover:scale-105"
        />
        <Text weight="bold" sz={isSheet ? "lg" : "xl"}>
          {fullName}
        </Text>
        <div className="w-full max-w-[200px] mt-4">
          <FriendButton uid={userId} className="w-full" />
        </div>
      </div>
      <Menu className={isSheet ? "px-4" : "min-w-[320px]"}>
        {showMessagePrivately && (
          <MenuItem
            icon="fa-solid fa-comment-dots"
            title={t("common:conversations.settings.messagePrivately")}
            onClick={() => {
              openChatWithTarget(userId);
              onClose();
            }}
          />
        )}
        <MenuItem
          icon="fa-solid fa-user"
          title={t("common:conversations.settings.viewProfile")}
          onClick={() => {
            navigate(`/${userId}`);
            onClose();
          }}
        />
      </Menu>
    </div>
  );
};
