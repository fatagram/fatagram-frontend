import React, { RefObject } from "react";
import useClickOutside from "../../../../hooks/useClickOutside";

export type OptionKey = string | number;

export type Option = {
    key: OptionKey;
    value: string | React.ReactNode;
}

interface SelectBoxProps {
    options: Option[];
    selectedOption: string;
    onSelect: (option: OptionKey) => void;
    className?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({ options, selectedOption, onSelect, className }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<OptionKey>(selectedOption);
    const selectBoxRef = React.useRef<HTMLDivElement>(null);
    const btnRef = React.useRef<HTMLButtonElement>(null);

    useClickOutside(selectBoxRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLButtonElement>, () => {
        if (isOpen) setIsOpen(false);
    });
    
    return (
        <div className={`relative ${className}`}>
            <button ref={btnRef} className="w-full">
                <div className={`flex items-center justify-between cursor-pointer bg-[var(--bg-color-fourth)] 
                        px-4 py-2 rounded-xl shadow-md gap-5 hover:bg-[var(--bg-color-secondary)]`} onClick={() => setIsOpen(!isOpen)}>
                    <span>{options.find((opt) => opt.key === selected)?.value}</span>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
            </button>

            {isOpen && <div className="absolute w-full animate-dropdown-slide bg-[var(--bg-color-fourth)] rounded-lg shadow-md mt-1 z-50"
                    ref={selectBoxRef}>
                    <ul className="p-1">
                        {options.map((item, index) => (
                            <li key={index} className="px-4 py-2 hover:bg-[var(--bg-color-secondary)] cursor-pointer rounded-lg"
                                onClick={() => {
                                    setSelected(item.key);
                                    onSelect(item.key);
                                    setIsOpen(false);
                                }}>
                                {item.value}
                            </li>
                        ))}
                    </ul>
                </div>}
        </div>
    );
};

export default SelectBox;