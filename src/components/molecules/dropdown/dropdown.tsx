import { Button } from "@/components/atoms";
import React from "react";
import clsx from "clsx";

export interface DropdownItem {
  id: string;
  content: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  isShow: boolean;
  onSelect?: (item: DropdownItem) => void;
  showPolygon?: boolean;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  isShow,
  onSelect,
  showPolygon = true,
  className,
  ref,
}) => {
  if (!isShow) return null;

  return (
    <div className={clsx("rounded-2xl p-2 bg-bg-seventh", className)} ref={ref}>
      {showPolygon && (
        <div
          className={clsx(
            "absolute hidden sm:flex sm:-top-2 sm:left-[10%] -translate-x-1/2 w-0 h-0",
            "border-l-8 border-l-transparent",
            "border-r-8 border-r-transparent",
            "border-b-8 border-b-bg-seventh rounded-sm",
          )}
        ></div>
      )}
      <ul className="flex flex-col gap-1 w-full">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              item.onClick?.();
              onSelect?.(item);
            }}
            className={clsx(
              "w-full text-left px-3 py-2 !rounded-md text-sm",
              "hover:bg-bg-fourth cursor-pointer select-none",
            )}
          >
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
