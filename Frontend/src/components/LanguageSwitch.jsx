import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const isKhmer = i18n.language === "kh";

  // This effect runs every time the language changes
  useEffect(() => {
    document.documentElement.setAttribute("lang", i18n.language);
    localStorage.setItem("i18nextLng", i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = isKhmer ? "en" : "kh";
    i18n.changeLanguage(newLang);
    
    // Save to local storage 
    localStorage.setItem("i18nextLng", newLang);
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div
        onClick={toggleLanguage}
        className="relative w-20 h-9 flex items-center bg-slate-100 rounded-full cursor-pointer p-1 shadow-inner border border-gray-200 transition-all duration-300 hover:shadow-md"
      >
        {/* Background Labels */}
        <div className="absolute inset-0 flex items-center justify-between px-2.5 select-none pointer-events-none">
          <span className={`text-[10px] font-black transition-opacity duration-300 ${isKhmer ? 'opacity-40' : 'opacity-100'}`}>
            EN
          </span>
          <span className={`text-[10px] font-black transition-opacity duration-300 ${isKhmer ? 'opacity-100' : 'opacity-40'}`}>
            KH
          </span>
        </div>

        {/* The Animated Slider */}
        <motion.div
          animate={{ x: isKhmer ? 44 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="relative w-7 h-7 bg-amber-400 rounded-full shadow-lg flex items-center justify-center z-10"
        >
          {/* Inner white dot */}
          <div className="w-2 h-2 bg-white rounded-full opacity-50" />
          
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-xs -z-10 opacity-60" />
        </motion.div>
      </div>
    </div>
  );
}