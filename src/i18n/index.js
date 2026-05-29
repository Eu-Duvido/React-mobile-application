import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'

import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

const deviceLanguage = getLocales()[0]?.languageTag ?? 'pt-BR'

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en: { translation: en },
  },
  lng: deviceLanguage,
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false },
})

export default i18n
