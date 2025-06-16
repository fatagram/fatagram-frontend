import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import NavbarItem from "./NavbarItem";

interface NavbarFooterProps {
    className?: string;
    children?: React.ReactNode;
}

const NavbarFooter: React.FC<NavbarFooterProps> = ({
    className,
}) => {
    const { isAuthenticated } = useAuth();
    const navItems: { icon: React.ReactNode, path: string }[] = [
            { icon: <i className="fa-solid fa-house"></i>, path: "/" },
            { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends" },
        ]

    return (
        <div className={`flex flex-wrap sm:flex-none py-1 sm:pl-10 sm:pr-10 pl-1 pr-1 bg-[var(--third-bg-color)] gap-3
            ${className}
            shadow-md items-center justify-between`}>
            {isAuthenticated &&
                <div className="flex flex-1 gap-3 items-center">
                    <div className="flex justify-center w-full md:w-auto">
                        {navItems.map((item, index) => (
                            <NavbarItem path={item.path} key={index} end="/">
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