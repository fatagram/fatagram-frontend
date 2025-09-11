import React, { useMemo } from "react";
import Button from "@/components/common/ui/Button/Button";
import { userProfileService } from "@/api/user/user-profile.api";
import { friendshipService } from "@/api/user/friendship.api";
import LabelSkeletonLoading from "@/components/common/ui/Text/TextSkeletionLoading";
import Text from "@/components/common/ui/Text";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import ProfileBackground from "./ProfileBackground";
import ProfileAvatar from "./ProfileAvatar";
import AddFriendButton from "./AddFriendButton";
// import { useDialog } from "@/contexts/DialogContext";
import { useNavigate } from "react-router-dom";
import { AuthStatus } from "@/pages/profile/AuthStatus";
import { useDispatch } from "react-redux";
import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { useDialog } from "@/contexts/DialogContext";

export interface ProfileHeaderProps {
    className?: string;
    authStatus?: AuthStatus;
    onUserNotFound?: () => void;
}

/**
 * ProfileHeader component displays the user's profile header with avatar, background image, and action buttons.
 * It allows the user to change their avatar and background image if they are the owner of the profile.
 * @param {string} className - Additional CSS classes for styling.
 * @param {string} userId - The ID of the user whose profile is being displayed.
 * @param {boolean} isOwner - Indicates if the current authenticated user is the owner of the profile.
 * @param {function} onUserNotFound - Callback function to handle when a user is not found.
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({className, authStatus, onUserNotFound}) => {

    // States
    const [fullName, setFullName] = React.useState<string>("");
    const [nickname, setNickname] = React.useState<string | null>(null);
    const [avatar, setAvatar] = React.useState<string>("");
    const [background, setBackground] = React.useState<string>("");
    // const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [numberOfFriends, setNumberOfFriends] = React.useState<number>(0);
    // const [isShowOversizeError, setIsShowOversizeError] = React.useState<boolean>(false);
    
    // Auth info hook
    // const { userId, isAuthenticated } = useAuth(); 
    const { t } = useTranslation() as { t: (key: string) => string };
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    const { openDialog, closeDialog } = useDialog(); 

    React.useEffect(() => {
        document.title = fullName
    }, [fullName]);

    // Fetch user profile
    React.useEffect(() => {
        const fetchProfile = async () => {
            const response = await userProfileService.GetProfile(authStatus?.userId ? authStatus.userId : "", "avatar,background,fullName,nickname");
            // console.log(response);
            // Delay to simulate loading
            if (response.success) {
                setAvatar(response.data.infos.avatar);
                setBackground(response.data.infos.background);
                setFullName(response.data.infos.fullName);
                setNickname(response.data.infos.nickname);
                // setIsOwner(response.data.isOwner);
            }
            else {
                // console.log(response.errorCodes);
                onUserNotFound?.();
            }
            setIsLoading(false);
        }
        const fetchNumberOfFriends = async() => {
            const response = await friendshipService.GetNumberOfFriends(authStatus?.userId ? authStatus.userId : "");
            if (response.success) {
                setNumberOfFriends(response.data?.numberOfFriends ?? 0);
            }
            else {
                // console.log(response.errorCodes);
            }
        }
        if (authStatus?.userId) {
            fetchProfile();
            fetchNumberOfFriends();
        }
    }, [authStatus, onUserNotFound, friendshipService]);

    // Handle background and avatar selection
    const handleSelectBackground = async (file: File) => {
        const result = await userProfileService.UploadBackground(file);
        console.log(result);
        if (result.success) {
            setBackground(result.data);
        }
        else if (result.errorCode === "LARGE_FILE_ERROR")
        {
            openDialog({
                title: t("user:profileHeader.oversizeErrorTitle"),
                content: t("user:profileHeader.oversizeErrorMessage"),
                primaryButton: {
                    text: t("user:profileHeader.oversizeErrorButton"),
                    onClick: closeDialog
                },
            });
        }
    }

    const handleSelectAvatar = async (file: File) => {
        const result = await userProfileService.UploadAvatar(file)
        if (result.success) {
            setAvatar(result.data);
        }
        else if (result.errorCode === "LARGE_FILE_ERROR")
        {
            openDialog({
                title: t("user:profileHeader.oversizeErrorTitle"),
                content: t("user:profileHeader.oversizeErrorMessage"),
                primaryButton: {
                    text: t("user:profileHeader.oversizeErrorButton"),
                    onClick: closeDialog
                },
            })
        }
    }

    return (
        <div className={`relative w-full h-auto pb-5 layout ${className}`}>
            <div className="relative lg:mx-0 mx-2">
                <ProfileBackground isLoading={isLoading} background={background} isOwner={authStatus?.isOwner || false}
                    handleSelectBackground={handleSelectBackground}/>
            </div>
            
            <div className="absolute flex layout w-[85%] left-1/2 -translate-x-1/2 top-100 -translate-y-1/2 flex-col lg:flex-row items-center lg:items-end
                            mt-[120px] lg:mt-0 lg:gap-0 gap-3">
                <ProfileAvatar isLoading={isLoading} avatar={avatar} isOwner={authStatus?.isOwner || false}
                    handleSelectAvatar={handleSelectAvatar}/>
                <div className="flex flex-col gap-2 flex-1 mb-3 ml-4">
                    { isLoading ? <LabelSkeletonLoading size="md-1" className="lg:self-end mb-2 lg:mb-8 lg:ml-5 w-[200px] mt-2 lg:mt-0"/> : 
                        <div >
                            <Text size="xl-1" weight="bold" className=" lg:text-left text-center break-words">{fullName}</Text>
                            {
                                nickname &&
                                <Text size="lg-3" weight="light" className="lg:text-left text-center lg:ml-2">({nickname})</Text>
                            }
                        </div>
                    }
                    
                    { isLoading ? <LabelSkeletonLoading size="lg-1" className="w-[300px] lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                        <div className="flex items-center lg:flex-row flex-col lg:items-start">
                            <Text size="md-2" className="text-[var(--text-color)]">{
                                        numberOfFriends > 0 ? numberOfFriends + " " + t("user:profileHeader.friendsCount") :
                                        t("user:profileHeader.noFriendsCount")
                                    }</Text>
                            <div className="relative flex flex-wrap lg:flex-none gap-2 lg:ml-auto lg:w-auto lg:mt-0 mt-2">       
                                {authStatus?.isAuthenticated && <>
                                    { authStatus.isOwner ? (<Button size="sm-1"
                                            onClick={() => {
                                                navigate(`/settings`)
                                            }}
                                        >
                                            <i className="fa-solid fa-user-pen"></i> {t("user:profileHeader.editButton")}
                                        </Button>) :
                                    <AddFriendButton size="sm-1" uid={authStatus?.userId}/>  
                                    }
                                </>}
                                
                                { !authStatus?.isOwner && authStatus?.isAuthenticated && <Button size="sm-1" variant="secondary"><i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}</Button> }
                                <Button size="sm-1" variant="secondary"><i className="fa-solid fa-circle-info"></i> 
                                    {/* <Text className="hidden sm:inline-flex ml-1">{t("user:profileHeader.moreButton")}</Text> */}
                                </Button>
                            </div>
                        </div>
                    }  
                </div>
            </div>

            {/* {isShowOversizeError && <OverlayDialog
                title={t("user:profileHeader.oversizeErrorTitle")}
                content={<Text>{t("user:profileHeader.oversizeErrorMessage")}</Text>}
                primaryButton={{
                    text: t("user:profileHeader.oversizeErrorButton"),
                    onClick: () => { setIsShowOversizeError(false); }
                }}
                onClose={() => {setIsShowOversizeError(false)}}/>} */}

        </div>
    )
}

export default ProfileHeader;