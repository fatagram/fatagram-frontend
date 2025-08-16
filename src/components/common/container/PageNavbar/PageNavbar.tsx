import React from "react";
import Text from "../../ui/Text";

interface PageNavbarProps {
    title?: string;
    className?: string;
    children?: React.ReactNode;
}

const PageNavbar: React.FC<PageNavbarProps> = ({
    title,
    className,
    children
}) => {

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <Text size="xl-1" weight="bold" className="p-2 pl-5 text-gradient-main">{title}</Text>
            {children}
        </div>
    )
}

export default PageNavbar;