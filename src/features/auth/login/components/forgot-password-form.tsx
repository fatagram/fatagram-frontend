import { Button, Logo, Textbox, Text } from "@/components/atoms";
import React from "react";
import clsx from "clsx";

type ForgotPasswordFormProps = {
  switchToLogin: () => void;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ switchToLogin }) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-[20px] w-[95%]",
        "!max-w-[450px] !p-16 bg-bg-second",
        "shadow-md rounded-lg animate-fade-in",
        "sm:max-w-[380px] sm:p-[25px]",
      )}
    >
      <Logo hasSlogan={false} />
      <Text sz="lg" weight="bold" className="!text-primary-500 uppercase font-bold select-none">
        Reset Password
      </Text>
      <div className="w-full">
        <Textbox
          className={clsx("text-[14px] w-[100%] px-[20px]", "sm:py-[5px] py-[10px]")}
          placeholder="Your username or email"
        />
        <Text sz="sm" className={clsx("hidden text-[10px] px-[5px] text-red-400")}>
          Username does not exist!
        </Text>
      </div>
      <Button
        sz="md"
        className={clsx(
          "sm:text-[17px] text-[20px] w-full",
          "sm:py-[5px] py-[7px] font-montserrat",
        )}
      >
        Confirm
      </Button>
      <Text
        className={clsx(
          "sm:text-[14px] text-[15px] !text-primary-500",
          "hover:!text-primary-600 hover:cursor-pointer",
          "transition-all duration-100 active:scale-95 select-none",
        )}
        onClick={switchToLogin}
      >
        &larr; Back to login
      </Text>
    </div>
  );
};

export default ForgotPasswordForm;
