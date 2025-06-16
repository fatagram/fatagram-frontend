import React from "react";
import "./Button.module.css";

const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    small: 'px-4 py-2 text-sm ',
    medium: 'px-6 py-3 text-base ',
    large: 'px-8 py-4 text-base ',
    xl: 'px-10 py-5 text-xl ',
    "2xl": 'px-12 py-6 text-2xl ',
    "3xl": 'px-14 py-7 text-3xl ',
};


type Size = keyof typeof sizeClasses;

// ButtonProps interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: (e?: any) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "third";
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
    size = "large",
    ref,
    className,
    ...props
}) => {

    const variants: Record<string, string> = {
        'primary': 'bg-gradient-main text-white hover:bg-gradient-main-move',
        'secondary': 'bg-[var(--btn-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-hover-color)] ',
        'third' : 'bg-[var(--main-bg-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-color)]'
    }

    return (
    <button onClick={onClick} 
        disabled={disabled} 
        ref={ref}
        className={` ${sizeClasses[size]} 
            font-normal 
            rounded-lg select-none
            ${disabled ? 'bg-disabled text-[#949494]': variants[variant] + ' active:scale-95 active:opacity-80'}
            ${className}`
    } {...props}>
        {children}
    </button>
  );
}

export default Button;