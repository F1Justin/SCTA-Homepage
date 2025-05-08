import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* 骨架屏 - 封面区域 */}
      <div className="w-full h-[50vh] bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* 骨架屏 - 内容区域 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 bg-white dark:bg-gray-800 -mt-8 relative rounded-t-xl shadow-sm">
        {/* 标签占位 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2].map((i) => (
            <div key={i} className="w-20 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full"></div>
          ))}
        </div>

        {/* 标题占位 */}
        <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse mb-4 rounded"></div>

        {/* 摘要占位 */}
        <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 animate-pulse mb-8 rounded"></div>

        {/* 基本信息区域占位 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
          <div>
            <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse mb-4 rounded"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start mb-3">
                <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mr-2"></div>
                <div className="flex-1 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
          <div>
            <div className="w-1/2 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse mb-4 rounded"></div>
            {[1, 2].map((i) => (
              <div key={i} className="mb-4">
                <div className="w-1/3 h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
                <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 内容区域占位 */}
        {[1, 2].map((i) => (
          <div key={i} className="mb-10">
            <div className="w-1/3 h-7 bg-gray-200 dark:bg-gray-700 animate-pulse mb-4 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="w-full h-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 