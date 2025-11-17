import React from "react";
import clsx from "clsx";
import { Option, OptionKey, SelectBox } from "@/components/atoms";
import { useLanguage } from "@/hooks/use-trans";
import { useTranslation } from "react-i18next";

interface SelectLanguageProps {
  className?: string;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({ className }) => {
  const { t } = useTranslation();
  const { changeLanguage, availableLanguages, currentLanguage } = useLanguage();
  const options: Option[] = availableLanguages.map((lang) => ({
    key: lang,
    value: t(`common:language.${lang}`),
  }));

  const _changeLanguage = (key: OptionKey) => {
    changeLanguage(key as any);
  };

  return (
    <SelectBox
      className={clsx(className)}
      options={options}
      selectedOption={currentLanguage}
      onSelect={_changeLanguage}
    />
  );
};

export default SelectLanguage;
