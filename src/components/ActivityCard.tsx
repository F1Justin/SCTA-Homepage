'use client';

import type { Activity } from '@/types/content';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ActivityCardProps {
  activity: Activity;
  index: number;
}

export default function ActivityCard({ activity, index }: ActivityCardProps) {
  const t = useTranslations('activities');
  const [imageAspectRatio, setImageAspectRatio] = useState(3/4);

  useEffect(() => {
    if (!activity.image) return;
    const img = new window.Image();
    img.src = activity.image;
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
    };
  }, [activity.image]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  const plainPreview = activity.contentHtml
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/activities/${activity.slug}`}>
        <div 
          className="relative rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
          style={{ 
            aspectRatio: activity.image ? imageAspectRatio : 16/9
          }}
        >
          {activity.image ? (
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-all duration-300 hover:scale-105"
              priority={index < 6}
              loading={index < 6 ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-red/20 to-brand-blue/20">
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">{activity.title}</span>
            </div>
          )}
          <div className="absolute top-0 right-0 bg-red-50 dark:bg-red-900/30 text-brand-red dark:text-red-400 px-3 py-1 text-sm font-medium rounded-bl-lg z-10">
            {activity.category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-brand-red dark:text-red-400 break-words hyphens-auto mb-2" style={{ wordBreak: 'break-word' }}>{activity.title}</h3>
          <div className="hidden sm:block">
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{plainPreview}</p>
          </div>
          <div className="flex justify-end sm:justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
            <span className="text-brand-blue dark:text-blue-400 font-medium text-sm items-center hidden sm:inline-flex">
              {t('learnMore')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
