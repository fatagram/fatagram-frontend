import React from "react";
import Textbox from "./Textbox";

interface PasswordBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    disabled?: boolean;
    isWrong?: boolean;
    className?: string;
    autoComplete?: string;
    name?: string;
    ref?: React.Ref<HTMLInputElement>;
    showPasswordToggle?: boolean;
}

// PasswordBox
const PasswordBox: React.FC<PasswordBoxProps> = ({
    placeholder = "Enter password",
    showPasswordToggle = true,
    autoComplete = "current-password",
    name="",
    ref,
    ...props
}) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
        <div className="relative">
            <Textbox {...props}
                ref={ref}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                autoComplete={autoComplete}
                name={name}/>
            {showPasswordToggle && (
                <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 mr-5"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <i className="fa-solid fa-eye text-[#5e5e5e]"></i> : 
                                <i className="fa-solid fa-eye-slash text-[var(--third-single-color)]"></i>}
                </button>
            )}
        </div>
    )
}

export default PasswordBox;