import React from "react";
import "./Button.module.css";

const sizeClasses = {
    xs: 'lg:px-2 lg:py-1 lg:text-xs px-[6px] py-[3px] text-[10px]',
    small: 'lg:px-4 lg:py-2 lg:text-sm px-[10px] py-[5px] text-xs',
    medium: 'lg:px-6 lg:py-3 lg:text-base px-[15px] py-[10px] text-sm',
    large: 'lg:px-8 lg:py-4 lg:text-lg px-[20px] py-[15px] text-lg',
    xl: 'lg:px-10 lg:py-5 lg:text-xl px-[25px] py-[20px] text-xl',
    "2xl": 'lg:px-12 lg:py-6 lg:text-2xl px-[30px] py-[25px] text-2xl',
    "3xl": 'lg:px-14 lg:py-7 lg:text-3xl px-[35px] py-[30px] text-3xl',
};


type Size = keyof typeof sizeClasses;

// ButtonProps interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: (e?: any) => void;
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
        'third' : 'bg-[var(--bg-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-color)]'
    }

    return (
    <button onClick={onClick} disabled={disabled} 
    className={` 
        ${sizeClasses[size]} 
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