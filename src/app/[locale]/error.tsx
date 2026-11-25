'use client';

import { useTranslations } from 'next-intl';

export default function RouteError({ reset }: { reset: () => void }) {
  const t = useTranslations('errors');
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-medium dark:text-white">{t('failed')}</h1>
      <button type="button" className="btn-primary" onClick={reset}>{t('retry')}</button>
    </div>
  );
}
