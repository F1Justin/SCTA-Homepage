'use client';

import React, { useState, useEffect } from 'react';
import { getActivityBlueprints } from '@/lib/contentful';
import ActivityBlueprintCard from '@/components/ActivityBlueprintCard';
import { ActivityBlueprint, ActivityBlueprintFields } from '@/types/contentful';
import Masonry from 'react-masonry-css';

// 定义 Masonry 的响应式断点
const masonryBreakpointsLibrary = {
  default: 2,    // 默认（手机端）显示 2 列
  640: 3        // 屏幕宽度 >= 640px 时显示 3 列
};

export default function ActivityLibraryPage() {
  // 状态管理
  const [activities, setActivities] = useState<ActivityBlueprint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取所有活动方案
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedActivities = await getActivityBlueprints();
        
        if (!fetchedActivities || fetchedActivities.length === 0) {
          setError("暂无活动方案数据");
          return;
        }
        
        // 直接设置获取到的活动数据
        setActivities(fetchedActivities);
        
        // 提取所有唯一类别
        const allCategories = new Set<string>();
        fetchedActivities.forEach(activity => {
          const fields = activity.fields as ActivityBlueprintFields;
          const categories = Array.isArray(fields.category) 
            ? fields.category 
            : fields.category ? [fields.category] : [];
          
          categories.forEach(cat => allCategories.add(cat));
        });
        
        // 设置类别列表，添加"全部"选项
        setCategories(['全部', ...Array.from(allCategories).sort()]);
      } catch (err) {
        console.error("获取活动方案失败:", err);
        setError("加载活动方案时出错，请稍后再试");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 筛选活动方案
  const filteredActivities = selectedCategory === '全部'
    ? activities
    : activities.filter(activity => {
        const fields = activity.fields as ActivityBlueprintFields;
        const categories = Array.isArray(fields.category) 
          ? fields.category 
          : fields.category ? [fields.category] : [];
        
        return categories.includes(selectedCategory);
      });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          {/* 修改为flex布局，标题和说明在左，贡献卡片在右 */}
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* 左侧：标题和说明 */}
            <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">社团活动方案库</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                为各高校东方社团提供活动策划参考，包含游戏、比赛、交流等多种活动形式，
                帮助社团组织丰富多彩的同人活动。
              </p>
            </div>
            
            {/* 右侧：贡献卡片 */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-brand-red dark:text-red-400 mb-3">贡献您的活动方案</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  您有好的活动策划方案吗？上传您的创意，为上海高校东方社团的发展做出贡献！
                  优质的活动方案能帮助其他社团举办更加精彩的活动，推动东方Project文化在高校中的传播。
                </p>
                <div className="text-center lg:text-left">
                  <a 
                    href="https://docs.qq.com/form/page/DQk1MaEpLQm9HbnRU#/fill" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-brand-red text-white font-medium rounded-md hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      提交活动方案
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 加载中状态 */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">正在加载活动方案...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">首次加载可能需要较长时间</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">加载活动方案库时出错</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-brand-red text-white rounded-md hover:bg-opacity-90 transition duration-300"
              >
                刷新页面
              </button>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">暂无活动方案</h2>
            <p className="text-gray-600 dark:text-gray-300">
              我们正在整理更多有趣的活动方案，请稍后再来查看。
            </p>
          </div>
        ) : (
          <>
            {/* 类别筛选按钮 */}
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

            {/* 活动方案列表 - 使用 Masonry */}
            {filteredActivities.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  没有找到&ldquo;<span className="text-brand-red font-medium">{selectedCategory}</span>&rdquo;类别的活动方案
                </p>
                <button
                  onClick={() => setSelectedCategory('全部')}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                >
                  查看全部活动方案
                </button>
              </div>
            ) : (
              <div className="relative">
                <Masonry
                  breakpointCols={masonryBreakpointsLibrary}
                  className="flex w-auto -mx-2 sm:-mx-4"
                  columnClassName="px-2 sm:px-4"
                >
                  {filteredActivities.map((activity) => (
                    <div key={activity.sys.id} className="mb-4 sm:mb-8">
                      <ActivityBlueprintCard activity={activity} />
                    </div>
                  ))}
                </Masonry>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 