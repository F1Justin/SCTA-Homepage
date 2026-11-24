import { getActivitySummaries } from '@/lib/content';
import ActivityMasonry from '@/components/ActivityMasonry';
import HomeSections from './HomeSections';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { pageMetadata } from '@/i18n/metadata';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  return pageMetadata(locale, '/');
}

export default async function Home({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const activities = await getActivitySummaries(6);
  return <HomeSections locale={locale} activities={<ActivityMasonry activities={activities} locale={locale} placement="home" />} />;
}
