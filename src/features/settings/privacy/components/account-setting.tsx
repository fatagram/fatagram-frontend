import EditableField from "@/features/settings/components/editable-field";
import { Skeleton } from "@/components/atoms";
import React from "react";
import { useNavigate } from "react-router-dom";
import useLanguage from "@/utils/i18n";
import { ChangeUrlName } from "./change-url-name";
import { ChangeNickname } from "./change-nickname";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useAuth } from "@/contexts";
import { List } from "@/components/ui/list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

type AccountSettingProps = {};

const AccountSetting: React.FC<AccountSettingProps> = () => {
  const t = useLanguage();
  const { userId } = useAuth();
  const { data: userProfile, isLoading } = useGetUserProfile(userId!);

  const navigate = useNavigate();
  const handleChangeName = () => navigate("name");

  return (
    <List
      title={t("settings:account.personalInfo.title")}
      description={t("settings:account.personalInfo.description")}
    >
      {!userProfile || isLoading ? (
        <div className="flex p-4">
          <Skeleton sz="md" className="w-full mb-2" />
        </div>
      ) : (
        <EditableField
          icon={<FontAwesomeIcon icon={faUser} />}
          title={t("settings:account.personalInfo.yourName")}
          description={t("settings:account.personalInfo.yourNameDescription")}
          value={userProfile?.infos.fullName}
          onChangeClick={handleChangeName}
        />
      )}
      <ChangeUrlName userId={userId!} />
      <ChangeNickname userId={userId!} />
    </List>
  );
};

export default AccountSetting;
