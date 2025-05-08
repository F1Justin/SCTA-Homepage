import { School } from '@/data/schools';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg dark:shadow-gray-900/30 transition-all duration-300"
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
        <div className="w-32 h-32 relative mb-4 flex items-center justify-center">
          <Image
            src={school.logo}
            alt={`${school.name} 徽标`}
            width={128}
            height={128}
            className="object-contain dark:brightness-95"
          />
        </div>
        <h3 className="text-base sm:text-xl font-bold text-brand-red dark:text-red-400">{school.name}</h3>
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                aria-label="关闭"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              <div className="w-56 h-56 sm:w-60 sm:h-60 md:w-64 md:h-64 flex-shrink-0 flex items-center justify-center relative mb-2 md:mb-0">
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
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-red dark:text-red-400 mb-6">{school.name}</h2>
                {school.groupInfo && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{school.groupInfo.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">群号：{school.groupInfo.number}</p>
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{school.groupInfo.description}</p>
                    </div>
                    {school.groupInfo.extraGroups && school.groupInfo.extraGroups.map((group, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">{group.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">群号：{group.number}</p>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{group.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 