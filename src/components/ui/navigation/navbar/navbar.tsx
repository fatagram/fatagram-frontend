import React from "react";
import clsx from "clsx";
import { NavbarItem } from "./navbar-item";

interface NavbarProps {
  isAuthenticated?: boolean | null;
  className?: string;
  optionClassName?: string;
  options?: React.ReactNode;
  items?: { icon: React.ReactNode; path: string; isIndex: boolean; showOnDesktop?: boolean }[];
  logo?: React.ReactNode;
  style?: any;
}

export const Navbar: React.FC<NavbarProps> = ({
  className,
  optionClassName,
  isAuthenticated,
  options,
  items,
  logo,
  style,
}) => {
  const navItems = items || [];

  return (
    <nav
      className={clsx(
        "flex items-center",
        "bg-bg-main p-[2px] shadow-md sm:px-8 justify-between",
        className,
      )}
      style={style}
    >
      {logo}
      <div className="flex flex-row gap-3 flex-1">
        {isAuthenticated && (
          <div className={clsx("flex w-full sm:justify-center flex-row")}>
            {navItems.map((item, index) => (
              <NavbarItem
                path={item.path}
                key={index}
                className={clsx(
                  "flex-1 sm:flex-none sm:px-10",
                  item.showOnDesktop ? "block" : "sm:hidden",
                )}
                activeRoute={item.isIndex}
              >
                {item.icon}
              </NavbarItem>
            ))}
          </div>
        )}
        <div className={clsx("flex flex-row gap-2 justify-center flex-1", optionClassName)}>
          {options}
        </div>
      </div>
    </nav>
  );
};
