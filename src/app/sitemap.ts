import type { MetadataRoute } from 'next';
import { getAllActivitySlugs, getAllBlueprintSlugs } from '@/lib/content';
import { alternateUrls, siteUrl } from '@/i18n/metadata';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/activities',
    '/activities-library',
    ...getAllActivitySlugs().map(id => `/activities/${encodeURIComponent(id)}`),
    ...getAllBlueprintSlugs().map(slug => `/activities-library/${encodeURIComponent(slug)}`),
  ];
  return paths.flatMap(pathname => {
    const languages = alternateUrls(pathname);
    return routing.locales.map(locale => ({
      url: siteUrl(locale, pathname),
      alternates: { languages },
    }));
  });
}
