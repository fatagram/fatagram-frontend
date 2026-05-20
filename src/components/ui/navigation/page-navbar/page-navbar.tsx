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
        "flex flex-col gap-3 w-full h-full",
        "bg-bg-main shadow-none sm:border-r border-bg-fourth/50",
        "overflow-y-auto",
        className,
      )}
    >
      <div className={clsx("flex flex-col relative bg-transparent pt-6 pb-2", headerClassName)}>
        {title && (
          <Text weight="extrabold" className="px-6 text-text-main !text-2xl mb-2">
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
