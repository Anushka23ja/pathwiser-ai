import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en";
import zh from "./locales/zh";
import es from "./locales/es";
import ar from "./locales/ar";
import pt from "./locales/pt";
import fr from "./locales/fr";
import de from "./locales/de";
import hi from "./locales/hi";
import ja from "./locales/ja";
import ko from "./locales/ko";
import ru from "./locales/ru";

export const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文 (简体)", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, zh, es, ar, pt, fr, de, hi, ja, ko, ru },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "pathwise-language",
      caches: ["localStorage"],
    },
  });

export default i18n;
