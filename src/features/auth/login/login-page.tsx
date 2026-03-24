import React, { useEffect } from "react";
import clsx from "clsx";
import { Text } from "@/components/atoms";
import { LoginForm } from "./components/login-form";

// LoginPage function
// This function is a React component that renders the login page.
function LoginPage(): React.ReactElement {
  const [forgotPassword, setForgotPassword] = React.useState<boolean>(false);

  useEffect(() => {
    document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
  }, [forgotPassword]);

  return (
    <div className={clsx("relative flex bg-bg-main h-full", "justify-center items-center")}>
      <div className="absolute hidden sm:block inset-0 filter blur-lg opacity-80 background-image" />
      <div
        className={clsx(
          "relative flex justify-center items-center bg-bg-second w-full h-full sm:w-[80%] sm:h-[80%]",
          "sm:rounded-3xl rounded-none overflow-hidden",
        )}
      >
        <div className="relative hidden lg:block flex-1 login-bg w-[95%] h-[800px]">
          <Text sz="xl-3" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Feeling
          </Text>
        </div>
        <LoginForm switchForgotPassword={() => setForgotPassword(true)} />
      </div>
    </div>
  );
}

export default LoginPage;
