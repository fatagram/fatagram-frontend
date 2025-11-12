import LanguageSettings from "@/features/settings/general/components/language-setting";
import clsx from "clsx";

const LanguageSettingPage = () => {
  return (
    <div className={clsx("flex justify-center w-full")}>
      <LanguageSettings className={clsx("w-full !min-w-[200px]")} />
    </div>
  );
};

export default LanguageSettingPage;
