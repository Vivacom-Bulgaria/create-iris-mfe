import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import bg from "./lang/bg"
import en from "./lang/en"

export const i18nNamespace = "template" as const

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      bg: { [i18nNamespace]: bg },
      en: { [i18nNamespace]: en },
    },
    ns: [i18nNamespace],
    defaultNS: i18nNamespace,
    lng: localStorage.getItem("iris-lang") ?? "bg",
    fallbackLng: "bg",
    interpolation: { escapeValue: false },
  })
}

// i18next only attaches `hasResourceBundle`/`addResourceBundle` to the instance inside `init()`,
// so this module cannot assume it runs after initialization. It does when loaded as a federated
// remote (the host initializes i18n before pulling us in), but not standalone: `import './i18n'`
// in main.tsx is hoisted and evaluated before main.tsx's own `init()` call. Register the bundles
// now if i18n is ready, otherwise wait for it, so either order works.
const addTranslationBundles = () => {
  if (!i18n.hasResourceBundle("bg", i18nNamespace)) {
    i18n.addResourceBundle("bg", i18nNamespace, bg, true, true)
  }
  if (!i18n.hasResourceBundle("en", i18nNamespace)) {
    i18n.addResourceBundle("en", i18nNamespace, en, true, true)
  }
}

if (i18n.isInitialized) {
  addTranslationBundles()
} else {
  i18n.on("initialized", addTranslationBundles)
}

export default i18n
