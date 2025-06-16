import React from "react";
import "@/styles/global.css";
import "./BackgroundImage.style.css";


interface BackgroundImageSkeletonLoadingProps {
    alt: string;
    className?: string;
}

const BackgroundImageSkeletonLoading: React.FC<BackgroundImageSkeletonLoadingProps> = ({
    alt,
    className
}) => {
    return (
        <div className={`${className} animate-pulse bg-[var(--fourth-bg-color)] rounded-2xl shadow-lg`}>

        </div>
    )
}


export default BackgroundImageSkeletonLoading;