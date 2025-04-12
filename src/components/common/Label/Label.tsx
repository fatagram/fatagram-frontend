import React from "react";

interface LabelProps {
    onClick?: () => void;
    children?: React.ReactNode;
    htmlFor?: string;
    className?: string;
    size?: "small" | "medium" | "large";
    weight?: "light" | "regular" | "bold";
    color?: "primary" | "secondary" | "danger" | "success" | "warning";
}

const Label: React.FC<LabelProps> = ({
    onClick,
    children,
    htmlFor,
    className = "",
    size = "medium",
    weight = "regular",
    color = "primary",
}) => {
    let sizeClass = "";
    let weightClass = "";
    let colorClass = "";

    switch (size) {
        case "small":
            sizeClass = "text-xs";
            break;
        case "medium":
            sizeClass = "text-sm";
            break;
        case "large":
            sizeClass = "text-xl";
            break;
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
    }

    switch (color) {
        case "primary":
            colorClass = "var(--text-color)";
            break;
        case "secondary":
            colorClass = "var(--text-color-secondary)";
            break;
        case "danger":
            colorClass = "text-red-600";
            break;
        case "success":
            colorClass = "text-green-600";
            break;
        case "warning":
            colorClass = "text-yellow-600";
            break;
    }

    return (
        <label
            onClick={onClick}
            htmlFor={htmlFor}
            className={`cursor-pointer select-none ${sizeClass} ${weightClass} ${colorClass} ${className}`}
        >
            {children}
        </label>
    );
};

export default Label;
