import React, { useEffect } from "react";
import Footer from "@/components/atoms/footer/footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "@/components/atoms/logo";
import Text from "@/components/atoms/text";
import Button from "@/components/atoms/button";

// NotFoundPage function
// This function is a React component that renders the 404 page.
// It displays a message that the page is not found.
function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    document.title = "Page Not Found";
    return () => {
      document.title = "Fatagram";
    }
  })

  return (
    <div
      className="flex flex-col items-center sm:justify-center h-full
                    w-full gap-[20px] pt-10"
    >
      <Logo hasSlogan={false} className={"text-[30px]"} />
      <Text
        sz="xl-3"
        className="font-jua bg-single-main text-single-third
                          w-[200px] h-[200px] flex justify-center items-center rounded-full"
      >
        404
      </Text>
      <Text
        weight="extrabold"
        sz="lg-3"
        className="uppercase
                        text-single-third"
      >
        {t("notFound.title")}
      </Text>
      <Text sz="lg-1" className="flex justify-center text-center">
        {t("notFound.description")}
      </Text>
      <div className="flex gap-[10px]">
        <Button
          className={"flex items-center"}
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("notFound.backButton")}
        </Button>
      </div>
      <Footer className="text-[#959595]" />
    </div>
  );
}

export default NotFoundPage;
