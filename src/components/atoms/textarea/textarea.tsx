import React, { forwardRef } from "react";
import styles from "./textarea.module.css";
import { Size } from "../../common/size";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

const sizeClasses: Record<Size, string> = {
  "xs-1": "px-2 py-1 text-xs min-h-16",
  "xs-2": "px-2 py-1 text-xs min-h-16",
  "xs-3": "px-2 py-1 text-xs min-h-16",
  "sm-1": "px-3 py-1 text-[16px] min-h-24",
  "sm-2": "px-4 py-2 text-[13px] min-h-24",
  "sm-3": "px-5 py-2 text-[13px] min-h-24",
  "md-1": "px-6 py-3 text-base min-h-28",
  "md-2": "px-7 py-3 text-base min-h-28",
  "md-3": "px-8 py-4 text-base min-h-32",
  "lg-1": "px-8 py-4 text-base min-h-32",
  "lg-2": "px-9 py-4 text-base min-h-32",
  "lg-3": "px-10 py-5 text-base min-h-32",
  "xl-1": "px-10 py-5 text-xl min-h-32",
  "xl-2": "px-12 py-6 text-2xl min-h-32",
  "xl-3": "px-14 py-7 text-3xl min-h-32",
};

interface TextAreaProps extends ComponentProps<HTMLTextAreaElement> {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isWrong?: boolean;
  sz?: Size;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      placeholder,
      onChange,
      value,
      disabled = false,
      isWrong = false,
      className,
      sz = "sm-1",
      autoComplete = "off",
      name = "",
      ...props
    },
    ref,
  ) => {
    return (
      <textarea
        name={name}
        value={value}
        ref={ref}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          "border-2 text-text-main resize-none",
          "font-normal rounded-[15px] outline-none text-lg caret-primary-500 selection:!bg-primary-600",
          "transition-all duration-300 ease-out",
          disabled ? "bg-bg-second opacity-60 cursor-not-allowed" : "focus:bg-gradient-main-move",
          sizeClasses[sz],
          isWrong ? styles["my-textarea-wrong"] : styles["my-textarea"],
          className,
        )}
        {...props}
      />
    );
  },
);

TextArea.displayName = "TextArea";
