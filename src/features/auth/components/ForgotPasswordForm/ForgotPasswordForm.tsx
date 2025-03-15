import React from "react";
import Button from "../../../../components/common/Button/Button";
import Textbox from "../../../../components/common/Textbox/Textbox";
import Logo from  "../../../../components/common/Logo/Logo";

interface ForgotPasswordFormProps {
    switchToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({switchToLogin}) =>
{
    return (
    <div className="flex flex-col items-center gap-[20px] w-[95%]  max-w-[380px] 
                    p-[20px] bg-white shadow-md rounded-lg 
                    sm:max-w-[380px] sm:p-[25px] animate-fade-in">
                        
    <Logo hasSlogan={false}/>
    <h2 className="sm:text-[45px] text-[40px] text-[var(--third-single-color)] font-bold font-jua select-none">Reset Password</h2>
    <div className="w-full">
        <Textbox className="text-[14px] w-[100%] px-[20px] sm:py-[5px] py-[10px]" placeholder="Your username or email"/>
        <span className="hidden text-[10px] px-[5px] text-red-400">Username does not exist!</span>
    </div>
    
    <Button className={`sm:text-[17px] text-[20px] w-full sm:py-[5px] py-[7px] font-montserrat`}>Confirm</Button>
    <span className="sm:text-[14px] text-[15px] text-[var(--second-single-color)] hover:text-[var(--main-single-color)] hover:cursor-pointer
            transition-all duration-100 active:scale-95 select-none"
            onClick={switchToLogin}>&larr; Back to login</span>
</div>
    )
}

export default ForgotPasswordForm;