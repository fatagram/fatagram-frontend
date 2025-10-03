import React from "react";
import clsx from "clsx";
import styles from "./Textbox.module.css";
import { Size } from "../../common/types/size";
import { ComponentProps } from "@/components/common/types/component-type";

const sizeClasses: Record<Size, string> = {
  xs: "px-2 py-1 text-xs",
  "sm-1": "px-3 py-1 text-[13px] ",
  "sm-2": "px-4 py-2 text-[13px] ",
  "sm-3": "px-5 py-2 text-[13px] ",
  "md-1": "px-6 py-3 text-base ",
  "md-2": "px-7 py-3 text-base ",
  "md-3": "px-8 py-4 text-base ",
  "lg-1": "px-8 py-4 text-base ",
  "lg-2": "px-9 py-4 text-base ",
  "lg-3": "px-10 py-5 text-base ",
  "xl-1": "px-10 py-5 text-xl ",
  "xl-2": "px-12 py-6 text-2xl ",
  "xl-3": "px-14 py-7 text-3xl ",
};

// TextboxProps interface
export interface TextboxProps extends ComponentProps<HTMLInputElement> {
  isWrong?: boolean;
}

// Textbox component
// This component is a textbox component that can be used in the application.
const Textbox = React.forwardRef<HTMLInputElement, TextboxProps>(
  ({ disabled = false, isWrong = false, className, sz = "sm-1", ...props }, ref) => {
    return (
      <input
        type="text"
        ref={ref}
        className={clsx(
          'border-[2px] text-text-main',
          'font-normal rounded-xl outline-none text-lg caret-secondary-100 selection:!bg-primary-600',
          {
            'bg-bg-main': disabled,
            'focus:bg-gradient-main-move': !disabled,
            [styles["primary-textbox-wrong"]]: isWrong && !disabled,
            [styles["primary-textbox"]]: !isWrong && !disabled,
          },
          sizeClasses[sz],
          className
        )}
        {...props}
      />
    );
  },
);

export default Textbox;
