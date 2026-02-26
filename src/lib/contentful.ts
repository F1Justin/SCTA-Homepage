import { createClient, ContentfulClientApi } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { BLOCKS } from '@contentful/rich-text-types';
import { ActivityBlueprint } from '@/types/contentful';

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

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const useContentful = !!(spaceId && accessToken);

let client: ContentfulClientApi<undefined> | null = null;

if (useContentful) {
  try {
    client = createClient({
      space: spaceId!,
      accessToken: accessToken!,
      retryOnError: true,
      retryLimit: 3,
      timeout: 30000,
    });
  } catch (error) {
    console.error('Contentful client initialization failed:', error);
  }
}

export function normalizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `https:${url}`;
  return url;
}

export async function getActivities(): Promise<Activity[]> {
  if (!useContentful || !client) {
    console.error('Contentful not configured');
    return [];
  }

  try {
    const response = await client.getEntries({
      content_type: 'activity',
      order: ['-fields.date'],
      include: 10,
    });

    if (!response.items?.length) return [];

    return response.items.map((item: any) => ({
      id: item.sys.id || '',
      title: item.fields.title || '',
      description: item.fields.description || emptyRichText,
      date: item.fields.date || '',
      image: normalizeImageUrl(item.fields.imageUrl || ''),
      category: item.fields.category || ''
    }));
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    throw error;
  }
}

export async function getActivity(id: string): Promise<Activity | null> {
  if (!useContentful || !client) return null;

  try {
    const entry = await client.getEntry(id, { include: 10 });
    if (!entry?.fields) return null;

    return {
      id: entry.sys.id || '',
      title: (entry.fields as any).title || '',
      description: (entry.fields as any).description || emptyRichText,
      date: (entry.fields as any).date || '',
      image: normalizeImageUrl((entry.fields as any).imageUrl || ''),
      category: (entry.fields as any).category || ''
    };
  } catch (error) {
    console.error(`Failed to fetch activity ${id}:`, error);
    throw error;
  }
}

export async function getActivityBlueprints(): Promise<ActivityBlueprint[]> {
  if (!useContentful || !client) return [];

  try {
    const response = await client.getEntries({
      content_type: 'activityBlueprint',
      order: ['fields.title'],
      include: 2,
    });

    if (!response.items?.length) return [];

    return response.items
      .filter((item: any) => {
        return item.fields?.title && item.fields?.category && item.fields?.summary;
      }) as unknown as ActivityBlueprint[];
  } catch (error) {
    console.error('Failed to fetch activity blueprints:', error);
    return [];
  }
}

export async function getActivityBlueprintById(id: string): Promise<ActivityBlueprint | null> {
  if (!useContentful || !client) return null;

  try {
    const entry = await client.getEntry(id, { include: 10 });
    return entry ? (entry as unknown as ActivityBlueprint) : null;
  } catch (error) {
    console.error(`Failed to fetch blueprint ${id}:`, error);
    return null;
  }
}

export async function getActivityBlueprintBySlug(slug: string): Promise<ActivityBlueprint | null> {
  if (!useContentful || !client || !slug) return null;

  try {
    let response = await client.getEntries({
      content_type: 'activityBlueprint',
      'fields.slug': slug,
      include: 10,
    }).catch(() => ({ items: [], total: 0 }));

    if (!response.items?.length) {
      try {
        const directEntry = await client.getEntry(slug, { include: 10 });
        if (directEntry?.sys?.contentType?.sys?.id === 'activityBlueprint') {
          response = { items: [directEntry], total: 1 } as any;
        }
      } catch {
        // slug is not a valid entry ID either
      }
    }

    if (!response.items?.length) return null;

    const activity = response.items[0] as any;
    if (!activity.fields?.title || !activity.fields?.category || !activity.fields?.summary) {
      return null;
    }

    return activity as unknown as ActivityBlueprint;
  } catch (error) {
    console.error(`Failed to fetch blueprint by slug "${slug}":`, error);
    return null;
  }
}
