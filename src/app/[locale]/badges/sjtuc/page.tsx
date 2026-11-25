import { pageMetadata } from '@/i18n/metadata';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import BadgeView from './BadgeView';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  return pageMetadata(locale, '/badges/sjtuc', { title: '上海交通大学创作之星勋章', hidden: true });
}

export default function Page() {
  return <BadgeView />;
}
