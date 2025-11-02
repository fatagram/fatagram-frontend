import React from "react";
import clsx from "clsx";
import PageNavbarSection from "./page-navbar-section";
import PageNavbarItem from "./page-navbar-item";
import Text from "@/components/atoms/text";

type PageNavbarProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const PageNavbar: React.FC<PageNavbarProps> & { Section: typeof PageNavbarSection } & {
  Item: typeof PageNavbarItem;
} = ({ title, className, children }) => {
  return (
    <div className={clsx(
      "flex flex-col gap-3",
      "bg-bg-main shadow-md rounded-b-2xl",
      "overflow-hidden",
      className
    )}>
      {title && (
        <div className="relative bg-bg-second mt-2">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5 pointer-events-none" />
          <Text 
            sz="xl-1" 
            weight="bold" 
            className="relative pt-4 pb-4 px-6 text-gradient-main"
          >
            {title}
          </Text>
        </div>
      )}
      <div className="px-2 pb-3 space-y-1">
        {children}
      </div>
    </div>
  );
};

PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;

export default PageNavbar;
