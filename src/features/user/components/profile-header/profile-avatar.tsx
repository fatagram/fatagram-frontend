import Avatar, { AvatarSkeletonLoading } from "@/components/atoms/avatar";
import React from "react";

interface ProfileAvatarProps {
    isLoading: boolean;
    avatar: string;
    isOwner: boolean;
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
    handleSelectAvatar: (file: File) => Promise<void>;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    isLoading,
    avatar,
    isOwner,
    className,
    ref,
    handleSelectAvatar
}) => {

    return (
        <div className={`relative ${className ? className : ""}`} ref={ref}>
            { isLoading ? <AvatarSkeletonLoading alt="Loading" size="large" 
                    className="border-[5px] border-[var(--second-bg-color)]"/> 
                    : <Avatar src={avatar} onChange={handleSelectAvatar}
                        alt="Avatar" size="large_2" isCanEdit={isOwner}
                        className="border-[5px] border-[var(--second-bg-color)] flex-shrink-0"/>
            }
        </div>
    )
}

export default ProfileAvatar;