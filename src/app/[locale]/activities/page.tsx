import { getAllActivities } from '@/lib/content';
import ActivitiesClient from './ActivitiesClient';
import { setStaticLocale } from '@/i18n/static';

export default async function ActivitiesPage({ params }: { params: { locale: string } }) {
  setStaticLocale(params.locale);
  const activities = await getAllActivities();
  return <ActivitiesClient activities={activities} />;
}
