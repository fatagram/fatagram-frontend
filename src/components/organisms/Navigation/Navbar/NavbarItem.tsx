import React from "react";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { Link } from "@/components/atoms";

interface NavbarItemProps {
    children?: React.ReactNode;
    path: string;
    className?: string;
    onClick?: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
    children,
    path,
    className = "",
    onClick
}) => {
    const isFocused = useActiveRoute(path, true);

    return (
        <Link className={`${className} relative flex items-center justify-center !text-[15px] whitespace-nowrap
                ${isFocused ? "text-single-main" : "!text-[var(--text-color)] "} cursor-pointer
                ${isFocused ? "" : "hover:bg-[var(--main-bg-color)]"} p-4 px-6 rounded-lg overflow-hidden
                ${isFocused ? "" : "active:bg-[var(--main-bg-color)] active:scale-95 transition-all duration-200 ease-in-out"}
                `}
                to={path}
                onClick={onClick}>
            {children}
            {isFocused && (
                <div className="absolute bg-single-main h-[2px] rounded-full
                            w-full bottom-0 left-0" />
            )}
        </Link>
    )
}

export default NavbarItem;
