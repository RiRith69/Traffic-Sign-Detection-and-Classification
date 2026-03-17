import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enHome } from "../locales/en/homeContent";
import { khHome } from "../locales/kh/homeContent";
import { enNav } from "../locales/en/navContent";
import { khNav } from "../locales/kh/navContent";
import { enFooter } from "../locales/en/footerContent";
import { khFooter } from "../locales/kh/footerContent";
import { enSigns } from "../locales/en/signContent";
import { khSigns } from "../locales/kh/signContent";
import { enDetect } from "../locales/en/detectContent";
import { khDetect } from "../locales/kh/detectContent";
import { enImageDetect } from "../locales/en/imageDetectContent";
import { khImageDetect } from "../locales/kh/imageDetectContent";
import { enVideo } from "../locales/en/videoContent";
import { khVideo } from "../locales/kh/videoContent";
import { enWebcam } from "../locales/en/webcamContent";
import { khWebcam } from "../locales/kh/webcamContent";
import  featureEn  from "../locales/en/featureContent.js";
import  featureKh  from "../locales/kh/featureContent.js";
const savedLanguage = localStorage.getItem("i18nextLng") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          ...enHome,
          nav: enNav,
          footer: enFooter,
          featureContent: featureEn,   
          ...enSigns,
          ...enDetect,
          ...enImageDetect,
          ...enVideo,
          ...enWebcam
        }
      },

      kh: {
        translation: {
          ...khHome,
          nav: khNav,
          footer: khFooter,
          featureContent: featureKh, 
          ...khSigns,
          ...khDetect,
          ...khImageDetect,
          ...khVideo,
          ...khWebcam
        }
      }
    },

    lng: savedLanguage,     // current language
    fallbackLng: "en",      // fallback if translation missing

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;