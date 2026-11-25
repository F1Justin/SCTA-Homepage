import { notFound } from 'next/navigation';
import { setRouteLocale, type LocaleParams } from '@/i18n/route-locale';

export default async function UnmatchedPage({ params }: { params: LocaleParams }) {
  setRouteLocale((await params).locale);
  notFound();
}
