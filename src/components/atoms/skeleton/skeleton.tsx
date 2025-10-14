import { ComponentProps } from "@/components/common/types/component-type";
import { Size } from "@/components/common/types/size";
import clsx from "clsx";
import { FC, JSX } from "react";

type SkeletonVariant = "text" | "rect" | "circle";

interface SkeletonProps extends ComponentProps {
  variant?: SkeletonVariant;
}

const sizeClasses: Record<Size, string> = {
  xs: "h-2",
  "sm-1": "h-4",
  "sm-2": "h-6",
  "sm-3": "h-8",
  "md-1": "h-10",
  "md-2": "h-12",
  "md-3": "h-16",
  "lg-1": "h-20",
  "lg-2": "h-24",
  "lg-3": "h-32",
  "xl-1": "h-40",
  "xl-2": "h-56",
  "xl-3": "h-72",
};

export default function Skeleton({
  className = "",
  sz = "md-1",
  variant = "text",
}: SkeletonProps): JSX.Element {
  return (
    <div
      className={clsx(
        `animate-pulse rounded-xl bg-bg-seventh`,
        { "aspect-square !rounded-full": variant === "circle" },
        sizeClasses[sz],
        className,
      )}
    />
  );
}
