import EditableField from "@/features/settings/components/editable-field";
import { Skeleton, Text } from "@/components/atoms";
import React from "react";
import { useNavigate } from "react-router-dom";
import useLanguage from "@/utils/i18n";
import { ChangeUrlName } from "./change-url-name";
import { ChangeNickname } from "./change-nickname";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useAuth } from "@/contexts";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

type AccountSettingProps = {};

const AccountSetting: React.FC<AccountSettingProps> = () => {
  const t = useLanguage();
  const { userId } = useAuth();
  const { data: userProfile, isLoading } = useGetUserProfile(userId!);

  const navigate = useNavigate();
  const handleChangeName = () => navigate("name");

  return (
    <SidebarPageCard title={t("settings:account.personalInfo.title")}>
      {isLoading ? (
        <Skeleton sz="md" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />
      ) : (
        <EditableField
          title={t("settings:account.personalInfo.yourName")}
          value={userProfile?.infos.fullName}
          btnChildren={
            <Text>
              <FontAwesomeIcon icon={faPen} className="mr-2"  />{" "}
              {t("settings:account.personalInfo.changeButton")}
            </Text>
          }
          onChangeClick={handleChangeName}
        />
      )}
      <ChangeUrlName userId={userId!} />
      <ChangeNickname userId={userId!} />
    </SidebarPageCard>
  );
};

export default AccountSetting;
