import { getBlueprintSummaries } from '@/lib/content';
import BlueprintLibraryClient from './BlueprintLibraryClient';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { pageMetadata } from '@/i18n/metadata';
import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import BlueprintCard from '@/components/BlueprintCard';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'library' });
  return pageMetadata(locale, '/activities-library', { title: t('pageTitle'), description: t('pageDesc') });
}

export default async function ActivityLibraryPage({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const [blueprints, t, { library }] = await Promise.all([
    getBlueprintSummaries(),
    getTranslations({ locale, namespace: 'library' }),
    getMessages({ locale }),
  ]);
  const categories = Array.from(new Set(blueprints.flatMap(blueprint => blueprint.category))).sort();
  const cards = blueprints.map(blueprint => ({
    categories: blueprint.category,
    view: (
      <div key={blueprint.slug} className="mb-4 sm:mb-8"><BlueprintCard blueprint={blueprint} /></div>
    ),
  }));

  return (
    <div className="library-page min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="library-intro mb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('pageTitle')}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{t('pageDesc')}</p>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="library-contribute bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-brand-red dark:text-red-400 mb-3">{t('contributeTitle')}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{t('contributeDesc')}</p>
                <div className="text-center lg:text-left">
                  <a href="https://docs.qq.com/form/page/DQk1MaEpLQm9HbnRU#/fill" target="_blank" rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-brand-red text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      {t('submitBtn')}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {cards.length ? (
          <NextIntlClientProvider messages={{ library: { all: library.all, noCategoryResult: library.noCategoryResult, viewAll: library.viewAll } }}>
            <BlueprintLibraryClient cards={cards} categories={categories} />
          </NextIntlClientProvider>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('noBlueprints')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('noBlueprintsHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
