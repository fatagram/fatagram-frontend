import clsx from "clsx";
import React from "react";
import { shapeClasses, sizeClasses } from "./types";
import { ComponentProps } from "@/components/common/component-type";

type Shape = keyof typeof shapeClasses;

interface AvatarSkeletonLoadingProps extends ComponentProps {
  alt: string;
  shape?: Shape;
  className?: string;
}

export const AvatarSkeletonLoading: React.FC<AvatarSkeletonLoadingProps> = ({
  sz = "md-1",
  shape = "circle",
  className,
}) => {
  const sizeClass = sizeClasses[sz];
  const shapeClass = shapeClasses[shape];

  return (
    <div
      className={clsx(
        "relative aspect-square overflow-hidden object-cover select-none",
        sizeClass,
        shapeClass,
        className,
      )}
    >
      <div className="absolute inset-0 bg-bg-main rounded-full overflow-hidden">
        <div className="animate-pulse bg-bg-fourth w-full h-full rounded-full" />
      </div>
    </div>
  );
};
