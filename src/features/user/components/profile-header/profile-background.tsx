import React from "react";
import BackgroundImage from "@/components/atoms/background-image";
import { BackgroundImageSkeletonLoading } from "@/components/atoms/background-image";
import { useTranslation } from "react-i18next";
import Text from "@/components/atoms/text";
import SelectFile from "@/components/molecules/select-file";

type ProfileBackgroundProps = {
    isLoading: boolean;
    background: string;
    isOwner: boolean;
    handleSelectBackground: (file: File) => Promise<void>;
}

const ProfileBackground: React.FC<ProfileBackgroundProps> = (
    {
        isLoading,
        background,
        isOwner,
        handleSelectBackground
    }) => {

    const { t } = useTranslation() as { t: (key: string) => string };

    return (
        <div className="relative aspect-[16/6] w-full rounded-[15px]">
            {isLoading ? <BackgroundImageSkeletonLoading alt="Loading" 
                className="relative h-full w-full" /> :
                <BackgroundImage src={background} alt="Background Image" className="relative h-full w-full">
                    {isOwner &&
                        <SelectFile
                            onChange={handleSelectBackground}
                            accept="image/*"
                            multiple={false}
                            className="absolute flex items-center right-2 bottom-2 z-10 opacity-40 hover:opacity-70 gap-2">
                            <i className="fa-solid fa-camera"></i>
                            <Text className="sm:flex hidden"
                                size="md-1">{background ? t("user:profileHeader.changeButton") : t("user:profileHeader.addButton")}</Text>
                        </SelectFile>
                    }
                </BackgroundImage>
            }
        </div>
    )
}

export default ProfileBackground;