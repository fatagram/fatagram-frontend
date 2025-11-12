import React, { useEffect } from "react";
import clsx from "clsx";
import LoginForm from "@/features/auth/components/login-form";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import SelectLanguage from "@/features/settings/general/components/select-language";
import { Footer } from "@/components/atoms";

// LoginPage function
// This function is a React component that renders the login page.
function LoginPage(): React.ReactElement {
  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false);

  useEffect(() => {
    document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
  }, [forgotPassword]);

  return (
    <div className={clsx("relative")}>
      <div
        className={clsx(
          "relative flex flex-col items-center justify-center h-screen w-full",
          "background-image",
        )}
      >
        <div className={clsx("w-full flex justify-center items-center flex-1 z-10")}>
          {forgotPassword ? (
            <ForgotPasswordForm switchToLogin={() => setForgotPassword(false)} />
          ) : (
            <LoginForm switchForgotPassword={() => setForgotPassword(true)} />
          )}
        </div>
        <Footer className={clsx("z-10 pb-0")} />
      </div>
      <SelectLanguage className={clsx("!absolute top-2 right-2 z-50")} />
    </div>
  );
}

export default LoginPage;
