import React from "react";

interface LogoProps {
    hasSlogan?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    hasSlogan = true,
    className = "",
    ...props
}) => {
    return (
        <div className="flex flex-col items-center">
            <h1 {...props} className={`font-bagel_fat_one sm:text-[35px] text-[50px] text-gradient-main select-none ${className}`}>Fatagram</h1>
            {hasSlogan && 
            <h2 className="sm:text-[15px] text-[15px] text-gradient-second font-light font-jua select-none whitespace-nowrap">Share your fun
moments with the world!</h2>}
        </div>
    );
}

export default Logo;