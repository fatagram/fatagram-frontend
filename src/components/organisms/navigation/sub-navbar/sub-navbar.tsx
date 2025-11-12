import { Text } from "@/components/atoms";
import clsx from "clsx";
import { SubNavbarSection } from "./sub-navbar-section";
import { SubNavbarItem } from "./sub-navbar-item";

type SubNavbarProps = {
  className?: string;
  children?: React.ReactNode;
};

export const SubNavbar: React.FC<SubNavbarProps> & { Item: typeof SubNavbarItem } & {
  Section: typeof SubNavbarSection;
} = ({ className, children }) => {
  return <div className={clsx("flex flex-col gap-1", className)}>{children}</div>;
};

SubNavbar.Item = SubNavbarItem;
SubNavbar.Section = SubNavbarSection;
