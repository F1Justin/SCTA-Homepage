'use client';

import React, { useState } from 'react';
import type { Blueprint } from '@/types/content';
import BlueprintCard from '@/components/BlueprintCard';
import Masonry from 'react-masonry-css';
import { useTranslations } from 'next-intl';

const masonryBreakpoints = {
  default: 3,
  640: 2,
};

interface BlueprintLibraryClientProps {
  blueprints: Blueprint[];
  categories: string[];
}

export default function BlueprintLibraryClient({ blueprints, categories }: BlueprintLibraryClientProps) {
  const t = useTranslations('library');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || t('all'));

  const isAll = selectedCategory === categories[0];
  const filteredBlueprints = isAll
    ? blueprints
    : blueprints.filter(bp => bp.category.includes(selectedCategory));

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('pageTitle')}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{t('pageDesc')}</p>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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

        {blueprints.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{t('noBlueprints')}</h2>
            <p className="text-gray-600 dark:text-gray-300">{t('noBlueprintsHint')}</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                      ${selectedCategory === category
                        ? 'bg-brand-red text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredBlueprints.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  {t('noCategoryResult', { category: selectedCategory })}
                </p>
                <button
                  onClick={() => setSelectedCategory(categories[0])}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                >
                  {t('viewAll')}
                </button>
              </div>
            ) : (
              <Masonry breakpointCols={masonryBreakpoints} className="flex w-auto -mx-2 sm:-mx-4" columnClassName="px-2 sm:px-4">
                {filteredBlueprints.map((blueprint) => (
                  <div key={blueprint.slug} className="mb-4 sm:mb-8">
                    <BlueprintCard blueprint={blueprint} />
                  </div>
                ))}
              </Masonry>
            )}
          </>
        )}
      </div>
    </div>
  );
}
