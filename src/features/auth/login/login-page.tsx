import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Text } from "@/components/atoms";
import { LoginForm } from "./components/login-form";

// LoginPage function
// This function is a React component that renders the login page.
function LoginPage(): React.ReactElement {
  const [forgotPassword, _setForgotPassword] = useState<boolean>(false);

  useEffect(() => {
    document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
  }, [forgotPassword]);

  return (
    <div className={clsx("relative flex bg-bg-main h-full lg:p-4", "justify-center items-center")}>
      <div className="absolute hidden sm:block inset-0 filter blur-lg opacity-80 background-image" />
      <div
        className={clsx(
          "relative flex justify-center items-center bg-bg-second w-full h-full lg:max-h-[800px] lg:w-[80%]",
          "lg:rounded-3xl rounded-none overflow-hidden",
        )}
      >
        <div className="absolute lg:relative hidden sm:block flex-1 login-bg lg:w-[95%] w-full h-full">
          <Text sz="xl-3" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Feeling
          </Text>
        </div>
        <LoginForm className="py-0 sm:py-12 h-full" />
      </div>
    </div>
  );
}

export default LoginPage;
