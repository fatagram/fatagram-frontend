import React from "react";
import clsx from "clsx";
import { ComponentProps } from "@/components/common/component-type";

export type Size = "sm" | "md" | "lg" | "xl";

export const sizeClasses: Record<Size, { logo: string; slogan: string }> = {
  sm: {
    logo: "text-base sm:text-lg",
    slogan: "text-[10px] sm:text-xs",
  },
  md: {
    logo: "text-lg sm:text-xl",
    slogan: "text-[11px] sm:text-xs",
  },
  lg: {
    logo: "text-2xl sm:text-3xl",
    slogan: "text-xs sm:text-sm",
  },
  xl: {
    logo: "text-3xl sm:text-4xl",
    slogan: "text-sm sm:text-base",
  },
};

export const sizeSpecs: Record<Size, { dimension: number; margin: number; sloganMargin: number }> =
  {
    sm: { dimension: 36, margin: -5, sloganMargin: 2 },
    md: { dimension: 56, margin: -8, sloganMargin: 4 },
    lg: { dimension: 96, margin: -14, sloganMargin: 8 },
    xl: { dimension: 144, margin: -20, sloganMargin: 12 },
  };

export interface LogoProps extends ComponentProps<HTMLDivElement> {
  hasSlogan?: boolean;
  sz?: Size;
}

export const Logo: React.FC<LogoProps> = ({ hasSlogan = true, sz = "md", className, ...props }) => {
  const specs = sizeSpecs[sz];

  return (
    <div className={clsx("flex flex-col items-center", className)} {...props}>
      <div className="flex items-end justify-center leading-none gap-1">
        <div
          className="bg-gradient-main filter drop-shadow-md flex-shrink-0"
          style={{
            width: `${specs.dimension}px`,
            height: `${specs.dimension}px`,
            WebkitMaskImage: "url('/svgs/logo-nobg.svg')",
            maskImage: "url('/svgs/logo-nobg.svg')",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "bottom center",
            maskPosition: "bottom center",
          }}
          aria-label="Fawe"
        />
        {hasSlogan && (
          <span
            className={clsx(
              "text-gradient-main font-bagel_fat_one select-none tracking-wide font-bold leading-none",
              sizeClasses[sz].logo,
            )}
          >
            FaWe
          </span>
        )}
      </div>
      {hasSlogan && (
        <p
          className={clsx(
            "text-gradient-second font-light font-bagel_fat_one select-none whitespace-nowrap",
            sizeClasses[sz].slogan,
          )}
          style={{
            marginTop: `${specs.sloganMargin}px`,
          }}
        >
          We are Fantastic!
        </p>
      )}
    </div>
  );
};
