import React, { createContext, useEffect, useState, useContext, useMemo } from 'react';
import es from '../translations/es.json';
import ca from '../translations/ca.json';

const translations = { es, ca };

const LanguageContext = createContext({
  language: 'es',
  setLanguage: () => {},
  t: (k) => k
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('app_language') || 'es';
    } catch (e) {
      return 'es';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_language', language);
    } catch (e) {}
    try { document.documentElement.lang = language; } catch (e) {}
  }, [language]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const t = (key, vars) => {
    const dict = translations[language] || {};
    let txt = dict[key] ?? key;
    if (vars && typeof vars === 'object') {
      Object.keys(vars).forEach(k => {
        const re = new RegExp(`\\{${k}\\}`, 'g');
        txt = txt.replace(re, String(vars[k]));
      });
    }
    return txt;
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
