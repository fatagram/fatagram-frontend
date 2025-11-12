import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { userConfigService } from "@/api/user/user-config.api";
import { useLanguage } from "@/hooks/utilities/use-language";
import { Language } from "@/contexts/common/language-context";
import { Option, OptionKey, SelectBox } from "@/components/atoms";

interface SelectLanguageProps {
  className?: string;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({ className }) => {
  const [langs, setLangs] = useState<Option[]>([]);
  const { language, setLanguage, availableLanguages } = useLanguage();

  const selectLanguage = async (opt: OptionKey) => {
    setLanguage(opt as Language);
    await userConfigService.changeLanguage({ LanguageCode: opt as string });
    window.location.reload();
  };

  useEffect(() => {
    const options: Option[] = availableLanguages.map((lang) => ({
      key: lang.language,
      value: lang.display,
    }));
    setLangs(options);
  }, [availableLanguages]);

  return (
    <SelectBox
      className={clsx(className)}
      options={langs}
      selectedOption={language}
      onSelect={selectLanguage}
    />
  );
};

export default SelectLanguage;
