import React, { useEffect } from "react";
import Footer from "../../components/layout/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "../../components/common/Logo/Logo";
import Button from "../../components/common/Button/Button";

// NotFoundPage function
// This function is a React component that renders the 404 page.
// It displays a message that the page is not found.
function NotFoundPage() {

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Fatagram - Page Not Found";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-[20px] bg-[var(--bg-color)]">
        <Logo hasSlogan={false} className={"text-[30px]"}/>
        <span className="text-[80px] font-bold font-roboto bg-[var(--main-single-color)] text-[var(--third-single-color)]
             w-[200px] h-[200px] flex justify-center items-center rounded-full">404</span>
        <span className="uppercase font-jua font-semibold sm:text- text-[40px] text-[var(--third-single-color)]">Page Not Found</span>
        <span className="text-[20px] flex justify-center text-center">Oops! The page you're looking for doesn't exist or has been moved.</span>
        <div className="flex gap-[10px]">
            <Button className={'flex items-center'} onClick={() => {navigate('/')}}><ArrowLeft className="w-5 h-5 mr-2"/> Back to Home</Button>
        </div>
        <Footer className="text-[#959595]"/>
    </div>
  );
}

export default NotFoundPage;