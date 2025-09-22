import React from "react";
import PageNavbarSection from "./page-navbar-section";
import PageNavbarItem from "./page-navbar-item";
import Text from "@/components/atoms/text";

type PageNavbarProps = {
    title?: string;
    className?: string;
    children?: React.ReactNode;
}

const PageNavbar: React.FC<PageNavbarProps> & { Section: typeof PageNavbarSection } & { Item: typeof PageNavbarItem } = ({
    title,
    className,
    children,
}) => {

    return (
        <div className={`flex flex-col gap-2 ${className} overflow-y-auto`}>
            <Text size="xl-1" weight="bold" className="p-2 pl-5 text-gradient-main">{title}</Text>
            {children}
        </div>
    )
};

PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;

export default PageNavbar;