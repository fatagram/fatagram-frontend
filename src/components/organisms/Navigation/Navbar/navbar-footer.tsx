import React from "react";
import clsx from "clsx";
import NavbarItem from "./navbar-item";

interface NavbarFooterProps {
  className?: string;
  children?: React.ReactNode;
  isAuthenticated: boolean | null;
}

const NavbarFooter: React.FC<NavbarFooterProps> = ({ className, isAuthenticated }) => {
  const navItems: { icon: React.ReactNode; path: string; isIndex: boolean }[] = [
    { icon: <i className="fa-solid fa-house"></i>, path: "/", isIndex: true },
    { icon: <i className="fa-solid fa-user-group"></i>, path: "/friends", isIndex: false },
  ];
  return (
    <div
      className={clsx(
        "bg-[var(--third-bg-color)] w-full py-1",
        className
      )}
    >
      {isAuthenticated && (
        <div className="flex flex-1 items-center justify-center py-1">
          {navItems.map((item, index) => (
              <NavbarItem path={item.path} key={index} activeRoute={item.isIndex}>
                {item.icon}
              </NavbarItem>
            ))}
        </div>
      )}
    </div>
  );
};

export default NavbarFooter;
