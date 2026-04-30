import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OptionKey, Option } from "@/components/atoms/selectbox/selectbox";
import SelectBoxSetting from "../../components/selectbox-setting";
import { Theme, useTheme } from "@/contexts";
import { SidebarPageCard } from "@/features/components/sidebar-page-layout";

interface ThemeSettingsProps {}

const ThemeSettings: React.FC<ThemeSettingsProps> = () => {
  const { availableThemes, theme, setTheme } = useTheme();
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
  }, [availableThemes, t]);

  return (
    <SidebarPageCard title={t("settings:theme.title")}>
      <SelectBoxSetting
        title={t("settings:theme.selectTheme")}
        selectedOption={theme}
        options={themeOptions}
        onOptionChange={selectTheme}
      />
    </SidebarPageCard>
  );
};

export default ThemeSettings;
