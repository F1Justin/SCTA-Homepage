import { pageMetadata } from '@/i18n/metadata';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { getTranslations } from 'next-intl/server';
import BadgeView from './BadgeView';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'badges' });
  return pageMetadata(locale, '/badges', { title: t('title'), hidden: true });
}

export default function Page() {
  return <BadgeView />;
}
