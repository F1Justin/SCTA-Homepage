import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { ACTIVITY_TIME_ZONE } from './activity-date';
import { routing, type Locale } from './routing';

const loadMessages = {
  zh: () => import('../../messages/zh.json'),
  en: () => import('../../messages/en.json'),
  ja: () => import('../../messages/ja.json'),
} satisfies Record<Locale, () => Promise<unknown>>;

export default getRequestConfig(async ({ locale: explicitLocale, requestLocale }) => {
  const requestedLocale = explicitLocale ?? await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;

  return {
    locale,
    timeZone: ACTIVITY_TIME_ZONE,
    messages: (await loadMessages[locale]()).default,
  };
});
