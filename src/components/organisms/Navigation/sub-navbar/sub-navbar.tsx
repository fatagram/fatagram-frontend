import SubNavbarItem from "./sub-navbar-item";
import SubNavbarSection from "./sub-navbar-section";

type SubNavbarProps = {
    className?: string;
    children?: React.ReactNode;
}

const SubNavbar: React.FC<SubNavbarProps> & { Item: typeof SubNavbarItem } & { Section: typeof SubNavbarSection } = ({
    className,
    children
}) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {children}
        </div>
    )
}

SubNavbar.Item = SubNavbarItem;
SubNavbar.Section = SubNavbarSection;

export default SubNavbar;