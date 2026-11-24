import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { ActivitySummary } from '@/types/content';
import { formatActivityDate } from '@/i18n/activity-date';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import './activity-masonry.css';

interface ActivityCardProps {
  activity: ActivitySummary;
  index: number;
  locale: Locale;
  learnMore: string;
  sizes: string;
  priority: boolean;
}

export default function ActivityCard({ activity, index, locale, learnMore, sizes, priority }: ActivityCardProps) {
  const { poster } = activity;
  const aspectRatio = poster ? `${poster.width} / ${poster.height}` : '16 / 9';

  return (
    <div className="activity-card" style={{ '--card-delay': `${index * 100}ms` } as CSSProperties}>
      <Link href={`/activities/${encodeURIComponent(activity.slug)}`} prefetch={false}>
        <div className="activity-card-cover" style={{ aspectRatio }}>
          {poster ? (
            <Image
              src={poster.src}
              alt={activity.title}
              fill
              unoptimized={poster.unoptimized}
              sizes={sizes}
              className="activity-card-poster"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-red/20 to-brand-blue/20">
              <span lang="zh" className="text-2xl font-bold text-gray-400 dark:text-gray-500">{activity.title}</span>
            </div>
          )}
          <span lang="zh" className="activity-card-category">{activity.category}</span>
        </div>
        <div className="activity-card-caption">
          <h3 lang="zh" className="activity-card-title">{activity.title}</h3>
          <div className="hidden sm:block">
            <p lang="zh" className="activity-card-preview">{activity.preview}</p>
          </div>
          <div className="activity-card-meta">
            <time dateTime={activity.date} className="text-sm text-gray-500 dark:text-gray-400">{formatActivityDate(activity.date, locale)}</time>
            <span className="text-brand-blue dark:text-blue-400 font-medium text-sm items-center hidden sm:inline-flex">
              {learnMore}
              <svg aria-hidden="true" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
