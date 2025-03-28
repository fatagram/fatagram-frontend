import React from "react";
import "./LoadingPage.style.css";
import Logo from "../../components/common/Logo/Logo";

// LoadingPage
// This component is the loading page component.
const LoadingPage: React.FC = () => {

    return (
        <div className="flex justify-center items-center h-screen bg-[var(--bg-color)]">
            <div className="flex flex-col items-center">
                <Logo hasSlogan={false}/>
                <div className="relative top-1/2  w-12 h-12 mt-5 border-4 border-transparent border-t-[var(--main-single-color)] border-r-[var(--main-single-color)] rounded-full animate-spin"></div>
            </div>
        </div>  
    )
}

export default LoadingPage;