import { FC, useState } from "react";
import { Skeleton, Text } from "@/components/atoms";
import EditableField from "../../components/editable-field";
import clsx from "clsx";
import useLanguage from "@/utils/i18n";
import { useGetUserProfile, useUpdateNickname } from "@/features/hooks/use-user-profile";
import { ErrorCodes } from "@/api/user/dto/change-nickname.dto";

interface ChangeNicknameProps {
  userId: string;
}

export const ChangeNickname: FC<ChangeNicknameProps> = ({ userId }) => {
  const t = useLanguage();
  // Nickname setting state
  const [isEditNickname, setIsEditNickname] = useState<boolean>(false);
  const [isEditNicknameFailed, setIsEditNicknameFailed] = useState<boolean>(false);
  const [editNicknameFailedMessage, setEditNicknameFailedMessage] = useState<string>("");

  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const updateNicknameMutation = useUpdateNickname(userId);

  const handleSaveNickname = (newNickname: string | undefined) => {
    if (!newNickname) return;

    updateNicknameMutation.fetch(
      { nickname: newNickname },
      {
        onSuccess: () => {
          setIsEditNickname(false);
          setIsEditNicknameFailed(false);
        },
        onError: (error) => {
          const errorCode = error?.code;
          if (errorCode && ErrorCodes[errorCode]) {
            setEditNicknameFailedMessage(t(ErrorCodes[errorCode]));
          } else {
            setEditNicknameFailedMessage(
              t("settings:account.personalInfo.errorMessages.changeNickname.unknownError"),
            );
          }
          setIsEditNicknameFailed(true);
        },
      },
    );
  };

  if (isLoading) {
    return <Skeleton sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />;
  }

  return (
    <EditableField
      title={t("settings:account.personalInfo.nickname")}
      value={userProfile?.nickname}
      noDataValue={t("settings:account.personalInfo.noNickname")}
      placeholder={t("settings:account.personalInfo.nicknamePlaceholder")}
      valueClassName={clsx(!userProfile?.nickname && "!opacity-50")}
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
      onSaveClick={handleSaveNickname}
    />
  );
};
