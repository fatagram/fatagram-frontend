import React from "react";
import clsx from "clsx";
import { useMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import Dropdown from "../atoms/dropdown";
import { DropdownProps } from "../atoms/dropdown/dropdown";

export interface DropdownItem {
  id: string;
  content: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface SmartDropdownProps extends DropdownProps {
  onClose: () => void;
  title?: string;
}

export function SmartDropdown(props: SmartDropdownProps) {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <BottomSheet
        open={props.isShow}
        onOpenChange={(open) => !open && props.onClose()}
        trigger={<span className="hidden" />}
        title={props.title || "Options"}
      >
        <ul className="flex flex-col w-full pb-6 px-2 gap-1">
          {props.items.map((item, index) => (
            <li
              key={item.id || index}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                props.onSelect?.(item);
                props.onClose();
              }}
              className={clsx(
                "w-full text-left px-4 py-3 rounded-xl text-base transition-colors",
                item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-bg-hover active:bg-bg-fourth cursor-pointer select-none",
              )}
            >
              {item.content}
            </li>
          ))}
        </ul>
      </BottomSheet>
    );
  }

  return <Dropdown {...props} />;
}
