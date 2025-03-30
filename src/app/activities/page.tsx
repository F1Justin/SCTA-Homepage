import { getActivities } from '@/lib/contentful';
import ActivityCard from '@/components/ActivityCard';
import { Activity } from '@/lib/contentful';

export default async function ActivitiesPage() {
  // 1. 获取活动数据
  const activitiesData = await getActivities();
  
  // 2. 按日期降序排序
  const sortedByDate = activitiesData.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // 3. 实现行优先级重排序逻辑
  const numColumns = 3; // 最宽布局时的目标列数
  const totalActivities = sortedByDate.length;
  const numRows = Math.ceil(totalActivities / numColumns);
  const rearrangedActivities: Activity[] = [];

  // 按行优先顺序重新排列活动
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numColumns; col++) {
      const index = row + col * numRows; // 基于列优先读取行优先填充网格的索引计算
      if (index < totalActivities) {
        rearrangedActivities.push(sortedByDate[index]);
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 mb-12 text-center">活动列表</h1>
      
      {rearrangedActivities.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-4">暂无活动</h2>
          <p className="text-gray-500 dark:text-gray-400">请稍后再来查看</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
          {rearrangedActivities.map((activity, index) => (
            <div key={activity.id} className="break-inside-avoid mb-8 inline-block w-full">
              <ActivityCard activity={activity} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 