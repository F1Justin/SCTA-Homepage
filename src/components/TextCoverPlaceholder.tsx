import React from 'react';

interface TextCoverPlaceholderProps {
  title: string;
}

/**
 * 文本封面占位组件
 * 当活动没有封面图片时，生成一个带有活动标题的渐变背景占位图
 */
export default function TextCoverPlaceholder({ title }: TextCoverPlaceholderProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 flex items-center justify-center p-8 w-full h-full">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center break-words max-w-2xl">
        {title}
      </h1>
    </div>
  );
} 