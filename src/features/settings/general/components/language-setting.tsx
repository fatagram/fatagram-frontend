import React from "react";
import { useTranslation } from "react-i18next";
import SelectBoxSetting from "../../components/selectbox-setting";
import SelectLanguage from "./select-language";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { List } from "@/components/ui/list";
interface LanguageSettingsProps {}

const LanguageSettings: React.FC<LanguageSettingsProps> = () => {
  const { t } = useTranslation();

  return (
    <List
      title={t("settings:language.title")}
      description={t("settings:language.description", "Choose the language for the application")}
    >
      <SelectBoxSetting
        icon={<FontAwesomeIcon icon={faGlobe} />}
        title={t("settings:language.yourLanguage")}
        selectBox={<SelectLanguage className="!min-w-[180px]" />}
      />
    </List>
  );
};

export default LanguageSettings;
