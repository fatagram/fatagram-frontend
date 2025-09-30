import React, { useEffect } from "react";
import LoginForm from "@/features/auth/components/login-form";
import Footer from "@/components/atoms/footer/footer";
import ForgotPasswordForm from "@/features/auth/components/forgot-password-form";
import SelectLanguage from "@/features/settings/general/components/select-language";

// LoginPage function
// This function is a React component that renders the login page.
function LoginPage(): React.ReactElement {
  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false);

  useEffect(() => {
    document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
  }, [forgotPassword]);

  return (
    <div className="relative">
      <div
        className="relative flex flex-col items-center justify-center h-screen w-full
                            background-image"
      >
        <div className="w-full flex justify-center items-center flex-1 z-10">
          {forgotPassword ? (
            <ForgotPasswordForm switchToLogin={() => setForgotPassword(false)} />
          ) : (
            <LoginForm switchForgotPassword={() => setForgotPassword(true)} />
          )}
        </div>
        <Footer className="z-10 pb-0" />
      </div>
      <SelectLanguage className="!absolute top-2 right-2 z-50" />
    </div>
  );
}

export default LoginPage;
