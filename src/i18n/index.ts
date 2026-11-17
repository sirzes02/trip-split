import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

const deviceLanguage = getLocales()[0]?.languageCode;

const supportedLanguage = deviceLanguage === "es" ? "es" : "en";

// eslint-disable-next-line import/no-named-as-default-member -- i18next's default instance uses .use() to register plugins.
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: supportedLanguage,
  fallbackLng: "en",
  supportedLngs: ["es", "en"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
