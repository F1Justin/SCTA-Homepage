import { getActivityBlueprintBySlug } from '@/lib/contentful';
import { Metadata } from 'next';
import { ActivityBlueprintFields } from '@/types/contentful';
import ActivityDetailClient from './ActivityDetailClient';
import Link from 'next/link';

interface ActivityDetailPageProps {
  params: {
    slug: string;
  };
}

// 生成元数据
export async function generateMetadata({ params }: ActivityDetailPageProps): Promise<Metadata> {
  const activity = await getActivityBlueprintBySlug(params.slug);
  
  if (!activity) {
    return {
      title: '未找到活动 | 上海高校东方联合会',
    };
  }
  
  const fields = activity.fields as ActivityBlueprintFields;
  
  return {
    title: `${fields.title} | 活动方案库 | 上海高校东方联合会`,
    description: fields.summary,
  };
}

// 服务器端组件
export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const activity = await getActivityBlueprintBySlug(params.slug);

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">未找到活动方案</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            您请求的活动方案不存在或已被删除。
          </p>
          <Link
            href="/activities-library"
            className="inline-block px-5 py-2 bg-brand-red text-white rounded-md hover:bg-opacity-90 transition duration-300"
          >
            返回活动方案库
          </Link>
        </div>
      </div>
    );
  }

  return <ActivityDetailClient activity={activity} />;
} 