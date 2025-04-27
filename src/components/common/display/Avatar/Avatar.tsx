import React, { useEffect } from "react";
import emptyAvatar from "@/assets/images/empty_avatar.png";
import SelectFile from "@/components/common/utils/SelectFile";

const sizeClasses = {
    // Mini sizes
    mini_1: "w-[16px] h-[16px]",
    mini_2: "w-[24px] h-[24px]",
    mini_3: "w-[32px] h-[32px]",
    mini_4: "w-[40px] h-[40px]",

    // Small sizes
    small_1: "w-[48px] h-[48px]",
    small_2: "w-[56px] h-[56px]",
    small_3: "w-[64px] h-[64px]",
    small: "w-[80px] h-[80px]",

    // Medium sizes
    medium_1: "w-[96px] h-[96px]",
    medium_2: "w-[112px] h-[112px]",
    medium: "w-[128px] h-[128px]",

    // Large sizes
    large_1: "w-[160px] h-[160px]",
    large_2: "w-[192px] h-[192px]",
    large: "w-[224px] h-[224px]",

    // Extra Large
    xlarge_1: "w-[256px] h-[256px]",
    xlarge_2: "w-[288px] h-[288px]",
    xlarge: "w-[320px] h-[320px]",
} as const;


// typeof is a type operator that returns the type of a value or variable
// keyof is a type operator that returns the type of the keys of an object
// The Size type is a union of the keys of the sizeClasses object
type Size = keyof typeof sizeClasses;

interface AvatarProps {
    onChange?: (file: File) => void;
    src: string;
    alt: string;
    size?: Size;
    isCanEdit?: boolean;
    className?: string;
}


const Avatar: React.FC<AvatarProps> = ({
    onChange = () => {},
    src,
    alt,
    size='medium',
    isCanEdit=false,
    className
}) => {
    const sizeClass = sizeClasses[size];

    const [imgSrc, setImgSrc] = React.useState<string>(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src])

    return (
        <div className={`relative ${sizeClass} rounded-full object-cover select-none ${className} 
            overflow-hidden`}>

            { isCanEdit ? 
                <SelectFile onChange={onChange} accept="image/*" className="absolute z-10 inset-0 cursor-pointer bg-black bg-opacity-50
                flex justify-center items-center opacity-0 hover:opacity-90 hover:bg-black hover:bg-opacity-50 active:opacity-100
                translate-all duration-75 ease">
                    <i className="fa-solid fa-camera text-white text-2xl"></i>
                </SelectFile> : null }

            <div className="absolute inset-0 bg-[var(--bg-color)] rounded-full overflow-hidden">
                <img
                    src={imgSrc || emptyAvatar}
                    alt={alt}
                    className="relative z-0 w-full h-full object-cover"
                    onError={() => setImgSrc(emptyAvatar)}
                />
            </div>
            
        </div>
        
    )
}

export default Avatar;