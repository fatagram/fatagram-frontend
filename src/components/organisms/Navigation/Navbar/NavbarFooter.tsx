import React from "react";
import NavbarItem from "./NavbarItem";

interface NavbarFooterProps {
    className?: string;
    children?: React.ReactNode;
    isAuthenticated: boolean | null;
}

const NavbarFooter: React.FC<NavbarFooterProps> = ({
    className,
    isAuthenticated
}) => {
    const navItems: { icon: React.ReactNode, path: string }[] = [
        { icon: <i className="fa-solid fa-house"></i>, path: "/" },
        { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends" },
    ];
    return (
        <div className={`flex bg-[var(--third-bg-color)] gap-3 w-full py-1
                ${className}`}>
            {isAuthenticated &&
                <div className="flex flex-1 gap-3 items-center">
                    <div className="flex justify-center w-full md:w-auto">
                        {navItems.map((item, index) => (
                            <NavbarItem path={item.path} key={index}>
                                {item.icon}
                            </NavbarItem>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default NavbarFooter;