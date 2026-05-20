import { useEffect, useState } from "react";
import clsx from "clsx";
import { SelectBox, SelectBoxProps } from "../atoms";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BottomSheet } from "./bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const sizeClasses: Record<string, { main: string; text: string }> = {
  sm: { main: "px-3 py-2", text: "text-sm" },
  md: { main: "px-4 py-3", text: "text-base" },
  lg: { main: "px-6 py-4", text: "text-lg" },
  xl: { main: "px-8 py-5", text: "text-xl" },
};

interface Props extends SelectBoxProps {}

export function SmartSelectBox({
  title,
  showTitle = true,
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
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const matches = useMediaQuery("(max-width: 640px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMobile = mounted ? matches : false;

  if (isMobile) {
    const selectedItem = options.find((opt) => opt.key === selectedOption);

    return (
      <div className="relative w-fit select-none">
        {showTitle && title && (
          <label
            className={clsx(
              "flex items-center gap-1 mb-1 ml-1 font-medium text-text-secondary",
              sizeClasses[sz]?.text || sizeClasses["md"].text,
            )}
          >
            {title}
            {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}

        <BottomSheet
          open={isOpen}
          onOpenChange={setIsOpen}
          title={title}
          trigger={
            <button
              type="button"
              disabled={disabled}
              className={clsx(
                "w-full flex items-center justify-between",
                "border-[2px] border-transparent rounded-xl outline-none transition-all duration-300",
                sizeClasses[sz]?.main || sizeClasses["md"].main,
                sizeClasses[sz]?.text || sizeClasses["md"].text,
                disabled
                  ? "bg-bg-second opacity-60 cursor-not-allowed"
                  : "bg-bg-fourth shadow-sm hover:bg-bg-hover focus:border-primary-500",
                className,
              )}
            >
              <span className="truncate">{selectedItem ? selectedItem.value : "Select..."}</span>
              <FontAwesomeIcon
                icon={faCaretDown}
                className={clsx("transition-transform", isOpen && "rotate-180")}
              />
            </button>
          }
        >
          <ul className="p-1 pb-6">
            {options.map((item) => (
              <li
                key={String(item.key)}
                className={clsx(
                  "px-4 py-4 cursor-pointer rounded-lg transition-colors truncate",
                  sizeClasses[sz]?.text || sizeClasses["md"].text,
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
        </BottomSheet>
      </div>
    );
  }

  return (
    <SelectBox
      title={title}
      showTitle={showTitle}
      isRequired={isRequired}
      options={options}
      selectedOption={selectedOption}
      onSelect={onSelect}
      optionClassName={optionClassName}
      optionActiveClassName={optionActiveClassName}
      dropdownClassName={dropdownClassName}
      className={clsx("w-full", className)}
      sz={sz}
      disabled={disabled}
      {...props}
    />
  );
}
