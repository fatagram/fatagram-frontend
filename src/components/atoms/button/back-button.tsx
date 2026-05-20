import React from "react";
import { MiniButton, MiniButtonProps } from "./mini-button";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon icon={faArrowLeft} className="text-primary-400 transition-colors group-hover:text-primary-500"  />
      </MiniButton>
    );
  }
);

BackButton.displayName = "BackButton";
