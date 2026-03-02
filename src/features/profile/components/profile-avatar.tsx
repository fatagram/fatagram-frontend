import React from "react";
import { clsx } from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Avatar, Skeleton } from "@/components/atoms";
import SelectFile from "@/components/atoms/select-file";

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
        >
          {isOwner && (
            <SelectFile
              onChange={handleSelectAvatar}
              accept="image/*"
              className="absolute z-10 inset-0 cursor-pointer bg-black bg-opacity-50
                flex justify-center items-center opacity-0 hover:opacity-90 hover:bg-black hover:bg-opacity-50 active:opacity-100
                translate-all duration-150 ease"
            >
              <i className="fa-solid fa-camera text-white text-2xl"></i>
            </SelectFile>
          )}
        </Avatar>
      )}
    </div>
  );
};

export default ProfileAvatar;
