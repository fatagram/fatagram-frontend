import React, { useEffect } from "react";
import "@/styles/global.css";
import style from "./background-image.module.css";
import { ComponentProps } from "@/components/common/types/component-type";

interface BackgroundImageProps extends ComponentProps {
  src: string;
  alt: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ src, alt, className, children }) => {
  useEffect(() => {
    document.documentElement.style.setProperty("--bg-image", `url(${src})`);
  }, [src]);

  return (
    <div
      className={`${style["user-bg-image"]}
                        ${src ?? "h-[200px] !bg-[var(--third-bg-color)]"}
                        ${className} `}
      aria-label={alt}
    >
      {children}
    </div>
  );
};

export default BackgroundImage;
