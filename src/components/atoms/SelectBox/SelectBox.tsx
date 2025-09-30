import React, { RefObject } from "react";
import Label from "../text";
import useClickOutside from "@/hooks/use-click-outside";
import { ComponentProps } from "@/components/common/types/component-type";

export type OptionKey = string | number | boolean;

export type Option = {
  key: OptionKey;
  value: string | React.ReactNode;
};

interface SelectBoxProps extends Omit<ComponentProps, "onSelect"> {
  options: Option[];
  selectedOption: string;
  onSelect: (option: OptionKey) => void;
}

const SelectBox: React.FC<SelectBoxProps> = ({ options, selectedOption, onSelect, className }) => {
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
    <div className={`relative ${className}`}>
      <button ref={btnRef} className="w-full">
        <div
          className={`flex items-center justify-between cursor-pointer bg-[var(--fourth-bg-color)] 
                        px-4 py-2 rounded-xl shadow-md gap-5 hover:bg-[var(--second-bg-color)]`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Label sz="md-2">{options.find((opt) => opt.key === selected)?.value}</Label>
          <i className="fa-solid fa-caret-down"></i>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute w-full animate-dropdown-slide bg-[var(--fourth-bg-color)] rounded-lg shadow-md mt-1 z-50"
          ref={selectBoxRef}
        >
          <ul className="p-1">
            {options.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-[var(--second-bg-color)] cursor-pointer rounded-lg"
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
      )}
    </div>
  );
};

export default SelectBox;
