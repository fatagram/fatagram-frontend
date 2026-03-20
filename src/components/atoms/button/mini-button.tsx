import { forwardRef } from "react";
import { Size } from "@/components/common/size";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

// Define a mapping of button sizes
const buttonSizes: Record<Size, string> = {
  "xs-1": "w-[24px] h-[24px] px-2 py-1 text-xs",
  "xs-2": "w-[28px] h-[28px] px-2 py-2 text-xs",
  "xs-3": "w-[32px] h-[32px] px-2 py-2 text-sm",
  "sm-1": "w-[36px] h-[36px] px-4 py-4 text-sm ",
  "sm-2": "w-[40px] h-[40px] px-5 py-5 text-sm ",
  "sm-3": "w-[44px] h-[44px] px-6 py-6 text-sm ",
  "md-1": "w-[48px] h-[48px] px-6 py-6 text-base ",
  "md-2": "w-[56px] h-[56px] px-8 py-8 text-base ",
  "md-3": "w-[64px] h-[64px] px-10 py-10 text-base ",
  "lg-1": "w-[56px] h-[56px] px-8 py-8 text-base ",
  "lg-2": "w-[64px] h-[64px] px-10 py-10 text-base ",
  "lg-3": "w-[72px] h-[72px] px-12 py-12 text-base ",
  "xl-1": "w-[64px] h-[64px] px-10 py-10 text-xl ",
  "xl-2": "w-[72px] h-[72px] px-12 py-12 text-2xl ",
  "xl-3": "w-[80px] h-[80px] px-14 py-14 text-3xl ",
};

const buttonVariants = {
  primary: "text-white hover:bg-gray-700/30",
  secondary: "bg-bg-second transition-all duration-200 ease text-text-main hover:bg-bg-second/70",
};

type Variant = keyof typeof buttonVariants;

// ButtonProps interface
interface ButtonProps extends ComponentProps<HTMLButtonElement> {
  variant?: Variant;
}

// Button component
// This component is a button component that can be used in the application.

const MiniButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
          "font-normal rounded-full select-none flex items-center justify-center transition-all duration-300 ease-out",
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

MiniButton.displayName = "MiniButton";
export { MiniButton };
