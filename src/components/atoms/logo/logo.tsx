import { ComponentProps } from "@/components/common/component-type";
import { Size } from "@/components/common/size";
import React from "react";
import clsx from "clsx";

const sizeClasses: Record<Size, { logo: string; slogan: string }> = {
  "xs-1": {
    logo: "lg:text-[16px] sm:text-[15px] text-[10px]",
    slogan: "lg:text-[12px] sm:text-[10px] text-[8px]",
  },
  "xs-2": {
    logo: "lg:text-[20px] sm:text-[20px] text-[15px]",
    slogan: "lg:text-[14px] sm:text-[12px] text-[10px]",
  },
  "xs-3": {
    logo: "lg:text-[20px] sm:text-[20px] text-[10px]",
    slogan: "lg:text-[14px] sm:text-[12px] text-[8px]",
  },
  "sm-1": {
    logo: "lg:text-[28px] sm:text-[25px] text-[15px]",
    slogan: "lg:text-[18px] sm:text-[15px] text-[12px]",
  },
  "sm-2": {
    logo: "lg:text-[32px] sm:text-[30px] text-[20px]",
    slogan: "lg:text-[20px] sm:text-[18px] text-[15px]",
  },
  "sm-3": {
    logo: "lg:text-[32px] sm:text-[30px] text-[20px]",
    slogan: "lg:text-[20px] sm:text-[18px] text-[15px]",
  },
  "md-1": {
    logo: "lg:text-[38px] sm:text-[35px] text-[30px]",
    slogan: "lg:text-[22px] sm:text-[18px] text-[16px]",
  },
  "md-2": {
    logo: "lg:text-[44px] sm:text-[40px] text-[35px]",
    slogan: "lg:text-[26px] sm:text-[22px] text-[20px]",
  },
  "md-3": {
    logo: "lg:text-[44px] sm:text-[40px] text-[35px]",
    slogan: "lg:text-[26px] sm:text-[22px] text-[20px]",
  },
  "lg-1": {
    logo: "lg:text-[50px] sm:text-[45px] text-[40px]",
    slogan: "lg:text-[30px] sm:text-[22px] text-[20px]",
  },
  "lg-2": {
    logo: "lg:text-[50px] sm:text-[45px] text-[40px]",
    slogan: "lg:text-[30px] sm:text-[22px] text-[20px]",
  },
  "lg-3": {
    logo: "lg:text-[56px] sm:text-[50px] text-[45px]",
    slogan: "lg:text-[34px] sm:text-[28px] text-[25px]",
  },
  "xl-1": {
    logo: "lg:text-[56px] sm:text-[50px] text-[45px]",
    slogan: "lg:text-[34px] sm:text-[28px] text-[25px]",
  },
  "xl-2": {
    logo: "lg:text-[62px] sm:text-[55px] text-[50px]",
    slogan: "lg:text-[36px] sm:text-[30px] text-[28px]",
  },
  "xl-3": {
    logo: "lg:text-[68px] sm:text-[60px] text-[55px]",
    slogan: "lg:text-[40px] sm:text-[34px] text-[30px]",
  },
};

// LogoProps interface
interface LogoProps extends ComponentProps {
  hasSlogan?: boolean;
}

// Logo component
// This component is a logo component that can be used in the application.
export const Logo: React.FC<LogoProps> = ({
  hasSlogan = true,
  sz = "md-1",
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col items-center">
      <h1
        {...props}
        className={clsx(
          "font-bagel_fat_one",
          sizeClasses[sz].logo,
          "text-gradient-main select-none",
          className,
        )}
      >
        Fatagram
      </h1>
      {hasSlogan && (
        <h2
          className={clsx(
            sizeClasses[sz].slogan,
            "text-gradient-second font-light font-bagel_fat_one select-none whitespace-nowrap",
          )}
        >
          Share your fun moments with the world!
        </h2>
      )}
    </div>
  );
};
