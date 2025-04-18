import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import vi from "./locales/vi/translation.json";

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });
