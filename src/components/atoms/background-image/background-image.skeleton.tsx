import React from "react";
import "@/styles/global.css";
import "./background-image.module.css";

interface BackgroundImageSkeletonProps {
    alt: string;
    className?: string;
}

const BackgroundImageSkeleton: React.FC<BackgroundImageSkeletonProps> = ({
    className
}) => {
    return (
        <div className={`${className} animate-pulse bg-[var(--fourth-bg-color)] rounded-2xl shadow-lg`} />
    )
}

export default BackgroundImageSkeleton;