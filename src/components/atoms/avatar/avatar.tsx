import React, { useEffect } from "react";
import emptyAvatar from "/images/empty_avatar.png";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { shapeClasses, sizeClasses } from "./types";

type Shape = keyof typeof shapeClasses;

interface AvatarProps extends ComponentProps {
  border?: number;
  src?: string;
  alt: string;
  shape?: Shape;
  isCanEdit?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  sz = "md-1",
  shape = "circle",
  className,
  children,
}) => {
  const sizeClass = sizeClasses[sz];
  const shapeClass = shapeClasses[shape];

  const [imgSrc, setImgSrc] = React.useState<string>(src || emptyAvatar);

  useEffect(() => {
    setImgSrc(src || emptyAvatar);
  }, [src]);

  return (
    <div
      className={clsx(
        "relative aspect-square object-contain select-none flex-shrink-0",
        "overflow-hidden",
        sizeClass,
        shapeClass,
        className,
      )}
    >
      {/* {isCanEdit ? (
        <SelectFile
          onChange={onChange}
          accept="image/*"
          className="absolute z-10 inset-0 cursor-pointer bg-black bg-opacity-50
                flex justify-center items-center opacity-0 hover:opacity-90 hover:bg-black hover:bg-opacity-50 active:opacity-100
                translate-all duration-75 ease"
        >
          <i className="fa-solid fa-camera text-white text-2xl"></i>
        </SelectFile>
      ) : null} */}

      <div className={clsx("absolute inset-0 bg-bg-main overflow-hidden")}>
        <img
          src={imgSrc || emptyAvatar}
          alt={alt}
          className={clsx("relative z-0 w-full h-full object-cover")}
          onError={() => setImgSrc(emptyAvatar)}
        />
        {children}
      </div>
    </div>
  );
};
