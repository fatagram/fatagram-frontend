import { forwardRef } from "react";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

export type Size = "sm" | "md" | "lg" | "xl";

const buttonSizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl",
};

export type ButtonVariant = "primary" | "secondary" | "third" | "fourth";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-gradient-main text-white hover:bg-gradient-main-move",
  secondary: "bg-bg-second text-text-main hover:bg-bg-second/70",
  third: "bg-bg-third text-text-main hover:bg-bg-third/70",
  fourth: "bg-bg-fourth text-text-main hover:bg-bg-fourth/70",
};

export interface ButtonProps extends ComponentProps<HTMLButtonElement> {
  variant?: ButtonVariant;
  sz?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", sz = "md", className, disabled = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={clsx(
          "font-normal rounded-xl select-none transition-all duration-200 ease-out",
          buttonSizes[sz],
          disabled
            ? "bg-bg-disabled text-text-fourth cursor-not-allowed opacity-60"
            : [buttonVariants[variant], "active:scale-[0.99] active:opacity-80 cursor-pointer"],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
