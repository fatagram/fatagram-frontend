import React from "react";
import PageNavbarSection from "./page-navbar-section";
import PageNavbarItem from "./page-navbar-item";
import Text from "@/components/atoms/text";
import { Stack } from "@/components/atoms";

type PageNavbarProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const PageNavbar: React.FC<PageNavbarProps> & { Section: typeof PageNavbarSection } & {
  Item: typeof PageNavbarItem;
} = ({ title, className, children }) => {
  return (
    <Stack space={2} overflow="scroll" align="start" className={`${className}`}>
      <Text sz="xl-1" weight="bold" className="p-2 pl-5 text-gradient-main">
        {title}
      </Text>
      {children}
    </Stack>
  );
};

PageNavbar.Section = PageNavbarSection;
PageNavbar.Item = PageNavbarItem;

export default PageNavbar;
