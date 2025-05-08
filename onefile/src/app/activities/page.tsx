'use client';

import { getActivities } from '@/lib/contentful';
import ActivityCard from '@/components/ActivityCard';
import { Activity } from '@/lib/contentful';
import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';

// 定义 Masonry 的响应式断点，确保与主页一致
const masonryBreakpoints = {
  default: 3,    // 默认（宽屏，>640px）显示 3 列
  640: 2        // 屏幕宽度 <= 640px 时显示 2 列
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function fetchActivities() {
      try {
        console.log('[ActivitiesPage] 开始获取活动数据...');
        setIsLoading(true);
        setError(null);
        
        const activitiesData = await getActivities();
        
        if (!activitiesData || !Array.isArray(activitiesData)) {
          console.error('[ActivitiesPage] 活动数据无效:', activitiesData);
          throw new Error('获取到的活动数据无效');
        }
        
        if (activitiesData.length === 0) {
          console.log('[ActivitiesPage] 没有找到活动数据');
          setActivities([]);
          return;
        }
        
        // 仅按日期降序排序，移除所有重排序逻辑
        const sortedByDate = [...activitiesData].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // 记录最终数据顺序
        console.log('[ActivitiesPage] FINAL data set to state (sortedByDate):');
        sortedByDate.forEach((item, idx) => {
          console.log(` activities[${idx}]: ${item.title} (${item.date})`);
        });
        
        setActivities(sortedByDate);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('[ActivitiesPage] 请求被中止');
          return;
        }
        console.error('[ActivitiesPage] 获取活动数据失败:', error);
        setError('获取活动数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
    
    return () => {
      console.log('[ActivitiesPage] 清理组件，中止请求');
      abortController.abort();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 mb-12 text-center">活动列表</h1>
      
      {isLoading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">正在加载...</h2>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">发生错误</h2>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">暂无活动</h2>
          <p className="text-gray-500 dark:text-gray-400">请稍后再来查看</p>
        </div>
      ) : (
        <div className="relative">
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="flex w-auto -mx-2 sm:-mx-4"
            columnClassName="px-2 sm:px-4"
          >
            {activities.map((activity, index) => (
              <div key={activity.id} className="mb-4 sm:mb-8">
                <ActivityCard activity={activity} index={index} />
              </div>
            ))}
          </Masonry>
        </div>
      )}
    </div>
  );
} 