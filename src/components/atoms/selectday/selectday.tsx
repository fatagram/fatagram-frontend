import React from "react";
import clsx from "clsx";
import { ComponentProps } from "@/components/common/types/component-type";

interface SelectDayProps extends Omit<ComponentProps<HTMLInputElement>, "type"> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SelectDay: React.FC<SelectDayProps> = ({
  title,
  isRequired = false,
  isWrong = false,
  wrongMessage,
  className,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {title && (
        <div className="flex items-center gap-1 ml-1">
          <label className="text-sm text-text-secondary font-medium">{title}</label>
          {isRequired && <span className="text-red-400">*</span>}
        </div>
      )}
      <input
        type="date"
        value={value}
        onChange={onChange}
        className={clsx(
          "border-[2px] text-text-main font-normal rounded-xl outline-none",
          "text-lg caret-primary-500 selection:!bg-primary-600",
          "transition-all duration-300 ease-out",
          "px-3 py-1 text-[13px] shadow-sm",
          "bg-bg-fourth border-border-main",
          "focus:ring-2 focus:ring-primary-500",
          isWrong && "border-error",
          className,
        )}
        max={new Date().toISOString().split("T")[0]}
        {...props}
      />
      {isWrong && wrongMessage && <span className="text-xs text-error ml-1">{wrongMessage}</span>}
    </div>
  );
};
