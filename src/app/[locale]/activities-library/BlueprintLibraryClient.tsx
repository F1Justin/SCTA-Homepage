'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import ResponsiveColumns from '@/components/ResponsiveColumns';

interface BlueprintLibraryClientProps {
  cards: { categories: string[]; view: ReactNode }[];
  categories: string[];
}

export default function BlueprintLibraryClient({ cards, categories }: BlueprintLibraryClientProps) {
  const t = useTranslations('library');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const visibleCards = selectedCategory === null
    ? cards
    : cards.filter(card => card.categories.includes(selectedCategory));

  return (
    <>
      <div className="mb-8">
        <div className="library-filters flex flex-wrap justify-center gap-2">
          {[null, ...categories].map((category) => (
            <button
              key={category ?? ''}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                ${selectedCategory === category
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              <span lang={category ? 'zh' : undefined}>{category ?? t('all')}</span>
            </button>
          ))}
        </div>
      </div>

      {visibleCards.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            {t('noCategoryResult', { category: selectedCategory ?? '' })}
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
          >
            {t('viewAll')}
          </button>
        </div>
      ) : (
        <ResponsiveColumns cards={visibleCards.map(card => card.view)} className="library-masonry" />
      )}
    </>
  );
}
