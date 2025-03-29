'use client';

import { getActivities } from '@/lib/contentful';
import { useEffect, useState } from 'react';
import ActivityCard from '@/components/ActivityCard';
import { Activity } from '@/lib/contentful';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesData = await getActivities();
        // 按日期降序排序
        const sortedByDate = activitiesData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // 重新排序为水平方向优先
        const numColumns = 3;
        const numRows = Math.ceil(sortedByDate.length / numColumns);
        
        const result = [];
        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numColumns; col++) {
            const index = col * numRows + row;
            if (index < sortedByDate.length) {
              result.push(sortedByDate[index]);
            }
          }
        }

        setActivities(result);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 mb-12 text-center">活动列表</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 mb-12 text-center">活动列表</h1>
      
      {activities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">暂无活动</h2>
          <p className="text-gray-500 dark:text-gray-400">请稍后再来查看</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
          {activities.map((activity, index) => {
            // 计算在3列布局中的位置
            const row = Math.floor(index / 3);
            const col = index % 3;
            // 计算新的索引，使其按照水平方向优先排序
            const newIndex = col * Math.ceil(activities.length / 3) + row;
            return (
              <div key={activity.id} className="break-inside-avoid mb-8 inline-block w-full" style={{
                order: newIndex
              }}>
                <ActivityCard activity={activity} index={index} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 