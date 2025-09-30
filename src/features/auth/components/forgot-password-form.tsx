import { Button, Logo, Textbox, Text } from "@/components/atoms";
import React from "react";

type ForgotPasswordFormProps = {
  switchToLogin: () => void;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ switchToLogin }) => {
  return (
    <div
      className="flex flex-col items-center gap-[20px] w-[95%]  max-w-[380px] 
                        p-[20px] bg-[var(--second-bg-color)] shadow-md rounded-lg 
                        sm:max-w-[380px] sm:p-[25px] animate-fade-in"
    >
      <Logo hasSlogan={false} />
      <Text sz="lg-3" weight="bold" className="text-single-third font-bold select-none">
        Reset Password
      </Text>
      <div className="w-full">
        <Textbox
          className="text-[14px] w-[100%] px-[20px] sm:py-[5px] py-[10px]"
          placeholder="Your username or email"
        />
        <Text sz="sm-1" className="hidden text-[10px] px-[5px] text-red-400">
          Username does not exist!
        </Text>
      </div>
      <Button
        sz="md-1"
        className={`sm:text-[17px] text-[20px] w-full sm:py-[5px] py-[7px] font-montserrat`}
      >
        Confirm
      </Button>
      <Text
        className="sm:text-[14px] text-[15px] text-single-second hover:text-single-main hover:cursor-pointer
                    transition-all duration-100 active:scale-95 select-none"
        onClick={switchToLogin}
      >
        &larr; Back to login
      </Text>
    </div>
  );
};

export default ForgotPasswordForm;
