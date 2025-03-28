import React from "react";

interface LabelProps {
    children?: React.ReactNode;
    htmlFor?: string;
    className?: string;
}

const Label: React.FC<LabelProps> = (
    {
        children,
        htmlFor,
        className
    }
) => {
    
    return (
        <span>
            {children}
        </span>
    )
}

export default Label;