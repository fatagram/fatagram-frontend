import React from "react";
import styles from "./Textbox.module.css";

const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1 text-[15px] ',
    md: 'px-6 py-3 text-base ',
    lg: 'px-8 py-4 text-base ',
    xl: 'px-10 py-5 text-xl ',
    "2xl": 'px-12 py-6 text-2xl ',
    "3xl": 'px-14 py-7 text-3xl ',
};

export type Size = keyof typeof sizeClasses;

// TextboxProps interface
interface TextboxProps {
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    disabled?: boolean;
    isWrong?: boolean;
    autoComplete?: string;
    name?: string;
    size?: Size;
    ref?: React.Ref<HTMLInputElement>;
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
    ref,
    size = "sm",
    autoComplete="off",
    name="",
    ...props
}) => {

    return (
        <input type="text"
        ref={ref}
        name={name}
        value={value}
        placeholder={placeholder} 
        autoComplete={autoComplete}
        onChange={onChange} 
        disabled={disabled}
        className={`border-[3px] bg-[var(--second-bg-color)] text-[var(--text-color)]
            ${disabled ? `bg-[var(--main-bg-color)]` : `focus:bg-gradient-main-move 
            ${isWrong ? styles['primary-textbox-wrong'] : styles['primary-textbox']}`}
            font-normal rounded-[15px] outline-none text-lg caret-[var(--main-single-color)]
            ${className}
            ${sizeClasses[size]}
        `}
        {...props}/>
    );
}

export default Textbox;