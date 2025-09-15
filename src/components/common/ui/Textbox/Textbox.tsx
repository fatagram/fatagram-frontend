import React from "react";
import styles from "./Textbox.module.css";
import { Size } from "../styles/size";

const sizeClasses: Record<Size, string> = {
    "xs": 'px-2 py-1 text-xs',
    "sm-1": 'px-3 py-1 text-[15px] ',
    "sm-2": 'px-4 py-2 text-[15px] ',
    "sm-3": 'px-5 py-2 text-[15px] ',
    "md-1": 'px-6 py-3 text-base ',
    "md-2": 'px-7 py-3 text-base ',
    "md-3": 'px-8 py-4 text-base ',
    "lg-1": 'px-8 py-4 text-base ',
    "lg-2": 'px-9 py-4 text-base ',
    "lg-3": 'px-10 py-5 text-base ',
    "xl-1": 'px-10 py-5 text-xl ',
    "xl-2": 'px-12 py-6 text-2xl ',
    "xl-3": 'px-14 py-7 text-3xl ',
}

// TextboxProps interface
interface TextboxProps {
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    disabled?: boolean;
    isWrong?: boolean;
    autoComplete?: string;
    type?: string;
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
    size = "sm-1",
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
                font-normal rounded-[15px] outline-none text-lg caret-single-main selection:!bg-single-third
                ${className}
                ${sizeClasses[size]}`}
            {...props}
        />
    );
}

export default Textbox;