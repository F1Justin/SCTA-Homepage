import { getActivityBySlug, getAllActivitySlugs } from '@/lib/content';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface ActivityPageProps {
  params: { id: string; locale: string };
}

export async function generateStaticParams() {
  const slugs = getAllActivitySlugs();
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.id);
  const activity = await getActivityBySlug(slug);
  const t = await getTranslations({ locale: params.locale, namespace: 'activities' });
  if (!activity) return { title: t('notFound') };
  return {
    title: activity.title,
    description: activity.contentHtml.replace(/<[^>]+>/g, '').slice(0, 160),
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { setStaticLocale } = await import('@/i18n/static');
  setStaticLocale(params.locale);
  const activity = await getActivityBySlug(decodeURIComponent(params.id));
  const t = await getTranslations({ locale: params.locale, namespace: 'activities' });

  if (!activity) {
    notFound();
  }

  const localeMap: Record<string, string> = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(localeMap[params.locale] || 'zh-CN', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="relative w-full overflow-hidden rounded-lg sticky top-8">
              {activity.image ? (
                <Image src={activity.image} alt={activity.title} width={800} height={600} className="w-full h-auto object-contain bg-gray-50 dark:bg-gray-800" />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-brand-red/20 to-brand-blue/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">{activity.title}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-start gap-4 mb-4">
              <div className="flex-1 flex items-start gap-4">
                <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 break-words hyphens-auto" style={{ wordBreak: 'break-word' }}>{activity.title}</h1>
                <span className="inline-flex items-center px-4 h-8 bg-red-50 dark:bg-red-900/30 text-brand-red dark:text-red-400 rounded-full text-sm font-medium flex-shrink-0 mt-2">
                  {activity.category}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-8">
              <span>{formatDate(activity.date)}</span>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: activity.contentHtml }} />

            <div className="mt-8">
              <Link href="/activities" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                {t('backToList')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
