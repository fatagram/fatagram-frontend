import React, { useEffect, useState } from "react";
import clsx from "clsx";
import SettingCard from "@/components/molecules/card";
import { useTranslation } from "react-i18next";
import { OptionKey, Option } from "@/components/atoms/selectbox/selectbox";
import SelectBoxSetting from "../../components/selectbox-setting";
import { availableThemes, Theme, useTheme } from "@/contexts/common/theme-context";

interface ThemeSettingsProps {
  className?: string;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const [themeOptions, setThemeOptions] = useState<Option[]>([]);
  const { t } = useTranslation() as { t: (key: string) => string };

  const selectTheme = (opt: OptionKey) => {
    setTheme(opt as Theme);
  };

  useEffect(() => {
    const options: Option[] = availableThemes.map((theme) => ({
      key: theme.key,
      value: t(theme.label),
    }));
    setThemeOptions(options);
  }, [availableThemes]);

  return (
    <div className={clsx(className)}>
      <SettingCard title={t("settings:theme.title")}>
        <SelectBoxSetting
          title={t("settings:theme.selectTheme")}
          selectedOption={theme}
          options={themeOptions}
          onOptionChange={selectTheme}
        />
      </SettingCard>
    </div>
  );
};

export default ThemeSettings;
