import React, { RefObject, use } from "react";
import useClickOutside from "../../../hooks/useClickOutside";

interface SelectBoxProps {
    options: string[];
    selectedOption: string;
    onSelect: (option: string) => void;
    className?: string;
}

const SelectBox: React.FC<SelectBoxProps> = ({ options, selectedOption, onSelect, className }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState(selectedOption);
    const [items, setItems] = React.useState<string[]>(options);
    const selectBoxRef = React.useRef<HTMLDivElement>(null);
    const btnRef = React.useRef<HTMLButtonElement>(null);

    useClickOutside(selectBoxRef as RefObject<HTMLDivElement>, btnRef as RefObject<HTMLButtonElement>, () => {
        if (isOpen) setIsOpen(false);
    });
    
    return (
        <div>
            <button ref={btnRef}>
                <div className={`flex items-center justify-between cursor-pointer bg-[var(--bg-color-third)] 
                        px-4 py-2 rounded-xl shadow-md gap-5 hover:bg-[var(--bg-color-secondary)] ${className}`} onClick={() => setIsOpen(!isOpen)}>
                    <span>{selected}</span>
                    <i className="fa-solid fa-caret-down"></i>
                </div>
            </button>

            {isOpen && <div className="absolute bg-[var(--bg-color-third)] rounded-lg shadow-md mt-2 z-10"
                    ref={selectBoxRef}>
                    <ul className="p-1">
                        {items.map((item, index) => (
                            <li key={index} className="px-4 py-2 hover:bg-[var(--bg-color-secondary)] cursor-pointer rounded-lg"
                                onClick={() => {
                                    setSelected(item);
                                    onSelect(item);
                                    setIsOpen(false);
                                }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>}
        </div>
    );
};

export default SelectBox;