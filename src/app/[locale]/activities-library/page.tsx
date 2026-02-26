import { getAllBlueprints } from '@/lib/content';
import BlueprintLibraryClient from './BlueprintLibraryClient';
import { setStaticLocale } from '@/i18n/static';
import { getTranslations } from 'next-intl/server';

export default async function ActivityLibraryPage({ params }: { params: { locale: string } }) {
  setStaticLocale(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'library' });
  const blueprints = await getAllBlueprints();

  const allCategories = new Set<string>();
  blueprints.forEach(bp => bp.category.forEach(cat => allCategories.add(cat)));
  const categories = [t('all'), ...Array.from(allCategories).sort()];

  return <BlueprintLibraryClient blueprints={blueprints} categories={categories} />;
}
