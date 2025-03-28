import React from "react";
import "./Button.module.css";

const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-medium',
    large: 'px-8 py-4 text-2xl',
}

type Size = keyof typeof sizeClasses;

// ButtonProps interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary";
    size?: Size;
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
    className,
    ...props
}) => {

    const variants: Record<string, string> = {
        'primary': 'bg-gradient-main text-white hover:bg-gradient-main-move',
        'secondary': 'bg-[var(--btn-color)] transition-all duration-200 ease text-[var(--text-color)] hover:bg-[var(--btn-hover-color)] ',
    }

    return (
    <button onClick={onClick} disabled={disabled} 
    className={`${sizeClasses[size]} 
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