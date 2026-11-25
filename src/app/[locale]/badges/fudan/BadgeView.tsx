'use client';

import { MotionDiv, MotionProvider } from '@/components/Motion';
import { useBadgeRotation } from '../useBadgeRotation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function FudanBadgePage() {
  const t = useTranslations('badges');
  const { stage, rotateY, controls } = useBadgeRotation();

  return (
    <div className="badge-detail min-h-screen bg-black text-white flex flex-col">
      <header className="py-6 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/badges" className="text-lg font-semibold text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('back')}
          </Link>
          <h1 lang="zh" className="text-xl font-bold">复旦大学弹幕大师勋章</h1>
        </div>
      </header>

      <section
        ref={stage}
        className="flex-grow flex flex-col items-center justify-center px-4"
        style={{
          background: 'radial-gradient(circle at center, #121212 0%, #000000 100%)'
        }}
      >
        <div
          {...controls}
          aria-label={t('rotate')}
          className="badge-rotation w-80 h-80 relative cursor-grab active:cursor-grabbing"
        >
          <MotionProvider>
            <MotionDiv
              className="absolute inset-0 flex items-center justify-center"
              style={{
                perspective: 1200,
                transformStyle: 'preserve-3d',
                rotateY,
              }}
            >
              {/* 徽章侧边厚度部分 */}
              <div className="absolute w-full h-full rounded-full" style={{
                background: 'linear-gradient(to right, #1c665f, #38B2A6, #c4fff8, #38B2A6, #1c665f)',
                transform: 'translateZ(-4px) scale(1.02)',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4)'
              }}></div>

              {/* 徽章背面 */}
              <div className="absolute w-full h-full rounded-full" style={{
                background: 'linear-gradient(135deg, #1c665f 0%, #38B2A6 100%)',
                transform: 'translateZ(-5px) scale(1.01)',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.6)'
              }}></div>

              {/* 外部金属环 */}
              <div className="absolute w-full h-full rounded-full" style={{
                background: 'linear-gradient(135deg, #38B2A6 0%, #c4fff8 25%, #38B2A6 50%, #c4fff8 75%, #38B2A6 100%)',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.01)'
              }}></div>

              {/* 主体背景圆盘 */}
              <div className="absolute w-[96%] h-[96%] rounded-full" style={{
                background: 'linear-gradient(135deg, #6a0303 0%, #8C1515 100%)',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.6)',
                transform: 'translateZ(0.5px)'
              }}></div>

              {/* 内部白色环 - 外圈 */}
              <div className="absolute w-[80%] h-[80%] rounded-full" style={{
                border: '3px solid rgba(255, 255, 255, 0.85)',
                transform: 'translateZ(0.8px)',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)'
              }}></div>

              {/* 内部白色环 - 内圈 */}
              <div className="absolute w-[60%] h-[60%] rounded-full" style={{
                border: '1.5px solid rgba(255, 255, 255, 0.7)',
                transform: 'translateZ(1px)',
                boxShadow: 'inset 0 0 5px rgba(255, 255, 255, 0.1)'
              }}></div>

              {/* 光泽效果层 */}
              <div className="absolute w-full h-full rounded-full overflow-hidden pointer-events-none" style={{
                background: 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
                transform: 'translateZ(1.2px)'
              }}></div>

              {/* 学校徽标 */}
              <div
                className="w-full h-full flex items-center justify-center absolute"
                style={{ transform: 'translateZ(1.3px)' }}
              >
                {/* 使用学校徽标图片 */}
                <div className="w-[85%] h-[85%] flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src="/School-Logos/复旦大学.webp"
                    alt={t('emblem', { name: '复旦大学' })}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    style={{
                      filter: 'drop-shadow(0 0 5px rgba(56, 178, 166, 0.5))'
                    }}
                  />
                </div>
              </div>

              {/* 底部文字 */}
              <div className="absolute bottom-8 text-center w-full" style={{
                transform: 'translateZ(1.4px)'
              }}>
                <div className="text-white text-xl font-bold mb-1" style={{
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
                }} lang="zh">复旦大学</div>
                <div className="text-white text-sm opacity-90" style={{
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
                }} lang="zh">弹幕大师勋章</div>
              </div>
            </MotionDiv>
          </MotionProvider>
        </div>

        <div className="badge-detail-caption mt-16 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3 text-teal-400" style={{
            textShadow: '0 0 10px rgba(56, 178, 166, 0.3)'
          }} lang="zh">弹幕大师勋章</h2>
          <p lang="zh" className="text-gray-400 mb-6">
            此勋章授予在弹幕游戏中展现卓越技巧的复旦大学东方社团成员，
            表彰其对东方游戏的热爱与精通，以及在各类比赛中的优异表现。
          </p>
          <div className="flex justify-center gap-3 text-xs text-gray-500">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block rounded-full bg-red-800 mr-1"></span>
              {t('fudanColor')}
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block rounded-full bg-teal-400 mr-1"></span>
              {t('fudanValue')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
