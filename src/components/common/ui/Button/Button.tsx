import React from "react";
import "./Button.module.css";
import { Size } from "../styles/size";

// Define a mapping of button sizes
const buttonSizes: Record<Size, string> = {
    "xs" : 'px-2 py-1 text-xs',
    "sm-1": 'px-4 py-2 text-sm ',
    "sm-2": 'px-5 py-2 text-sm ',
    "sm-3": 'px-6 py-2 text-sm ',
    "md-1": 'px-6 py-3 text-base ',
    "md-2": 'px-8 py-3 text-base ',
    "md-3": 'px-10 py-3 text-base ',
    "lg-1": 'px-8 py-4 text-base ',
    "lg-2": 'px-10 py-4 text-base ',
    "lg-3": 'px-12 py-4 text-base ',
    "xl-1": 'px-10 py-5 text-xl ',
    "xl-2": 'px-12 py-6 text-2xl ',
    "xl-3": 'px-14 py-7 text-3xl ',
}

const buttonVariants = {
    'primary': 'bg-gradient-main text-white hover:bg-gradient-main-move',
    'secondary': 'bg-[var(--btn-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-hover-color)] ',
    'third' : 'bg-[var(--main-bg-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-color)]'
}

type Variant = keyof typeof buttonVariants;

// ButtonProps interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: (e?: any) => void;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
    ref?: React.Ref<HTMLButtonElement>;
    className?: string;
}

// Button component
// This component is a button component that can be used in the application.
const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    onKeyDown,
    disabled,
    variant = "primary",
    size = "lg-1",
    ref,
    className,
    ...props
}) => {

    return (
    <button onClick={onClick} 
        disabled={disabled} 
        ref={ref}
        className={` ${buttonSizes[size]} 
            font-normal 
            rounded-lg select-none
            ${disabled ? 'bg-disabled text-[#949494]': buttonVariants[variant] + ' active:scale-95 active:opacity-80'}
            ${className}`
    } {...props}>
        {children}
    </button>
  );
}

export default Button;