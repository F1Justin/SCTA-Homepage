import React from 'react';
import Link from 'next/link';
import { ActivityBlueprint, ActivityBlueprintFields } from '@/types/contentful';

interface ActivityBlueprintCardProps {
  activity: ActivityBlueprint;
  index: number;
}

/**
 * 活动方案卡片组件
 * 展示活动方案的缩略信息，包括标题、分类、简介等
 */
export default function ActivityBlueprintCard({ activity, index }: ActivityBlueprintCardProps) {
  const fields = activity.fields as ActivityBlueprintFields;
  const slug = fields.slug || activity.sys.id;

  return (
    <Link 
      href={`/activities-library/${slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* 封面图或渐变背景 */}
      <div className="relative aspect-video w-full">
        {fields.coverImage?.fields?.file?.url ? (
          <img
            src={typeof fields.coverImage.fields.file.url === 'string' 
              ? (fields.coverImage.fields.file.url.startsWith('//') 
                  ? `https:${fields.coverImage.fields.file.url}` 
                  : fields.coverImage.fields.file.url)
              : ''}
            alt={fields.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 flex items-center justify-center p-6">
            <h3 className="text-2xl font-bold text-white text-center">
              {fields.title}
            </h3>
          </div>
        )}
        
        {/* 分类标签 */}
        <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
          {Array.isArray(fields.category) 
            ? fields.category.map((category: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-brand-red dark:text-red-400 rounded-full font-medium"
                >
                  {category}
                </span>
              ))
            : fields.category && (
                <span className="px-2 py-1 text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-brand-red dark:text-red-400 rounded-full font-medium">
                  {fields.category}
                </span>
              )
          }
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {fields.title}
        </h3>
        {fields.summary && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {fields.summary}
          </p>
        )}

        {/* 活动信息 */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {fields.durationPerRound && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{fields.durationPerRound}</span>
            </div>
          )}
          {fields.participantsPerRound && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{fields.participantsPerRound}人</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 