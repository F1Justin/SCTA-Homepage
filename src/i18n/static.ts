import { setRequestLocale } from 'next-intl/server';

export function setStaticLocale(locale: string) {
  setRequestLocale(locale);
}
