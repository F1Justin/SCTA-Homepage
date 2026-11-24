import { pageMetadata } from '@/i18n/metadata';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';
import BadgeView from './BadgeView';

export async function generateMetadata({ params }: { params: LocaleParams }) {
  const locale = setRouteLocale((await params).locale);
  return pageMetadata(locale, '/badges/tongji', { title: '同济大学东方例会贡献勋章', hidden: true });
}

export default function Page() {
  return <BadgeView />;
}
