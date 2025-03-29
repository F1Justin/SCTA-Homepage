'use client';

import { getActivity } from '@/lib/contentful';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { Activity } from '@/lib/contentful';
import Link from 'next/link';

interface ActivityPageProps {
  params: {
    id: string;
  };
}

export default function ActivityPage({ params }: ActivityPageProps) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageAspectRatio, setImageAspectRatio] = useState(16/9); // 默认比例

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const activityData = await getActivity(params.id);
        setActivity(activityData);
        
        console.log('Activity data:', JSON.stringify(activityData, null, 2));
        if (activityData?.description?.content) {
          console.log('Description content types:', activityData.description.content.map(item => item.nodeType));
          
          // 检查是否有嵌入资产
          const embeddedAssets = activityData.description.content.filter(
            item => item.nodeType === BLOCKS.EMBEDDED_ASSET
          );
          
          console.log('Embedded assets found:', embeddedAssets.length);
          if (embeddedAssets.length > 0) {
            embeddedAssets.forEach((asset, index) => {
              console.log(`Asset ${index + 1}:`, JSON.stringify(asset.data, null, 2));
            });
          }
        }
        
        // 获取图片实际尺寸
        if (activityData?.image) {
          const img = new window.Image();
          img.src = activityData.image;
          img.onload = () => {
            setImageAspectRatio(img.width / img.height);
          };
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  // 富文本渲染选项
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
        return <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>;
      },
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-3xl font-bold mb-4 dark:text-gray-100">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-2xl font-bold mb-3 dark:text-gray-100">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-xl font-bold mb-2 dark:text-gray-100">{children}</h3>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        console.log('Rendering embedded asset:', JSON.stringify(node, null, 2));
        try {
          // 检查节点的数据结构
          if (!node.data.target || !node.data.target.fields) {
            console.error('Invalid node structure:', node);
            return <div className="my-4 p-2 bg-red-100 text-red-700 rounded">资源加载失败</div>;
          }

          // 获取资产字段
          const { title, description, file } = node.data.target.fields;
          if (!file || !file.url) {
            console.error('Missing file URL in asset:', node.data.target.fields);
            return <div className="my-4 p-2 bg-red-100 text-red-700 rounded">图片URL缺失</div>;
          }

          // 确保URL是完整的URL
          let imageUrl = file.url;
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (!imageUrl.startsWith('http')) {
            imageUrl = 'https:' + imageUrl; // 添加此行，确保所有 URL 都加上协议
          }

          console.log('Rendering image with URL:', imageUrl);
          
          return (
            <div className="my-8">
              <img
                src={imageUrl}
                height={file.details?.image?.height}
                width={file.details?.image?.width}
                alt={description || title || '活动图片'}
                className="max-w-full h-auto rounded-lg shadow-lg dark:shadow-gray-700/30"
              />
              {description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {description}
                </p>
              )}
            </div>
          );
        } catch (error) {
          console.error('Error rendering embedded asset:', error);
          console.error('Node data:', node);
          return <div className="my-8 p-4 bg-red-100 text-red-800 rounded-lg">图片加载失败</div>;
        }
      },
      // 确保处理嵌入式条目 - block和inline两种类型
      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
        console.log('Rendering embedded entry block:', node);
        return <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">嵌入式内容</div>;
      },
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        console.log('Rendering embedded entry inline:', node);
        return <span className="bg-gray-100 dark:bg-gray-800 px-1 rounded">嵌入式内容</span>;
      },
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal pl-6 mb-4 text-gray-700 dark:text-gray-300">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="mb-1">{children}</li>
      ),
      [INLINES.HYPERLINK]: (node: any, children: any) => (
        <a 
          href={node.data.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
        >
          {children}
        </a>
      ),
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: any) => <u>{text}</u>,
      [MARKS.CODE]: (text: any) => (
        <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{text}</code>
      ),
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">活动未找到</h1>
        <p className="mt-4 dark:text-gray-300">抱歉，我们无法找到您请求的活动。</p>
        <Link 
          href="/activities" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← 返回活动列表
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧图片区域 */}
          <div className="lg:col-span-5">
            <div 
              className="relative w-full overflow-hidden rounded-lg sticky top-8"
              style={{ 
                aspectRatio: imageAspectRatio,
                maxHeight: '80vh'
              }}
            >
              <img
                src={activity.image || '/activities/placeholder.jpg'}
                alt={activity.title}
                className="w-full h-full object-contain bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-start gap-4 mb-4">
              <div className="flex-1 flex items-start gap-4">
                <h1 className="text-4xl font-bold text-brand-red dark:text-red-400 break-words hyphens-auto" style={{ wordBreak: 'break-word' }}>{activity.title}</h1>
                <span className="inline-flex items-center px-4 h-8 bg-red-50 dark:bg-red-900/30 text-brand-red dark:text-red-400 rounded-full text-sm font-medium flex-shrink-0 mt-2">
                  {activity.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-8">
              <span className="flex items-center">
                <i className="far fa-calendar mr-2"></i>
                {formatDate(activity.date)}
              </span>
            </div>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              {documentToReactComponents(activity.description, options)}
            </div>
            
            <div className="mt-8">
              <Link 
                href="/activities" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← 返回活动列表
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 