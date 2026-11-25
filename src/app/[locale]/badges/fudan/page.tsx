import { pageMetadata } from '@/i18n/metadata';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import BadgeView from './BadgeView';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  return pageMetadata(locale, '/badges/fudan', { title: '复旦大学弹幕大师勋章', hidden: true });
}

export default function Page() {
  return <BadgeView />;
}
