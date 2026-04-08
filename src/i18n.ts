import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import bn from './locales/bn/translation.json';
import ta from './locales/ta/translation.json';
import te from './locales/te/translation.json';
import mr from './locales/mr/translation.json';
import gu from './locales/gu/translation.json';
import kn from './locales/kn/translation.json';
import ml from './locales/ml/translation.json';
import pa from './locales/pa/translation.json';
import or from './locales/or/translation.json';
import as from './locales/as/translation.json';
import mai from './locales/mai/translation.json';
import sat from './locales/sat/translation.json';
import ks from './locales/ks/translation.json';
import ne from './locales/ne/translation.json';
import kok from './locales/kok/translation.json';
import sd from './locales/sd/translation.json';
import doi from './locales/doi/translation.json';
import mni from './locales/mni/translation.json';
import brx from './locales/brx/translation.json';
import sa from './locales/sa/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      ta: { translation: ta },
      te: { translation: te },
      mr: { translation: mr },
      gu: { translation: gu },
      kn: { translation: kn },
      ml: { translation: ml },
      pa: { translation: pa },
      or: { translation: or },
      as: { translation: as },
      mai: { translation: mai },
      sat: { translation: sat },
      ks: { translation: ks },
      ne: { translation: ne },
      kok: { translation: kok },
      sd: { translation: sd },
      doi: { translation: doi },
      mni: { translation: mni },
      brx: { translation: brx },
      sa: { translation: sa },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'sahayk_lang',
    },
  });

export default i18n;
