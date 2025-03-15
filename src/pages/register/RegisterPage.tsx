import React, { useEffect } from "react";
import RegisterForm from "../features/user/components/RegisterForm/RegisterForm";
import Footer from "../components/layout/Footer/Footer";


function RegisterPage() {
    
    useEffect(() => {
        document.title = "Fatagram - Register";
    }, []);

    return (
        
        <div className="flex flex-col items-center justify-center h-screen w-full
                        background-image bg-cover bg-center">
            <div className="w-full flex justify-center items-center flex-1">
                <RegisterForm/>
            </div>

            <Footer/>
        </div>
    )
}

export default RegisterPage;