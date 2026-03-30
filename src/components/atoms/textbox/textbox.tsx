import { useId, useState, forwardRef } from "react";
import clsx from "clsx";
import styles from "./textbox.module.css";
import { ComponentProps } from "@/components/common/component-type";

// Thu gọn hệ thống kích thước
export type Size = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<Size, { mainText: string; titleText: string }> = {
  sm: { mainText: "px-2 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-2 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-3 py-5 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-4 py-6 text-xl", titleText: "text-xl" },
};

export interface TextboxProps extends ComponentProps<HTMLInputElement> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  wrapperClassName?: string;
  placeholder?: string;
  sz?: Size;
  type: "text" | "password" | "search" | "email" | "number";
}

export const Textbox = forwardRef<HTMLInputElement, TextboxProps>(
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
      type,
      disabled,
      value,
      onChange,
      autoComplete = "off",
      ...props
    },
    ref,
  ) => {
    const inputId = useId();
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const typeOfText = type === "password" ? (showPassword ? "text" : "password") : type;

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

        <div className="relative w-full">
          {type === "search" && (
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 z-10" />
          )}

          <input
            id={inputId}
            type={typeOfText}
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={clsx(
              "w-full border-[2px] text-text-main",
              "font-normal rounded-xl outline-none caret-primary-500 selection:!bg-primary-600",
              "transition-all duration-300 ease-out",
              sizeClasses[sz].mainText,
              {
                "pl-10": type === "search",
                "pr-12": type === "password",
                "bg-bg-main opacity-60 cursor-not-allowed": disabled,
                "focus:bg-gradient-main-move": !disabled,
                [styles["primary-textbox-wrong"]]: isWrong && !disabled,
                [styles["primary-textbox"]]: !isWrong && !disabled,
              },
              className,
            )}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={clsx(
                  "fa-solid",
                  showPassword ? "fa-eye text-secondary-500" : "fa-eye-slash text-text-main",
                )}
              />
            </button>
          )}
        </div>

        {isWrong && wrongMessage && (
          <span className="text-red-400 text-sm ml-1">{wrongMessage}</span>
        )}
      </div>
    );
  },
);

Textbox.displayName = "Textbox";
