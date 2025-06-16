import React from "react";

interface TextSkeletionLoadingProps {
    className?: string;
    size?: "small" | "medium" | "large"
}

const TextSkeletionLoading: React.FC<TextSkeletionLoadingProps> = ({
    className = "",
    size = "medium"
}) => {
    let sizeClass = "";

    switch (size) {
        case "small":
            sizeClass = "h-[20px] ";
            break;
        case "medium":
            sizeClass = "h-[40px]";
            break;
        case "large":
            sizeClass = "h-[50px]";
            break;
    }

    return (
        <div
            className={`animate-pulse select-none rounded-lg bg-[var(--fourth-bg-color)] shadow-lg
                ${sizeClass} ${className}`}
        >

        </div>
    );
};

export default TextSkeletionLoading;
