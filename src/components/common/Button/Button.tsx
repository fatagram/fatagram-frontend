import React from "react";
import "./Button.module.css";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary";
    className?: string;
}


const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled,
    variant = "primary",
    className,
    ...props
}) => {

    const variants: Record<string, string> = {
        'primary': 'bg-gradient-main text-white hover:bg-gradient-main-move',
        'secondary': 'bg-[#EBEBEB] transition-all duration-200 ease text-[#636363] hover:bg-[#D9D9D9] ',
    }

    return (
    <button onClick={onClick} disabled={disabled} 
    className={`px-6 py-3 
        font-normal text-2xl
        rounded-lg select-none
        ${disabled ? 'bg-disabled text-[#949494]': variants[variant] + ' active:scale-95 active:opacity-80'}
        ${className}`
    } {...props}>
        {children}
    </button>
  );
}

export default Button;