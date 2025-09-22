import React, { useEffect } from "react";
import "@/styles/global.css";
import style from "./background-image.module.css";


interface BackgroundImageProps {
    src: string;
    alt: string;
    className?: string;
    children?: React.ReactNode;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
    src,
    alt,
    className,
    children
}) => {
    useEffect(() => {
        document.documentElement.style.setProperty('--bg-image', `url(${src})`);
    }, [src])

    return (
        <div className={`${style['user-bg-image']}
                        ${src ?? "h-[200px] !bg-[var(--third-bg-color)]"}
                        ${className} `} 
            aria-label={alt}>
                {children}
        </div>
    )
} 

export default BackgroundImage;