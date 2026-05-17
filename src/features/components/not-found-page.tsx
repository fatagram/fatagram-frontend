import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, Footer, Logo, Text } from "@/components/atoms";

// NotFoundPage function
// This function is a React component that renders the 404 page.
// It displays a message that the page is not found.
function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    document.title = "Page Not Found";
    return () => {
      document.title = "Fawe";
    };
  });

  return (
    <div
      className={clsx(
        "flex flex-col items-center sm:justify-start flex-1 w-full gap-[20px] pt-10",
        "bg-bg-main sm:bg-bg-second",
      )}
    >
      <Logo hasSlogan={false} sz="md" />
      <span
        className={clsx(
          "font-bagel_fat_one leading-none tracking-tighter",
          "text-8xl sm:text-9xl",
          "text-gradient-main",
          "drop-shadow-sm",
        )}
      >
        404
      </span>
      <Text weight="extrabold" sz="xl" className={clsx("uppercase text-gradient-second")}>
        {t("notFound.title")}
      </Text>
      <Text sz="lg" className={clsx("flex justify-center text-center")} wrap="whitespace-normal">
        {t("notFound.description")}
      </Text>
      <div className={clsx("flex gap-[10px]")}>
        <Button
          className={clsx("flex items-center")}
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowLeft className={clsx("w-5 h-5 mr-2")} />
          {t("notFound.backButton")}
        </Button>
      </div>
      <Footer className={clsx("text-text-third")} />
    </div>
  );
}

export default NotFoundPage;
