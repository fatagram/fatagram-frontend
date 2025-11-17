import { resources } from "@/locales";
import i18next from "i18next";

export type LocaleKeys = keyof typeof resources;

export const useLanguage = () => {
  const changeLanguage = (lng: LocaleKeys) => {
    console.log("Changing language to:", lng);
    i18next.changeLanguage(lng);
  };

  const currentLanguage = i18next.language.split("-")[0] as LocaleKeys;

  const availableLanguages = Object.keys(resources) as LocaleKeys[];

  return { changeLanguage, availableLanguages, currentLanguage };
};
