import React from "react";
import { useActiveRoute } from "@/hooks/use-active-route";
import { Link } from "@/components/atoms";
import clsx from "clsx";

interface NavbarItemProps {
  children?: React.ReactNode;
  path: string;
  className?: string;
  activeRoute: boolean;
  onClick?: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ children, path, activeRoute = true, className = "", onClick }) => {
  const isFocused = useActiveRoute(path, activeRoute);

  return (
    <Link
      className={clsx(
        className,
        "relative flex items-center justify-center !text-[15px] whitespace-nowrap",
        isFocused ? "!text-primary-500" : "!text-text-main",
        "cursor-pointer",
        "p-4 px-6 rounded-lg overflow-hidden",
        {
          "hover:bg-bg-third": !isFocused,
          "active:bg-bg-third active:scale-95 transition-all duration-200 ease-in-out": !isFocused
        }
      )}
      to={path}
      onClick={onClick}
    >
      {children}
      {isFocused && (
        <div
          className="absolute bg-primary-500 h-[2px] rounded-full w-full bottom-0 left-0"
        />
      )}
    </Link>
  );
};

export default NavbarItem;
