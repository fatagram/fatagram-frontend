import React from "react";
import Text from "../../ui/Text";

interface CardProps {
    className?: string;
    children?: React.ReactNode;
    title?: string;
}

const Card: React.FC<CardProps> = ({className, children, title}) => {
    return (
        <div className={`flex flex-col items-start bg-[var(--bg-color)] p-7 rounded-2xl shadow-lg ${className}`}>
            <Text size="lg-2" weight="bold" className="mb-5">{title}</Text>
            {children}
        </div>
    )
}

export default Card;