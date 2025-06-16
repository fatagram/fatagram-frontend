import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import Link from "@/components/common/ui/Link";

interface NavbarItemProps {
    children?: React.ReactNode;
    path: string;
    classname?: string;
    end?: string
}

const NavbarItem: React.FC<NavbarItemProps> = ({
    children,
    path,
    classname,
    end
}) => {
    const isFocused = useActiveRoute(path, end ?? "/");

    return (
        <Link className={`relative flex items-center justify-center !text-[15px]
                ${isFocused ? "text-[var(--main-single-color)]" : "text-[var(--text-color)]"} cursor-pointer
                ${isFocused ? "" : "hover:bg-[var(--main-bg-color)]"} p-4 px-10  rounded-lg overflow-hidden
                ${isFocused ? "" : "active:bg-[var(--main-bg-color)] active:scale-95 transition-all duration-200 ease-in-out"}
                ${classname}`}
                to={path}>
            {children}
            {isFocused && (
                <div className="absolute bg-[var(--main-single-color)] h-[2px] rounded-full
                            w-full bottom-0 left-0" />
            )}
        </Link>
    )
}

export default NavbarItem;
