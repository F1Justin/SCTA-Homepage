import '@/styles/badges.css';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';

export default async function BadgesLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const { badges } = await getMessages({ locale });
  return <NextIntlClientProvider messages={{ badges }}>{children}</NextIntlClientProvider>;
}
