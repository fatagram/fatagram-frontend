import React from "react";
import "./LoadingPage.style.css";
import Logo from "@/components/common/ui/Logo/Logo";

// LoadingPage
// This component is the loading page component.
const LoadingPage: React.FC = () => {

    return (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-[var(--main-bg-color)]">
            <div className="flex flex-col items-center">
                <Logo size="large" hasSlogan={false}/>
                {/* <div className="relative top-1/2 w-12 h-12 mt-5 border-4 border-transparent 
                                border-t-single-main border-r-single-main 
                                rounded-full animate-spin"></div> */}
            </div>
        </div>  
    )
}

export default LoadingPage;