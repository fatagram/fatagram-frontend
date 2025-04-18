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
        <div className={`${className} animate-pulse bg-[var(--bg-color-fourth)] rounded-2xl shadow-lg`}>

        </div>
    )
}


export default BackgroundImageSkeletonLoading;