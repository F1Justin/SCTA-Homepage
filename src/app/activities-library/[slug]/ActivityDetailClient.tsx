'use client';

import React from 'react';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { ActivityBlueprint, ActivityBlueprintFields } from '@/types/contentful';
import TextCoverPlaceholder from '@/components/TextCoverPlaceholder';

interface ActivityDetailClientProps {
  activity: ActivityBlueprint;
}

export default function ActivityDetailClient({ activity }: ActivityDetailClientProps) {
  const fields = activity.fields as ActivityBlueprintFields;

  // 调试日志
  console.log('需求字段:', {
    硬件需求: fields.hardwareRequirements,
    软件需求: fields.softwareRequirements,
    物料需求: fields.materialsNeeded,
  });

  // 格式化需求字段
  const formatRequirement = (requirement: any): string[] => {
    if (typeof requirement === 'string') {
      return requirement.split('\n').filter(Boolean);
    } else if (requirement && typeof requirement === 'object') {
      // 处理可能的Contentful对象
      if (requirement.content && Array.isArray(requirement.content)) {
        // 富文本格式处理
        return requirement.content
          .map((item: any) => 
            item.content?.map((c: any) => c.value).join('') || '')
          .filter(Boolean);
      } else {
        // 其他对象格式
        return [JSON.stringify(requirement)];
      }
    }
    return [];
  };

  // 富文本渲染选项
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-2">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal list-inside mb-6 text-gray-700 dark:text-gray-300 space-y-2">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="ml-4">{children}</li>
      ),
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: any) => <u className="underline">{text}</u>,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-[700px] mx-auto">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link
            href="/activities-library"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回活动方案库
          </Link>
        </div>

        {/* 活动方案内容 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* 封面图 */}
          <div className="relative w-full bg-gray-200 dark:bg-gray-700">
            {fields.coverImage?.fields?.file?.url ? (
              <img
                src={typeof fields.coverImage.fields.file.url === 'string' 
                  ? (fields.coverImage.fields.file.url.startsWith('//') 
                      ? `https:${fields.coverImage.fields.file.url}` 
                      : fields.coverImage.fields.file.url)
                  : ''}
                alt={fields.title}
                className="w-full h-auto"
              />
            ) : (
              <div className="aspect-video">
                <TextCoverPlaceholder title={fields.title} />
              </div>
            )}
          </div>

          {/* 活动信息表格 - 移到封面图下方 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-600">
            {fields.durationPerRound && (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-red/10 dark:bg-brand-red/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-red dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">每轮时长</h3>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{fields.durationPerRound}</p>
                </div>
              </div>
            )}
            {fields.rounds && (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-gold/10 dark:bg-brand-gold/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-gold dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">活动轮次</h3>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{fields.rounds}</p>
                </div>
              </div>
            )}
            {fields.participantsPerRound && (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-blue dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">每轮人数</h3>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{fields.participantsPerRound}</p>
                </div>
              </div>
            )}
            {fields.participantCriteria && (
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-500 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">参与条件</h3>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{fields.participantCriteria}</p>
                </div>
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-8">
            {/* 标题和分类 */}
            <div className="mb-12">
              <div className="flex items-start mb-4">
                <div className="flex-1 flex items-start">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {fields.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 ml-4 mt-1.5">
                    {Array.isArray(fields.category) 
                      ? fields.category.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-brand-red/20 text-brand-red dark:bg-brand-red/30 dark:text-red-300 rounded-full text-sm font-medium whitespace-nowrap"
                          >
                            {category}
                          </span>
                        ))
                      : fields.category && (
                          <span
                            className="px-3 py-1 bg-brand-red/20 text-brand-red dark:bg-brand-red/30 dark:text-red-300 rounded-full text-sm font-medium whitespace-nowrap"
                          >
                            {fields.category}
                          </span>
                        )
                    }
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">{fields.summary}</p>
            </div>

            {/* 活动规则 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">活动规则</h2>
              <div className="prose dark:prose-invert max-w-none">
                {documentToReactComponents(fields.rules, options)}
              </div>
            </section>

            {/* 活动流程 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">活动流程</h2>
              <div className="prose dark:prose-invert max-w-none">
                {documentToReactComponents(fields.procedure, options)}
              </div>
            </section>

            {/* 准备事项 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">准备事项</h2>
              <div className="space-y-4">
                {/* 硬件需求 */}
                {fields.hardwareRequirements && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                      <svg className="w-5 h-5 text-brand-red dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      硬件需求
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(fields.hardwareRequirements) && fields.hardwareRequirements.map((item: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 软件需求 */}
                {fields.softwareRequirements && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                      <svg className="w-5 h-5 text-brand-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      软件需求
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(fields.softwareRequirements) && fields.softwareRequirements.map((item: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 物料需求 */}
                {fields.materialsNeeded && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                      <svg className="w-5 h-5 text-brand-gold dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      物料需求
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(fields.materialsNeeded) && fields.materialsNeeded.map((item: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 注意事项 */}
            {fields.tips && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">注意事项</h2>
                <div className="prose dark:prose-invert max-w-none">
                  {documentToReactComponents(fields.tips, options)}
                </div>
              </section>
            )}

            {/* 奖励建议 */}
            {fields.rewardSuggestion && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">奖励建议</h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <p className="text-gray-700 dark:text-gray-300">{fields.rewardSuggestion}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 