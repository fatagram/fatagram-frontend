import i18next from "i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const LANG_LIST = ["en", "vi"] as const; // Array of supported languages
export type Language = (typeof LANG_LIST)[number]; // Type of supported languages

// Language option type
interface LanguageOption {
  language: Language;
  display: string;
}

// Language context type
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: LanguageOption[];
}

// Language context
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider props
interface LanguageProviderProps {
  children?: React.ReactNode;
}

// Language Provider
export const LanguageProvider = React.memo(function LanguageProvider({ children }: LanguageProviderProps) {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "en",
  );
  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);

  const setLanguage = React.useCallback((lang: Language) => {
    setLang(lang);
  }, []);

  useEffect(() => {
    const langOptions: LanguageOption[] = LANG_LIST.map((lang) => ({
      language: lang,
      display: t(`language.${lang}`),
    }));
    setAvailableLanguages(langOptions);
  }, [t]);

  useEffect(() => {
    i18next.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }, [lang]);

  const value = React.useMemo(
    () => ({ 
      language: lang, 
      setLanguage, 
      availableLanguages 
    }),
    [lang, setLanguage, availableLanguages]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
});
