import { getActivity } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface ActivityPageProps {
  params: {
    id: string;
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const activity = await getActivity(params.id);

  if (!activity) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };

  // 富文本渲染选项
  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node: any, 
        children: any
      ) => {
        return <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>;
      },
      [BLOCKS.HEADING_1]: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node: any, 
        children: any
      ) => (
        <h1 className="text-3xl font-bold mb-4 dark:text-gray-100">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node: any, 
        children: any
      ) => (
        <h2 className="text-2xl font-bold mb-3 dark:text-gray-100">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        node: any, 
        children: any
      ) => (
        <h3 className="text-xl font-bold mb-2 dark:text-gray-100">{children}</h3>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        try {
          if (!node.data.target || !node.data.target.fields) {
            return <div className="my-4 p-2 bg-red-100 text-red-700 rounded">资源加载失败</div>;
          }

          const { title, description, file } = node.data.target.fields;
          if (!file || !file.url) {
            return <div className="my-4 p-2 bg-red-100 text-red-700 rounded">图片URL缺失</div>;
          }

          let imageUrl = file.url;
          if (imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
          } else if (!imageUrl.startsWith('http')) {
            imageUrl = 'https:' + imageUrl;
          }
          
          return (
            <div className="my-8">
              <Image
                src={imageUrl}
                height={file.details?.image?.height || 400}
                width={file.details?.image?.width || 600}
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
          return <div className="my-8 p-4 bg-red-100 text-red-800 rounded-lg">图片加载失败</div>;
        }
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
        return <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">嵌入式内容</div>;
      },
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧图片区域 */}
          <div className="lg:col-span-5">
            <div className="relative w-full overflow-hidden rounded-lg sticky top-8">
              <Image
                src={activity.image || '/activities/placeholder.jpg'}
                alt={activity.title}
                width={800}
                height={600}
                className="w-full h-auto object-contain bg-gray-50 dark:bg-gray-800"
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