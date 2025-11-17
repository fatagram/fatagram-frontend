import { Skeleton, Text } from "@/components/atoms";
import EditableField from "../../components/editable-field";
import useLanguage from "@/utils/i18n";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ChangeUrlNameDto, { ErrorCodes, ErrorKey } from "@/api/user/dto/change-url-name.dto";
import { userProfileService } from "@/api/user/user-profile.api";
import { useAuth } from "@/hooks/contexts/use-auth";
interface ChangeUrlNameProps {
  isLoading: boolean;
  urlName: string | undefined;
}

export const ChangeUrlName: React.FC<ChangeUrlNameProps> = ({ isLoading, urlName: u }) => {
  const t = useLanguage();
  const { setUrlName: _setUrlName } = useAuth();
  const [urlName, setUrlName] = useState<string | undefined>();
  const [isEditUrlName, setIsEditUrlName] = useState<boolean>(false);
  const [isEditUrlNameFailed, setIsEditUrlNameFailed] = useState<boolean>(false);
  const [editUrlFailedMessage, setEditUrlFailedMessage] = useState<string>("");

  useEffect(() => {
    setUrlName(u);
  }, [u]);

  // Handle change URL name
  const handleChangeUrlName = async (urlName: string | undefined) => {
    const changeUrlNameDto: ChangeUrlNameDto = {
      urlName: urlName ?? "",
    };
    const response = await userProfileService.UpdateUrlName(changeUrlNameDto);
    if (response.success) {
      setUrlName(urlName);
      _setUrlName?.(urlName);
      setIsEditUrlName(false);
    } else {
      setIsEditUrlNameFailed(true);
      const errorCode = response?.errorCode;
      setEditUrlFailedMessage(t(ErrorCodes[errorCode as ErrorKey]));
    }
  };

  if (isLoading) {
    return <Skeleton sz="md-1" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0" />;
  }

  return (
    <EditableField
      title={t("settings:account.personalInfo.urlName")}
      value={urlName}
      noDataValue={t("settings:account.personalInfo.noUrlName")}
      placeholder={t("settings:account.personalInfo.urlNamePlaceholder")}
      valueClassName={clsx(!urlName && "!opacity-50")}
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
  );
};
