import React from "react";
import { Text } from "@/components/atoms";

interface CardProps {
    className?: string;
    titleClassName?: string;
    children?: React.ReactNode;
    title?: string;
}

const Card: React.FC<CardProps> = ({className, children, title, titleClassName}) => {
    return (
        <div className={`flex flex-col items-start bg-[var(--main-bg-color)] p-7 rounded-2xl shadow-lg ${className}`}>
            <Text size="lg-2" weight="bold" className={`mb-5 ${titleClassName}`}>{title}</Text>
            {children}
        </div>
    )
}

export default Card;