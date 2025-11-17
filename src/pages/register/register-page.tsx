import React, { useEffect } from "react";
import clsx from "clsx";
import { Footer, Text } from "@/components/atoms";
import SelectLanguage from "@/features/settings/general/components/select-language";
import { RegisterForm } from "@/features/auth/components";

// RegisterPage - match layout with LoginPage (hero + form card)
function RegisterPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Register - Fatagram";
  }, []);

  return (
    <div
      className={clsx("relative flex h-screen w-screen bg-bg-main", "justify-center items-center")}
    >
      <div className="absolute inset-0 filter blur-lg opacity-80 background-image" />
      <div
        className={clsx("relative flex items-center bg-bg-second", "rounded-3xl overflow-hidden")}
      >
        <div className="relative hidden sm:block flex-1 login-bg w-[1000px] h-[800px]">
          <Text sz="xl-3" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            Feeling
          </Text>
        </div>
        <RegisterForm className="min-h-[700px] max-h-[800px]" />
      </div>
    </div>
  );
}

export default RegisterPage;
