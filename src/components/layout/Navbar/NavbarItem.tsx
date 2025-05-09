import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/useActiveRoute";

interface NavbarItemProps {
    children?: React.ReactNode;
    path: string;
    classname?: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
    children,
    path,
    classname
}) => {
    const navigate = useNavigate();
    const isFocused = useActiveRoute(path);

    return (
        <div className={`relative flex items-center justify-center 
                ${isFocused ? "text-[var(--main-single-color)]" : "text-[bg-[var(--text-color)]]"} cursor-pointer
                ${isFocused ? "" : "hover:bg-[var(--bg-color)]"} p-4 px-10  rounded-lg overflow-hidden
                ${isFocused ? "" : "active:bg-[var(--bg-color)] active:scale-95 transition-all duration-200 ease-in-out"}
                ${classname}`}
            onClick={() => navigate(path)}>
            {children}
            {isFocused && (
                <div className="absolute bg-[var(--main-single-color)] h-[2px] rounded-full
                            w-full bottom-0 left-0" />
            )}
        </div>
    )
}

export default NavbarItem;
