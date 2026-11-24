import { getAllActivities } from '@/lib/content';
import HomeClient from './HomeClient';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { pageMetadata } from '@/i18n/metadata';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  return pageMetadata(locale, '/');
}

export default async function Home({ params }: { params: LocaleParams }) {
  setRouteLocale((await params).locale);
  const allActivities = await getAllActivities();
  const activities = allActivities.slice(0, 6);

  return <HomeClient activities={activities} />;
}
