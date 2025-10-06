import clsx from "clsx";
import EditableField from "@/features/settings/components/editable-field";
import Text, { TextSkeletonLoading } from "@/components/atoms/text";
import { userProfileService } from "@/api/user/user-profile.api";
import React, { useEffect } from "react";
import ChangeUrlNameDto, { ErrorCodes } from "@/api/user/dto/change-url-name.dto";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ErrorKey } from "@/api/auth/dto/login.dto";
import ChangeNicknameDto from "@/api/user/dto/change-nickname.dto";
import { userInfoService } from "@/api/user/user-info.api";
import Card from "@/components/molecules/card";
import { useAuth } from "@/hooks/utilities/use-auth";

type AccountSettingProps = {
  className?: string;
};

const AccountSetting: React.FC<AccountSettingProps> = ({ className }) => {
  const [fullName, setFullName] = React.useState<string>("");
  const [urlName, setUrlName] = React.useState<string | undefined>(undefined);
  const [nickname, setNickname] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const { userId } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation() as { t: (key: string) => string };

  // URL name setting state
  const [isEditUrlName, setIsEditUrlName] = React.useState<boolean>(false);
  const [isEditUrlNameFailed, setIsEditUrlNameFailed] = React.useState<boolean>(false);
  const [editUrlFailedMessage, setEditUrlFailedMessage] = React.useState<string>("");

  // Nickname setting state
  const [isEditNickname, setIsEditNickname] = React.useState<boolean>(false);
  const [isEditNicknameFailed, setIsEditNicknameFailed] = React.useState<boolean>(false);
  const [editNicknameFailedMessage, setEditNicknameFailedMessage] = React.useState<string>("");

  // Handle change URL name
  const handleChangeUrlName = async (urlName: string | undefined) => {
    const changeUrlNameDto: ChangeUrlNameDto = {
      urlName: urlName ?? "",
    };
    const response = await userProfileService.UpdateUrlName(changeUrlNameDto);
    if (response.success) {
      setUrlName(urlName);
      setIsEditUrlName(false);
    } else {
      setIsEditUrlNameFailed(true);
      const errorCode = response?.errorCode;
      setEditUrlFailedMessage(t(ErrorCodes[errorCode as ErrorKey]));
    }
  };

  // Handle change nickname
  const handleChangeNickname = async (nickname: string | undefined) => {
    const changeNickname: ChangeNicknameDto = {
      nickname: nickname ?? "",
    };
    const response = await userInfoService.UpdateNickname(changeNickname);
    if (response.success) {
      setNickname(nickname);
      setIsEditNickname(false);
    } else {
      setIsEditNicknameFailed(true);
      const errorCode = response?.errorCode;
      setEditNicknameFailedMessage(t(ErrorCodes[errorCode as ErrorKey]));
    }
  };

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
          <TextSkeletonLoading sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />
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
        {isLoading ? (
          <TextSkeletonLoading sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />
        ) : (
          <EditableField
            title={t("settings:account.personalInfo.urlName")}
            value={urlName}
            noDataValue={t("settings:account.personalInfo.noUrlName")}
            placeholder={t("settings:account.personalInfo.urlNamePlaceholder")}
            valueClassName={clsx(urlName === undefined || urlName === null && "!opacity-50")}
            btnChildren={
              <Text>
                <i className="fa-solid fa-pen mr-2"></i>
                {t("settings:account.personalInfo.changeButton")}
              </Text>
            }
            editableMode="inline"
            isEdit={isEditUrlName}
            isError={isEditUrlNameFailed}
            errorMessage={editUrlFailedMessage}
            onChangeClick={() => {
              setIsEditUrlName(true);
            }}
            onCancelClick={() => {
              setIsEditUrlName(false);
              setIsEditUrlNameFailed(false);
            }}
            onSaveClick={(e) => handleChangeUrlName(e)}
          />
        )}
        {isLoading ? (
          <TextSkeletonLoading sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />
        ) : (
          <EditableField
            title={t("settings:account.personalInfo.nickname")}
            value={nickname}
            noDataValue={t("settings:account.personalInfo.noNickname")}
            placeholder={t("settings:account.personalInfo.nicknamePlaceholder")}
            valueClassName={clsx(nickname === undefined || nickname === null && "!opacity-50")}
            btnChildren={
              <Text>
                <i className="fa-solid fa-pen mr-2"></i>
                {t("settings:account.personalInfo.changeButton")}
              </Text>
            }
            editableMode="inline"
            isEdit={isEditNickname}
            isError={isEditNicknameFailed}
            errorMessage={editNicknameFailedMessage}
            onChangeClick={() => {
              setIsEditNickname(true);
            }}
            onCancelClick={() => {
              setIsEditNickname(false);
              setIsEditNicknameFailed(false);
            }}
            onSaveClick={(e) => handleChangeNickname(e)}
          />
        )}
      </Card>
    </div>
  );
};

export default AccountSetting;
