import React from "react";
import { useTranslation } from "react-i18next";
import SelectFile from "@/components/atoms/select-file";
import clsx from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Button, Skeleton } from "@/components/atoms";
import BackgroundImage from "@/components/atoms/background-image/background-image";
import { Text } from "@/components/atoms";
import { useGetUserBackground, useSelectBackground } from "@/features/hooks/use-user-profile";
import { useSnackbar, useDialog } from "@/contexts";
import { UpdateBackgroundContent, UpdateBackgroundContentRef } from "./update-background-modal";
import { useMobile } from "@/hooks/use-mobile";
import { useBottomSheetStore } from "@/features/hooks/use-bottom-sheet-store";

type ProfileBackgroundProps = {};

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({}) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserBackground(targetId);
  const { fetch, isFetching: isUpdating } = useSelectBackground(targetId);
  const { showSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const isMobile = useMobile();

  const { openSheet, closeSheet } = useBottomSheetStore();

  const handleSelectBackgroundFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const contentRef = React.createRef<UpdateBackgroundContentRef>();

    const handleSave = async (closeFn: () => void) => {
      const metadata = contentRef.current?.getMetadata() || {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      await fetch(
        { file, metadata },
        {
          onSuccess: () => {
            showSnackbar("Background updated successfully", "success");
            URL.revokeObjectURL(objectUrl);
            closeFn();
          },
          onError: () => {
            URL.revokeObjectURL(objectUrl);
            closeFn();
          },
        },
      );
    };

    const handleCancel = (closeFn: () => void) => {
      URL.revokeObjectURL(objectUrl);
      closeFn();
    };

    if (isMobile) {
      openSheet(
        <div className="flex flex-col gap-4 p-4">
          <UpdateBackgroundContent
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
        "Adjust Background",
      );
    } else {
      openDialog({
        title: "Adjust Background",
        content: <UpdateBackgroundContent ref={contentRef} imageSrc={objectUrl} />,
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
    <div
      className={clsx("relative aspect-[16/6] w-full overflow-hidden sm:rounded-xl rounded-none")}
    >
      {isLoading || isFetching || isUpdating ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <BackgroundImage
          src={data?.infos.background}
          alt="Background Image"
          className={clsx("relative h-full w-full sm:rounded-xl rounded-none")}
          metadata={
            typeof data?.infos.backgroundMetadata === "string"
              ? JSON.parse(data?.infos.backgroundMetadata || "{}")
              : data?.infos.backgroundMetadata
          }
        >
          {isOwner && (
            <SelectFile
              onChange={handleSelectBackgroundFile}
              accept="image/*"
              multiple={false}
              className={clsx(
                "absolute flex items-center right-2 bottom-2 z-10",
                "opacity-40 hover:opacity-70 gap-2",
              )}
            >
              <i className={clsx("fa-solid fa-camera")}></i>
              <Text className={clsx("sm:flex hidden")} sz="md">
                {data?.infos.background
                  ? t("user:profileHeader.changeButton")
                  : t("user:profileHeader.addButton")}
              </Text>
            </SelectFile>
          )}
        </BackgroundImage>
      )}
    </div>
  );
};

export default ProfileBackground;
