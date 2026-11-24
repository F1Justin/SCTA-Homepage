import type { Locale } from './routing';

export const ACTIVITY_TIME_ZONE = 'Asia/Shanghai';

const dateLocales: Record<Locale, string> = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' };
const dateFormatters = new Map<Locale, Intl.DateTimeFormat>();

export function parseActivityDate(value: string) {
  const localDate = /^\d{4}-\d{2}-\d{2}$/;
  const localDateTime = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/;
  if (localDate.test(value)) return new Date(`${value}T00:00:00+08:00`);
  if (localDateTime.test(value)) return new Date(`${value.replace(' ', 'T')}+08:00`);
  return new Date(value);
}

export function formatActivityDate(value: string, locale: Locale) {
  const date = parseActivityDate(value);
  if (Number.isNaN(date.getTime())) return '';
  let formatter = dateFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(dateLocales[locale], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: ACTIVITY_TIME_ZONE,
    });
    dateFormatters.set(locale, formatter);
  }
  return formatter.format(date);
}
