import React from "react";
import { useTranslation } from "react-i18next";
import SelectFile from "@/components/atoms/select-file";
import clsx from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Skeleton } from "@/components/atoms";
import BackgroundImage from "@/components/atoms/background-image/background-image";
import { Text } from "@/components/atoms";
import { useGetUserBackground, useSelectBackground } from "@/features/hooks/use-user-profile";
import { useSnackbar } from "@/contexts";

type ProfileBackgroundProps = {};

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({}) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { targetId, isOwner } = useProfilePage();
  const { data, isLoading, isFetching } = useGetUserBackground(targetId);
  const { fetch, isFetching: isUpdating } = useSelectBackground(targetId);
  const { showSnackbar } = useSnackbar();

  const handleSelectBackground = async (file: File) => {
    await fetch(file, {
      onSuccess: () => {
        showSnackbar("Background updated successfully", "success");
      },
    });
  };

  return (
    <div className={clsx("relative aspect-[16/6] w-full")}>
      {isLoading || isFetching || isUpdating ? (
        <Skeleton className="h-full" />
      ) : (
        <BackgroundImage
          src={data?.infos.background}
          alt="Background Image"
          className={clsx("relative h-full w-full sm:rounded-xl rounded-none")}
        >
          {isOwner && (
            <SelectFile
              onChange={handleSelectBackground}
              accept="image/*"
              multiple={false}
              className={clsx(
                "absolute flex items-center right-2 bottom-2 z-10",
                "opacity-40 hover:opacity-70 gap-2",
              )}
            >
              <i className={clsx("fa-solid fa-camera")}></i>
              <Text className={clsx("sm:flex hidden")} sz="md-1">
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
