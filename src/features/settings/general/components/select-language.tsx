import React from "react";
import clsx from "clsx";
import { Option, OptionKey } from "@/components/atoms";
import { LocaleKeys, useLanguage } from "@/hooks/use-trans";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "../hooks/use-change-language";
import { SmartSelectBox } from "@/components/ui/smart-select-box";

const VietnamFlag = () => (
  <svg viewBox="0 0 60 40" className="w-[22px] h-[15px] rounded-sm overflow-hidden flex-shrink-0">
    <rect width="60" height="40" fill="#da251d" />
    <polygon points="30,8 33,18 43,18 35,24 38,34 30,28 22,34 25,24 17,18 27,18" fill="#ffff00" />
  </svg>
);

const UKFlag = () => (
  <svg viewBox="0 0 60 40" className="w-[22px] h-[15px] rounded-sm overflow-hidden flex-shrink-0">
    <rect width="60" height="40" fill="#012169" />
    <path d="M0,0 L60,40 M0,40 L60,0" stroke="#fff" strokeWidth="4" />
    <path d="M0,0 L60,40 M0,40 L60,0" stroke="#da251d" strokeWidth="1.5" />
    <path d="M30,0 L30,40 M0,20 L60,20" stroke="#fff" strokeWidth="8" />
    <path d="M30,0 L30,40 M0,20 L60,20" stroke="#da251d" strokeWidth="4" />
  </svg>
);

interface SelectLanguageProps {
  className?: string;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({ className }) => {
  const { t } = useTranslation();
  const { changeLanguage, availableLanguages, currentLanguage } = useLanguage();
  const { fetch: changeLanguageFetch } = useChangeLanguage();

  const options: Option[] = availableLanguages.map((lang) => ({
    key: lang,
    value: (
      <div className="flex items-center gap-3">
        {lang === "vi" ? <VietnamFlag /> : <UKFlag />}
        <span>{t(`common:language.${lang}`)}</span>
      </div>
    ),
  }));

  const _changeLanguage = (key: OptionKey) => {
    changeLanguageFetch(key as LocaleKeys, {
      onSuccess: () => {
        changeLanguage(key as LocaleKeys);
      },
    });
  };

  return (
    <SmartSelectBox
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
