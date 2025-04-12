import React from "react";
import BackgroundImage from "../../../../components/common/BackgroundImage/BackgroundImage";
import Button from "../../../../components/common/Button/Button";
import Avatar from "../../../../components/common/Avatar/Avatar";
import SelectFile from "../../../../components/common/SelectFile/SelectFile";
import { ProfileService } from "../../services/Profile/ProfileService";

export interface ProfileData {
    fullName: string,
    avatar: string,
    background: string
}

export interface ProfileHeaderProps {
    profileData: ProfileData,
    isOwner: boolean
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({profileData, isOwner}) => {
    
    const [background, setBackground] = React.useState<string>(profileData.background);
    const [avatar, setAvatar] = React.useState<string>(profileData.avatar);

    const handleSelectBackground = async (file: File) => {
        const profileService = new ProfileService();
        const result = await profileService.UploadBackground(file)
        if (result.success) {
            setBackground(result.data);
        }
    }

    const handleSelectAvatar = async (file: File) => {
        const profileService = new ProfileService();
        const result = await profileService.UploadAvatar(file)
        if (result.success) {
            setAvatar(result.data);
        }
    }

    return (
        <div className="relative w-full h-auto layout">
            <div>
                <BackgroundImage src={background} alt="Background Image"
                className="relative min-h-[200px]"></BackgroundImage>

                { isOwner && <SelectFile
                    onChange={handleSelectBackground}
                    accept="image/*"
                    multiple={false}
                    className="absolute flex items-center right-5 bottom-5 z-10 opacity-30 hover:opacity-50 gap-2"
                    ><i className="fa-solid fa-camera"></i> <span>Add</span></SelectFile> }
            </div>
            
            <div className="absolute flex layout w-[85%] left-1/2 -translate-x-1/2 top-100 -translate-y-1/2 flex-col lg:flex-row items-center lg:items-end
            mt-28 lg:mt-0">
                <Avatar src={avatar} onChange={handleSelectAvatar}
                        alt="Avatar" size="large" isCanEdit={isOwner}
                        className="border-[5px] border-[var(--bg-color-secondary)]"></Avatar>

                <span className="text-[35px] font-bold lg:self-end mb-2 lg:mb-8 lg:ml-5">{profileData.fullName}</span>
                
                <div className="flex lg:flex-1 justify-end gap-2 lg:self-end mb-8 lg:mr-5 md:w-auto">
                    { isOwner ? <Button size="medium"><i className="fa-solid fa-user-pen"></i> Edit</Button> :
                         <Button size="medium"><i className="fa-solid fa-plus"></i> Add friend</Button> }
                    { !isOwner && <Button size="medium" variant="secondary"><i className="fa-solid fa-comment"></i> Message</Button> }
                    <Button size="medium" variant="secondary"><i className="fa-solid fa-circle-info"></i> More</Button>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader;