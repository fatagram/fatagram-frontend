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
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: LanguageOption[];
}

// Language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider props
interface LanguageProviderProps {
  children?: React.ReactNode;
}

// Language Provider
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem("language") as Language) || "en",
  );
  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);

  const setLanguage = (lang: Language) => setLang(lang);

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

  return (
    <LanguageContext.Provider
      value={{ language: lang, setLanguage: setLanguage, availableLanguages: availableLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage muse be used within LanguageProvider.");
  return context;
};
