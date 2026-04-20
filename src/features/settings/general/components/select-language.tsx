import React from "react";
import clsx from "clsx";
import { Option, OptionKey, SelectBox } from "@/components/atoms";
import { LocaleKeys, useLanguage } from "@/hooks/use-trans";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "../hooks/use-change-language";

interface SelectLanguageProps {
  className?: string;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({ className }) => {
  const { t } = useTranslation();
  const { changeLanguage, availableLanguages, currentLanguage } = useLanguage();
  const { fetch: changeLanguageFetch } = useChangeLanguage();
  const options: Option[] = availableLanguages.map((lang) => ({
    key: lang,
    value: t(`common:language.${lang}`),
  }));

  const _changeLanguage = (key: OptionKey) => {
    changeLanguageFetch(key as LocaleKeys, {
      onSuccess: () => {
        changeLanguage(key as LocaleKeys);
      },
    });
  };

  return (
    <SelectBox
      showTitle={false}
      title={t("settings:language.yourLanguage")}
      className={clsx(className)}
      options={options}
      selectedOption={currentLanguage ?? "en"}
      onSelect={_changeLanguage}
    />
  );
};

export default SelectLanguage;
