import React from "react";

interface LabelSkeletonLoadingProps {
    className?: string;
    size?: "small" | "medium" | "large"
}

const LabelSkeletonLoading: React.FC<LabelSkeletonLoadingProps> = ({
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
            className={`animate-pulse select-none rounded-lg bg-[var(--bg-color-fourth)] shadow-lg
                ${sizeClass} ${className}`}
        >

        </div>
    );
};

export default LabelSkeletonLoading;
