import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import SiteDocument from '@/components/layout/SiteDocument';
import NotFoundMessage from '@/components/layout/NotFoundMessage';
import { routing } from '@/i18n/routing';
import { setRouteLocale } from '@/i18n/route-locale';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'errors' });
  return { title: t('notFound'), robots: { index: false } };
}

export default function GlobalNotFound() {
  const locale = setRouteLocale(routing.defaultLocale);
  return (
    <SiteDocument locale={locale}>
      <main><NotFoundMessage /></main>
    </SiteDocument>
  );
}
