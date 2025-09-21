import React, { forwardRef } from "react";
import Textbox, { TextboxProps } from "./Textbox";
import { Size } from "../../common/types/size";

interface PasswordBoxProps extends TextboxProps {
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    setShowPassword?: (show: boolean) => void;
}

const PasswordBox = forwardRef<HTMLInputElement, PasswordBoxProps>(
    ({
        showPasswordToggle = true,
        placeholder = "Enter your password",
        autoComplete = "current-password",
        sz = "md-1",
        ...props
    }, ref) => {
        const [showPassword, setShowPassword] = React.useState<boolean>(false);

        return (
            <div className="relative">
                <Textbox {...props}
                    ref={ref}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    sz={sz as Size}
                    type={showPassword ? "text" : "password"}/>
                {showPasswordToggle && (
                    <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 mr-5"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <i className="fa-solid fa-eye text-[#5e5e5e]"></i> : 
                                    <i className="fa-solid fa-eye-slash text-single-third"></i>}
                    </button>
                )}
            </div>
        )
    }
);

export default PasswordBox;