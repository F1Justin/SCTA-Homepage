import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export type LocaleParams = Promise<{ locale: string }>;

export function setRouteLocale(locale: string) {
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

// Next 15 supplies encoded segments to the static render as well as decoded ones on some requests.
export function decodeRouteSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
