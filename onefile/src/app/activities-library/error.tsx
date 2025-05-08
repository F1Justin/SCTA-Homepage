'use client'; // 错误组件必须是客户端组件

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台或错误报告服务
    console.error('活动方案库加载错误:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">加载活动方案库时出错</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error.message || '无法加载活动方案库，请稍后再试。'}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2 bg-brand-red text-white rounded-md hover:bg-opacity-90 transition duration-300"
        >
          重试
        </button>
      </div>
    </div>
  );
} 