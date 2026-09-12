import { useEffect, useState, type ReactNode } from 'react';
import { en } from './en';
import { fr } from './fr';
import type { Locale, SiteContent } from './types';
import { LocaleContext } from './useLocale';

const content: Record<Locale, SiteContent> = { fr, en };
const STORAGE_KEY = 'locale';

const initialLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch {
    /* storage unavailable */
  }
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = content[locale].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', content[locale].meta.description);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage unavailable */
    }
  }, [locale]);

  const toggle = () => {
    document.documentElement.classList.add('lang-switching');
    setTimeout(() => {
      setLocale((current) => (current === 'fr' ? 'en' : 'fr'));
      requestAnimationFrame(() => document.documentElement.classList.remove('lang-switching'));
    }, 230);
  };

  return (
    <LocaleContext.Provider value={{ locale, content: content[locale], toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

