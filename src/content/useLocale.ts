import { createContext, useContext } from 'react';
import type { Locale, SiteContent } from './types';

export type LocaleValue = { locale: Locale; content: SiteContent; toggle: () => void };

export const LocaleContext = createContext<LocaleValue | null>(null);

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale needs a LocaleProvider');
  return value;
}
