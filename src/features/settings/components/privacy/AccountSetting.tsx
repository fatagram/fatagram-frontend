import SettingCard from "@/components/common/container/SettingCard";
import EditableField from "@/components/common/container/SettingCard/SettingItem/EditableField";
import { LabelSkeletonLoading } from "@/components/common/ui/Label";
import { UserService } from "@/api/user/user.api";
import React, { useEffect } from "react";
import ChangeUrlNameDto, { ErrorMessages } from "@/api/user/dto/change_url_name.dto";
import { useLocation, useNavigate } from "react-router-dom";

interface AccountSettingProps {
    className?: string;
}

const AccountSetting: React.FC<AccountSettingProps> = ({className}) => {
    const [fullName, setFullName] = React.useState<string>("");
    const [urlName, setUrlName] = React.useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const navigate = useNavigate();
    const location = useLocation();

    // URL name setting state
    const [isEditUrlName, setIsEditUrlName] = React.useState<boolean>(false);
    const [isEditUrlNameFailed, setIsEditUrlNameFailed] = React.useState<boolean>(false);
    const [editUrlFailedMessage, setEditUrlFailedMessage] = React.useState<string>("");

    const userService = React.useMemo(() => {
        return new UserService();
    }, []);

    const handleChangeUrlName = async (urlName: string) => {
        const changeUrlNameDto : ChangeUrlNameDto = {
            urlName: urlName
        }
        const response = await userService.UpdateUrlName(changeUrlNameDto);
        if (response.success) {
            setUrlName(urlName);
            localStorage.setItem("urlName", urlName);
            setIsEditUrlName(false);
        }
        else {
            setIsEditUrlNameFailed(true);
            const errorCode = response?.errorCodes?.[0];
            setEditUrlFailedMessage(errorCode !== undefined ? ErrorMessages[errorCode] : "An error occurred");
        }
    }

    const handleChangeName = () => navigate("name");

    useEffect(() => {
        const fetchProfile = async () => {
            const userId : string = localStorage.getItem("userId") ?? "";
            const response = await userService.GetProfile(userId, "fullName,urlName");
            if (response.success) {
                setFullName(response.data.infos.fullName);
                setUrlName(response.data.infos.urlName);
            }
            else {
                console.log(response.errorCodes);
            }
            setIsLoading(false);
        }
        fetchProfile();
    }, [userService, location.key])

    return (
        <div className={`${className}`}>
            <SettingCard title="Personal Informations" className="mb-0 gap-2 lg:gap-5">
                { isLoading ? <LabelSkeletonLoading size="medium" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <EditableField title="Your name" 
                        value={fullName} 
                        btnChildren={<div><i className="fa-solid fa-pen mr-2"></i> Change</div>}
                        onChangeClick={handleChangeName}/> 
                }
                { isLoading ? <LabelSkeletonLoading size="medium" className="w-full lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <EditableField title="Custom URL name"
                        isEmpty={urlName === undefined}
                        value={urlName === undefined ? "No custom URL name" : urlName}
                        placeholder="Your custom URL name"
                        valueClassName={`${urlName === undefined ? "!opacity-50" : ""}`}
                        btnChildren={<div><i className="fa-solid fa-pen mr-2"></i> Change</div>}
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