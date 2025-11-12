import React, { useEffect } from "react";
import "@/styles/global.css";
import style from "./background-image.module.css";
import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

interface BackgroundImageProps extends ComponentProps {
  src: string;
  alt: string;
}

export default function BackgroundImage({ src, alt, className, children }: BackgroundImageProps) {
  useEffect(() => {
    document.documentElement.style.setProperty("--bg-image", `url(${src})`);
  }, [src]);

  return (
    <div
      className={clsx(
        "rounded-2xl",
        style["user-bg-image"],
        src ? "" : "h-[200px] bg-bg-fourth",
        className,
      )}
      aria-label={alt}
    >
      {children}
    </div>
  );
}
