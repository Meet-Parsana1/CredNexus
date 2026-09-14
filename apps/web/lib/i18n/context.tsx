'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LOCALE, LanguageDefinition } from './languages';
import { TRANSLATIONS } from './translations';

interface LanguageContextType {
  locale: string;
  setLocale: (code: string) => void;
  dir: 'ltr' | 'rtl';
  currentLanguage: LanguageDefinition;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem('crednexus_locale');
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLocaleState(saved);
    }
  }, []);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === locale) || SUPPORTED_LANGUAGES[0];

  const setLocale = (code: string) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      setLocaleState(code);
      localStorage.setItem('crednexus_locale', code);
      // update html attributes
      document.documentElement.lang = code;
      const langDef = SUPPORTED_LANGUAGES.find((l) => l.code === code);
      document.documentElement.dir = langDef ? langDef.dir : 'ltr';
    }
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.dir;
  }, [currentLanguage]);

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[locale] || TRANSLATIONS['en'];
    if (dict && dict[key]) {
      return dict[key];
    }
    // fallback to english
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        dir: currentLanguage.dir,
        currentLanguage,
        t,
      }}
    >
      <div dir={currentLanguage.dir} className={currentLanguage.dir === 'rtl' ? 'rtl-layout' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
