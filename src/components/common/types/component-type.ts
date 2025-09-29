import { Size } from "./size";
import React from "react";

interface ResponsiveOverride {
  sz?: Size;
  className?: string;
  children?: React.ReactNode;
}

interface BaseProps extends ResponsiveOverride {
  smProps?: ResponsiveOverride;
  mdProps?: ResponsiveOverride;
  lgProps?: ResponsiveOverride;
}

// ComponentProps sẽ tự động chọn đúng HTML attributes dựa theo T
export type ComponentProps<T extends HTMLElement = HTMLElement> =
  (T extends HTMLInputElement
    ? React.InputHTMLAttributes<T>
    : T extends HTMLTextAreaElement
      ? React.TextareaHTMLAttributes<T>
      : T extends HTMLButtonElement
        ? React.ButtonHTMLAttributes<T>
        : T extends HTMLAnchorElement
          ? React.AnchorHTMLAttributes<T>
      : React.HTMLAttributes<T>
  ) & BaseProps;
