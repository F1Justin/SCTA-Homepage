import { School } from '@/data/schools';
import { motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const t = useTranslations('schools');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const modal = dialog.current;
    if (!isModalOpen || !modal || modal.open) return;

    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    modal.style.setProperty('--school-backdrop-inset', `${headerBottom}px`);
    modal.showModal();
  }, [isModalOpen]);

  return (
    <>
      <motion.button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-label={school.name}
        className="school-card bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg dark:shadow-gray-900/30 transition-all duration-300"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "tween",
          ease: "easeOut",
          duration: 0.2
        }}
        whileHover={{ 
          scale: 1.03,
          transition: {
            type: "tween",
            ease: "easeOut",
            duration: 0.15
          }
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <span className="school-card-logo w-32 h-32 relative mb-4 flex items-center justify-center">
          <Image
            src={school.logo}
            alt={t('logoAlt', { name: school.name })}
            width={128}
            height={128}
            className="object-contain dark:brightness-95"
          />
        </span>
        <span lang="zh" className="school-card-name text-base sm:text-xl font-bold text-brand-red dark:text-red-400">{school.name}</span>
      </motion.button>

      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="school-dialog bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8"
        onClose={() => {
          setIsModalOpen(false);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            event.currentTarget.close();
          }
        }}
      >
        {isModalOpen && <>
            <div className="school-dialog-close flex justify-end mb-4">
              <button 
                type="button"
                autoFocus
                onClick={() => dialog.current?.close()}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label={t('close')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="school-dialog-content flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              <div className="school-dialog-logo w-56 h-56 sm:w-60 sm:h-60 md:w-64 md:h-64 flex-shrink-0 flex items-center justify-center relative mb-2 md:mb-0">
                <Image
                  src={school.logo}
                  alt={school.name}
                  width={256}
                  height={256}
                  className="object-contain dark:brightness-95"
                  priority
                />
              </div>
              <div className="flex-grow w-full md:w-auto text-center md:text-left">
                <h2 id={titleId} lang="zh" className="text-2xl sm:text-3xl font-bold text-brand-red dark:text-red-400 mb-6">{school.name}</h2>
                {school.groupInfo && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p lang="zh" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{school.groupInfo.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">{t('groupNumber', { number: school.groupInfo.number })}</p>
                      <p lang="zh" className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{school.groupInfo.description}</p>
                    </div>
                    {school.groupInfo.extraGroups && school.groupInfo.extraGroups.map((group, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p lang="zh" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{group.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">{t('groupNumber', { number: group.number })}</p>
                        <p lang="zh" className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{group.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </>}
      </dialog>
    </>
  );
} 