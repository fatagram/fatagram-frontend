import React, { useCallback } from "react";
import { useSnackbar } from "@/contexts";
import { Menu, MenuItem, MenuSection } from "@/components/ui/menu";
import useLanguage from "@/utils/i18n";

interface UserInfoDialogProps {
  userProfile?: {
    nickname?: string;
    urlName?: string;
    fullName?: string;
  };
  targetId: string;
  onClose?: () => void;
}

export const UserInfoDialog: React.FC<UserInfoDialogProps> = ({ userProfile, targetId }) => {
  const { showSnackbar } = useSnackbar();
  const t = useLanguage();

  const nickname = userProfile?.nickname || userProfile?.urlName;
  const urlNameValue = nickname ? `@${nickname}` : t("user:profileHeader.notSet");
  const profileUrl =
    typeof window !== "undefined" ? window.location.origin + "/" + (nickname || targetId) : "";

  const handleCopy = useCallback(
    (text: string, label: string) => {
      if (!text || text === t("user:profileHeader.notSet")) return;
      navigator.clipboard.writeText(text);
      showSnackbar(t("user:profileHeader.copiedSuccess").replace("{{label}}", label), "success");
    },
    [showSnackbar, t],
  );

  const copyIcon = (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-third text-text-third group-hover:text-primary-500 group-hover:bg-bg-hover transition-all duration-200 shrink-0">
      <i className="fa-solid fa-copy text-xs"></i>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 py-2 w-full">
      <Menu className="w-full bg-bg-second border border-bg-fourth rounded-2xl p-2 shadow-sm">
        <MenuSection>
          <MenuItem
            icon="fa-solid fa-at"
            title={t("user:profileHeader.urlNameLabel")}
            description={urlNameValue}
            onClick={() => handleCopy(nickname || "", t("user:profileHeader.urlNameLabel"))}
            rightElement={nickname ? copyIcon : <div />}
          />
          <MenuItem
            icon="fa-solid fa-link"
            title={t("user:profileHeader.profileUrlLabel")}
            description={profileUrl}
            onClick={() => handleCopy(profileUrl, t("user:profileHeader.profileUrlLabel"))}
            rightElement={copyIcon}
          />
          <MenuItem
            icon="fa-solid fa-id-card"
            title={t("user:profileHeader.userIdLabel")}
            description={targetId}
            onClick={() => handleCopy(targetId, t("user:profileHeader.userIdLabel"))}
            rightElement={copyIcon}
          />
        </MenuSection>
      </Menu>
    </div>
  );
};

export default UserInfoDialog;
