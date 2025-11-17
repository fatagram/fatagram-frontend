import { forwardRef } from "react";
import { Size } from "@/components/common/types/size";
import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

// Define a mapping of button sizes
const buttonSizes: Record<Size, string> = {
  xs: "px-2 py-1 text-xs",
  "sm-1": "px-4 py-2 text-sm ",
  "sm-2": "px-5 py-2 text-sm ",
  "sm-3": "px-6 py-2 text-sm ",
  "md-1": "px-6 py-3 text-base ",
  "md-2": "px-8 py-3 text-base ",
  "md-3": "px-10 py-3 text-base ",
  "lg-1": "px-8 py-4 text-base ",
  "lg-2": "px-10 py-4 text-base ",
  "lg-3": "px-12 py-4 text-base ",
  "xl-1": "px-10 py-5 text-xl ",
  "xl-2": "px-12 py-6 text-2xl ",
  "xl-3": "px-14 py-7 text-3xl ",
};

const buttonVariants = {
  primary: "bg-gradient-main text-white hover:bg-gradient-main-move",
  secondary: "bg-bg-second transition-all duration-200 ease text-text-main hover:bg-bg-second/70",
  third: "bg-bg-third transition-all duration-200 ease text-text-main hover:bg-bg-third/70",
  fourth: "bg-bg-fourth transition-all duration-200 ease text-text-main hover:bg-bg-fourth/70",
};

type Variant = keyof typeof buttonVariants;

// ButtonProps interface
interface ButtonProps extends ComponentProps<HTMLButtonElement> {
  variant?: Variant;
}

// Button component
// This component is a button component that can be used in the application.

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { onClick, variant = "primary", sz = "lg-1", className, children, disabled = false, ...props },
    ref,
  ) => {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={clsx(
          buttonSizes[sz],
          "font-normal rounded-xl select-none",
          {
            "bg-bg-disabled text-text-fourth": disabled,
            [buttonVariants[variant]]: !disabled,
            "active:scale-[0.98] active:opacity-80": !disabled,
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export { Button };
