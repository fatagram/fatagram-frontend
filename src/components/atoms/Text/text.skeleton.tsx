import React from "react";
import { Size } from "../../common/types/size";

const skeletonSizeClasses: Record<Size, string> = {
    "xs": "h-[16px]",
    "sm-1": "h-[20px]",
    "sm-2": "h-[24px]",
    "sm-3": "h-[28px]",
    "md-1": "h-[40px]",
    "md-2": "h-[48px]",
    "md-3": "h-[56px]",
    "lg-1": "h-[50px]",
    "lg-2": "h-[60px]",
    "lg-3": "h-[70px]",
    "xl-1": "h-[80px]",
    "xl-2": "h-[90px]",
    "xl-3": "h-[100px]",
}

type TextSkeletonLoadingProps = {
    className?: string;
    size?: Size
}

const TextSkeletonLoading: React.FC<TextSkeletonLoadingProps> = ({
    className = "",
    size = "md-1"
}) => {
    
    return (
        <div className={`animate-pulse select-none rounded-lg bg-[var(--fourth-bg-color)] shadow-lg
            ${skeletonSizeClasses[size]} ${className}`}/>
    );
};

export default TextSkeletonLoading;
