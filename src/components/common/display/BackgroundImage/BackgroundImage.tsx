import React, { useEffect } from "react";
import "@/styles/global.css";
import "./BackgroundImage.style.css";


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
        <div className={`user-bg-image
                        ${src ?? "h-[200px] !bg-[var(--bg-color-third)]"}
                        ${className} `} 
            data-bg-image={src}
            aria-label={alt}>
                {children}
        </div>
    )
} 

export default BackgroundImage;