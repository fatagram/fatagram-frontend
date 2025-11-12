import { forwardRef } from "react";
import clsx from "clsx";
import { Textbox, TextboxProps } from "./textbox";

interface SearchBoxProps extends TextboxProps {}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ sz = "sm-1", className, ...props }, ref) => {
    return (
      <div className={clsx("relative h-fit w-fit", className)}>
        <Textbox sz={sz} {...props} ref={ref} className="pl-10" />
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-text-main" />
      </div>
    );
  },
);
SearchBox.displayName = "SearchBox";
