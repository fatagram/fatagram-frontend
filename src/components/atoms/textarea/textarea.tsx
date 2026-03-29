import { forwardRef, useId } from "react";
import clsx from "clsx";
import styles from "./textarea.module.css";
import { ComponentProps } from "@/components/common/component-type";

// Cần đồng bộ type Size này với Textbox
export type Size = "sm" | "md" | "lg" | "xl";

// Đồng bộ cấu trúc với Textbox, thêm min-h cho TextArea
const sizeClasses: Record<Size, { mainText: string; titleText: string }> = {
  sm: { mainText: "px-3 py-2 text-sm min-h-20", titleText: "text-sm" },
  md: { mainText: "px-4 py-3 text-base min-h-24", titleText: "text-base" },
  lg: { mainText: "px-6 py-4 text-lg min-h-32", titleText: "text-lg" },
  xl: { mainText: "px-8 py-5 text-xl min-h-40", titleText: "text-xl" },
};

export interface TextAreaProps extends ComponentProps<HTMLTextAreaElement> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  wrapperClassName?: string;
  sz?: Size;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      disabled = false,
      isWrong = false,
      wrongMessage,
      title,
      isRequired = false,
      className,
      sz = "md",
      wrapperClassName,
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
          className={clsx(
            "w-full border-[2px] text-text-main resize-none",
            "font-normal rounded-xl outline-none caret-primary-500 selection:!bg-primary-600",
            "transition-all duration-300 ease-out",
            sizeClasses[sz].mainText,
            disabled ? "bg-bg-second opacity-60 cursor-not-allowed" : "focus:bg-gradient-main-move",
            isWrong ? styles["my-textarea-wrong"] : styles["my-textarea"],
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
