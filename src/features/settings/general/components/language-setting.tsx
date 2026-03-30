import React from "react";
import { useTranslation } from "react-i18next";
import SelectBoxSetting from "../../components/selectbox-setting";
import SelectLanguage from "./select-language";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";

interface LanguageSettingsProps {}

const LanguageSettings: React.FC<LanguageSettingsProps> = () => {
  const { t } = useTranslation();

  return (
    <SidebarPageCard title={t("settings:language.title")}>
      <SelectBoxSetting
        title={t("settings:language.yourLanguage")}
        selectBox={<SelectLanguage className="!min-w-[180px]" />}
      />
    </SidebarPageCard>
  );
};

export default LanguageSettings;
