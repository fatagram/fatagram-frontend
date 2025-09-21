import React from "react";

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

interface AvatarSkeletonLoadingProps {
    alt: string;
    size?: Size;
    className?: string;
}


const AvatarSkeletonLoading: React.FC<AvatarSkeletonLoadingProps> = ({
    size='medium',
    className
}) => {
    const sizeClass = sizeClasses[size];

    return (
        <div className={`relative ${sizeClass} rounded-full object-cover select-none ${className} 
            overflow-hidden`}>
            <div className="absolute inset-0 bg-[var(--main-bg-color)] rounded-full overflow-hidden">
                <div className="animate-pulse bg-[var(--fourth-bg-color)] w-full h-full rounded-full"></div>
            </div>
        </div>
    )
}

export default AvatarSkeletonLoading;