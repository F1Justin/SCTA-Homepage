import { getAllActivities } from '@/lib/content';
import HomeClient from './HomeClient';
import { setStaticLocale } from '@/i18n/static';

export default async function Home({ params }: { params: { locale: string } }) {
  setStaticLocale(params.locale);
  const allActivities = await getAllActivities();
  const activities = allActivities.slice(0, 6);

  return <HomeClient activities={activities} />;
}
