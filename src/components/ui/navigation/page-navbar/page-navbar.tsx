import React from "react";
import clsx from "clsx";
import { PageNavbarItem } from "./page-navbar-item";
import { PageNavbarSection } from "./page-navbar-section";
import { Text } from "@/components/atoms/text/text";

type PageNavbarProps = {
  title?: string;
  header?: React.ReactNode;
  headerClassName?: string;
  className?: string;
  children?: React.ReactNode;
};

const PageNavbar: React.FC<PageNavbarProps> & { Section: typeof PageNavbarSection } & {
  Item: typeof PageNavbarItem;
} = ({ title, header, headerClassName, className, children }) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-3 w-full",
        "bg-bg-main sm:bg-bg-second shadow-none border-r-0 sm:border-r-2 border-bg-fourth/80",
        "overflow-y-auto",
        className,
      )}
    >
      <div
        className={clsx(
          "flex flex-col relative bg-bg-main sm:bg-bg-second mt-4 mb-2",
          headerClassName,
        )}
      >
        {title && (
          <Text weight="bold" className="relative px-6 text-gradient-main !text-2xl">
            {title}
          </Text>
        )}
        {header}
      </div>
      {children}
    </div>
  );
};

PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;

export default PageNavbar;
