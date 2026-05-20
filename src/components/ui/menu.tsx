import React from "react";
import clsx from "clsx";
import { Text } from "../atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({ children, className }) => {
  return <div className={clsx("flex flex-col gap-1", className)}>{children}</div>;
};

interface MenuItemProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  variant?: "default" | "danger";
  className?: string;
  hideIconContainer?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  description,
  onClick,
  rightElement,
  variant = "default",
  className,
  hideIconContainer = false,
}) => {
  const isDanger = variant === "danger";
  const isStringIcon = typeof icon === "string";

  const defaultRightElement = (
    <FontAwesomeIcon
      icon={faChevronRight}
      className={clsx(
        "text-[10px] shrink-0 transition-colors",
        isDanger ? "text-red-500/50" : "text-text-fourth",
      )}
    />
  );

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left w-full group",
        "hover:bg-bg-third hover:scale-[1.01]",
        "active:scale-[0.99]",
        className,
      )}
    >
      {icon && (
        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all",
            !hideIconContainer &&
              (isDanger ? "bg-red-500/10 text-red-500" : "bg-primary-500/10 text-primary-500"),
            "group-hover:scale-[1.02]",
          )}
        >
          {isStringIcon ? <i className={icon as string} /> : icon}
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Text weight="medium" color={isDanger ? "danger" : "primary"}>
          {title}
        </Text>
        {description && (
          <Text sz="xs" className="text-text-third leading-tight truncate">
            {description}
          </Text>
        )}
      </div>
      {rightElement || defaultRightElement}
    </button>
  );
};

interface MenuSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ title, children, className }) => {
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      {title && (
        <div className="px-3 py-2">
          <Text sz="xs" weight="bold" className="text-text-third uppercase tracking-wider">
            {title}
          </Text>
        </div>
      )}
      {children}
    </div>
  );
};
