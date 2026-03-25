import React, { RefObject, useEffect } from "react";
import useClickOutside from "@/hooks/use-click-outside";
import { ComponentProps } from "@/components/common/component-type";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";

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

  // prevent background scroll when mobile sheet is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [isOpen]);

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

      <Transition
        animation={AnimationLib.DropdownSlide}
        show={isOpen}
        duration={100}
        className="hidden sm:block"
      >
        <div
          className={clsx(
            "absolute w-full ",
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

      {/* Mobile: overlay + bottom sheet */}
      <Transition animation={AnimationLib.Fade} show={isOpen} duration={100} className="sm:hidden">
        <div className="fixed inset-0 bg-bg-fourth/60 z-[9998]" onClick={() => setIsOpen(false)} />
      </Transition>

      {isOpen && <div className="sm:hidden fixed inset-0 z-[9998] bg-black/50" />}

      <Transition
        animation={AnimationLib.SlideUp}
        show={isOpen}
        duration={200}
        className="sm:hidden fixed left-0 right-0 bottom-0 z-[9999]"
      >
        <div
          ref={selectBoxRef}
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "bg-bg-card rounded-t-2xl shadow-md border border-border-main",
            "max-h-[72vh] overflow-auto",
            dropdownClassName,
          )}
        >
          <div className="w-14 h-1.5 bg-border-main/30 rounded-full mx-auto mt-3 mb-2" />

          <div className="px-6 pb-2 pt-1">
            <div className="text-center text-base font-medium text-text-primary">
              {title ? `${title}` : "Select"}
            </div>
          </div>

          <ul className="py-2">
            {options.map((item, index) => (
              <li
                key={index}
                className={clsx(
                  "px-6 py-4 hover:bg-bg-hover/60",
                  "cursor-pointer transition-colors",
                  optionClassName,
                  selected === item.key &&
                    (optionActiveClassName ?? "bg-bg-hover/80 text-text-primary"),
                )}
                onClick={() => {
                  setSelected(item.key);
                  onSelect(item.key);
                  setIsOpen(false);
                }}
              >
                <div className="text-base">{item.value}</div>
              </li>
            ))}
          </ul>

          <div className="h-6" />
        </div>
      </Transition>
    </div>
  );
};
