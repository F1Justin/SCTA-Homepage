import { MetadataRoute } from 'next'
import { getActivities, getActivityBlueprints } from '@/lib/contentful'
import { ActivityBlueprint, ActivityBlueprintFields } from '@/types/contentful'

// 站点域名
const baseUrl = 'https://www.scta.cc'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面站点地图条目
  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/activities-library`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ] as MetadataRoute.Sitemap

  // 获取所有活动条目
  const activities = await getActivities().catch(() => [])
  const activityEntries = activities.map((activity) => {
    // 使用contentful.ts中定义的Activity类型的date属性
    const lastMod = activity.date 
      ? new Date(activity.date) 
      : new Date() // 默认使用当前时间
    
    return {
      url: `${baseUrl}/activities/${activity.id}`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  // 获取所有活动方案条目
  const activityBlueprints = await getActivityBlueprints().catch(() => [])
  const blueprintEntries = activityBlueprints.map((blueprint: ActivityBlueprint) => {
    // 使用blueprint的更新时间
    const lastMod = blueprint.sys.updatedAt 
      ? new Date(blueprint.sys.updatedAt) 
      : new Date()
    
    // 使用blueprint的fields.slug或sys.id作为URL参数
    const fields = blueprint.fields as ActivityBlueprintFields
    const slug = fields.slug || blueprint.sys.id
    
    return {
      url: `${baseUrl}/activities-library/${slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  // 合并所有站点地图条目
  return [...staticPages, ...activityEntries, ...blueprintEntries]
} 