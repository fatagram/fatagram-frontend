import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultNS, namespaces, resources } from "./locales";

let detectedLanguage = "en";
if (typeof window !== "undefined" && window.navigator) {
  const browserLang = window.navigator.language || (window.navigator as any).userLanguage || "en";
  const shortLang = browserLang.split("-")[0];
  if (shortLang === "vi" || shortLang === "en") {
    detectedLanguage = shortLang;
  }
}

i18next.use(initReactI18next).init({
  resources,
  lng: detectedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  ns: namespaces,
  defaultNS: defaultNS,
});
