// hooks/useTrans.js
import { ENGLISH_LANG } from "@/lib/eng_lang";
import { HINDI_LANG } from "@/lib/hindi_lang";
import { useMemo } from "react";

const useTrans = (language2 = localStorage.getItem("language") ?? "en") => {
  const language = localStorage.getItem("language");
  
  const translations = useMemo(() => {
    return language === "hi" ? HINDI_LANG : ENGLISH_LANG;
  }, [language]);

  const t = (key, params = {}) => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    
    // Replace placeholders with actual values
    let translatedText = translations[key];
    Object.keys(params).forEach(param => {
      translatedText = translatedText.replace(`\${${param}}`, params[param]);
    });
    
    return translatedText;
  };

  return t;
};

export default useTrans;