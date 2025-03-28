import React, { useEffect } from "react";
import LoginForm from "../../features/auth/components/LoginForm/LoginForm";
import Footer from "../../components/layout/Footer/Footer";
import withNoAuth from "../../hocs/auth/withNoAuth";
import ForgotPasswordForm from "../../features/auth/components/ForgotPasswordForm/ForgotPasswordForm";

// LoginPage function
// This function is a React component that renders the login page.
function LoginPage() : React.ReactElement
{
    const [forgotPassword, setForgotPassword] = React.useState<boolean>(false);
    useEffect(() => {
        document.title = forgotPassword ? "Forgot Password - Fatagram" : "Login - Fatagram";
    }, [forgotPassword]);

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen w-full
                        background-image bg-cover bg-center ">
                        
                    <div className="w-full flex justify-center items-center flex-1 z-10">
                        {forgotPassword ? <ForgotPasswordForm switchToLogin={() => setForgotPassword(false)}/> : 
                        <LoginForm switchForgotPassword={() => setForgotPassword(true)}/>}
                    </div>
                <Footer className="z-10 pb-0"/>
            </div>
        </div>
    )
}

export default withNoAuth(LoginPage);