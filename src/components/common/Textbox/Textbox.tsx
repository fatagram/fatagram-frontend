import React from "react";
import styles from "./Textbox.module.css";

// TextboxProps interface
interface TextboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    disabled?: boolean;
    isWrong?: boolean;
    autoComplete?: string;
    name?: string;
    className?: string;
}

// Textbox component
// This component is a textbox component that can be used in the application.
const Textbox: React.FC<TextboxProps> = ({
    placeholder,
    onChange,
    value,
    disabled=false,
    isWrong=false,
    className="",
    autoComplete="off",
    name="",
    ...props
}) => {
    return (
        <input type="text"
        name={name}
        placeholder={placeholder} 
        autoComplete={autoComplete}
        onChange={onChange} 
        disabled={disabled}
        className={`border-[3px] bg-[var(--bg-color-secondary)] text-[var(--text-color)]
                ${disabled ? `bg-[var(--bg-color)]` : `focus:bg-gradient-main-move 
                ${isWrong ? styles['primary-textbox-wrong'] : styles['primary-textbox']}`}
                font-normal rounded-[15px] outline-none text-lg caret-[var(--main-single-color)]
                ${className}
            `}
        {...props}/>
    );
}

export default Textbox;