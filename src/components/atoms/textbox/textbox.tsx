import React from "react";
import clsx from "clsx";
import styles from "./textbox.module.css";
import { Size } from "../../common/types/size";
import { ComponentProps } from "@/components/common/types/component-type";

const sizeClasses: Record<Size, { mainText: string; titleText: string }> = {
  xs: { mainText: "px-2 py-1 text-xs", titleText: "text-xs" },
  "sm-1": { mainText: "px-3 py-1 text-[13px] ", titleText: "text-sm" },
  "sm-2": { mainText: "px-4 py-2 text-[13px] ", titleText: "text-sm" },
  "sm-3": { mainText: "px-5 py-2 text-[13px] ", titleText: "text-sm" },
  "md-1": { mainText: "px-6 py-3 text-base ", titleText: "text-base" },
  "md-2": { mainText: "px-7 py-3 text-base ", titleText: "text-base" },
  "md-3": { mainText: "px-8 py-4 text-base ", titleText: "text-base" },
  "lg-1": { mainText: "px-8 py-4 text-base ", titleText: "text-base" },
  "lg-2": { mainText: "px-9 py-4 text-base ", titleText: "text-base" },
  "lg-3": { mainText: "px-10 py-5 text-base ", titleText: "text-base" },
  "xl-1": { mainText: "px-10 py-5 text-xl ", titleText: "text-xl" },
  "xl-2": { mainText: "px-12 py-6 text-2xl ", titleText: "text-2xl" },
  "xl-3": { mainText: "px-14 py-7 text-3xl ", titleText: "text-3xl" },
};

// TextboxProps interface
export interface TextboxProps extends ComponentProps<HTMLInputElement> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  wrapperClassName?: string;
}

// Textbox component
// This component is a textbox component that can be used in the application.
export const Textbox = React.forwardRef<HTMLInputElement, TextboxProps>(
  (
    {
      disabled = false,
      isWrong = false,
      wrongMessage,
      title,
      isRequired = false,
      className,
      sz = "sm-1",
      type = "text",
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const typeOfText =
      type === "text"
        ? "text"
        : type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type === "search"
        ? "search"
        : type;
    return (
      <div className={clsx(wrapperClassName)}>
        <div className={clsx("relative")}>
          {title && (
            <div
              className={clsx(
                "flex items-center gap-1 ml-1 mb-1 font-medium",
                sizeClasses[sz].titleText,
              )}
            >
              <label htmlFor={title}>{title}</label>
              {isRequired && <span className="text-red-400">*</span>}
            </div>
          )}
          <input
            type={typeOfText}
            ref={ref}
            className={clsx(
              "border-[2px] text-text-main",
              "font-normal rounded-xl outline-none text-lg caret-primary-500 selection:!bg-primary-600",
              "transition-all duration-300 ease-out",
              {
                "pl-10": type === "search",
                "bg-bg-main opacity-60 cursor-not-allowed": disabled,
                "focus:bg-gradient-main-move": !disabled,
                [styles["primary-textbox-wrong"]]: isWrong && !disabled,
                [styles["primary-textbox"]]: !isWrong && !disabled,
              },
              sizeClasses[sz].mainText,
              className,
            )}
            disabled={disabled}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              className={clsx("absolute right-0 top-1/2 -translate-y-1/2 mr-5")}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className={clsx("fa-solid fa-eye text-secondary-500")}></i>
              ) : (
                <i className={clsx("fa-solid fa-eye-slash text-text-main")}></i>
              )}
            </button>
          )}
          {type === "search" && (
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-text-main" />
          )}
        </div>
        {isWrong && <span className="text-red-400">{wrongMessage}</span>}
      </div>
    );
  },
);
Textbox.displayName = "Textbox";
