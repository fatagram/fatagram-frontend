import { Logo, Text } from "@/components/atoms";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export default function OnboardingPage() {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        "relative flex flex-col bg-bg-second flex-1 h-full lg:p-4",
        "justify-center items-center",
      )}
    >
      <div
        className={clsx(
          "relative flex flex-col items-center justify-center gap-8 w-full sm:flex-none flex-1 sm:max-w-[700px]",
          "bg-bg-second/80 sm:rounded-3xl shadow-2xl",
          "sm:p-10 px-4 border border-border-main/50",
        )}
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" />

        <div className="flex flex-col items-center gap-3 z-10">
          <Logo sz="md" hasSlogan={false} />
          <Text
            sz="xl"
            weight="extrabold"
            className="mt-2 !text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 font-inter"
          >
            {t("onboarding.welcome")}
          </Text>
          <Text sz="md" className="text-text-secondary text-center max-w-[400px]">
            {t("onboarding.completeInfo")}
          </Text>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border-main to-transparent" />

        <OnboardingForm />

        <div className="flex items-center gap-2 text-text-third">
          <FontAwesomeIcon icon={faShieldHalved} className="text-primary-500"  />
          <Text sz="sm">{t("onboarding.privacy")}</Text>
        </div>
      </div>
    </div>
  );
}
