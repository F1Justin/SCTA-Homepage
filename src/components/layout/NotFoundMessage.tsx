import { getTranslations } from 'next-intl/server';

export default async function NotFoundMessage() {
  const t = await getTranslations('errors');
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-gray-900 dark:text-gray-100">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium border-r border-current mr-5 pr-5 py-2">404</h1>
        <p className="text-sm">{t('notFound')}</p>
      </div>
    </div>
  );
}
