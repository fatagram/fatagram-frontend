import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "../../../../contexts/ThemeContext";
import SettingCard from "@/components/molecules/Card";
import { useTranslation } from "react-i18next";
import { OptionKey, Option } from "@/components/atoms/SelectBox/SelectBox";
import SelectBoxSetting from "../common/SelectBoxSetting";

interface ThemeSettingsProps {
    className?: string;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({className}) => {

    const { theme, setTheme, availableThemes } = useTheme();
    const [themeOptions, setThemeOptions] = useState<Option[]>([]);
    const { t } = useTranslation() as { t: (key: string) => string };

    const selectTheme = (opt: OptionKey) => {
        setTheme(opt as Theme);
    }

    useEffect(() => {
        const options: Option[] = availableThemes.map((theme) => ({ key: theme.theme, value: theme.display }));
        setThemeOptions(options)
    }, [availableThemes]) 

    return (
        <div className={`${className}`}>
            <SettingCard title={t("settings:theme.title")}>
                <SelectBoxSetting title={t("settings:theme.selectTheme")} 
                    selectedOption={theme}
                    options={themeOptions} onOptionChange={selectTheme}/>
            </SettingCard>
        </div>
    )
}

export default ThemeSettings;