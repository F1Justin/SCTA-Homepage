import { getTranslations } from 'next-intl/server';
import ActivityCard from '@/components/ActivityCard';
import type { Locale } from '@/i18n/routing';
import type { ActivitySummary } from '@/types/content';

const sizes = {
  home: '(max-width: 639px) calc(50vw - 24px), (max-width: 640px) 288px, (max-width: 767px) 182px, (max-width: 1023px) 219px, (max-width: 1279px) 304px, 390px',
  archive: '(max-width: 639px) calc(50vw - 24px), (max-width: 640px) 288px, (max-width: 767px) 182px, (max-width: 1023px) 224px, (max-width: 1279px) 310px, (max-width: 1535px) 395px, 480px',
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
        priority={placement === 'archive' && index === 0}
      />
    </div>
  ));

  return ([2, 3] as const).map(count => (
    <div data-activity-masonry={count} className="activity-masonry w-auto -mx-2 sm:-mx-4" key={count}>
      {Array.from({ length: Math.min(count, cards.length) }, (_, column) => (
        <div className="px-2 sm:px-4 activity-masonry-column" key={column}>
          {cards.filter((_, index) => index % count === column)}
        </div>
      ))}
    </div>
  ));
}
