import clsx from "clsx";
import EditableField from "@/features/settings/components/editable-field";
import { Skeleton, Text } from "@/components/atoms";
import { userProfileService } from "@/api/user/user-profile.api";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@/components/molecules/card";
import { useAuth } from "@/hooks/contexts/use-auth";
import useLanguage from "@/utils/i18n";
import { ChangeUrlName } from "./change-url-name";
import { ChangeNickname } from "./change-nickname";

type AccountSettingProps = {
  className?: string;
};

const AccountSetting: React.FC<AccountSettingProps> = ({ className }) => {
  const t = useLanguage();
  const [fullName, setFullName] = React.useState<string>("");
  const [urlName, setUrlName] = React.useState<string | undefined>();
  const [nickname, setNickname] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const { userId } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const handleChangeName = () => navigate("name");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const _userId: string = userId ?? "";
      const response = await userProfileService.GetProfile(_userId, "fullName,urlName,nickname");
      if (response.success) {
        setFullName(response.data.infos.fullName);
        setUrlName(response.data.infos.urlName);
        setNickname(response.data.infos.nickname);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [userProfileService, location.key, userId]);

  return (
    <div className={clsx(className)}>
      <Card title={t("settings:account.personalInfo.title")} className="mb-0 gap-5">
        {isLoading ? (
          <Skeleton sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />
        ) : (
          <EditableField
            title={t("settings:account.personalInfo.yourName")}
            value={fullName}
            btnChildren={
              <Text>
                <i className="fa-solid fa-pen mr-2"></i>{" "}
                {t("settings:account.personalInfo.changeButton")}
              </Text>
            }
            onChangeClick={handleChangeName}
          />
        )}
        <ChangeUrlName isLoading={isLoading} urlName={urlName} />
        <ChangeNickname isLoading={isLoading} nickname={nickname} />
      </Card>
    </div>
  );
};

export default AccountSetting;
