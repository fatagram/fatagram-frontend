import { Stack } from "@/components/atoms";
import SubNavbarItem from "./sub-navbar-item";
import SubNavbarSection from "./sub-navbar-section";

type SubNavbarProps = {
  className?: string;
  children?: React.ReactNode;
};

const SubNavbar: React.FC<SubNavbarProps> & { Item: typeof SubNavbarItem } & {
  Section: typeof SubNavbarSection;
} = ({ className, children }) => {
  return (
    <Stack as="nav" space={2} className={className}>
      {children}
    </Stack>
  );
};

SubNavbar.Item = SubNavbarItem;
SubNavbar.Section = SubNavbarSection;

export default SubNavbar;
