import React, { forwardRef } from "react";
import Textbox, { TextboxProps } from "./textbox";
import { Size } from "../../common/types/size";
import clsx from "clsx";

interface PasswordBoxProps extends TextboxProps {
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
}

const PasswordBox = forwardRef<HTMLInputElement, PasswordBoxProps>(
  (
    {
      showPasswordToggle = true,
      placeholder = "Enter your password",
      autoComplete = "current-password",
      sz = "md-1",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    return (
      <div className="relative">
        <Textbox
          {...props}
          ref={ref}
          placeholder={placeholder}
          autoComplete={autoComplete}
          sz={sz}
          type={showPassword ? "text" : "password"}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className={clsx(
              "absolute right-0 top-1/2 -translate-y-1/2 mr-5"
            )}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <i className={clsx("fa-solid fa-eye text-secondary-500")}></i>
            ) : (
              <i className={clsx("fa-solid fa-eye-slash text-text-main")}></i>
            )}
          </button>
        )}
      </div>
    );
  },
);
PasswordBox.displayName = "PasswordBox";

export default PasswordBox;
