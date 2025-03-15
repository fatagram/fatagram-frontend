import React from "react";
import { Link as RouterLink } from "react-router-dom";

interface LinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
}

const Link: React.FC<LinkProps> = ({
    to,
    children,
    className = "",
    ...props
}) => {
    return (
        <RouterLink to={to} className={`sm:text-[12px] text-[15px] text-[var(--second-single-color)] 
        hover:text-[var(--main-single-color)] hover:cursor-pointer
        transition-all duration-100 active:scale-95 select-none
        ${className}
        `} {...props}>{children}</RouterLink>
   );
}

export default Link;