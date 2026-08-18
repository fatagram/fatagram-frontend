import React from "react";
import { clsx } from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Avatar, Button, Skeleton } from "@/components/atoms";
import SelectFile from "@/components/atoms/select-file";
import { useGetUserAvatar, useSelectAvatar } from "@/features/hooks/use-user-profile";
import { useDialog, useSnackbar } from "@/contexts";
import { useMobile } from "@/hooks/use-mobile";
import { useBottomSheetStore } from "@/features/hooks/use-bottom-sheet-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  UpdateAvatarContent,
  UpdateAvatarContentRef,
} from "./update-avatar-modal";

interface ProfileAvatarProps {
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ className }) => {
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading } = useGetUserAvatar(targetId);
  const { fetch, isFetching: isUpdating } = useSelectAvatar(targetId);
  const { showSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const isMobile = useMobile();
  const { openSheet, closeSheet } = useBottomSheetStore();

  const handleSelectAvatarFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const contentRef = React.createRef<UpdateAvatarContentRef>();

    const handleSave = async (closeFn: () => void) => {
      closeFn();
      try {
        const croppedFile =
          (await contentRef.current?.getCroppedFile(file.name)) || file;
        await fetch(croppedFile, {
          onSuccess: () => {
            showSnackbar("Avatar updated successfully", "success");
            URL.revokeObjectURL(objectUrl);
          },
          onError: () => {
            URL.revokeObjectURL(objectUrl);
          },
        });
      } catch {
        URL.revokeObjectURL(objectUrl);
      }
    };

    const handleCancel = (closeFn: () => void) => {
      URL.revokeObjectURL(objectUrl);
      closeFn();
    };

    if (isMobile) {
      openSheet(
        <div className="flex flex-col gap-4 p-4">
          <UpdateAvatarContent
            ref={contentRef}
            imageSrc={objectUrl}
            className="bg-transparent"
          />

          <div className="flex gap-3 mt-4">
            <Button
              variant="third"
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-bg-second text-text-primary hover:bg-bg-hover transition-colors"
              onClick={() => handleCancel(closeSheet)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              onClick={() => handleSave(closeSheet)}
            >
              Save
            </Button>
          </div>
        </div>,
        "Adjust Avatar",
      );
    } else {
      openDialog({
        title: "Adjust Avatar",
        content: <UpdateAvatarContent ref={contentRef} imageSrc={objectUrl} />,
        className: "w-[400px]",
        primaryButton: {
          text: "Save",
          onClick: () => handleSave(closeDialog),
        },
        secondaryButton: {
          text: "Cancel",
          onClick: () => handleCancel(closeDialog),
        },
        onClose: () => handleCancel(closeDialog),
      });
    }
  };

  return (
    <div className={clsx("relative group", className)}>
      {isLoading || isUpdating ? (
        <div className="bg-bg-main rounded-full">
          <Skeleton
            className="border-4 border-bg-main h-20 w-20 sm:h-[188px] sm:w-[188px]"
            variant="circle"
          />
        </div>
      ) : (
        <div
          className={clsx(
            "relative rounded-full p-[3px] bg-bg-main",
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
            className="w-20 h-20 sm:w-[180px] sm:h-[180px] flex-shrink-0 relative z-10 overflow-hidden rounded-full"
          >
            {isOwner && (
              <SelectFile
                onChange={handleSelectAvatarFile}
                accept="image/*"
                className="absolute z-10 inset-0 cursor-pointer bg-black bg-opacity-50
                  flex justify-center items-center opacity-0 group-hover:opacity-90 active:opacity-100
                  transition-all duration-300 ease-out"
              >
                <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
              </SelectFile>
            )}
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
