import Avatar, { AvatarSkeletonLoading } from "@/components/atoms/avatar";
import React from "react";
import { clsx } from "clsx";
import { useProfilePage } from "../context/profile-page-context";

interface ProfileAvatarProps {
  isLoading: boolean;
  avatar: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  handleSelectAvatar: (file: File) => Promise<void>;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  isLoading,
  avatar,
  className,
  ref,
  handleSelectAvatar,
}) => {
  const { isOwner } = useProfilePage();
  return (
    <div className={clsx("relative", className)} ref={ref}>
      {isLoading ? (
        <AvatarSkeletonLoading
          alt="Loading"
          sz="lg-2"
          className="border-4 border-bg-main flex-shrink-0"
        />
      ) : (
        <Avatar
          src={avatar}
          alt="Avatar"
          sz="lg-2"
          className="border-4 border-bg-main flex-shrink-0"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
