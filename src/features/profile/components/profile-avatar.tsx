import React from "react";
import { clsx } from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Avatar, Skeleton } from "@/components/atoms";

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
        <div className="bg-bg-main rounded-full">
          <Skeleton className="border-4 border-bg-main h-[192px]" variant="circle" />
        </div>
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
