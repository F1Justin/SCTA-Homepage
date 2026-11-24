import { getBlueprintBySlug, getAllBlueprintSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { pageMetadata, siteUrl, SITE_URL } from '@/i18n/metadata';
import { setRouteLocale } from '@/i18n/route-locale';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import TextCoverPlaceholder from '@/components/TextCoverPlaceholder';

interface BlueprintDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlueprintSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlueprintDetailPageProps) {
  const { slug, locale: routeLocale } = await params;
  const locale = setRouteLocale(routeLocale);
  const blueprint = await getBlueprintBySlug(slug);
  if (!blueprint) {
    const t = await getTranslations({ locale, namespace: 'library' });
    return { title: t('notFound'), robots: { index: false } };
  }

  return pageMetadata(locale, `/activities-library/${encodeURIComponent(blueprint.slug)}`, {
    title: blueprint.title,
    description: blueprint.summary,
    image: blueprint.coverImage,
  });
}

export default async function BlueprintDetailPage({ params }: BlueprintDetailPageProps) {
  const { slug, locale: routeLocale } = await params;
  const locale = setRouteLocale(routeLocale);
  const blueprint = await getBlueprintBySlug(slug);
  if (!blueprint) notFound();

  const t = await getTranslations({ locale, namespace: 'library' });
  const meta = await getTranslations({ locale, namespace: 'metadata' });
  const organization = { '@type': 'Organization', name: meta('siteName'), url: SITE_URL };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: blueprint.title,
    description: blueprint.summary,
    author: organization,
    publisher: organization,
    articleSection: blueprint.category.join(', '),
    url: siteUrl(locale, `/activities-library/${encodeURIComponent(blueprint.slug)}`),
    inLanguage: 'zh',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-[700px] mx-auto">
          <div className="mb-6">
            <Link href="/activities-library" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToLibrary')}
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
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('durationPerRound')}</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium" lang="zh">{blueprint.durationPerRound}</p>
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
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('rounds')}</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium" lang="zh">{blueprint.rounds}</p>
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
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('participantsPerRound')}</h3>
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
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('participantCriteria')}</h3>
                    <p className="text-sm text-gray-900 dark:text-white font-medium" lang="zh">{blueprint.participantCriteria}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="mb-12">
                <div className="flex items-start mb-4">
                  <h1 lang="zh" className="text-4xl font-bold text-gray-900 dark:text-white">{blueprint.title}</h1>
                  <div className="flex flex-wrap gap-2 ml-4 mt-1.5">
                    {blueprint.category.map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-red/20 text-brand-red dark:bg-brand-red/30 dark:text-red-300 rounded-full text-sm font-medium whitespace-nowrap">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300" lang="zh">{blueprint.summary}</p>
              </div>

              {blueprint.sections.rules && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('rules')}</h2>
                  <div lang="zh" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.sections.rules }} />
                </section>
              )}

              {blueprint.sections.procedure && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('procedure')}</h2>
                  <div lang="zh" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.sections.procedure }} />
                </section>
              )}

              {/* Requirements */}
              {(blueprint.hardwareRequirements || blueprint.softwareRequirements || blueprint.materialsNeeded) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('preparation')}</h2>
                  <div className="space-y-4">
                    {blueprint.hardwareRequirements && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t('hardware')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.hardwareRequirements.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600" lang="zh">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {blueprint.softwareRequirements && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t('software')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.softwareRequirements.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600" lang="zh">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {blueprint.materialsNeeded && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">{t('materials')}</h3>
                        <div className="flex flex-wrap gap-2">
                          {blueprint.materialsNeeded.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600" lang="zh">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {blueprint.sections.tips && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('tips')}</h2>
                  <div lang="zh" className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.sections.tips }} />
                </section>
              )}

              {blueprint.rewardSuggestion && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('rewardSuggestion')}</h2>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                    <p className="text-gray-700 dark:text-gray-300" lang="zh">{blueprint.rewardSuggestion}</p>
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
