import SettingCard from "@/components/common/container/SettingCard";
import EditableField from "@/components/common/container/SettingCard/SettingItem/EditableField";
import Text, { TextSkeletonLoading } from "@/components/common/ui/Text";
import { UserService } from "@/api/user/user.api";
import React, { useEffect } from "react";
import ChangeUrlNameDto, { ErrorCodes } from "@/api/user/dto/change_url_name.dto";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ErrorKey } from "@/api/auth/dto/login.dto";
import { useAuth } from "@/contexts/AuthContext";

interface AccountSettingProps {
    className?: string;
}

const AccountSetting: React.FC<AccountSettingProps> = ({className}) => {
    const [fullName, setFullName] = React.useState<string>("");
    const [urlName, setUrlName] = React.useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const { userId, refresh } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation() as { t: (key: string) => string };

    // URL name setting state
    const [isEditUrlName, setIsEditUrlName] = React.useState<boolean>(false);
    const [isEditUrlNameFailed, setIsEditUrlNameFailed] = React.useState<boolean>(false);
    const [editUrlFailedMessage, setEditUrlFailedMessage] = React.useState<string>("");

    const userService = React.useMemo(() => {
        return new UserService();
    }, []);

    // Handle change URL name
    const handleChangeUrlName = async (urlName: string) => {
        const changeUrlNameDto : ChangeUrlNameDto = {
            urlName: urlName
        }
        const response = await userService.UpdateUrlName(changeUrlNameDto);
        if (response.success) {
            setUrlName(urlName);
            setIsEditUrlName(false);

            // AuthContext refresh user info after update
            refresh?.();

        }
        else {
            setIsEditUrlNameFailed(true);
            const errorCode = response?.errorCode;
            setEditUrlFailedMessage(t(ErrorCodes[errorCode as ErrorKey]));
        }
    }

    const handleChangeName = () => navigate("name");

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            const _userId : string = userId ?? "";
            const response = await userService.GetProfile(_userId, "fullName,urlName");
            if (response.success) {
                setFullName(response.data.infos.fullName);
                setUrlName(response.data.infos.urlName);
            }
            setIsLoading(false);
        }
        fetchProfile();
    }, [userService, location.key, userId])

    return (
        <div className={`${className}`}>
            <SettingCard title={t("settings:account.personalInfo.title")} className="mb-0 gap-5">
                { isLoading ? <TextSkeletonLoading size="medium" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <EditableField title={t("settings:account.personalInfo.yourName")} 
                        value={fullName} 
                        btnChildren={<Text><i className="fa-solid fa-pen mr-2"></i> {
                            t("settings:account.personalInfo.changeButton")
                        }</Text>}
                        onChangeClick={handleChangeName}/> 
                }
                { isLoading ? <TextSkeletonLoading size="medium" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <EditableField title={t("settings:account.personalInfo.urlName")}
                        isEmpty={urlName === undefined}
                        value={urlName === undefined ? t("settings:account.personalInfo.noUrlName") : urlName}
                        placeholder={t("settings:account.personalInfo.urlNamePlaceholder")}
                        valueClassName={`${urlName === undefined ? "!opacity-50" : ""}`}
                        btnChildren={<Text><i className="fa-solid fa-pen mr-2"></i> {
                            t("settings:account.personalInfo.changeButton")
                        }</Text>}
                        editableMode="inline"
                        isEdit={isEditUrlName}
                        isError={isEditUrlNameFailed}
                        errorMessage={editUrlFailedMessage}
                        onChangeClick={() => { setIsEditUrlName(true); }}
                        onCancelClick={() => { setIsEditUrlName(false); setIsEditUrlNameFailed(false); }}
                        onSaveClick={(e) => handleChangeUrlName(e)}/> 
                }
            </SettingCard>
        </div>
    )
}

export default AccountSetting;