import React, { useMemo } from 'react';

interface TextCoverPlaceholderProps {
  title: string;
}

// 渐变背景样式数组
const gradients = [
  // 红色系列
  'bg-gradient-to-r from-brand-red via-brand-red/70 to-brand-gold/50',
  'bg-gradient-to-br from-brand-red/90 via-brand-gold/30 to-brand-blue/30',
  'bg-gradient-to-tr from-brand-red/80 via-brand-red/50 to-brand-gold/40',
  
  // 金色系列
  'bg-gradient-to-r from-brand-gold via-brand-gold/70 to-brand-blue/50',
  'bg-gradient-to-br from-brand-gold/90 via-brand-red/30 to-brand-blue/30',
  'bg-gradient-to-tr from-brand-gold/80 via-brand-gold/50 to-brand-red/40',
  
  // 蓝色系列
  'bg-gradient-to-r from-brand-blue via-brand-blue/70 to-brand-gold/50',
  'bg-gradient-to-br from-brand-blue/90 via-brand-gold/30 to-brand-red/30',
  'bg-gradient-to-tr from-brand-blue/80 via-brand-blue/50 to-brand-gold/40',
  
  // 混合系列
  'bg-gradient-to-r from-brand-red via-brand-gold to-brand-blue',
  'bg-gradient-to-br from-brand-gold via-brand-blue to-brand-red',
  'bg-gradient-to-tr from-brand-blue via-brand-red to-brand-gold',
];

/**
 * 文本封面占位组件
 * 当活动没有封面图片时，生成一个带有活动标题的渐变背景占位图
 */
export default function TextCoverPlaceholder({ title }: TextCoverPlaceholderProps) {
  // 根据标题生成一个稳定的渐变样式索引
  const gradientIndex = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = ((hash << 5) - hash) + title.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % gradients.length;
  }, [title]);

  return (
    <div className={`absolute inset-0 ${gradients[gradientIndex]} flex items-center justify-center p-8 w-full h-full`}>
      <h1 style={{ fontFamily: 'SmileySans' }} className="text-4xl md:text-5xl font-normal text-white text-center break-words max-w-2xl drop-shadow-lg">
        {title}
      </h1>
    </div>
  );
} 