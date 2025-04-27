import React, { useMemo } from "react";
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

    // Auth info hook
    const { userId } = useAuth(); 
    const { t } = useTranslation() as { t: (key: string) => string };

    const userService = useMemo(() => {
        return new UserService();
    }
    , []);

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
        if (uid) fetchProfile();
    }, [uid, userId, onUserNotFound, userService]);

    // Handle background and avatar selection
    const handleSelectBackground = async (file: File) => {
        const result = await userService.UploadBackground(file)
        if (result.success) {
            setBackground(result.data);
        }
    }

    const handleSelectAvatar = async (file: File) => {
        const result = await userService.UploadAvatar(file)
        if (result.success) {
            setAvatar(result.data);
        }
    }

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
                    <Text size="xl" weight="bold" className="lg:self-end mb-2 lg:mb-8 lg:ml-5">{fullName}</Text>
                }
                
                { isLoading ? <LabelSkeletonLoading size="large" className="w-[300px] lg:ml-auto mb-7 mt-2 lg:mt-0"/> :
                    <div className="flex lg:flex-1 justify-end gap-2 lg:self-end mb-8 lg:mr-5 md:w-auto">
                        { isOwner ? <Button size="medium"><i className="fa-solid fa-user-pen"></i> {t("user:profileHeader.editButton")}</Button> :
                            <Button size="medium"><i className="fa-solid fa-plus"></i> {t("user:profileHeader.addFriendButton")}</Button> }
                        { !isOwner && <Button size="medium" variant="secondary"><i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}</Button> }
                        <Button size="medium" variant="secondary"><i className="fa-solid fa-circle-info"></i> {t("user:profileHeader.moreButton")}</Button>
                    </div>
                }  
            </div>
        </div>
    )
}

export default ProfileHeader;