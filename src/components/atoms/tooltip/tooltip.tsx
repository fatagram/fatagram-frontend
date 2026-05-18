import React, { ReactNode } from "react";
import clsx from "clsx";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
  tooltipClassName?: string;
}

const positionClasses: Record<TooltipPosition, string> = {
  left: "right-[115%] top-1/2 -translate-y-1/2 origin-right translate-x-2 group-hover:translate-x-0",
  right:
    "left-[115%] top-1/2 -translate-y-1/2 origin-left -translate-x-2 group-hover:translate-x-0",
  top: "bottom-[115%] left-1/2 -translate-x-1/2 origin-bottom translate-y-2 group-hover:translate-y-0",
  bottom:
    "top-[115%] left-1/2 -translate-x-1/2 origin-top -translate-y-2 group-hover:translate-y-0",
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className,
  tooltipClassName,
}) => {
  return (
    <div className={clsx("relative group inline-block", className)}>
      {children}
      <div
        className={clsx(
          "absolute pointer-events-none z-50",
          "opacity-0 scale-95",
          "group-hover:opacity-100 group-hover:scale-100",
          "transition-all duration-200 ease-out",
          "bg-bg-glass backdrop-blur-md border border-border-main shadow-lg rounded-xl px-3 py-1.5",
          "w-max max-w-[250px]",
          positionClasses[position],
          tooltipClassName,
        )}
      >
        {content}
      </div>
    </div>
  );
};
