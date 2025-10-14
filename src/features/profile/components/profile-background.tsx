import React from "react";
import BackgroundImage from "@/components/atoms/background-image";
import { useTranslation } from "react-i18next";
import Text from "@/components/atoms/text";
import SelectFile from "@/components/molecules/select-file";
import clsx from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import { Skeleton } from "@/components/atoms";

type ProfileBackgroundProps = {
  isLoading: boolean;
  background: string;
  handleSelectBackground: (file: File) => Promise<void>;
};

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({
  isLoading,
  background,
  handleSelectBackground,
}) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const { isOwner } = useProfilePage();

  return (
    <div className={clsx("relative aspect-[16/6] w-full rounded-[15px]")}>
      {isLoading ? (
        <Skeleton className="h-full"/>
      ) : (
        <BackgroundImage 
          src={background} 
          alt="Background Image" 
          className={clsx("relative h-full w-full")}
        >
          {isOwner && (
            <SelectFile
              onChange={handleSelectBackground}
              accept="image/*"
              multiple={false}
              className={clsx(
                "absolute flex items-center right-2 bottom-2 z-10",
                "opacity-40 hover:opacity-70 gap-2"
              )}
            >
              <i className={clsx("fa-solid fa-camera")}></i>
              <Text className={clsx("sm:flex hidden")} sz="md-1">
                {background
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
