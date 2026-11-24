import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import SiteDocument from '@/components/layout/SiteDocument';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: LocaleParams;
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = setRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    keywords: ['东方Project', '東方Project', 'Touhou', '上海高校', '同人', '弹幕', '幻想乡', 'SCTA'],
    icons: {
      icon: [
        { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.json',
    appleWebApp: { capable: true, statusBarStyle: 'default', title: t('siteName') },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = setRouteLocale((await params).locale);

  return (
    <SiteDocument locale={locale}>
      <NextIntlClientProvider>
        <AppHeader />
        <main className="min-h-screen">{children}</main>
        <AppFooter />
      </NextIntlClientProvider>
    </SiteDocument>
  );
}
