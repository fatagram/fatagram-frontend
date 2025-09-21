import { forwardRef } from "react";
import Textbox, { TextboxProps } from "./Textbox"

interface SearchBoxProps extends TextboxProps {};

const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
    ({
        sz = "sm-1",
        className,
        ...props
    }, ref) => {
        return (
            <div className={`relative ${className} h-fit w-fit`}>
                <Textbox sz={sz} {...props} ref={ref} className="pl-10"/>
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2"></i>   
            </div>
        )
    }
);

export default SearchBox;