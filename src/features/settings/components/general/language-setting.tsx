import SettingCard from "@/components/molecules/card";
import React from "react";
import { useTranslation } from "react-i18next";
import SelectBoxSetting from "../common/selectbox-setting";
import SelectLanguage from "./select-language";

interface LanguageSettingsProps {
    className?: string;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({className}) => {
    const { t } = useTranslation() as { t: (key: string) => string };

    return (
        <div className={`${className}`}>
            <SettingCard title={t("settings:language.title")}>
                <SelectBoxSetting title={t("settings:language.yourLanguage")} 
                    selectBox={<SelectLanguage className="!min-w-[180px]" />}/>
            </SettingCard>
        </div>
    )
}

export default LanguageSettings;