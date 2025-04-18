import React from "react";

const sizeClasses = {
    small: { logo: "sm:text-[20px] text-[10px]", slogan: "sm:text-[10px] text-[15px]" },
    medium: { logo: "sm:text-[35px] text-[30px]", slogan: "sm:text-[15px] text-[20px]" },
    large: { logo: "sm:text-[45px] text-[40px]", slogan: "sm:text-[20px] text-[25px]" }
}

type Size = keyof typeof sizeClasses;

// LogoProps interface
interface LogoProps {
    hasSlogan?: boolean;
    size?: Size;
    className?: string;
}

// Logo component
// This component is a logo component that can be used in the application.
const Logo: React.FC<LogoProps> = ({
    hasSlogan = true,
    size = "medium",
    className = "",
    ...props
}) => {
    return (
        <div className="flex flex-col items-center">
            <h1 {...props} className={`font-bagel_fat_one ${sizeClasses[size].logo} text-gradient-main select-none ${className}`}>Fatagram</h1>
            {hasSlogan && 
            <h2 className={`${sizeClasses[size].slogan} text-gradient-second font-light font-jua select-none whitespace-nowrap`}>Share your fun
moments with the world!</h2>}
        </div>
    );
}

export default Logo;