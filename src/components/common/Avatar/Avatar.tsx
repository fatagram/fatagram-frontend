import React, { useEffect } from "react";
import emptyAvatar from "../../../assets/images/empty_avatar.png"
import SelectFile from "../SelectFile/SelectFile";

const sizeClasses = {
    mini: 'w-[20px] h-[20px]',
    small: 'w-[80px] h-[80px]',
    medium: 'w-[120px] h-[120px]',
    large: 'w-[200px] h-[200px]',
    xlarge: 'w-[250px] h-[250px]',
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
        setImgSrc(src === "" ? emptyAvatar : src);
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

            <img
                src={imgSrc}
                alt={alt}
                className="relative z-0 w-full h-full object-cover"
                onError={() => setImgSrc(emptyAvatar)}
            />
        </div>
        
    )
}

export default Avatar;