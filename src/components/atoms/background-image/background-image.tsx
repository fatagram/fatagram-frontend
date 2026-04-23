import { useEffect, useRef } from "react";
import style from "./background-image.module.css";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

interface BackgroundImageProps extends ComponentProps {
  src: string;
  alt: string;
  metadata?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
}

export default function BackgroundImage({
  src,
  alt,
  className,
  children,
  metadata,
}: BackgroundImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We update the CSS variables on the container to avoid global scope leaks
    if (containerRef.current) {
      containerRef.current.style.setProperty("--bg-image", `url(${src})`);

      if (metadata && metadata.width && metadata.height) {
        const { x = 0, y = 0, width = 100, height = 100 } = metadata;

        // Convert to valid percentages avoiding division by zero if width/height is 100
        const sizeX = 100 / (width / 100);
        const sizeY = 100 / (height / 100);

        const posX = width < 100 ? (x / (100 - width)) * 100 : 50;
        const posY = height < 100 ? (y / (100 - height)) * 100 : 50;

        containerRef.current.style.setProperty("--bg-size", `${sizeX}% ${sizeY}%`);
        containerRef.current.style.setProperty("--bg-position", `${posX}% ${posY}%`);
      } else {
        // Defaults
        containerRef.current.style.setProperty("--bg-size", `cover`);
        containerRef.current.style.setProperty("--bg-position", `center`);
      }
    }
  }, [src, metadata]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "rounded-2xl relative overflow-hidden",
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
