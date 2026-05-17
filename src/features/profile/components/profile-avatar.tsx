import React from "react";
import { clsx } from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Avatar, Skeleton } from "@/components/atoms";
import SelectFile from "@/components/atoms/select-file";
import { useGetUserAvatar, useSelectAvatar } from "@/features/hooks/use-user-profile";
import { useSnackbar } from "@/contexts";

interface ProfileAvatarProps {
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ className }) => {
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserAvatar(targetId);
  const { fetch, isFetching: isUpdating } = useSelectAvatar(targetId);
  const { showSnackbar } = useSnackbar();

  const handleSelectAvatar = async (file: File) => {
    await fetch(file, {
      onSuccess: () => {
        showSnackbar("Avatar updated successfully", "success");
      },
    });
  };

  return (
    <div className={clsx("relative group", className)}>
      {isLoading || isFetching || isUpdating ? (
        <div className="bg-bg-main rounded-full">
          <Skeleton className="border-4 border-bg-main h-[192px]" variant="circle" />
        </div>
      ) : (
        <div
          className={clsx(
            "relative rounded-full p-[4px] bg-bg-main",
            "transition-all duration-500 ease-out",
            isOwner && "hover:scale-[1.04] hover:shadow-2xl cursor-pointer",
          )}
        >
          {isOwner && (
            <div
              className={clsx(
                "absolute inset-0 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out",
                "z-0",
              )}
            />
          )}

          <Avatar
            src={data?.infos.avatar}
            alt="Avatar"
            className="w-[184px] h-[184px] border-2 border-bg-main flex-shrink-0 relative z-10 overflow-hidden rounded-full"
          >
            {isOwner && (
              <SelectFile
                onChange={handleSelectAvatar}
                accept="image/*"
                className="absolute z-10 inset-0 cursor-pointer bg-black bg-opacity-50
                  flex justify-center items-center opacity-0 group-hover:opacity-90 active:opacity-100
                  transition-all duration-300 ease-out"
              >
                <i className="fa-solid fa-camera text-white text-2xl"></i>
              </SelectFile>
            )}
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
