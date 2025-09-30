import { Button } from "@/components/atoms";
import React from "react";

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
    <div className={`${className}`} ref={ref}>
      {showPolygon && (
        <div
          className="absolute hidden sm:flex sm:-top-2 sm:left-[10%] -translate-x-1/2 w-0 h-0 
                                                    border-l-8 border-l-transparent 
                                                    border-r-8 border-r-transparent 
                                                    border-b-8 border-b-[var(--main-bg-color)] rounded-sm"
        ></div>
      )}
      <ul className="flex flex-col gap-2 w-full">
        {items.map((item, index) => (
          <li key={index}>
            <Button
              size="md-1"
              variant="third"
              className="w-full text-left pl-3"
              onClick={() => {
                item.onClick?.();
                onSelect?.(item);
              }}
            >
              {item.content}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
