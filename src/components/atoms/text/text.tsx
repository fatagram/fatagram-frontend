import { ElementType, forwardRef } from "react";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

const textSizes: Record<Size, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export type TextWeight = "light" | "regular" | "medium" | "bold" | "extrabold";
const weightClasses: Record<TextWeight, string> = {
  light: "font-light",
  regular: "font-[400]",
  medium: "font-medium",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

export type TextColor = "primary" | "secondary" | "danger" | "success" | "warning";
const colorClasses: Record<TextColor, string> = {
  primary: "text-text-main",
  secondary: "text-primary-600",
  danger: "text-red-400",
  success: "text-green-600",
  warning: "text-yellow-600",
};

export interface TextProps extends ComponentProps<HTMLElement> {
  as?: ElementType;
  color?: TextColor;
  weight?: TextWeight;
  wrap?: "whitespace-pre-wrap" | "whitespace-normal" | "whitespace-nowrap";
  sz?: Size;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = "span",
      sz = "md",
      weight = "regular",
      color = "primary",
      wrap = "whitespace-nowrap",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        className={clsx(
          textSizes[sz],
          weightClasses[weight],
          colorClasses[color],
          wrap,
          "break-words",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
