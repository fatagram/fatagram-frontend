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
    <div
      className={clsx(
        "relative flex flex-col bg-bg-second flex-1 h-full lg:p-4",
        "justify-center items-center",
      )}
    >
      <div className="absolute hidden sm:block inset-0 filter blur-lg opacity-80 background-image" />
      <div
        className={clsx(
          "relative flex bg-bg-second w-full ",
          "flex-1 lg:w-[80%] lg:max-h-[800px]",
          "lg:rounded-3xl rounded-none overflow-hidden",
        )}
      >
        <div
          className={clsx(
            "sm:absolute inset-0 lg:relative hidden sm:flex",
            "flex-1 login-bg justify-center items-center z-0",
          )}
        >
          <Text sz="xl-3" className="select-none hidden lg:block">
            Feeling
          </Text>
        </div>

        <div className="bg-bg-second px-[3rem] py-[1rem] flex-1 m-auto max-w-[500px] z-10 rounded-3xl lg:rounded-none">
          <LoginForm className="m-auto" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
