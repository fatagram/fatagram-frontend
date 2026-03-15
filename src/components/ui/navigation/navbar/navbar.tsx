import React from "react";
import clsx from "clsx";
import { NavbarItem } from "./navbar-item";

interface NavbarProps {
  className?: string;
  isAuthenticated: boolean | null;
  options?: React.ReactNode;
  items?: { icon: React.ReactNode; path: string; isIndex: boolean }[];
  logo?: React.ReactNode;
  style?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ className, options, items, logo, style }) => {
  const navItems = items || [];

  return (
    <nav
      className={clsx(
        "flex items-center justify-between",
        "bg-bg-main p-[2px] shadow-md sm:px-8",
        className,
      )}
      style={style}
    >
      {/* <div onClick={handleGoToHome} className="cursor-pointer items-center gap-2">
        <Logo hasSlogan={false} sz="sm-3" />
      </div> */}
      {logo}
      <div className="flex flex-row gap-3 flex-1">
        <div className={clsx("flex w-full sm:justify-center flex-row")}>
          {navItems.map((item, index) => (
            <NavbarItem path={item.path} key={index} className="!px-10" activeRoute={item.isIndex}>
              {item.icon}
            </NavbarItem>
          ))}
        </div>
        <div className={clsx("flex flex-row gap-2 flex-1 justify-end sm:flex-none")}>{options}</div>
      </div>
    </nav>
  );
};
