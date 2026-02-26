import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' });
  const SITE_URL = 'https://www.scta.cc';

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: t('siteName'),
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        'zh': SITE_URL,
        'en': `${SITE_URL}/en`,
        'ja': `${SITE_URL}/ja`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  if (!locales.includes(params.locale as Locale)) {
    notFound();
  }

  unstable_setRequestLocale(params.locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AppHeader />
      <main className="min-h-screen">{children}</main>
      <AppFooter />
    </NextIntlClientProvider>
  );
}
