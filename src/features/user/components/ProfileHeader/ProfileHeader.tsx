import React, { useMemo } from "react";
import BackgroundImage from "../../../../components/common/display/BackgroundImage/BackgroundImage";
import Button from "../../../../components/common/ui/Button/Button";
import Avatar from "@/components/common/display/Avatar";
import SelectFile from "../../../../components/common/utils/SelectFile/SelectFile";
import { UserService } from "@/api/user/user.api";
import AvatarSkeletonLoading from "../../../../components/common/display/Avatar/AvatarSkeletonLoading";
import BackgroundImageSkeletonLoading from "../../../../components/common/display/BackgroundImage/BackgroundImageSkeletonLoading";
import LabelSkeletonLoading from "../../../../components/common/ui/Label/LabelSkeletonLoading";


export interface ProfileHeaderProps {
    className?: string;
    userId?: string;
    onUserNotFound?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({className, userId, onUserNotFound}) => {
    
    const [fullName, setFullName] = React.useState<string>("");
    const [avatar, setAvatar] = React.useState<string>("");
    const [background, setBackground] = React.useState<string>("");
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const userService = useMemo(() => {
        return new UserService();
    }
    , []);

    React.useEffect(() => {
        const fetchProfile = async () => {
            const response = await userService.GetProfile(userId ? userId : "", "avatar,background,fullName");
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
        if (userId) fetchProfile();
    }, [userId, onUserNotFound, userService]);

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
        <div className={`relative w-full h-auto layout ${className}`}>
            <div>
                { isLoading ? <BackgroundImageSkeletonLoading alt="Loading" className="relative min-h-[300px]"/> : <BackgroundImage src={background} alt="Background Image"
                    className="relative min-h-[200px] mx-2 lg:mx-0" />
                }

                { isOwner && <SelectFile
                    onChange={handleSelectBackground}
                    accept="image/*"
                    multiple={false}
                    className="absolute flex items-center right-5 bottom-5 z-10 opacity-30 hover:opacity-50 gap-2"
                    ><i className="fa-solid fa-camera"></i> <span>Add</span></SelectFile> }
            </div>
            
            <div className="absolute flex layout w-[85%] left-1/2 -translate-x-1/2 top-100 -translate-y-1/2 flex-col lg:flex-row items-center lg:items-end
                            mt-28 lg:mt-0">
                { isLoading ? <AvatarSkeletonLoading alt="Loading" size="large" className="border-[5px] border-[var(--bg-color-secondary)]"/> 
                    : <Avatar src={avatar} onChange={handleSelectAvatar}
                        alt="Avatar" size="large" isCanEdit={isOwner}
                        className="border-[5px] border-[var(--bg-color-secondary)]"></Avatar>
                }
                { isLoading ? <LabelSkeletonLoading size="medium" className="lg:self-end mb-2 lg:mb-8 lg:ml-5 w-[200px] mt-2 lg:mt-0"/> : 
                    <span className="text-[35px] font-bold lg:self-end mb-2 lg:mb-8 lg:ml-5">{fullName}</span>
                }
                
                
                { isLoading ? <LabelSkeletonLoading size="large" className="w-[300px] lg:ml-auto mb-7 mt-2 lg:mt-0"/> 
                : <div className="flex lg:flex-1 justify-end gap-2 lg:self-end mb-8 lg:mr-5 md:w-auto">
                    { isOwner ? <Button size="medium"><i className="fa-solid fa-user-pen"></i> Edit</Button> :
                         <Button size="medium"><i className="fa-solid fa-plus"></i> Add friend</Button> }
                    { !isOwner && <Button size="medium" variant="secondary"><i className="fa-solid fa-comment"></i> Message</Button> }
                    <Button size="medium" variant="secondary"><i className="fa-solid fa-circle-info"></i> More</Button>
                </div>
                }  
            </div>
        </div>
    )
}

export default ProfileHeader;