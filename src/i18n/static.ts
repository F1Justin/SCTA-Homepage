import { unstable_setRequestLocale } from 'next-intl/server';

export function setStaticLocale(locale: string) {
  unstable_setRequestLocale(locale);
}
