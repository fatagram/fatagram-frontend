import Avatar, { AvatarSkeletonLoading } from "@/components/common/display/Avatar";
import React from "react";

interface ProfileAvatarProps {
    isLoading: boolean;
    avatar: string;
    isOwner: boolean;
    handleSelectAvatar: (file: File) => Promise<void>;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    isLoading,
    avatar,
    isOwner,
    handleSelectAvatar
}) => {

    return (
        <>
            { isLoading ? <AvatarSkeletonLoading alt="Loading" size="large" 
                    className="border-[5px] border-[var(--second-bg-color)]"/> 
                    : <Avatar src={avatar} onChange={handleSelectAvatar}
                        alt="Avatar" size="large" isCanEdit={isOwner}
                        className="border-[5px] border-[var(--second-bg-color)]"/>
            }
        </>
    )
}

export default ProfileAvatar;