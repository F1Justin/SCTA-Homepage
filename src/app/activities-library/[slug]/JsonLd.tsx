import { ActivityBlueprint, ActivityBlueprintFields } from '@/types/contentful';
import { normalizeImageUrl } from '@/lib/contentful';

interface JsonLdProps {
  blueprint: ActivityBlueprint;
}

export default function JsonLd({ blueprint }: JsonLdProps) {
  const fields = blueprint.fields as ActivityBlueprintFields;
  
  // 获取活动方案封面图片的URL，确保是字符串类型
  let coverImageUrl = '';
  if (fields.coverImage && 
      fields.coverImage.fields && 
      fields.coverImage.fields.file && 
      typeof fields.coverImage.fields.file.url === 'string') {
    coverImageUrl = normalizeImageUrl(fields.coverImage.fields.file.url);
  }
  
  // 构建TechArticle结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: fields.title,
    description: fields.summary,
    datePublished: blueprint.sys.createdAt,
    dateModified: blueprint.sys.updatedAt,
    author: {
      '@type': 'Organization',
      name: '上海高校东方联合会',
      url: 'https://www.scta.cc',
      logo: {
        '@type': 'ImageObject',
        url: 'https://scta.moe/Logos/上海.png'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: '上海高校东方联合会',
      url: 'https://www.scta.cc',
      logo: {
        '@type': 'ImageObject',
        url: 'https://scta.moe/Logos/上海.png'
      }
    },
    // 如果有封面图片则添加图片数据
    ...(coverImageUrl ? {
      image: {
        '@type': 'ImageObject',
        url: coverImageUrl
      }
    } : {}),
    // 添加活动相关信息
    articleSection: Array.isArray(fields.category) ? fields.category.join(', ') : fields.category,
    // 添加可选的活动相关信息
    ...(fields.durationPerRound ? { timeRequired: fields.durationPerRound } : {}),
    ...(fields.participantsPerRound ? { audience: fields.participantsPerRound } : {}),
    // 添加活动方案URL
    url: `https://www.scta.cc/activities-library/${fields.slug || blueprint.sys.id}`,
    // 添加mainEntityOfPage
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.scta.cc/activities-library/${fields.slug || blueprint.sys.id}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 