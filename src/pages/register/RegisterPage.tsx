import React, { useEffect } from "react";
import RegisterForm from "../../features/user/components/RegisterForm/RegisterForm";
import Footer from "../../components/layout/Footer/Footer";
import SelectLanguage from "@/components/common/utils/SelectLanguage";
import Text from "@/components/common/ui/Text";

// RegisterPage function
// This function is a React component that renders the register page.
// It displays the register form.
function RegisterPage() {
    // const { t } = useTranslation() as { t: (key: string) => string };

    useEffect(() => {
        document.title = "Register - Fatagram";
    }, []);

    return ( 
        <div className="relative flex flex-col items-center justify-center h-full
                        background-image">
            <div className="relative w-full flex justify-center lg:justify-between m-2 z-10 backdrop-blur-sm bg-[var(--second-bg-color)]
                lg:max-w-[75%] max-w-[95%] rounded-lg overflow-hidden sm:h-[95vh] h-auto">
                <div className="hidden relative sm:flex flex-col register-bg w-full rounded-lg h-full items-center justify-center gap-1
                        border-[15px] border-[var(--second-bg-color)] border-r-0">
                    <Text weight="extrabold" 
                        className="relative flex items-center z-50 text-white text-center shadow-lg rounded-lg backdrop-blur-sm h-[70px]
                            xl:text-[50px] lg:text-[40px] text-[30px]">
                            Welcome to Fatagram
                    </Text>
                    <Text weight="light" 
                        className="text-white z-50 shadow-lg rounded-lg backdrop-blur-sm
                            xl:text-[30px] lg:text-[25px] text-[20px]">
                        Connect with your friends
                    </Text>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-500/30"></div>
                </div>
                <RegisterForm className="shadow-none sm:w-[55%] w-full bg-transparent"/>
            </div>
            <Footer className="z-10 pt-0 pb-0"/>
            <SelectLanguage className="!absolute top-2 right-2 z-50"/>
        </div>
    )
}

export default RegisterPage;