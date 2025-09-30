import React from "react";
import "@/styles/global.css";
import "./background-image.module.css";
import { ComponentProps } from "@/components/common/types/component-type";

interface BackgroundImageSkeletonProps extends ComponentProps {
  alt: string;
}

const BackgroundImageSkeleton: React.FC<BackgroundImageSkeletonProps> = ({ className }) => {
  return (
    <div
      className={`${className} animate-pulse bg-[var(--fourth-bg-color)] h-[200px] rounded-2xl shadow-lg`}
    />
  );
};

export default BackgroundImageSkeleton;
