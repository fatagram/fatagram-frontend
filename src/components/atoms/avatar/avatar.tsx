import React, { useState } from "react";
import emptyAvatar from "/images/empty_avatar.png";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";
export type Shape = "circle" | "square" | "rounded";

export const sizeClasses: Record<Size, string> = {
  xs: "w-3 h-3",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export const shapeClasses: Record<Shape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

export interface AvatarProps extends ComponentProps<HTMLDivElement> {
  src?: string;
  alt: string;
  shape?: Shape;
  sz?: Size;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  sz = "md",
  shape = "circle",
  className,
  children,
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  const imageSource = hasError || !src ? emptyAvatar : src;

  return (
    <div
      className={clsx(
        "relative flex-shrink-0 select-none overflow-hidden",
        "aspect-square object-contain bg-bg-main",
        sizeClasses[sz],
        shapeClasses[shape],
        className,
      )}
      {...props}
    >
      <img
        src={imageSource}
        alt={alt}
        className="w-full h-full object-cover relative z-0"
        onError={() => setHasError(true)}
      />
      {children}
    </div>
  );
};

Avatar.displayName = "Avatar";
