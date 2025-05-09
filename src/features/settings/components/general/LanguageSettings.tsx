import SettingCard from "@/components/common/container/Card";
import SelectBoxSetting from "@/components/common/container/Card/SettingItem/SelectBoxSetting";
import SelectLanguage from "@/components/common/utils/SelectLanguage";
import React from "react";
import { useTranslation } from "react-i18next";

interface LanguageSettingsProps {
    className?: string;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({className}) => {
    const { t } = useTranslation() as { t: (key: string) => string };

    return (
        <div className={`${className}`}>
            <SettingCard title={t("settings:language.title")}>
                <SelectBoxSetting title={t("settings:language.yourLanguage")} selectBox={<SelectLanguage className="!min-w-[180px]" />}/>
            </SettingCard>
        </div>
    )
}

export default LanguageSettings;