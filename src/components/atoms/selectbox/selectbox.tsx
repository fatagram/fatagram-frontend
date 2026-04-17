import React, { useId, useEffect, useRef, useState, RefObject } from "react";
import useClickOutside from "@/hooks/use-click-outside";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { useMediaQuery } from "@/hooks/use-media-query";

export type OptionKey = string | number | boolean;

export type Option = {
  key: OptionKey;
  value: string | React.ReactNode;
};

export type Size = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<Size, { main: string; text: string }> = {
  sm: { main: "px-3 py-2", text: "text-sm" },
  md: { main: "px-4 py-3", text: "text-base" },
  lg: { main: "px-6 py-4", text: "text-lg" },
  xl: { main: "px-8 py-5", text: "text-xl" },
};

interface SelectBoxProps extends Omit<ComponentProps<HTMLButtonElement>, "onSelect"> {
  title?: string;
  isRequired?: boolean;
  optionClassName?: string;
  optionActiveClassName?: string;
  dropdownClassName?: string;
  options: Option[];
  selectedOption: OptionKey;
  onSelect: (option: OptionKey) => void;
  sz?: Size;
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
  sz = "md",
  disabled = false,
  ...props
}) => {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const desktopDropdownRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  useClickOutside(
    desktopDropdownRef as RefObject<HTMLDivElement>,
    btnRef as RefObject<HTMLButtonElement>,
    () => {
      if (isOpen) setIsOpen(false);
    },
    !isMobile,
  );

  const selectedItem = options.find((opt) => opt.key === selectedOption);

  return (
    <div className="relative">
      {title && (
        <label
          htmlFor={selectId}
          className={clsx(
            "flex items-center gap-1 mb-1 ml-1 font-medium text-text-secondary",
            sizeClasses[sz].text,
          )}
        >
          {title}
          {isRequired && <span className="text-red-400">*</span>}
        </label>
      )}

      <button
        id={selectId}
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center justify-between",
          "border-[2px] border-transparent rounded-xl outline-none transition-all duration-300",
          sizeClasses[sz].main,
          sizeClasses[sz].text,
          disabled
            ? "bg-bg-second opacity-60 cursor-not-allowed"
            : "bg-bg-fourth shadow-sm hover:bg-bg-hover focus:border-primary-500",
          className,
        )}
        {...props}
      >
        <span className="truncate">{selectedItem ? selectedItem.value : "Select..."}</span>
        <i
          className={clsx("fa-solid fa-caret-down transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <Transition
        animation={AnimationLib.DropdownSlide}
        show={isOpen}
        duration={100}
        className="hidden sm:block absolute w-full z-50 mt-1"
      >
        <div
          ref={desktopDropdownRef as RefObject<HTMLDivElement>}
          className={clsx(
            "bg-bg-card rounded-xl shadow-lg border border-border-main overflow-hidden",
            dropdownClassName,
          )}
        >
          <ul className="max-h-60 overflow-y-auto p-1">
            {options.map((item) => (
              <li
                key={String(item.key)}
                className={clsx(
                  "px-4 py-2 cursor-pointer rounded-lg transition-colors truncate",
                  sizeClasses[sz].text,
                  optionClassName,
                  selectedOption === item.key
                    ? optionActiveClassName || "bg-primary-500/10 text-primary-600 font-medium"
                    : "hover:bg-bg-hover",
                )}
                onClick={() => {
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

      <Transition
        animation={AnimationLib.SoftFade}
        show={isOpen}
        duration={200}
        className="fixed inset-0 sm:hidden"
      >
        <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={() => setIsOpen(false)} />
      </Transition>

      <Transition
        animation={AnimationLib.SlideUp}
        show={isOpen}
        duration={200}
        className="sm:hidden fixed inset-x-0 bottom-0 z-[9999]"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "bg-bg-card rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.1)] border-t border-border-main",
            "max-h-[72vh] flex flex-col",
            dropdownClassName,
          )}
        >
          <div className="w-12 h-1.5 bg-border-main/50 rounded-full mx-auto mt-3 mb-1 shrink-0" />

          <div className="px-6 py-3 shrink-0 border-b border-border-main/30">
            <div className="text-center text-lg font-semibold text-text-primary">
              {title || "Select Option"}
            </div>
          </div>

          <ul className="py-2 overflow-y-auto">
            {options.map((item) => (
              <li
                key={String(item.key)}
                className={clsx(
                  "px-6 py-4 cursor-pointer transition-colors border-b border-border-main/10 last:border-none",
                  sizeClasses[sz].text,
                  optionClassName,
                  selectedOption === item.key
                    ? optionActiveClassName || "bg-primary-500/10 text-primary-600 font-medium"
                    : "hover:bg-bg-hover/60",
                )}
                onClick={() => {
                  onSelect(item.key);
                  setIsOpen(false);
                }}
              >
                {item.value}
              </li>
            ))}
          </ul>
          <div className="h-6 shrink-0" />
        </div>
      </Transition>
    </div>
  );
};
