import { ComponentProps } from "@/components/common/types/component-type";
import React from "react";

const sizeClasses = {
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

interface AvatarSkeletonLoadingProps extends ComponentProps {
  alt: string;
  shape?: Shape;
  className?: string;
}

const AvatarSkeletonLoading: React.FC<AvatarSkeletonLoadingProps> = ({
  sz = "md-1",
  shape = "circle",
  className,
}) => {
  const sizeClass = sizeClasses[sz];
  const shapeClass = shapeClasses[shape];

  return (
    <div
      className={`relative aspect-square ${sizeClass} ${shapeClass} object-cover select-none ${className} 
            overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[var(--main-bg-color)] rounded-full overflow-hidden">
        <div className="animate-pulse bg-[var(--fourth-bg-color)] w-full h-full rounded-full"></div>
      </div>
    </div>
  );
};

export default AvatarSkeletonLoading;
