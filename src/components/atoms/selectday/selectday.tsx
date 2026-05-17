import { useId, forwardRef } from "react";
import clsx from "clsx";
import { ComponentProps } from "@/components/common/component-type";

export type Size = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<Size, { mainText: string; titleText: string }> = {
  sm: { mainText: "px-3 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-4 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-6 py-4 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-8 py-5 text-xl", titleText: "text-xl" },
};

export interface SelectDayProps extends Omit<ComponentProps<HTMLInputElement>, "type"> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  sz?: Size;
}

export const SelectDay = forwardRef<HTMLInputElement, SelectDayProps>(
  (
    {
      title,
      isRequired = false,
      isWrong = false,
      wrongMessage,
      className,
      sz = "md",
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const inputId = useId();

    return (
      <div className="flex flex-col gap-1 w-full">
        {title && (
          <label
            htmlFor={inputId}
            className={clsx(
              "flex items-center gap-1 ml-1 font-medium text-text-secondary",
              sizeClasses[sz].titleText,
            )}
          >
            {title}
            {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type="date"
          ref={ref}
          disabled={disabled}
          className={clsx(
            "w-full border-[2px] text-text-main font-normal rounded-xl outline-none",
            "caret-primary-500 shadow-sm",
            "transition-all duration-300 ease-out",
            sizeClasses[sz].mainText,
            disabled
              ? "bg-bg-second opacity-60 cursor-not-allowed"
              : "bg-bg-fourth border-border-main focus:ring-2 focus:ring-primary-500",
            isWrong && "border-red-400",
            className,
          )}
          {...props}
        />
        {isWrong && wrongMessage && (
          <span className="text-sm text-red-400 ml-1">{wrongMessage}</span>
        )}
      </div>
    );
  },
);

SelectDay.displayName = "SelectDay";
