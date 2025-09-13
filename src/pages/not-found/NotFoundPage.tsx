import React, { useEffect } from "react";
import Footer from "@/components/layout/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/common/ui/Logo/Logo";
import Button from "@/components/common/ui/Button/Button";
import { useTranslation } from "react-i18next";
import Text from "@/components/common/ui/Text";

// NotFoundPage function
// This function is a React component that renders the 404 page.
// It displays a message that the page is not found.
function NotFoundPage() {

  const navigate = useNavigate();
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div className="flex flex-col items-center pt-20 sm:pt-10 sm:justify-center h-screen w-full gap-[20px] bg-[var(--main-bg-color)]">
        <Logo hasSlogan={false} className={"text-[30px]"}/>
        <Text className="text-[80px] font-bold font-jua bg-single-main text-[var(--third-single-color)]
                          w-[200px] h-[200px] flex justify-center items-center rounded-full">404</Text>
        <Text weight="extrabold" className="uppercase sm:text- text-[40px] 
                        text-[var(--third-single-color)]">{t("notFound.title")}</Text>
        <Text size="lg-2" className="flex justify-center text-center">
            {t("notFound.description")}
        </Text>
        <div className="flex gap-[10px]">
            <Button className={'flex items-center'} 
                    onClick={() => {navigate('/')}}>
                    <ArrowLeft className="w-5 h-5 mr-2"/> 
                    {t("notFound.backButton")}
            </Button>
        </div>
        <Footer className="text-[#959595]"/>
    </div>
  );
}

export default NotFoundPage;