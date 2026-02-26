import { MetadataRoute } from 'next';
import { getAllActivities, getAllBlueprints } from '@/lib/content';

const baseUrl = 'https://www.scta.cc';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/activities`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/activities-library`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const activities = await getAllActivities();
  const activityEntries: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${baseUrl}/activities/${activity.slug}`,
    lastModified: activity.date ? new Date(activity.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blueprints = await getAllBlueprints();
  const blueprintEntries: MetadataRoute.Sitemap = blueprints.map((bp) => ({
    url: `${baseUrl}/activities-library/${bp.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...activityEntries, ...blueprintEntries];
}
