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
      "flex flex-col gap-2",
      className
    )}>
      <Text sz="xl-1" weight="bold" className="pt-2 pb-4 px-5 text-gradient-main bg-bg-second">
        {title}
      </Text>
      {children}
    </div>
  );
};

PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;

export default PageNavbar;
