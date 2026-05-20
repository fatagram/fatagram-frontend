import React from "react";
import { useActiveRoute, useNavigationStore } from "@/hooks/use-active-route";
import { Link } from "@/components/atoms";
import clsx from "clsx";

interface NavbarItemProps {
  children?: React.ReactNode;
  path: string;
  className?: string;
  activeRoute: boolean;
  onClick?: () => void;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  children,
  path,
  activeRoute = true,
  className = "",
  onClick,
}) => {
  const isFocused = useActiveRoute(path, activeRoute);
  const setPendingPath = useNavigationStore((state) => state.setPendingPath);

  const handleClick = () => {
    setPendingPath(path);
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      className={clsx(
        className,
        "group relative flex items-center justify-center !text-[15px] whitespace-nowrap",
        "cursor-pointer p-4 px-6 transition-all duration-300",
        isFocused ? "!text-primary-500" : "!text-text-main hover:!text-primary-400",
      )}
      to={path}
      onClick={handleClick}
    >
      <span className="relative z-10">{children}</span>

      <div
        className={clsx(
          "absolute bottom-1 left-1/2 -translate-x-1/2 transform transition-all duration-300",
          "h-[4px] rounded-full bg-primary-500",
          isFocused ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-2 group-hover:opacity-100",
        )}
      />
    </Link>
  );
};
