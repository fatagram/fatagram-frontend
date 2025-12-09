import React, { RefObject } from "react";
import useClickOutside from "@/hooks/use-click-outside";
import { ComponentProps } from "@/components/common/types/component-type";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import Transition, { AnimationLib } from "@/components/utils/transition";

export type OptionKey = string | number | boolean;

export type Option = {
  key: OptionKey;
  value: string | React.ReactNode;
};

interface SelectBoxProps extends Omit<ComponentProps, "onSelect"> {
  title?: string;
  isRequired?: boolean;
  optionClassName?: string;
  optionActiveClassName?: string;
  dropdownClassName?: string;
  options: Option[];
  selectedOption: OptionKey;
  onSelect: (option: OptionKey) => void;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  title,
  isRequired = false,
  options,
  selectedOption,
  onSelect,
  optionClassName,
  optionActiveClassName,
  dropdownClassName,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<OptionKey>(selectedOption);
  const selectBoxRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  useClickOutside(
    selectBoxRef as RefObject<HTMLDivElement>,
    btnRef as RefObject<HTMLButtonElement>,
    () => {
      if (isOpen) setIsOpen(false);
    },
  );

  return (
    <div className={clsx("relative")}>
      {title && (
        <div className="flex items-center gap-1 mb-1 ml-1">
          <label className="text-sm text-text-secondary font-medium">{title}</label>
          {isRequired && <span className="text-red-400">*</span>}
        </div>
      )}
      <button ref={btnRef} className={clsx("w-full", className)}>
        <div
          className={clsx(
            "flex items-center justify-between cursor-pointer",
            "bg-bg-fourth px-4 py-2 text-[13px] rounded-xl shadow-md gap-5",
            "hover:bg-bg-hover transition-colors",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Text sz="md-2">{options.find((opt) => opt.key === selected)?.value}</Text>
          <i className="fa-solid fa-caret-down"></i>
        </div>
      </button>

      <Transition animation={AnimationLib.DropdownSlide} show={isOpen} duration={100}>
        <div
          className={clsx(
            "absolute w-full",
            "bg-bg-card rounded-lg shadow-md mt-1 z-50 border border-border-main",
            dropdownClassName,
          )}
          ref={selectBoxRef}
        >
          <ul className="p-1">
            {options.map((item, index) => (
              <li
                key={index}
                className={clsx(
                  "px-4 py-2 hover:bg-bg-hover",
                  "cursor-pointer rounded-lg transition-colors",
                  optionClassName,
                  selected === item.key && optionActiveClassName,
                )}
                onClick={() => {
                  setSelected(item.key);
                  onSelect(item.key);
                  setIsOpen(false);
                }}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      </Transition>
    </div>
  );
};
