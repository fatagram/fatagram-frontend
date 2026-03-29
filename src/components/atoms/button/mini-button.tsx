import { forwardRef } from "react";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

// Ép về 4 standard sizes (kích cỡ chuẩn)
export type Size = "sm" | "md" | "lg" | "xl";

// Dùng class chuẩn của Tailwind, loại bỏ hoàn toàn padding (px, py) vì đã có Flexbox center
const buttonSizes: Record<Size, string> = {
  sm: "w-8 h-8 text-sm", // 32px
  md: "w-10 h-10 text-base", // 40px
  lg: "w-12 h-12 text-lg", // 48px
  xl: "w-14 h-14 text-xl", // 56px
};

export type ButtonVariant = "primary" | "secondary";

// Gom nhóm các styles (định dạng) không bị trùng lặp
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "text-text-main hover:bg-bg-fourth",
  secondary: "bg-bg-second text-text-main hover:bg-bg-second/70",
};

export interface MiniButtonProps extends ComponentProps<HTMLButtonElement> {
  variant?: ButtonVariant;
  sz?: Size;
}

const MiniButton = forwardRef<HTMLButtonElement, MiniButtonProps>(
  (
    { onClick, variant = "primary", sz = "md", className, children, disabled = false, ...props },
    ref,
  ) => {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        className={clsx(
          "rounded-full select-none flex items-center justify-center font-normal",
          "transition-all duration-300 ease-out", // Đặt transition ở 1 nơi duy nhất
          buttonSizes[sz],
          disabled
            ? "bg-bg-disabled text-text-fourth cursor-not-allowed opacity-60"
            : [buttonVariants[variant], "active:scale-[0.98] active:opacity-80 cursor-pointer"],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

MiniButton.displayName = "MiniButton";
export { MiniButton };
