import React from "react";

interface TextProps {
    onClick?: () => void;
    children?: React.ReactNode;
    htmlFor?: string;
    className?: string;
    ref?: React.Ref<HTMLLabelElement>;
    size?: "sm" | "sm-2" | "md" | "md-2" | "lg" | "lg-2" | "lg-3" | "xl" | "xl-2" | "xl-3"; 
    weight?: "light" | "regular" | "bold" | "extrabold";
    color?: "primary" | "secondary" | "danger" | "success" | "warning";
}

const Text: React.FC<TextProps> = ({
    onClick,
    children,
    htmlFor,
    className,
    ref,
    size = "medium",
    weight = "regular",
    color = "primary",
}) => {
    let sizeClass = "";
    let weightClass = "";
    let colorClass = "";

    switch (size) {
        case "sm":
            sizeClass = "text-xs";
            break;
        case "sm-2":
            sizeClass = "text-sm";
            break;
        case "md":
            sizeClass = "text-md";
            break;
        case "md-2":
            sizeClass = "text-lg";
            break;
        case "lg":
            sizeClass = "text-xl";
            break;
        case "lg-2":
            sizeClass = "text-2xl";
            break;
        case "lg-3":
            sizeClass = "text-3xl";
            break;
        case "xl":
            sizeClass = "text-4xl";
            break;
        case "xl-2":
            sizeClass = "text-5xl";
            break;
        case "xl-3":
            sizeClass = "text-6xl";
            break;
        default:
    }

    switch (weight) {
        case "light":
            weightClass = "font-light";
            break;
        case "regular":
            weightClass = "font-normal";
            break;
        case "bold":
            weightClass = "font-bold";
            break;
        case "extrabold":
            weightClass = "font-extrabold";
            break;
        default:
    }

    switch (color) {
        case "primary":
            colorClass = "text-[var(--text-color)]";
            break;
        case "secondary":
            colorClass = "text-[var(--main-single-color)]";
            break;
        case "danger":
            colorClass = "text-red-400";
            break;
        case "success":
            colorClass = "text-green-600";
            break;
        case "warning":
            colorClass = "text-yellow-600";
            break;
    }

    return (
        <label ref={ref}
            onClick={onClick}
            htmlFor={htmlFor}
            className={`cursor-pointer select-none ${sizeClass} ${weightClass} ${colorClass} ${className}`}>
            {children}
        </label>
    );
};

export default Text;
