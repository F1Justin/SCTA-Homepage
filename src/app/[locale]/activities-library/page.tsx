import { getAllBlueprints } from '@/lib/content';
import BlueprintLibraryClient from './BlueprintLibraryClient';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import { pageMetadata } from '@/i18n/metadata';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'library' });
  return pageMetadata(locale, '/activities-library', { title: t('pageTitle'), description: t('pageDesc') });
}

export default async function ActivityLibraryPage({ params }: { params: LocaleParams }) {
  setRouteLocale((await params).locale);
  const blueprints = await getAllBlueprints();

  const allCategories = new Set<string>();
  blueprints.forEach(bp => bp.category.forEach(cat => allCategories.add(cat)));
  const categories = Array.from(allCategories).sort();

  return <BlueprintLibraryClient blueprints={blueprints} categories={categories} />;
}
