import React, { ElementType, forwardRef, JSX } from "react";
import { Size } from "../../common/types/size";
import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

// Define a mapping of text sizes
const textSizes: Record<Size, string> = {
  xs: "text-xs",
  "sm-1": "text-xs",
  "sm-2": "text-sm",
  "sm-3": "text-[15px]",
  "md-1": "text-md",
  "md-2": "text-lg",
  "md-3": "text-md",
  "lg-1": "text-xl",
  "lg-2": "text-2xl",
  "lg-3": "text-3xl",
  "xl-1": "text-4xl",
  "xl-2": "text-5xl",
  "xl-3": "text-6xl",
};

// Define a mapping of font weights
const weightClasses: Record<string, string> = {
  light: "font-light",
  regular: "font-normal",
  bold: "font-bold",
  extrabold: "font-extrabold",
};
type Weight = keyof typeof weightClasses;

// Define a mapping of text colors
const colorClasses: Record<string, string> = {
  primary: "text-text-main",
  secondary: "text-primary-600",
  danger: "text-red-400",
  success: "text-green-600",
  warning: "text-yellow-600",
};
type Color = keyof typeof colorClasses;

interface TextProps extends ComponentProps {
  as?: ElementType;
  color?: Color;
  weight?: Weight;
  wrap?: "whitespace-pre-wrap" | "whitespace-normal";
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Component = "span",
      sz = "md-1",
      weight = "regular",
      color = "primary",
      wrap = "whitespace-normal",
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        className={clsx(textSizes[sz], weightClasses[weight], colorClasses[color], wrap, className)}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
