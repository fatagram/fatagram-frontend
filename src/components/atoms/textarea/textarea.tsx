import { forwardRef, useId } from "react";
import clsx from "clsx";
import styles from "./textarea.module.css";
import { ComponentProps } from "@/components/common/component-type";

// Cần đồng bộ type Size này với Textbox
export type Size = "sm" | "md" | "lg" | "xl";

// Đồng bộ cấu trúc với Textbox, thêm min-h cho TextArea
const sizeClasses: Record<Size, { mainText: string; titleText: string }> = {
  sm: { mainText: "px-2 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-2 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-3 py-5 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-4 py-6 text-xl", titleText: "text-xl" },
};

export interface TextAreaProps extends ComponentProps<HTMLTextAreaElement> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  wrapperClassName?: string;
  placeholder?: string;
  sz?: Size;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      isWrong = false,
      wrongMessage,
      title,
      isRequired = false,
      className,
      sz = "md",
      wrapperClassName,
      placeholder,
      disabled,
      value,
      onChange,
      autoComplete = "off",
      rows = 1,
      ...props
    },
    ref,
  ) => {
    const inputId = useId();

    return (
      <div className={clsx(wrapperClassName, "flex flex-col gap-1")}>
        {title && (
          <label
            htmlFor={inputId}
            className={clsx("flex items-center gap-1 ml-1 font-medium", sizeClasses[sz].titleText)}
          >
            {title}
            {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}

        <textarea
          id={inputId}
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          rows={rows}
          className={clsx(
            "w-full border-[2px] text-text-main resize-none",
            "font-normal rounded-xl outline-none caret-primary-500 selection:!bg-primary-600",
            "transition-all duration-300 ease-out",
            sizeClasses[sz].mainText,
            {
              "bg-bg-main opacity-60 cursor-not-allowed": disabled,
              "focus:bg-gradient-main-move": !disabled,
              [styles["my-textarea-wrong"]]: isWrong && !disabled,
              [styles["my-textarea"]]: !isWrong && !disabled,
            },
            className,
          )}
          {...props}
        />

        {isWrong && wrongMessage && (
          <span className="text-red-400 text-sm ml-1">{wrongMessage}</span>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
