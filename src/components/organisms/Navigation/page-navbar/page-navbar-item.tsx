import React from "react";
import { useNavigate } from "react-router-dom";
import { useActiveRoute } from "@/hooks/use-active-route";
import { Button, Text } from "@/components/atoms";
import clsx from "clsx";

export type PageNavbarItemProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  path: string;
  className?: string;
  onClick?: () => void;
};

const PageNavbarItem: React.FC<PageNavbarItemProps> = ({
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
      className={clsx("w-full text-left px-1 py-3 rounded-md",
        { "bg-bg-fourth border-x-primary-500 border-x-2" : isFocused },
        { "hover:bg-bg-third transition-all duration-100" : !isFocused },
        className,
      )}
    >
      <div className={clsx("grid grid-cols-10")}>
        <Text sz="md-3" className={clsx("flex justify-center items-center h-full", "col-span-2")}>
          {icon}
        </Text>
        <Text sz="md-1" className={clsx("col-span-8")}>
          {title}
        </Text>
        {description && (
          <Text sz="sm-2" weight="light">
            {description}
          </Text>
        )}
      </div>
    </button>
  );
};

export default PageNavbarItem;
