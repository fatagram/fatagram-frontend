import React from "react";
import BackgroundImage from "@/components/common/display/BackgroundImage";
import { BackgroundImageSkeletonLoading } from "@/components/common/display/BackgroundImage";
import { useTranslation } from "react-i18next";
import Text from "@/components/common/ui/Text";
import SelectFile from "@/components/common/widgets/SelectFile";

interface ProfileBackgroundProps {
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
        <>
            {isLoading ? <BackgroundImageSkeletonLoading alt="Loading" className="relative min-h-[300px]" /> :
                <BackgroundImage src={background} alt="Background Image"
                    className="relative min-h-[200px] w-full">
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
        </>
    )
}

export default ProfileBackground;