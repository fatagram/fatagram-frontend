import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/use-active-route";
import { Text } from "@/components/atoms";
import clsx from "clsx";

export type PageNavbarItemProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  path: string;
  className?: string;
  onClick?: () => void;
};

export const PageNavbarItem: React.FC<PageNavbarItemProps> = ({
  icon,
  title,
  description,
  path,
  className = "",
  onClick,
}) => {
  const navigate = useNavigate();
  const isFocused = useActiveRoute(path, true);

  return (
    <button
      onClick={() => {
        navigate(path);
        onClick?.();
      }}
      className={clsx(
        "w-full text-left px-3 py-3 rounded-xl",
        "transition-all duration-300 ease-out",
        "relative overflow-hidden group",
        {
          "bg-bg-fourth border-l-4 border-l-primary-500 shadow-sm": isFocused,
          "hover:bg-bg-third hover:shadow-sm hover:translate-x-1": !isFocused,
        },
        className,
      )}
    >
      {/* Active indicator glow */}
      {isFocused && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent pointer-events-none" />
      )}

      <div className={clsx("grid grid-cols-10 relative z-10")}>
        <Text
          sz="md"
          className={clsx(
            "flex justify-center items-center h-full col-span-2",
            "transition-all duration-300",
            isFocused
              ? "text-primary-500 scale-110"
              : "text-text-second group-hover:text-primary-500 group-hover:scale-105",
          )}
        >
          {icon}
        </Text>
        <div className="col-span-8 flex flex-col justify-center">
          <Text
            sz="md"
            className={clsx(
              "transition-colors duration-300",
              isFocused
                ? "text-primary-600 font-semibold"
                : "text-text-main group-hover:text-primary-600",
            )}
          >
            {title}
          </Text>
          {description && (
            <Text sz="sm" weight="light" className="text-text-second mt-0.5">
              {description}
            </Text>
          )}
        </div>
      </div>
    </button>
  );
};
