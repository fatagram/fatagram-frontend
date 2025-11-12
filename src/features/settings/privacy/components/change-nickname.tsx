import { FC, useEffect, useState } from "react";
import { Skeleton, Text } from "@/components/atoms";
import EditableField from "../../components/editable-field";
import clsx from "clsx";
import useLanguage from "@/utils/i18n";
import ChangeNicknameDto, { ErrorCodes, ErrorKey } from "@/api/user/dto/change-nickname.dto";
import { userInfoService } from "@/api/user/user-info.api";

interface ChangeNicknameProps {
  isLoading: boolean;
  nickname: string | undefined;
}

export const ChangeNickname: FC<ChangeNicknameProps> = ({ isLoading, nickname: n }) => {
  const t = useLanguage();
  // Nickname setting state
  const [nickname, setNickname] = useState<string | undefined>();
  const [isEditNickname, setIsEditNickname] = useState<boolean>(false);
  const [isEditNicknameFailed, setIsEditNicknameFailed] = useState<boolean>(false);
  const [editNicknameFailedMessage, setEditNicknameFailedMessage] = useState<string>("");

  useEffect(() => {
    setNickname(n);
  }, [n]);

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

  if (isLoading) {
    return <Skeleton sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />;
  }

  return (
    <EditableField
      title={t("settings:account.personalInfo.nickname")}
      value={nickname}
      noDataValue={t("settings:account.personalInfo.noNickname")}
      placeholder={t("settings:account.personalInfo.nicknamePlaceholder")}
      valueClassName={clsx(!nickname && "!opacity-50")}
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
  );
};
