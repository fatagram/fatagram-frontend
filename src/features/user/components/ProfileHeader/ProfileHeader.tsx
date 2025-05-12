import React, { useMemo } from "react";
import Button from "@/components/common/ui/Button/Button";
import { UserService } from "@/api/user/user.api";
import LabelSkeletonLoading from "@/components/common/ui/Text/TextSkeletionLoading";
import Text from "@/components/common/ui/Text";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import ProfileBackground from "./ProfileBackground";
import ProfileAvatar from "./ProfileAvatar";
import AddFriendButton from "./AddFriendButton";
import OverlayDialog from "@/components/common/utils/DialogBox/OverlayDialog";
import { useDialog } from "@/contexts/DialogContext";

export interface ProfileHeaderProps {
    className?: string;
    userId ?: string;
    onUserNotFound?: () => void;
}

/**
 * ProfileHeader component displays the user's profile header with avatar, background image, and action buttons.
 * It allows the user to change their avatar and background image if they are the owner of the profile.
 * @param {string} className - Additional CSS classes for styling.
 * @param {string} userId - The ID of the user whose profile is being displayed.
 * @param {function} onUserNotFound - Callback function to handle when a user is not found.
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({className, userId: uid , onUserNotFound}) => {
    
    // States
    const [fullName, setFullName] = React.useState<string>("");
    const [avatar, setAvatar] = React.useState<string>("");
    const [background, setBackground] = React.useState<string>("");
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [numberOfFriends, setNumberOfFriends] = React.useState<number>(0);
    const [isShowOversizeError, setIsShowOversizeError] = React.useState<boolean>(false);
    
    // Auth info hook
    const { userId, isAuthenticated } = useAuth(); 
    const { t } = useTranslation() as { t: (key: string) => string };
    const { showDialog, closeDialog } = useDialog();

    const userService = useMemo(() => {
        return new UserService();
    }
    , []);

    React.useEffect(() => {
        document.title = fullName
    }, [fullName]);

    // Fetch user profile
    React.useEffect(() => {
        const fetchProfile = async () => {
            const response = await userService.GetProfile(uid ? uid : "", "avatar,background,fullName");
            if (response.success) {
                setAvatar(response.data.infos.avatar);
                setBackground(response.data.infos.background);
                setFullName(response.data.infos.fullName);
                setIsOwner(response.data.isOwner);
            }
            else {
                console.log(response.errorCodes);
                onUserNotFound?.();
            }
            setIsLoading(false);
        }
        const fetchNumberOfFriends = async() => {
            const response = await userService.GetNumberOfFriends(uid ? uid : "");
            if (response.success) {
                setNumberOfFriends(response.data?.numberOfFriends ?? 0);
            }
            else {
                console.log(response.errorCodes);
            }
        }
        if (uid) { 
            fetchProfile();
            fetchNumberOfFriends();
        }
    }, [uid, userId, onUserNotFound, userService]);

    // Handle background and avatar selection
    const handleSelectBackground = async (file: File) => {
        const result = await userService.UploadBackground(file)
        if (result.success) {
            setBackground(result.data);
        }
        else if (result.errorCode === "LARGE_FILE_ERROR")
        {
            showDialog?.({
                title: t("user:profileHeader.oversizeErrorTitle"),
                content: <Text>{t("user:profileHeader.oversizeErrorMessage")}</Text>,
                primaryButton: {
                    text: t("user:profileHeader.oversizeErrorButton"),
                    onClick: () => { closeDialog?.(); }
                },
                onClose: () => { closeDialog?.(); }
            });
        }
    }

    const handleSelectAvatar = async (file: File) => {
        const result = await userService.UploadAvatar(file)
        if (result.success) {
            setAvatar(result.data);
        }
        else if (result.errorCode === "LARGE_FILE_ERROR")
        {
            showDialog?.({
                title: t("user:profileHeader.oversizeErrorTitle"),
                content: <Text>{t("user:profileHeader.oversizeErrorMessage")}</Text>,
                primaryButton: {
                    text: t("user:profileHeader.oversizeErrorButton"),
                    onClick: () => { closeDialog?.(); }
                },
                onClose: () => { closeDialog?.(); }
            });
        }
    }

    return (
        <div className={`relative w-full h-auto pb-5 layout ${className}`}>
            <div className="relative lg:mx-0 mx-2">
                <ProfileBackground isLoading={isLoading} background={background} isOwner={isOwner}
                    handleSelectBackground={handleSelectBackground}/>
            </div>
            
            <div className="absolute flex layout w-[85%] left-1/2 -translate-x-1/2 top-100 -translate-y-1/2 flex-col lg:flex-row items-center lg:items-end
                            mt-[120px] lg:mt-0 lg:gap-0 gap-3">
                <ProfileAvatar isLoading={isLoading} avatar={avatar} isOwner={isOwner}
                    handleSelectAvatar={handleSelectAvatar}/>
                { isLoading ? <LabelSkeletonLoading size="medium" className="lg:self-end mb-2 lg:mb-8 lg:ml-5 w-[200px] mt-2 lg:mt-0"/> : 
                    <div className="flex flex-col mb-2 lg:ml-5 gap-1 lg:items-start items-center">
                        <Text size="xl" weight="bold" className=" lg:text-left text-center">{fullName}</Text>
                        <Text size="md-2" className="text-[var(--text-color)]">{
                                numberOfFriends > 0 ? numberOfFriends + " " + t("user:profileHeader.friendsCount") :
                                t("user:profileHeader.noFriendsCount")
                            }</Text>
                    </div>
                }
                
                { isLoading ? <LabelSkeletonLoading size="large" className="w-[300px] lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <div className="relative flex flex-wrap lg:flex-none gap-2 lg:ml-auto lg:w-auto mb-7 lg:mt-0 mt-2">
                        {isAuthenticated && <>
                            { isOwner ? (<Button size="medium"><i className="fa-solid fa-user-pen"></i> {t("user:profileHeader.editButton")}</Button>) :
                               <AddFriendButton uid={uid}/>  
                            }
                        </>}
                        
                        { !isOwner && isAuthenticated && <Button size="medium" variant="secondary"><i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}</Button> }
                        <Button size="medium" variant="secondary"><i className="fa-solid fa-circle-info"></i> 
                            <Text className="hidden sm:inline-flex ml-1">{t("user:profileHeader.moreButton")}</Text>
                        </Button>
                    </div>
                }  
            </div>

            {isShowOversizeError && <OverlayDialog
                title={t("user:profileHeader.oversizeErrorTitle")}
                content={<Text>{t("user:profileHeader.oversizeErrorMessage")}</Text>}
                primaryButton={{
                    text: t("user:profileHeader.oversizeErrorButton"),
                    onClick: () => { setIsShowOversizeError(false); }
                }}
                onClose={() => {setIsShowOversizeError(false)}}/>}
        </div>
    )
}

export default ProfileHeader;