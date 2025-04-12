import React from "react";
import "../../../assets/styles/global.css";
import "./BackgroundImage.style.css";


interface BackgroundImageProps {
    src: string;
    alt: string;
    className?: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
    src,
    alt,
    className
}) => {
    return (
        <div className={`user-bg-image 
                        ${className} `} 
            style={{ backgroundImage: `url(${src})`}}>

        </div>
    )
}


export default BackgroundImage;