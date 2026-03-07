import { Skeleton, Text } from "@/components/atoms";
import EditableField from "../../components/editable-field";
import useLanguage from "@/utils/i18n";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "@/hooks/contexts/use-auth";
import { useGetUserProfile, useUpdateUrlName } from "@/features/hooks/use-user-profile";
import { ErrorCodes } from "@/api/user/dto/change-url-name.dto";

interface ChangeUrlNameProps {
  userId: string;
}

export const ChangeUrlName: React.FC<ChangeUrlNameProps> = ({ userId }) => {
  const t = useLanguage();
  const { setUrlName: _setUrlName } = useAuth();
  const [isEditUrlName, setIsEditUrlName] = useState<boolean>(false);
  const [isEditUrlNameFailed, setIsEditUrlNameFailed] = useState<boolean>(false);
  const [editUrlFailedMessage, setEditUrlFailedMessage] = useState<string>("");

  const { data: userProfile, isLoading } = useGetUserProfile(userId);
  const updateUrlNameMutation = useUpdateUrlName(userId);

  const handleSaveUrlName = (newUrlName: string | undefined) => {
    if (!newUrlName) return;

    updateUrlNameMutation.fetch(
      { urlName: newUrlName },
      {
        onSuccess: () => {
          setIsEditUrlName(false);
          setIsEditUrlNameFailed(false);
          _setUrlName?.(newUrlName);
        },
        onError: (error) => {
          const errorCode = error?.code;
          if (errorCode && ErrorCodes[errorCode]) {
            setEditUrlFailedMessage(t(ErrorCodes[errorCode]));
          } else {
            setEditUrlFailedMessage(t(ErrorCodes["UNKNOWN_ERROR"]));
          }
          setIsEditUrlNameFailed(true);
        },
      },
    );
  };

  if (isLoading) {
    return <Skeleton sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />;
  }

  return (
    <EditableField
      title={t("settings:account.personalInfo.urlName")}
      value={userProfile?.infos.urlName}
      noDataValue={t("settings:account.personalInfo.noUrlName")}
      placeholder={t("settings:account.personalInfo.urlNamePlaceholder")}
      valueClassName={clsx(!userProfile?.infos.urlName && "!opacity-50")}
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
      onSaveClick={handleSaveUrlName}
    />
  );
};
