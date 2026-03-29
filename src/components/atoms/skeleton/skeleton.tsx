import { FC } from "react";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

export type Size = "sm" | "md" | "lg" | "xl";
export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps extends ComponentProps<HTMLDivElement> {
  variant?: SkeletonVariant;
  sz?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
  xl: "h-32",
};

export const Skeleton: FC<SkeletonProps> = ({
  className,
  sz = "md",
  variant = "text",
  ...props
}) => {
  return (
    <div
      className={clsx(
        "w-full animate-pulse bg-bg-third",
        sizeClasses[sz],
        {
          "rounded-md": variant === "text",
          "rounded-xl": variant === "rect",
          "aspect-square !w-auto !rounded-full": variant === "circle",
        },
        className,
      )}
      {...props}
    />
  );
};
