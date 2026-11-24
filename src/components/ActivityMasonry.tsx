import { getTranslations } from 'next-intl/server';
import ResponsiveColumns from '@/components/ResponsiveColumns';
import ActivityCard from '@/components/ActivityCard';
import type { Locale } from '@/i18n/routing';
import type { ActivitySummary } from '@/types/content';

const sizes = {
  home: '(max-width: 640px) calc(50vw - 17px), (max-width: 767px) 182px, (max-width: 1023px) 219px, (max-width: 1279px) 304px, 390px',
  archive: '(max-width: 640px) calc(50vw - 17px), (max-width: 767px) 182px, (max-width: 1023px) 224px, (max-width: 1279px) 310px, (max-width: 1535px) 395px, 480px',
};

export default async function ActivityMasonry({ activities, locale, placement }: {
  activities: ActivitySummary[];
  locale: Locale;
  placement: keyof typeof sizes;
}) {
  const t = await getTranslations({ locale, namespace: 'activities' });
  const learnMore = t('learnMore');
  const cards = activities.map((activity, index) => (
    <div className="mb-4 sm:mb-8 activity-masonry-item" key={activity.slug}>
      <ActivityCard
        activity={activity}
        index={index}
        locale={locale}
        learnMore={learnMore}
        sizes={sizes[placement]}
        loading={placement === 'home' || index >= 3 ? 'lazy' : index === 0 ? 'preload' : 'eager'}
      />
    </div>
  ));

  return <ResponsiveColumns cards={cards} className="activity-masonry" />;
}
