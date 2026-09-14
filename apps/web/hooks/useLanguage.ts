'use client';

import { useLanguage as useLanguageContext } from '../lib/i18n/context';

export function useLanguage() {
  return useLanguageContext();
}
