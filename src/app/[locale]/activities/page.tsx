import { getTranslations } from 'next-intl/server';
import { getAllActivities } from '@/lib/content';
import ActivitiesClient from './ActivitiesClient';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { pageMetadata } from '@/i18n/metadata';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'activities' });
  return pageMetadata(locale, '/activities', { title: t('pageTitle') });
}

export default async function ActivitiesPage({ params }: { params: LocaleParams }) {
  setRouteLocale((await params).locale);
  const activities = await getAllActivities();
  return <ActivitiesClient activities={activities} />;
}
