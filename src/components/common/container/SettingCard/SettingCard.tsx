import React from "react";

interface SettingCardProps {
    className?: string;
    children?: React.ReactNode;
    title?: string;
}

const SettingCard: React.FC<SettingCardProps> = ({className, children, title}) => {
    return (
        <div className={`flex flex-col items-start bg-[var(--bg-color)] p-5 rounded-2xl shadow-lg ${className}`}>
            <h1 className="text-2xl font-bold text-left m-2 mb-5">{title}</h1>
            {children}
        </div>
    )
}

export default SettingCard;