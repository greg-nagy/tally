import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { DEFAULT_LANGUAGE, resources } from "./index"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      bindI18n: "languageChanged",
    },
  })

const getLanguage = (): string => i18n.language
const setLanguage = (lang: string) => i18n.changeLanguage(lang)

export { i18n, getLanguage, setLanguage }

export default i18n
