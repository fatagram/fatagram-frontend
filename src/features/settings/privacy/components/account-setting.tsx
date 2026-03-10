import clsx from "clsx";
import EditableField from "@/features/settings/components/editable-field";
import { Skeleton, Text } from "@/components/atoms";
import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/card";
import useLanguage from "@/utils/i18n";
import { ChangeUrlName } from "./change-url-name";
import { ChangeNickname } from "./change-nickname";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useAuth } from "@/contexts";

type AccountSettingProps = {
  className?: string;
};

const AccountSetting: React.FC<AccountSettingProps> = ({ className }) => {
  const t = useLanguage();
  // const [fullName, setFullName] = React.useState<string>("");
  // const [urlName, setUrlName] = React.useState<string | undefined>();
  // const [nickname, setNickname] = React.useState<string | undefined>();
  // const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { userId } = useAuth();
  const { data: userProfile, isLoading } = useGetUserProfile(userId!);

  const navigate = useNavigate();
  // const location = useLocation();
  const handleChangeName = () => navigate("name");

  return (
    <div className={clsx(className)}>
      <Card title={t("settings:account.personalInfo.title")} className="mb-0 gap-5">
        {isLoading ? (
          <Skeleton sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />
        ) : (
          <EditableField
            title={t("settings:account.personalInfo.yourName")}
            value={userProfile?.infos.fullName}
            btnChildren={
              <Text>
                <i className="fa-solid fa-pen mr-2" />{" "}
                {t("settings:account.personalInfo.changeButton")}
              </Text>
            }
            onChangeClick={handleChangeName}
          />
        )}
        <ChangeUrlName userId={userId!} />
        <ChangeNickname userId={userId!} />
      </Card>
    </div>
  );
};

export default AccountSetting;
