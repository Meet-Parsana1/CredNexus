export const RTL_LOCALES = ['ur'];

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale.toLowerCase());
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}
