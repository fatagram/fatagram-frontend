import React from "react";
import { MiniButton, MiniButtonProps } from "./mini-button";
import clsx from "clsx";

export interface BackButtonProps extends Omit<MiniButtonProps, "children"> {}

export const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ className, sz = "sm", ...props }, ref) => {
    return (
      <MiniButton
        ref={ref}
        sz={sz}
        className={clsx("group", className)}
        {...props}
      >
        <i className="fa-solid fa-arrow-left text-primary-400 transition-colors group-hover:text-primary-500" />
      </MiniButton>
    );
  }
);

BackButton.displayName = "BackButton";
