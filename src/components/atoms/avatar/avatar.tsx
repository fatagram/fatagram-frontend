import React, { useEffect } from "react";
import emptyAvatar from "@/assets/images/empty_avatar.png";
import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

export const sizeClasses = {
  // Mini sizes
  "xs": "w-[24px]",

  // Small sizes
  "sm-1": "w-[48px]",
  "sm-2": "w-[56px]",
  "sm-3": "w-[64px]",

  // Medium sizes
  "md-1": "w-[96px]",
  "md-2": "w-[112px] ",
  "md-3": "w-[128px]",

  // Large sizes
  "lg-1": "w-[160px]",
  "lg-2": "w-[192px]",
  "lg-3": "w-[224px]",

  // Extra Large
  "xl-1": "w-[256px]",
  "xl-2": "w-[288px]",
  "xl-3": "w-[320px]",
} as const;

export const shapeClasses = {
  square: "rounded-none",
  rounded: "rounded-2xl",
  circle: "rounded-full",
} as const;

type Shape = keyof typeof shapeClasses;

interface AvatarProps extends ComponentProps {
  border?: number;
  src?: string;
  alt: string;
  shape?: Shape;
  isCanEdit?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  onChange = () => {},
  src,
  alt,
  sz = "md-1",
  shape = "circle",
  className,
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

      <div className={clsx(
        "absolute inset-0 bg-bg-main overflow-hidden"
      )}>
        <img
          src={imgSrc || emptyAvatar}
          alt={alt}
          className={clsx("relative z-0 w-full h-full object-cover")}
          onError={() => setImgSrc(emptyAvatar)}
        />
      </div>
    </div>
  );
};

export default Avatar;
