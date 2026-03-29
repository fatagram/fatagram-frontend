import React from "react";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

export type Size = "sm" | "md" | "lg" | "xl";

// Sử dụng các lớp chiều cao chuẩn của thư viện thay vì giá trị cứng
const skeletonSizeClasses: Record<Size, string> = {
  sm: "h-5", // 20px
  md: "h-8", // 32px
  lg: "h-12", // 48px
  xl: "h-16", // 64px
};

export interface TextSkeletonLoadingProps extends ComponentProps<HTMLDivElement> {
  sz?: Size;
}

export const TextSkeletonLoading: React.FC<TextSkeletonLoadingProps> = ({
  className,
  sz = "md",
  ...props
}) => {
  return (
    <div
      className={clsx(
        "w-full animate-pulse select-none rounded-lg bg-bg-fourth",
        skeletonSizeClasses[sz],
        className,
      )}
      {...props}
    />
  );
};
