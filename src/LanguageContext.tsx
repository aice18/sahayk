import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';

type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as' | 'mai' | 'sat' | 'ks' | 'ne' | 'kok' | 'sd' | 'doi' | 'mni' | 'brx' | 'sa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  colorBlindMode: boolean;
  setColorBlindMode: (val: boolean) => void;
  largeFontMode: boolean;
  setLargeFontMode: (val: boolean) => void;
  sarvamTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sahayk_lang');
    return (saved as Language) || 'en';
  });

  const [colorBlindMode, setColorBlindMode] = useState(() => {
    return localStorage.getItem('sahayk_colorblind') === 'true';
  });

  const [largeFontMode, setLargeFontMode] = useState(() => {
    return localStorage.getItem('sahayk_largefont') === 'true';
  });

  const [sarvamTranslating, setSarvamTranslating] = useState(false);
  const [sarvamCache, setSarvamCache] = useState<Record<string, Record<string, string>>>({});

  // Sarvam API translation function
  const translateWithSarvam = async (text: string, targetLanguage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_SARVAM_API_KEY || process.env.SARVAM_API_KEY;

    if (!apiKey) {
      console.warn('Sarvam API key not found, using fallback');
      return text;
    }

    try {
      const response = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: text,
          source_language_code: 'en-IN',
          target_language_code: targetLanguage,
          speaker_gender: 'Male',
          mode: 'formal',
          model: 'mayura:v1',
          enable_preprocessing: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sarvam API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translated_text || text;
    } catch (error) {
      console.error('Sarvam translation failed:', error);
      return text; // Fallback to original text
    }
  };

  useEffect(() => {
    localStorage.setItem('sahayk_lang', language);

    if (language !== 'en') {
      setSarvamTranslating(true);

      // Real Sarvam API integration
      // Note: This would translate missing keys, but for demo we'll keep simulation
      setTimeout(() => setSarvamTranslating(false), 800);
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sahayk_colorblind', String(colorBlindMode));
    if (colorBlindMode) {
      document.documentElement.classList.add('color-blind');
    } else {
      document.documentElement.classList.remove('color-blind');
    }
  }, [colorBlindMode]);

  useEffect(() => {
    localStorage.setItem('sahayk_largefont', String(largeFontMode));
    if (largeFontMode) {
      document.documentElement.classList.add('large-font');
    } else {
      document.documentElement.classList.remove('large-font');
    }
  }, [largeFontMode]);

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value) value = value[k];
    }

    if (!value) {
       // Fallback to English dictionary but queue Sarvam translation
       let fallbackVal: any = translations['en'];
       for (const k of keys) {
         if (fallbackVal) fallbackVal = fallbackVal[k];
       }
       if (!fallbackVal) return key;

       // Check Sarvam cache first
       if (sarvamCache[language]?.[key]) {
         value = sarvamCache[language][key];
       } else {
         // Trigger Sarvam translation in background
         translateWithSarvam(String(fallbackVal), language).then(translated => {
           setSarvamCache(prev => ({
             ...prev,
             [language]: {
               ...prev[language],
               [key]: translated
             }
           }));
         }).catch(err => {
           console.warn('Sarvam translation failed for key:', key, err);
         });

         // Return English fallback while translation happens
         value = fallbackVal;
       }
    }

    let result = String(value);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
    }

    return result;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, setLanguage, t, 
      colorBlindMode, setColorBlindMode, 
      largeFontMode, setLargeFontMode,
      sarvamTranslating
    }}>
      {children}
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
