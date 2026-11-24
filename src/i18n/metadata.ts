import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPathname } from './navigation';
import { routing, type Locale } from './routing';

export const SITE_URL = 'https://www.scta.cc';

const openGraphLocales: Record<Locale, string> = { zh: 'zh_CN', en: 'en_US', ja: 'ja_JP' };

export function siteUrl(locale: Locale, pathname: string) {
  return new URL(getPathname({ locale, href: pathname }), SITE_URL).href;
}

export function alternateUrls(pathname: string) {
  return {
    ...Object.fromEntries(routing.locales.map(locale => [locale, siteUrl(locale, pathname)])),
    'x-default': siteUrl(routing.defaultLocale, pathname),
  };
}

export async function pageMetadata(locale: Locale, pathname: string, options: {
  title?: string;
  description?: string;
  image?: string;
  hidden?: boolean;
} = {}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteName = t('siteName');
  const title = options.title ? `${options.title} | ${siteName}` : t('title');
  const description = options.description || t('description');
  const canonical = siteUrl(locale, pathname);
  const image = options.image
    ? { url: options.image, alt: options.title ?? siteName }
    : { url: '/Logos/上海.png', width: 2989, height: 4094, alt: siteName };

  return {
    title,
    description,
    alternates: { canonical, languages: alternateUrls(pathname) },
    openGraph: {
      type: 'website',
      url: canonical,
      locale: openGraphLocales[locale],
      alternateLocale: routing.locales.filter(other => other !== locale).map(other => openGraphLocales[other]),
      siteName,
      title,
      description,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    ...(options.hidden && { robots: { index: false, follow: false } }),
  };
}
