import { createClient } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';

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
if (useContentful) {
  try {
    client = createClient({
      space: spaceId!,
      accessToken: accessToken!,
    });
  } catch (error) {
    console.error('Contentful初始化失败:', error);
  }
}

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
    console.warn('使用模拟数据 - Contentful环境变量未设置或客户端初始化失败');
    return mockActivities;
  }

  try {
    const response = await client.getEntries({
      content_type: 'activity',
      order: ['fields.date'],
      include: 10, // 解析嵌入资产的引用
    });

    if (!response.items || !response.items.length) {
      console.warn('未找到活动数据，使用模拟数据');
      return mockActivities;
    }

    return response.items.map((item: any) => {
      try {
        return {
          id: item.sys.id || '',
          title: item.fields.title || '',
          description: item.fields.description || emptyRichText,
          date: item.fields.date || '',
          image: normalizeImageUrl(item.fields.imageUrl || ''),
          category: item.fields.category || '其他',
        };
      } catch (e) {
        console.error('处理活动数据时出错:', e);
        return null;
      }
    }).filter(Boolean) as Activity[];
  } catch (error) {
    console.error('获取活动列表失败:', error);
    return mockActivities;
  }
}

/**
 * 获取单个活动详情
 */
export async function getActivity(id: string): Promise<Activity | null> {
  if (!useContentful || !client) {
    console.warn('使用模拟数据 - Contentful环境变量未设置或客户端初始化失败');
    return mockActivities.find(activity => activity.id === id) || null;
  }

  try {
    console.log(`正在获取ID为 ${id} 的活动详情，包含深度为 10 的链接引用`);
    const activity = await client.getEntry(id, {
      include: 10, // 解析嵌入资产的引用，最大深度
    });
    
    console.log('获取到的活动数据结构:', JSON.stringify({ 
      sys: activity.sys,
      hasFields: !!activity.fields,
      fieldKeys: activity.fields ? Object.keys(activity.fields) : [],
      hasDescription: activity.fields?.description ? true : false,
      descriptionType: activity.fields?.description ? typeof activity.fields.description : null,
      descriptionNodeType: activity.fields?.description?.nodeType || null,
      hasDescriptionContent: activity.fields?.description?.content ? true : false,
      contentLength: activity.fields?.description?.content?.length || 0
    }, null, 2));
    
    if (!activity || !activity.fields) {
      console.warn(`未找到ID为${id}的活动，使用模拟数据`);
      return mockActivities.find(activity => activity.id === id) || null;
    }
    
    // 记录描述内容的结构
    if (activity.fields.description && activity.fields.description.content) {
      const contentTypes = activity.fields.description.content.map((item: any) => ({
        nodeType: item.nodeType,
        hasTarget: item.data && item.data.target ? true : false,
        targetType: item.data && item.data.target ? item.data.target.sys.type : null,
        hasFields: item.data && item.data.target && item.data.target.fields ? true : false
      }));
      console.log('描述内容的节点类型:', contentTypes);
    }

    return {
      id: activity.sys.id || '',
      title: activity.fields.title || '',
      description: activity.fields.description || emptyRichText,
      date: activity.fields.date || '',
      image: normalizeImageUrl(activity.fields.imageUrl || ''),
      category: activity.fields.category || '其他',
    };
  } catch (error) {
    console.error(`获取活动详情失败 (ID: ${id}):`, error);
    return mockActivities.find(activity => activity.id === id) || null;
  }
} 