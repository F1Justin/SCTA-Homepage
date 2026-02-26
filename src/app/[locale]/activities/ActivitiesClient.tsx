'use client';

import type { Activity } from '@/types/content';
import ActivityCard from '@/components/ActivityCard';
import Masonry from 'react-masonry-css';
import { useTranslations } from 'next-intl';

const masonryBreakpoints = {
  default: 3,
  640: 2,
};

interface ActivitiesClientProps {
  activities: Activity[];
}

export default function ActivitiesClient({ activities }: ActivitiesClientProps) {
  const t = useTranslations('activities');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 mb-12 text-center">{t('pageTitle')}</h1>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">{t('noActivities')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('noActivitiesHint')}</p>
        </div>
      ) : (
        <div className="relative">
          <Masonry breakpointCols={masonryBreakpoints} className="flex w-auto -mx-2 sm:-mx-4" columnClassName="px-2 sm:px-4">
            {activities.map((activity, index) => (
              <div key={activity.slug} className="mb-4 sm:mb-8">
                <ActivityCard activity={activity} index={index} />
              </div>
            ))}
          </Masonry>
        </div>
      )}
    </div>
  );
}
