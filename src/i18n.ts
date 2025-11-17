import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { defaultNS, namespaces, resources } from "./locales";

i18next.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("i18nextLng") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  ns: namespaces,
  defaultNS: defaultNS,
});
