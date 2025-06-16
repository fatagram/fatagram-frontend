import React from "react";
import Button from "../Button";

export interface DropdownItem {
    id: string;
    content: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

interface DropdownProps {
    items: DropdownItem[];
    onSelect?: (item: DropdownItem) => void;
    showPolygon?: boolean;
    className?: string,
    ref?: React.Ref<HTMLDivElement>;
}

const Dropdown: React.FC<DropdownProps> = ({
    items,
    onSelect,
    showPolygon = true,
    className,
    ref
}) => {
    return (
        <div className={`${className}`} ref={ref}>
            { showPolygon && <div className="absolute hidden sm:flex sm:-top-2 sm:left-[25%] -translate-x-1/2 w-0 h-0 
                                                    border-l-8 border-l-transparent 
                                                    border-r-8 border-r-transparent 
                                                    border-b-8 border-b-[var(--main-bg-color)] rounded-sm"></div> }
            <ul className="flex flex-col gap-2 w-full">
                {items.map((item, index) => (
                    <li key={index}>
                        <Button size="medium" variant="third" className="w-full text-left pl-3"
                                onClick={() => { item.onClick?.(); onSelect?.(item);}}>
                            {item.content}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dropdown;