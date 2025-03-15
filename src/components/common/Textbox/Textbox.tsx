import React from "react";
import styles from "./Textbox.module.css";

interface TextboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    disabled?: boolean;
    isWrong?: boolean;
    className?: string;
}

const Textbox: React.FC<TextboxProps> = ({
    placeholder,
    onChange,
    value,
    disabled=false,
    isWrong=false,
    className="",
    ...props
}) => {
    return (
        <input type="text" 
        placeholder={placeholder} 
        onChange={onChange} 
        disabled={disabled}
        className={`border-[3px]
                ${disabled ? `bg-[#f3fbf8]` : `focus:bg-gradient-main-move 
                ${isWrong ? styles['primary-textbox-wrong'] : styles['primary-textbox']}`}
                font-normal rounded-[15px] outline-none text-lg caret-[var(--main-single-color)] 
                ${className}
            `}
        {...props}/>
    );
}

export default Textbox;