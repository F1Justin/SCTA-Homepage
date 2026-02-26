import { getBlueprintBySlug, getAllBlueprintSlugs } from '@/lib/content';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TextCoverPlaceholder from '@/components/TextCoverPlaceholder';

interface BlueprintDetailPageProps {
  params: { slug: string; locale: string };
}

export async function generateStaticParams() {
  const slugs = getAllBlueprintSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlueprintDetailPageProps): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const blueprint = await getBlueprintBySlug(slug);
  if (!blueprint) return { title: '未找到活动方案' };
  return {
    title: `${blueprint.title} | 活动方案库`,
    description: blueprint.summary,
  };
}

export default async function BlueprintDetailPage({ params }: BlueprintDetailPageProps) {
  const { setStaticLocale } = await import('@/i18n/static');
  setStaticLocale(params.locale);
  const blueprint = await getBlueprintBySlug(decodeURIComponent(params.slug));

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">未找到活动方案</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">您请求的活动方案不存在或已被删除。</p>
          <Link href="/activities-library" className="inline-block px-5 py-2 bg-brand-red text-white rounded-md hover:bg-opacity-90 transition duration-300">
            返回活动方案库
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: blueprint.title,
    description: blueprint.summary,
    author: { '@type': 'Organization', name: '上海高校东方联合会', url: 'https://www.scta.cc' },
    publisher: { '@type': 'Organization', name: '上海高校东方联合会', url: 'https://www.scta.cc' },
    articleSection: blueprint.category.join(', '),
    url: `https://www.scta.cc/activities-library/${blueprint.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-6">
            <Link href="/activities-library" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回活动方案库
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="relative w-full bg-gray-200 dark:bg-gray-700">
              {blueprint.coverImage ? (
                <div className="relative aspect-video">
                  <Image src={blueprint.coverImage} alt={blueprint.title} fill className="object-cover" sizes="(max-width: 700px) 100vw, 700px" />
                </div>
              ) : (
                <div className="aspect-video">
                  <TextCoverPlaceholder title={blueprint.title} />
                </div>
              )}
            </div>

            {/* Info bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-600">
              {blueprint.durationPerRound && (
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-red dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">每轮时长</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{blueprint.durationPerRound}</p>
                  </div>
                </div>
              )}
              {blueprint.rounds && (
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-gold/10 dark:bg-brand-gold/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-gold dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">活动轮次</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{blueprint.rounds}</p>
                  </div>
                </div>
              )}
              {blueprint.participantsPerRound && (
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-blue dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">每轮人数</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{blueprint.participantsPerRound}</p>
                  </div>
                </div>
              )}
              {blueprint.participantCriteria && (
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-500 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">参与条件</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{blueprint.participantCriteria}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="mb-12">
                <div className="flex items-start mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{blueprint.title}</h1>
                  <div className="flex flex-wrap gap-2 ml-4 mt-1.5">
                    {blueprint.category.map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-red/20 text-brand-red dark:bg-brand-red/30 dark:text-red-300 rounded-full text-sm font-medium whitespace-nowrap">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">{blueprint.summary}</p>
              </div>

              {blueprint.sections.rules && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">活动规则</h2>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.sections.rules }} />
                </section>
              )}

              {blueprint.sections.procedure && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">活动流程</h2>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.sections.procedure }} />
                </section>
              )}

              {/* Requirements */}
              {(blueprint.hardwareRequirements || blueprint.softwareRequirements || blueprint.materialsNeeded) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">准备事项</h2>
                  <div className="space-y-4">
                    {blueprint.hardwareRequirements && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">硬件需求</h3>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.hardwareRequirements.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {blueprint.softwareRequirements && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">软件需求</h3>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.softwareRequirements.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {blueprint.materialsNeeded && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">物料需求</h3>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.materialsNeeded.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {blueprint.sections.tips && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">注意事项</h2>
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.sections.tips }} />
                </section>
              )}

              {blueprint.rewardSuggestion && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">奖励建议</h2>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300">{blueprint.rewardSuggestion}</p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
