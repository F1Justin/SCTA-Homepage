import { createClient } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { ActivityBlueprint, ActivityBlueprintFields } from '@/types/contentful';

// 定义活动数据结构
export interface Activity {
  id: string;
  title: string;
  description: Document & {
    content: Array<{
      nodeType: string;
      data: {
        target?: {
          fields: {
            title: string;
            description?: string;
            file: {
              url: string;
              details: {
                size: number;
                image?: {
                  width: number;
                  height: number;
                };
              };
              fileName: string;
              contentType: string;
            };
          };
        };
      };
      content: any[];
    }>;
  };
  date: string;
  image: string;
  category: string;
}

// 模拟数据，当环境变量未设置时使用
const mockActivities: Activity[] = [
  {
    id: 'mock1',
    title: '东方Project主题交流会',
    description: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '一场关于东方Project的主题交流会，欢迎各校爱好者参加！讨论内容包括音乐、游戏和二次创作等。',
              marks: [],
              data: {}
            }
          ]
        }
      ]
    },
    date: '2023-10-15',
    image: '/activities/mock1.jpg',
    category: '交流会',
  },
  {
    id: 'mock2',
    title: '东方音乐演奏会',
    description: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '由上海高校东方联合会举办的音乐会，将演奏多首东方Project经典曲目。',
              marks: [],
              data: {}
            }
          ]
        }
      ]
    },
    date: '2023-11-20',
    image: '/activities/mock2.jpg',
    category: '音乐会',
  },
  {
    id: 'mock3',
    title: '东方同人展',
    description: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '展示东方Project相关的同人作品，包括绘画、手工艺品、音乐作品等。',
              marks: [],
              data: {}
            }
          ]
        }
      ]
    },
    date: '2023-12-05',
    image: '/activities/mock3.jpg',
    category: '展览',
  },
];

// 检查环境变量
const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

// 判断是否使用Contentful API或模拟数据
const useContentful = !!(spaceId && accessToken);

// 如果环境变量有效，则创建Contentful客户端
let client: any = null;
let initializationError: Error | null = null;

if (useContentful) {
  try {
    console.log('正在初始化Contentful客户端...');
    console.log('环境变量状态:', {
      hasSpaceId: !!spaceId,
      hasAccessToken: !!accessToken,
      spaceIdLength: spaceId?.length,
      accessTokenLength: accessToken?.length
    });

    client = createClient({
      space: spaceId!,
      accessToken: accessToken!,
      retryOnError: true,
      retryLimit: 3,
      timeout: 30000, // 30秒超时
    });

    // 测试连接
    client.getSpace()
      .then(() => {
        console.log('Contentful客户端初始化成功，已连接到空间');
      })
      .catch((error: Error) => {
        console.error('Contentful空间连接测试失败:', error);
        initializationError = error;
      });

  } catch (error) {
    console.error('Contentful客户端初始化失败:', error);
    if (error instanceof Error) {
      console.error('初始化错误详情:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    initializationError = error as Error;
  }
}

// 导出初始化状态，方便调试
export const contentfulStatus = {
  isEnabled: useContentful,
  hasClient: !!client,
  initializationError: initializationError?.message || null,
  spaceId: spaceId ? '已设置' : '未设置',
  accessToken: accessToken ? '已设置' : '未设置'
};

const emptyRichText: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: '',
          marks: [],
          data: {}
        }
      ]
    }
  ]
};

// 处理 Contentful 图片 URL，确保完整的 URL
export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  
  // 如果已经是完整的 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 处理以 // 开头的 URL
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // 其他情况添加 https:
  if (url.startsWith('/')) {
    return `https:${url}`;
  }
  
  return url;
}

/**
 * 获取活动列表
 */
export async function getActivities(): Promise<Activity[]> {
  if (!useContentful || !client) {
    console.error('Contentful环境变量未设置或客户端初始化失败');
    return [];
  }

  try {
    const response = await client.getEntries({
      content_type: 'activity',
      order: ['-fields.date'],
      include: 10,
    });

    if (!response.items || !response.items.length) {
      console.warn('未找到活动数据');
      return [];
    }

    return response.items.map((item: any) => ({
      id: item.sys.id || '',
      title: item.fields.title || '',
      description: item.fields.description || emptyRichText,
      date: item.fields.date || '',
      image: normalizeImageUrl(item.fields.imageUrl || ''),
      category: item.fields.category || ''
    }));
  } catch (error) {
    console.error('获取活动列表失败:', error);
    throw error;
  }
}

/**
 * 获取单个活动详情
 */
export async function getActivity(id: string): Promise<Activity | null> {
  if (!useContentful || !client) {
    console.error('Contentful环境变量未设置或客户端初始化失败');
    return null;
  }

  try {
    const entry = await client.getEntry(id, {
      include: 10,
    });

    if (!entry || !entry.fields) {
      console.warn(`未找到ID为 ${id} 的活动`);
      return null;
    }

    return {
      id: entry.sys.id || '',
      title: entry.fields.title || '',
      description: entry.fields.description || emptyRichText,
      date: entry.fields.date || '',
      image: normalizeImageUrl(entry.fields.imageUrl || ''),
      category: entry.fields.category || ''
    };
  } catch (error) {
    console.error(`获取活动 ${id} 失败:`, error);
    throw error;
  }
}

/**
 * 获取所有活动方案
 */
export async function getActivityBlueprints(): Promise<ActivityBlueprint[]> {
  if (!useContentful || !client) {
    console.warn('使用模拟数据 - Contentful环境变量未设置或客户端初始化失败', {
      useContentful,
      hasClient: !!client,
      spaceId: !!spaceId,
      accessToken: !!accessToken
    });
    return []; // 暂时没有模拟数据，返回空数组
  }

  try {
    console.log('正在从Contentful获取活动方案列表...');
    const response = await client.getEntries({
      content_type: 'activityBlueprint',
      order: ['fields.title'],
      include: 2,
    });

    console.log('Contentful响应:', {
      total: response.total,
      hasItems: !!response.items,
      itemsLength: response.items?.length || 0
    });

    if (!response.items || !response.items.length) {
      console.warn('未找到活动方案数据');
      return [];
    }

    // 验证每个活动方案的数据结构
    const validBlueprints = response.items.map((item: any) => {
      try {
        // 验证必需字段
        if (!item.fields?.title || !item.fields?.category || !item.fields?.summary) {
          console.warn('活动方案缺少必需字段:', {
            id: item.sys?.id,
            hasTitle: !!item.fields?.title,
            hasCategory: !!item.fields?.category,
            hasSummary: !!item.fields?.summary
          });
          return null;
        }
        return item;
      } catch (e) {
        console.error('处理活动方案数据时出错:', e);
        return null;
      }
    }).filter(Boolean) as ActivityBlueprint[];

    console.log(`成功获取 ${validBlueprints.length} 个有效的活动方案`);
    return validBlueprints;
  } catch (error) {
    console.error('获取活动方案列表失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return [];
  }
}

/**
 * 根据ID获取单个活动方案
 */
export async function getActivityBlueprintById(id: string): Promise<ActivityBlueprint | null> {
  if (!useContentful || !client) {
    console.warn('使用模拟数据 - Contentful环境变量未设置或客户端初始化失败');
    return null;
  }

  try {
    const entry = await client.getEntry(id, {
      include: 10, // 解析嵌入资产的引用，最大深度
    });

    if (!entry) {
      console.warn(`未找到ID为${id}的活动方案`);
      return null;
    }

    return entry as unknown as ActivityBlueprint;
  } catch (error) {
    console.error(`获取活动方案详情失败 (ID: ${id}):`, error);
    return null;
  }
}

/**
 * 根据slug获取单个活动方案
 * 注意：此函数既支持slug查询，也支持ID查询，以确保向前兼容性
 */
export async function getActivityBlueprintBySlug(slug: string): Promise<ActivityBlueprint | null> {
  if (!useContentful || !client) {
    console.warn('[getActivityBlueprintBySlug] 使用模拟数据 - Contentful环境变量未设置或客户端初始化失败', {
      useContentful,
      hasClient: !!client,
      spaceId: spaceId ? '已设置' : '未设置',
      accessToken: accessToken ? '已设置' : '未设置'
    });
    return null;
  }

  try {
    // 验证输入参数
    if (!slug) {
      console.error('[getActivityBlueprintBySlug] 无效的slug参数');
      return null;
    }

    console.log(`[getActivityBlueprintBySlug] 开始获取活动方案，参数:`, {
      slug,
      useContentful,
      hasClient: !!client,
      clientSpace: client.space,
      clientEnvironment: client.environment
    });

    // 首先尝试通过slug字段查询
    let response;
    try {
      response = await client.getEntries({
        content_type: 'activityBlueprint',
        'fields.slug': slug,
        include: 10,
      });

      console.log(`[getActivityBlueprintBySlug] slug查询结果:`, {
        total: response.total,
        hasItems: !!response.items,
        itemsLength: response.items?.length || 0,
        query: {
          content_type: 'activityBlueprint',
          'fields.slug': slug
        }
      });
    } catch (slugError) {
      console.error('[getActivityBlueprintBySlug] slug查询失败:', slugError);
      response = { items: [], total: 0 };
    }

    // 如果没有找到，则尝试通过ID查询
    if (!response.items || response.items.length === 0) {
      console.log(`[getActivityBlueprintBySlug] 未通过slug找到活动方案，尝试使用ID查询：${slug}`);
      try {
        const directEntry = await client.getEntry(slug, {
          include: 10,
        });
        
        console.log(`[getActivityBlueprintBySlug] ID查询结果:`, {
          hasEntry: !!directEntry,
          entryId: directEntry?.sys?.id,
          contentType: directEntry?.sys?.contentType?.sys?.id,
          hasFields: !!directEntry?.fields,
          fields: directEntry?.fields ? Object.keys(directEntry.fields) : [],
          createdAt: directEntry?.sys?.createdAt,
          updatedAt: directEntry?.sys?.updatedAt
        });
        
        if (directEntry && directEntry.sys && directEntry.sys.contentType && 
            directEntry.sys.contentType.sys.id === 'activityBlueprint') {
          response = { items: [directEntry], total: 1 };
        } else {
          console.warn('[getActivityBlueprintBySlug] 通过ID找到的条目不是活动方案类型:', {
            foundType: directEntry?.sys?.contentType?.sys?.id,
            expectedType: 'activityBlueprint'
          });
        }
      } catch (idError) {
        console.error('[getActivityBlueprintBySlug] 通过ID查询失败:', {
          error: idError,
          slug
        });
      }
    }

    if (!response.items || response.items.length === 0) {
      console.warn(`[getActivityBlueprintBySlug] 未找到活动方案:`, {
        slug,
        searchMethods: ['slug', 'id'],
        responseStatus: response ? '有响应' : '无响应',
        itemsStatus: response?.items ? '有items' : '无items'
      });
      return null;
    }

    const activity = response.items[0];
    
    console.log(`[getActivityBlueprintBySlug] 找到活动方案:`, {
      id: activity.sys?.id,
      hasFields: !!activity.fields,
      fields: activity.fields ? Object.keys(activity.fields) : [],
      title: activity.fields?.title,
      hasCategory: !!activity.fields?.category,
      hasSummary: !!activity.fields?.summary,
      sys: {
        id: activity.sys?.id,
        contentType: activity.sys?.contentType?.sys?.id,
        createdAt: activity.sys?.createdAt,
        updatedAt: activity.sys?.updatedAt
      }
    });
    
    // 验证必需字段
    if (!activity.fields?.title || !activity.fields?.category || !activity.fields?.summary) {
      console.warn('[getActivityBlueprintBySlug] 活动方案缺少必需字段:', {
        id: activity.sys?.id,
        hasTitle: !!activity.fields?.title,
        hasCategory: !!activity.fields?.category,
        hasSummary: !!activity.fields?.summary,
        availableFields: activity.fields ? Object.keys(activity.fields) : []
      });
      return null;
    }

    return activity as unknown as ActivityBlueprint;
  } catch (error) {
    console.error(`[getActivityBlueprintBySlug] 获取活动方案详情失败:`, {
      slug,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
    return null;
  }
} 