import React, { forwardRef } from "react";
import "./Button.module.css";
import { Size } from "@/components/common/types/size";

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
    variant?: Variant;
    size?: Size;
}

// Button component
// This component is a button component that can be used in the application.

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        onClick,
        variant = "primary",
        size = "lg-1",
        className,
        children,
        disabled = false,
        ...props
    }, ref) => {
        return (
            <button onClick={onClick} 
                className={` ${buttonSizes[size]} 
                font-normal
                rounded-lg select-none
                ${disabled ? 'bg-disabled text-[#949494]': buttonVariants[variant] + ' active:scale-[0.98] active:opacity-80'}
                ${className}`} 
                ref={ref}
                {...props}
            >
                {children}
            </button>
        )
    }
); 

Button.displayName = "Button";
export default Button;