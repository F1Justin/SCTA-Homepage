import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* 标题区域骨架屏 */}
        <div className="text-center mb-12">
          <div className="w-3/4 md:w-1/2 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mx-auto mb-4"></div>
          <div className="w-full md:w-3/4 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mx-auto"></div>
          <div className="w-full md:w-2/3 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mx-auto mt-2"></div>
        </div>

        {/* 筛选按钮骨架屏 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-20 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
            ))}
          </div>
        </div>

        {/* 卡片网格骨架屏 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-[360px]">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="p-4">
                <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 