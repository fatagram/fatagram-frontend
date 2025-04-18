import React, { useEffect, useState } from "react";
import { Theme, useTheme } from "../../../../contexts/ThemeContext";
import SettingCard from "@/components/common/container/SettingCard";
import SelectBoxSetting from "@/components/common/container/SettingCard/SettingItem/SelectBoxSetting";
import { Option, OptionKey } from "@/components/common/ui/SelectBox/SelectBox";

interface ThemeSettingsProps {
    className?: string;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({className}) => {

    const { theme, setTheme, availableThemes } = useTheme();
    const [themeOptions, setThemeOptions] = useState<Option[]>([]);

    const selectTheme = (opt: OptionKey) => {
        setTheme(opt as Theme);
    }

    useEffect(() => {
        const options: Option[] = availableThemes.map((theme) => ({ key: theme.theme, value: theme.display }));
        setThemeOptions(options)
    }, [availableThemes]) 

    return (
        <div className={`${className}`}>
            <SettingCard className={``} title="Theme Settings">
                <SelectBoxSetting title="Select theme" 
                    selectedOption={theme}
                    options={themeOptions} onOptionChange={selectTheme}/>
            </SettingCard>
        </div>
    )
}

export default ThemeSettings;