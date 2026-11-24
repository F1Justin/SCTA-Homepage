import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { parseActivityDate } from '@/i18n/activity-date';
import { decodeRouteSegment } from '@/i18n/route-locale';
import type { Activity, ActivitySummary, Blueprint, BlueprintSummary } from '@/types/content';
import { readActivityPoster } from './posters';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify)
  .freeze();

async function markdownToHtml(markdown: string) {
  return (await processor.process(markdown)).toString();
}

function once<T>(load: () => Promise<T>) {
  let pending: Promise<T> | undefined;
  return () => pending ??= load().catch(error => {
    pending = undefined;
    throw error;
  });
}

function contentCache<T>(load: () => Promise<T>) {
  // Published content belongs to a deployment. Development reads changes on each request.
  return process.env.NODE_ENV === 'production' ? once(load) : cache(load);
}

async function readCollection<T extends { slug: string }>(
  directory: string,
  build: (document: ReturnType<typeof matter>, slug: string) => T,
) {
  const directoryPath = path.join(process.cwd(), 'content', directory);
  const files = await readdir(directoryPath).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  const records = await Promise.all(files.filter(file => file.endsWith('.md')).map(async file => {
    const document = matter(await readFile(path.join(directoryPath, file), 'utf8'));
    const slug = document.data.slug || path.basename(file, '.md');
    return build(document, slug);
  }));
  const bySlug = new Map(records.map(record => [record.slug, record]));
  if (bySlug.size !== records.length) throw new Error(`Duplicate slugs in content/${directory}`);
  return { records, bySlug };
}

const getActivityIndex = contentCache(async () => {
  const posters = new Map<string, Promise<ActivitySummary['poster']>>();
  const index = await readCollection('activities', ({ data, content }, slug) => {
    const image = String(data.image ?? '');
    const date = data.date instanceof Date ? data.date.toISOString() : String(data.date ?? '');
    const meta = { slug, title: String(data.title ?? ''), date, category: String(data.category ?? '') };
    const width = Number(data.imageWidth);
    const height = Number(data.imageHeight);
    const getPoster = () => {
      const key = `${image}\n${width}\n${height}`;
      let poster = posters.get(key);
      if (!poster) {
        poster = readActivityPoster(image, width, height);
        posters.set(key, poster);
      }
      return poster;
    };
    const getBody = once(async () => {
      const contentHtml = await markdownToHtml(content);
      const text = contentHtml.replace(/<[^>]+>/g, '');
      return {
        contentHtml,
        description: text.slice(0, 160),
        preview: text.replace(/\s+/g, ' ').trim().slice(0, 120),
      };
    });
    return { ...meta, timestamp: parseActivityDate(date).getTime(), getPoster, getBody };
  });
  return { ...index, sorted: index.records.slice().sort((a, b) => b.timestamp - a.timestamp) };
});

export async function getActivitySummaries(limit?: number): Promise<ActivitySummary[]> {
  const { sorted } = await getActivityIndex();
  const entries = limit === undefined ? sorted : sorted.slice(0, limit);
  return Promise.all(entries.map(async ({ slug, title, date, category, getPoster, getBody }) => {
    const [poster, { preview }] = await Promise.all([getPoster(), getBody()]);
    return { slug, title, date, category, poster, preview };
  }));
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const { bySlug } = await getActivityIndex();
  const entry = bySlug.get(slug) ?? bySlug.get(decodeRouteSegment(slug));
  if (!entry) return null;

  const { slug: canonicalSlug, title, date, category, getPoster, getBody } = entry;
  const [poster, { contentHtml, description }] = await Promise.all([getPoster(), getBody()]);
  return { slug: canonicalSlug, title, date, category, poster, contentHtml, description };
}

export async function getAllActivitySlugs() {
  return (await getActivityIndex()).records.map(({ slug }) => slug);
}

function splitBlueprintSections(content: string) {
  const sections: { rules?: string; procedure?: string; tips?: string } = {};
  const headings = Array.from(content.matchAll(/^## (.+)$/gm));

  headings.forEach((heading, index) => {
    const name = heading[1].trim();
    const start = heading.index + heading[0].length;
    const text = content.slice(start, headings[index + 1]?.index).trim();
    if (name.includes('规则')) sections.rules = text;
    else if (name.includes('流程')) sections.procedure = text;
    else if (name.includes('注意')) sections.tips = text;
  });

  return sections;
}

const getBlueprintIndex = contentCache(async () => readCollection('blueprints', ({ data, content }, slug) => {
  const summary: BlueprintSummary = {
    slug,
    title: data.title || '',
    category: Array.isArray(data.category) ? data.category : [data.category].filter(Boolean),
    summary: data.summary || '',
    coverImage: data.coverImage || '',
    durationPerRound: data.durationPerRound,
    participantsPerRound: data.participantsPerRound == null ? undefined : String(data.participantsPerRound),
  };
  const getArticle = once(async (): Promise<Blueprint> => {
    const parts = splitBlueprintSections(content);
    const [rules, procedure, tips] = await Promise.all([
      parts.rules && markdownToHtml(parts.rules),
      parts.procedure && markdownToHtml(parts.procedure),
      parts.tips && markdownToHtml(parts.tips),
    ]);
    return {
      ...summary,
      rounds: data.rounds,
      participantCriteria: data.participantCriteria,
      hardwareRequirements: data.hardwareRequirements,
      softwareRequirements: data.softwareRequirements,
      materialsNeeded: data.materialsNeeded,
      rewardSuggestion: data.rewardSuggestion,
      sections: { rules, procedure, tips },
    };
  });
  return { slug, summary, getArticle };
}));

export const getBlueprintSummaries = contentCache(async () => {
  const { records } = await getBlueprintIndex();
  return records.map(({ summary }) => summary).sort((a, b) => a.title.localeCompare(b.title, 'zh'));
});

export async function getBlueprintBySlug(slug: string) {
  const { bySlug } = await getBlueprintIndex();
  const entry = bySlug.get(slug) ?? bySlug.get(decodeRouteSegment(slug));
  return entry ? entry.getArticle() : null;
}

export async function getAllBlueprintSlugs() {
  return (await getBlueprintIndex()).records.map(({ slug }) => slug);
}
