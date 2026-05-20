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
        "w-full text-left px-4 py-3 rounded-xl",
        "transition-all duration-200 ease-out",
        "relative group flex items-center gap-4",
        {
          "bg-primary-500/10": isFocused,
          "hover:bg-bg-second": !isFocused,
        },
        className,
      )}
    >
      <Text
        sz="lg"
        className={clsx(
          "flex justify-center items-center shrink-0 transition-all duration-200",
          isFocused ? "text-primary-500" : "text-text-second group-hover:text-text-main",
        )}
      >
        {icon}
      </Text>
      <div className="flex flex-col flex-1 min-w-0">
        <Text
          sz="md"
          weight={isFocused ? "bold" : "medium"}
          className={clsx(
            "truncate transition-colors duration-200",
            isFocused ? "text-primary-500" : "text-text-main group-hover:text-text-main",
          )}
        >
          {title}
        </Text>
        {description && (
          <Text sz="sm" className="text-text-third truncate mt-0.5">
            {description}
          </Text>
        )}
      </div>
    </button>
  );
};
