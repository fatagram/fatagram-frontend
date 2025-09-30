import { ComponentProps } from "@/components/common/types/component-type";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

// LinkProps interface
interface LinkProps extends ComponentProps {
  to: string;
  onClick?: () => void;
}

// Link component
// This component is a link component that can be used in the application.
const Link: React.FC<LinkProps> = ({ to, children, onClick, className = "", ...props }) => {
  return (
    <RouterLink
      to={to}
      className={`sm:text-[12px] text-[15px] text-single-second 
        hover:text-single-main hover:cursor-pointer
        transition-all duration-100 active:scale-95 select-none
        ${className}
        `}
      onClick={onClick}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

export default Link;
