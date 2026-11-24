import { getTranslations } from 'next-intl/server';
import { getActivitySummaries } from '@/lib/content';
import ActivityMasonry from '@/components/ActivityMasonry';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { pageMetadata } from '@/i18n/metadata';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'activities' });
  return pageMetadata(locale, '/activities', { title: t('pageTitle') });
}

export default async function ActivitiesPage({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const [t, activities] = await Promise.all([
    getTranslations({ locale, namespace: 'activities' }),
    getActivitySummaries(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 activity-archive">
      <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 mb-12 text-center">{t('pageTitle')}</h1>
      {activities.length ? (
        <div className="relative"><ActivityMasonry activities={activities} locale={locale} placement="archive" /></div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-400 mb-4">{t('noActivities')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('noActivitiesHint')}</p>
        </div>
      )}
    </div>
  );
}
