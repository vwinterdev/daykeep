import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { Language } from '@/modules/common/enums/Language'
import { applyTheme, readPreferences } from '@/modules/common/services/preferences'

const preferences = readPreferences()
applyTheme(preferences.theme)

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

export const i18nReady = i18n.use(Backend).use(initReactI18next).init({
  lng: preferences.language,
  fallbackLng: Language.English,
  supportedLngs: Object.values(Language),
  load: 'languageOnly',
  backend: { loadPath: '/locales/{{lng}}/translation.json' },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

export default i18n
