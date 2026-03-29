import React from "react";
import clsx from "clsx";
import { ComponentProps } from "@/components/common/component-type";

export type Size = "sm" | "md" | "lg" | "xl";

export const sizeClasses: Record<Size, { logo: string; slogan: string }> = {
  sm: {
    logo: "text-base sm:text-lg", // Khoảng 16-18px
    slogan: "text-xs", // 12px (Giới hạn tối thiểu an toàn)
  },
  md: {
    logo: "text-xl sm:text-2xl", // Khoảng 20-24px (Vừa vặn cho thanh điều hướng)
    slogan: "text-xs", // 12px
  },
  lg: {
    logo: "text-3xl sm:text-4xl", // Khoảng 30-36px (Phù hợp trang giới thiệu)
    slogan: "text-sm", // 14px
  },
  xl: {
    logo: "text-4xl sm:text-5xl", // Khoảng 36-48px (Vừa phải cho màn hình đăng nhập)
    slogan: "text-base text-gray-400", // 16px
  },
};

export interface LogoProps extends ComponentProps<HTMLDivElement> {
  hasSlogan?: boolean;
  sz?: Size;
}

export const Logo: React.FC<LogoProps> = ({ hasSlogan = true, sz = "md", className, ...props }) => {
  return (
    <div className={clsx("flex flex-col items-center", className)} {...props}>
      <h1
        className={clsx("font-bagel_fat_one text-gradient-main select-none", sizeClasses[sz].logo)}
      >
        Fatagram
      </h1>
      {hasSlogan && (
        <p
          className={clsx(
            "text-gradient-second font-light font-bagel_fat_one select-none whitespace-nowrap",
            sizeClasses[sz].slogan,
          )}
        >
          Share your fun moments with the world!
        </p>
      )}
    </div>
  );
};
