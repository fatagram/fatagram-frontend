import React from "react";
import clsx from "clsx";
import { PageNavbarItem } from "./page-navbar-item";
import { PageNavbarSection } from "./page-navbar-section";
import { Text } from "@/components/atoms/text/text";

type PageNavbarProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const PageNavbar: React.FC<PageNavbarProps> & { Section: typeof PageNavbarSection } & {
  Item: typeof PageNavbarItem;
} = ({ title, className, children }) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3",
        "bg-bg-main shadow-md rounded-b-2xl",
        "overflow-y-auto",
        className,
      )}
    >
      {title && (
        <div className="relative bg-bg-second mt-4 mb-2">
          <Text sz="xl-1" weight="bold" className="relative px-6 text-gradient-main">
            {title}
          </Text>
        </div>
      )}
      <div className="px-2 pb-3 space-y-1">{children}</div>
    </div>
  );
};

PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;

export default PageNavbar;
