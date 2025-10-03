import React, { useEffect } from "react";
import clsx from "clsx";
import RegisterForm from "../../features/auth/components/register-form";
import Footer from "../../components/atoms/footer/footer";
import Text from "@/components/atoms/text";
import SelectLanguage from "@/features/settings/general/components/select-language";

// RegisterPage function
function RegisterPage() {
  useEffect(() => {
    document.title = "Register - Fatagram";
  }, []);

  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-center h-full",
        "background-image"
      )}
    >
      <div
        className={clsx(
          "relative w-full flex justify-center lg:justify-between m-2 z-10 backdrop-blur-sm bg-bg-main",
          "lg:max-w-[75%] max-w-[95%] rounded-lg overflow-hidden sm:h-[95vh] h-auto"
        )}
      >
        <div
          className={clsx(
            "hidden relative sm:flex flex-col register-bg w-full rounded-lg h-full items-center justify-center gap-1",
            "border-8 border-bg-main border-r-0 overflow-hidden"
          )}
        >
          <Text
            weight="extrabold"
            className={clsx(
              "relative flex items-center z-50 text-white text-center shadow-lg rounded-lg backdrop-blur-sm h-[70px]",
              "xl:text-[50px] lg:text-[40px] text-[30px]"
            )}
          >
            Welcome to Fatagram
          </Text>
          <Text
            weight="light"
            className={clsx(
              "text-white z-50 shadow-lg rounded-lg backdrop-blur-sm",
              "xl:text-[30px] lg:text-[25px] text-[20px]"
            )}
          >
            Connect with your friends
          </Text>
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-blue-600/20"></div>
        </div>
        <RegisterForm className={clsx("shadow-none w-full bg-bg-main")} />
      </div>
      <Footer className={clsx("z-10 pt-0 pb-0")} />
      <SelectLanguage className={clsx("!absolute top-2 right-2 z-50")} />
    </div>
  );
}

export default RegisterPage;
