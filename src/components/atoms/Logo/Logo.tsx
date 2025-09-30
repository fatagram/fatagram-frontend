import { ComponentProps } from "@/components/common/types/component-type";
import { Size } from "@/components/common/types/size";
import React from "react";

const sizeClasses : Record<Size, { logo: string; slogan: string }> = {
  'xs': { logo: "sm:text-[20px] text-[10px]", slogan: "sm:text-[10px] text-[15px]" },
  'sm-1': { logo: "sm:text-[25px] text-[15px]", slogan: "sm:text-[15px] text-[20px]" },
  'sm-2': { logo: "sm:text-[30px] text-[20px]", slogan: "sm:text-[15px] text-[20px]" },
  'sm-3': { logo: "sm:text-[30px] text-[20px]", slogan: "sm:text-[15px] text-[20px]" },
  'md-1': { logo: "sm:text-[35px] text-[30px]", slogan: "sm:text-[15px] text-[20px]" },
  'md-2': { logo: "sm:text-[40px] text-[35px]", slogan: "sm:text-[20px] text-[25px]" },
  'md-3': { logo: "sm:text-[40px] text-[35px]", slogan: "sm:text-[20px] text-[25px]" },
  'lg-1': { logo: "sm:text-[45px] text-[40px]", slogan: "sm:text-[20px] text-[25px]" },
  'lg-2': { logo: "sm:text-[45px] text-[40px]", slogan: "sm:text-[20px] text-[25px]" },
  'lg-3': { logo: "sm:text-[50px] text-[45px]", slogan: "sm:text-[25px] text-[30px]" },
  'xl-1': { logo: "sm:text-[50px] text-[45px]", slogan: "sm:text-[25px] text-[30px]" },
  'xl-2': { logo: "sm:text-[55px] text-[50px]", slogan: "sm:text-[25px] text-[30px]" },
  'xl-3': { logo: "sm:text-[60px] text-[55px]", slogan: "sm:text-[30px] text-[35px]" },
};

// LogoProps interface
interface LogoProps extends ComponentProps {
  hasSlogan?: boolean;
};

// Logo component
// This component is a logo component that can be used in the application.
const Logo: React.FC<LogoProps> = ({
  hasSlogan = true,
  sz = "md-1",
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col items-center">
      <h1
        {...props}
        className={`font-bagel_fat_one ${sizeClasses[sz].logo} text-gradient-main select-none ${className}`}
      >
        Fatagram
      </h1>
      {hasSlogan && (
        <h2
          className={`${sizeClasses[sz].slogan} text-gradient-second font-light font-jua select-none whitespace-nowrap`}
        >
          Share your fun moments with the world!
        </h2>
      )}
    </div>
  );
};

export default Logo;
