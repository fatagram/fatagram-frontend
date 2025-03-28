import React, { useEffect } from "react";
import RegisterForm from "../../features/user/components/RegisterForm/RegisterForm";
import Footer from "../../components/layout/Footer/Footer";
import withNoAuth from "../../hocs/auth/withNoAuth";

// RegisterPage function
// This function is a React component that renders the register page.
// It displays the register form.
function RegisterPage() {
    
    useEffect(() => {
        document.title = "Register - Fatagram";
    }, []);

    return ( 
        <div className="relative flex flex-col items-center justify-center w-full h-full
                        background-image bg-cover bg-center">
            <div className="w-full flex justify-center items-center flex-1 m-2 z-10">
                <RegisterForm/>
            </div>
            <Footer className="z-10 pt-0 pb-0"/>
        </div>
    )
}

export default withNoAuth(RegisterPage);