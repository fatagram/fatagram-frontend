import React from "react";
import { Size } from "../styles/size";

// Define a mapping of text sizes
const textSizes: Record<Size, string> = {
    "xs": "text-xs",
    "sm-1": "text-xs",
    "sm-2": "text-sm",
    "sm-3": "text-sm",
    "md-1": "text-md",
    "md-2": "text-lg",
    "md-3": "text-md",
    "lg-1": "text-xl",
    "lg-2": "text-2xl",
    "lg-3": "text-3xl",
    "xl-1": "text-4xl",
    "xl-2": "text-5xl",
    "xl-3": "text-6xl",
}

// Define a mapping of font weights
const weightClasses: Record<string, string> = {
    "light": "font-light",
    "regular": "font-normal",
    "bold": "font-bold",
    "extrabold": "font-extrabold",
}
type Weight = keyof typeof weightClasses;

// Define a mapping of text colors
const colorClasses: Record<string, string> = {
    "primary": "text-[var(--text-color)]",
    "secondary": "text-[var(--main-single-color)]",
    "danger": "text-red-400",
    "success": "text-green-600",
    "warning": "text-yellow-600",
}
type Color = keyof typeof colorClasses;

// Text props
interface TextProps {
    onClick?: () => void;
    children?: React.ReactNode;
    htmlFor?: string;
    className?: string;
    ref?: React.Ref<HTMLLabelElement>;
    size?: Size;
    weight?: Weight;
    color?: Color;
}

const Text: React.FC<TextProps> = ({
    onClick,
    children,
    htmlFor,
    className,
    ref,
    size = "md-1",
    weight = "regular",
    color = "primary",
}) => {
    return (
        <label ref={ref}
            onClick={onClick}
            htmlFor={htmlFor}
            className={`cursor-pointer select-none
                ${textSizes[size]} 
                ${weightClasses[weight]} 
                ${colorClasses[color]} 
                ${className}`}>
            {children}
        </label>
    );
};

export default Text;
