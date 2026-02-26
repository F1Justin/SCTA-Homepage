import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Blueprint } from '@/types/content';

const gradients = [
  'bg-gradient-to-r from-brand-red via-brand-red/70 to-brand-gold/50',
  'bg-gradient-to-br from-brand-red/90 via-brand-gold/30 to-brand-blue/30',
  'bg-gradient-to-tr from-brand-red/80 via-brand-red/50 to-brand-gold/40',
  'bg-gradient-to-r from-brand-gold via-brand-gold/70 to-brand-blue/50',
  'bg-gradient-to-br from-brand-gold/90 via-brand-red/30 to-brand-blue/30',
  'bg-gradient-to-tr from-brand-gold/80 via-brand-gold/50 to-brand-red/40',
  'bg-gradient-to-r from-brand-blue via-brand-blue/70 to-brand-gold/50',
  'bg-gradient-to-br from-brand-blue/90 via-brand-gold/30 to-brand-red/30',
  'bg-gradient-to-tr from-brand-blue/80 via-brand-blue/50 to-brand-gold/40',
  'bg-gradient-to-r from-brand-red via-brand-gold to-brand-blue',
  'bg-gradient-to-br from-brand-gold via-brand-blue to-brand-red',
  'bg-gradient-to-tr from-brand-blue via-brand-red to-brand-gold',
];

interface BlueprintCardProps {
  blueprint: Blueprint;
}

export default function BlueprintCard({ blueprint }: BlueprintCardProps) {
  const gradientIndex = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < blueprint.title.length; i++) {
      hash = ((hash << 5) - hash) + blueprint.title.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % gradients.length;
  }, [blueprint.title]);

  return (
    <Link 
      href={`/activities-library/${blueprint.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative aspect-video w-full">
        {blueprint.coverImage ? (
          <Image
            src={blueprint.coverImage}
            alt={blueprint.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 ${gradients[gradientIndex]} flex items-center justify-center p-6`}>
            <h3 style={{ fontFamily: 'SmileySans' }} className="text-4xl md:text-5xl font-normal text-white text-center drop-shadow-lg">
              {blueprint.title}
            </h3>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
          {blueprint.category.map((cat, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-brand-red dark:text-red-400 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{blueprint.title}</h3>
        {blueprint.summary && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{blueprint.summary}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {blueprint.durationPerRound && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{blueprint.durationPerRound}</span>
            </div>
          )}
          {blueprint.participantsPerRound && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{blueprint.participantsPerRound}人</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
