import React from "react";
import { Size } from "../../common/types/size";
import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

const skeletonSizeClasses: Record<Size, string> = {
  xs: "h-[16px]",
  "sm-1": "h-[20px]",
  "sm-2": "h-[24px]",
  "sm-3": "h-[28px]",
  "md-1": "h-[40px]",
  "md-2": "h-[48px]",
  "md-3": "h-[56px]",
  "lg-1": "h-[50px]",
  "lg-2": "h-[60px]",
  "lg-3": "h-[70px]",
  "xl-1": "h-[80px]",
  "xl-2": "h-[90px]",
  "xl-3": "h-[100px]",
};

interface TextSkeletonLoadingProps extends ComponentProps {}

const TextSkeletonLoading: React.FC<TextSkeletonLoadingProps> = ({
  className = "",
  sz = "md-1",
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse select-none rounded-lg bg-bg-fourth shadow-lg',
        skeletonSizeClasses[sz],
        className
      )}
    />
  );
};

export default TextSkeletonLoading;
