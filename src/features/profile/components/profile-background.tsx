import React from "react";
import { useTranslation } from "react-i18next";
import SelectFile from "@/components/atoms/select-file";
import clsx from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Skeleton } from "@/components/atoms";
import BackgroundImage from "@/components/atoms/background-image/background-image";
import { Text } from "@/components/atoms";
import { useGetUserBackground, useSelectBackground } from "@/features/hooks/use-user-profile";
import { useSnackbar, useDialog } from "@/contexts";
import { UpdateBackgroundContent, UpdateBackgroundContentRef } from "./update-background-modal";

type ProfileBackgroundProps = {};

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({}) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserBackground(targetId);
  const { fetch, isFetching: isUpdating } = useSelectBackground(targetId);
  const { showSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();

  const handleSelectBackgroundFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const contentRef = React.createRef<UpdateBackgroundContentRef>();

    openDialog({
      title: "Adjust Background",
      content: <UpdateBackgroundContent ref={contentRef} imageSrc={objectUrl} />,
      className: "w-[400px]",
      primaryButton: {
        text: "Save",
        onClick: async () => {
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
                closeDialog();
              },
              onError: () => {
                URL.revokeObjectURL(objectUrl);
                closeDialog();
              },
            },
          );
        },
      },
      secondaryButton: {
        text: "Cancel",
        onClick: () => {
          URL.revokeObjectURL(objectUrl);
          closeDialog();
        },
      },
      onClose: () => {
        URL.revokeObjectURL(objectUrl);
        closeDialog();
      },
    });
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
