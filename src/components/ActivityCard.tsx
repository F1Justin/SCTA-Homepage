'use client';

import { Activity } from '@/lib/contentful';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ActivityCardProps {
  activity: Activity;
  index: number;
}

export default function ActivityCard({ activity, index }: ActivityCardProps) {
  const [imageAspectRatio, setImageAspectRatio] = useState(3/4); // 默认比例

  useEffect(() => {
    // 预加载图片以获取实际尺寸
    const img = new window.Image();
    img.src = activity.image || '/activities/placeholder.jpg';
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
    };
  }, [activity.image]);

  // Format date 
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  // Convert rich text to plain text for preview
  const plainTextDescription = documentToPlainTextString(activity.description);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/activities/${activity.id}`}>
        <div 
          className="relative rounded-t-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
          style={{ aspectRatio: imageAspectRatio }}
        >
          <Image
            src={activity.image || '/activities/placeholder.jpg'}
            alt={activity.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover will-change-transform transition-all duration-300 hover:scale-105"
            style={{ backfaceVisibility: 'hidden' }}
            priority={index < 6} // 优先加载前6张图片
          />
          <div className="absolute top-0 right-0 bg-red-50 dark:bg-red-900/30 text-brand-red dark:text-red-400 px-3 py-1 text-sm font-medium rounded-bl-lg z-10">
            {activity.category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-brand-red dark:text-red-400 break-words hyphens-auto mb-2" style={{ wordBreak: 'break-word' }}>{activity.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{plainTextDescription}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
            <span className="text-brand-blue dark:text-blue-400 font-medium text-sm flex items-center">
              了解更多
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