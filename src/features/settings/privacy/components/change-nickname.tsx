import { FC, useState } from "react";
import { Skeleton } from "@/components/atoms";
import EditableField from "../../components/editable-field";
import clsx from "clsx";
import useLanguage from "@/utils/i18n";
import { useGetUserProfile, useUpdateNickname } from "@/features/hooks/use-user-profile";
import { ErrorCodes } from "@/api/user/dto/change-nickname.dto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

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

  if (!userProfile || isLoading) {
    return (
      <div className="flex p-4">
        <Skeleton sz="md" className="w-full mb-2" />
      </div>
    );
  }

  return (
    <EditableField
      icon={<FontAwesomeIcon icon={faTag} />}
      title={t("settings:account.personalInfo.nickname")}
      description={t("settings:account.personalInfo.nicknameDescription")}
      value={userProfile?.infos.nickname}
      noDataValue={t("settings:account.personalInfo.noNickname")}
      placeholder={t("settings:account.personalInfo.nicknamePlaceholder")}
      valueClassName={clsx(!userProfile?.infos.nickname && "!opacity-50")}
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
