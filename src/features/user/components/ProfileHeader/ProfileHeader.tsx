import React, { RefObject, useCallback, useMemo } from "react";
import BackgroundImage from "../../../../components/common/display/BackgroundImage/BackgroundImage";
import Button from "../../../../components/common/ui/Button/Button";
import Avatar from "@/components/common/display/Avatar";
import SelectFile from "../../../../components/common/utils/SelectFile/SelectFile";
import { UserService } from "@/api/user/user.api";
import AvatarSkeletonLoading from "../../../../components/common/display/Avatar/AvatarSkeletonLoading";
import BackgroundImageSkeletonLoading from "../../../../components/common/display/BackgroundImage/BackgroundImageSkeletonLoading";
import LabelSkeletonLoading from "../../../../components/common/ui/Text/TextSkeletionLoading";
import Text from "@/components/common/ui/Text";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import Dropdown from "@/components/common/ui/Dropdown/Dropdown";
import useClickOutside from "@/hooks/useClickOutside";

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
    const [friendshipStatus, setFriendshipStatus] = React.useState<string>("None");
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isShowFriendOptions, setIsShowFriendOptions] = React.useState<boolean>(false);
    const [isShowRequestOptions, setIsShowRequestOptions] = React.useState<boolean>(false);
    const [numberOfFriends, setNumberOfFriends] = React.useState<number>(0);

    // Refs
    const btnFriendRef = React.useRef<HTMLButtonElement>(null);
    const btnRequestRef = React.useRef<HTMLButtonElement>(null);
    const friendOptionsRef = React.useRef<HTMLDivElement>(null);
    const requestOptionsRef = React.useRef<HTMLDivElement>(null);

    useClickOutside(friendOptionsRef as RefObject<HTMLDivElement>, 
        btnFriendRef as RefObject<HTMLButtonElement>, () => {
            if (isShowFriendOptions) setIsShowFriendOptions(false);
        }
    );

    useClickOutside(requestOptionsRef as RefObject<HTMLDivElement>, 
        btnRequestRef as RefObject<HTMLButtonElement>, () => {
            if (isShowRequestOptions) setIsShowRequestOptions(false);
        }
    );
    
    // Auth info hook
    const { userId, isAuthenticated } = useAuth(); 
    const { t } = useTranslation() as { t: (key: string) => string };

    const userService = useMemo(() => {
        return new UserService();
    }
    , []);

    // Fetch user profile
    React.useEffect(() => {
        const fetchFriendshipStatus = async () => {
            const response = await userService.GetFriendshipStatus(uid ? uid : "");
            if (response.success) {
                setFriendshipStatus(response.data?.status ?? "None");
            }
            else {
                console.log(response.errorCodes);
            }
        }
        const fetchProfile = async () => {
            const response = await userService.GetProfile(uid ? uid : "", "avatar,background,fullName");
            if (response.success) {
                setAvatar(response.data.infos.avatar);
                setBackground(response.data.infos.background);
                setFullName(response.data.infos.fullName);
                setIsOwner(response.data.isOwner);
                if (!response.data.isOwner) {
                    await fetchFriendshipStatus();
                }
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
            alert("LARGE SIZE")
        }
    }

    const handleSelectAvatar = async (file: File) => {
        const result = await userService.UploadAvatar(file)
        if (result.success) {
            setAvatar(result.data);
        }
        else if (result.errorCode === "LARGE_FILE_ERROR")
        {
            alert("LARGE SIZE")
        }
    }

    const handleSentAddFriendRequest = useCallback(async () => {
        const response = await userService.SendAddFriendRequest(uid ? uid : "");
        if (response.success) {
            setFriendshipStatus("SentByMe");
        }
        else {
            console.log(response.errorCodes);
        }
    }, [uid, userService]);

    const handleCancelAddFriendRequest = useCallback(async () => {
        const response = await userService.CancelAddFriendRequest(uid ? uid : "");
        if (response.success) {
            setFriendshipStatus("None");
        }
        else {
            console.log(response.errorCodes);
        }
    }, [uid, userService]);

    const handleAcceptAddFriendRequest = useCallback(async (id: string | undefined) => {
        const response = await userService.AcceptAddFriendRequest(id ? id : "");
        if (response.success) {
            setFriendshipStatus("Friend");
        }
        else {
            console.log(response.errorCodes);
        }
    }, [userService]);

    const handleDeclineAddFriendRequest = useCallback(async (id: string | undefined) => {
        const response = await userService.DeclineAddFriendRequest(id ? id : "");
        if (response.success) {
            setFriendshipStatus("None");
        }
        else {
            console.log(response.errorCodes);
        }
    }, [userService]);

    // Handle unfriend action
    const handleUnfriend = useCallback(async (id: string | undefined) => {
        const response = await userService.Unfriend(id ? id : "");
        if (response.success) {
            setFriendshipStatus("None");
        }
        else {
            console.log(response.errorCodes);
        }
    }, [userService]);

    // Dropdown options for friend actions
    const friendOptions = useMemo(() => [
        {
            id: "unfriend",
            content: <div><i className="fa-solid fa-user-xmark mr-2"></i> {t("user:profileHeader.unfriendButton")}</div>,
            onClick: async () => { await handleUnfriend?.(uid); },
        }
    ], [uid, handleUnfriend, t]);

    // Dropdown options for request actions
    const requestOptions = useMemo(() => [
        {
            id: "acceptRequest",
            content: <div><i className="fa-solid fa-check mr-2"></i> {t("user:profileHeader.acceptButton")}</div>,
            onClick: async () => await handleAcceptAddFriendRequest?.(uid)
        },
        {
            id: "cancelRequest",
            content: <div><i className="fa-solid fa-xmark mr-2"></i> {t("user:profileHeader.declineButton")}</div>,
            onClick: async () => await handleDeclineAddFriendRequest?.(uid)
        }
    ], [uid, handleAcceptAddFriendRequest, handleDeclineAddFriendRequest, t]);

    return (
        <div className={`relative w-full h-auto pb-5 layout ${className}`}>
            <div className="relative lg:mx-0 mx-2">
                { isLoading ? <BackgroundImageSkeletonLoading alt="Loading" className="relative min-h-[300px]"/> : 
                    <BackgroundImage src={background} alt="Background Image"
                    className="relative min-h-[200px] w-full">
                        { isOwner && 
                            <SelectFile
                                onChange={handleSelectBackground}
                                accept="image/*"
                                multiple={false}
                                className="absolute flex items-center right-2 bottom-2 z-10 opacity-40 hover:opacity-70 gap-2">
                                    <i className="fa-solid fa-camera"></i> 
                                    <Text className="sm:flex hidden"
                                        size="md">{background ? t("user:profileHeader.changeButton") : t("user:profileHeader.addButton")}</Text>
                            </SelectFile> 
                        }
                    </BackgroundImage>
                }
            </div>
            
            <div className="absolute flex layout w-[85%] left-1/2 -translate-x-1/2 top-100 -translate-y-1/2 flex-col lg:flex-row items-center lg:items-end
                            mt-[120px] lg:mt-0 lg:gap-0 gap-3">
                { isLoading ? <AvatarSkeletonLoading alt="Loading" size="large" className="border-[5px] border-[var(--bg-color-secondary)]"/> 
                    : <Avatar src={avatar} onChange={handleSelectAvatar}
                        alt="Avatar" size="large" isCanEdit={isOwner}
                        className="border-[5px] border-[var(--bg-color-secondary)]"/>
                }
                { isLoading ? <LabelSkeletonLoading size="medium" className="lg:self-end mb-2 lg:mb-8 lg:ml-5 w-[200px] mt-2 lg:mt-0"/> : 
                    <div className="flex flex-col mb-2 lg:ml-5 gap-1 lg:items-start items-center">
                        <Text size="xl" weight="bold">{fullName}</Text>
                        <Text size="md-2" className="text-[var(--text-color)]">{
                                numberOfFriends > 0 ? numberOfFriends + " " + t("user:profileHeader.friendsCount") :
                                t("user:profileHeader.noFriendsCount")
                            }</Text>
                    </div>
                }
                
                { isLoading ? <LabelSkeletonLoading size="large" className="w-[300px] lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <div className="relative flex flex-wrap w-screen lg:flex-1 lg:justify-end justify-center gap-2 mb-8 lg:mr-5 lg:w-auto">
                        {isAuthenticated && <>
                            { isOwner ? (<Button size="medium"><i className="fa-solid fa-user-pen"></i> {t("user:profileHeader.editButton")}</Button>) :
                                <>
                                    {friendshipStatus === "None" ? (
                                        <Button size="medium"
                                            onClick={handleSentAddFriendRequest}>
                                                <i className="fa-solid fa-plus"></i> {t("user:profileHeader.addFriendButton")}
                                        </Button>
                                    ) : friendshipStatus === "SentByMe" ? (
                                        <Button size="medium"
                                            onClick={handleCancelAddFriendRequest}>
                                            <i className="fa-solid fa-xmark"></i> {t("user:profileHeader.cancelRequestButton")}
                                        </Button>
                                    ) : friendshipStatus === "SentByThem" ? (
                                        <div className="sm:relative">
                                            <Button size="medium" ref={btnRequestRef}
                                                onClick={() => {setIsShowRequestOptions(!isShowRequestOptions)}}>
                                                <i className="fa-solid fa-reply"></i> {t("user:profileHeader.respondRequestButton")}
                                            </Button>
                                            { isShowRequestOptions && <Dropdown ref={requestOptionsRef}
                                                 className="absolute flex sm:top-[130%] top-[110%] left-[1%] bg-[var(--bg-color)] p-2
                                                 rounded-lg shadow-md z-10 sm:min-w-[200px] w-[calc(100%-2%)]"
                                                 items={requestOptions}/> }
                                        </div>
                                    ) : (
                                        <div className="sm:relative">
                                            <Button size="medium" ref={btnFriendRef}
                                                onClick={() => {setIsShowFriendOptions(!isShowFriendOptions)}}>
                                                <i className="fa-solid fa-user-check"></i> {t("user:profileHeader.friendButton")}
                                            </Button>
                                            { isShowFriendOptions && <Dropdown ref={friendOptionsRef}
                                                className="absolute flex sm:top-[130%] top-[110%] left-[1%] bg-[var(--bg-color)] p-2
                                                 rounded-lg shadow-md z-10 sm:min-w-[200px] w-[calc(100%-2%)]"
                                                 items={friendOptions}/> }
                                        </div>
                                        
                                    )}
                                </> 
                            }
                        </>}
                        
                        { !isOwner && isAuthenticated && <Button size="medium" variant="secondary"><i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}</Button> }
                        <Button size="medium" variant="secondary"><i className="fa-solid fa-circle-info"></i> 
                            <Text className="hidden sm:inline-flex ml-1">{t("user:profileHeader.moreButton")}</Text>
                        </Button>
                    </div>
                }  
            </div>
        </div>
    )
}

export default ProfileHeader;