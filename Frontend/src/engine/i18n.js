import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enHome } from '../locales/en/homeContent.js';
import { khHome } from '../locales/kh/homeContent.js';
import { enNav } from '../locales/en/navContent.js';
import { khNav } from '../locales/kh/navContent.js';
import { enFooter } from '../locales/en/footerContent.js';
import { khFooter } from '../locales/kh/footerContent.js';

// 1. Check if a language was saved previously, otherwise default to "en"
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        translation: { 
          ...enHome, 
          nav: enNav,
          footer: enFooter
        } 
      },
      kh: { 
        translation: { 
          ...khHome, 
          nav: khNav,
          footer: khFooter
        } 
      }
    },
    lng: savedLanguage, 
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;