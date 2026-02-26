import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import type { Activity, Blueprint } from '@/types/content';

const ACTIVITIES_DIR = path.join(process.cwd(), 'content/activities');
const BLUEPRINTS_DIR = path.join(process.cwd(), 'content/blueprints');

async function markdownToHtml(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(md);
  return result.toString();
}

// ── Activities ──

export async function getAllActivities(): Promise<Activity[]> {
  if (!fs.existsSync(ACTIVITIES_DIR)) return [];

  const files = fs.readdirSync(ACTIVITIES_DIR).filter(f => f.endsWith('.md'));

  const activities = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(ACTIVITIES_DIR, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      const contentHtml = await markdownToHtml(content);

      return {
        slug: data.slug || filename.replace(/\.md$/, ''),
        title: data.title || '',
        date: data.date || '',
        category: data.category || '',
        image: data.image || '',
        contentHtml,
      } satisfies Activity;
    })
  );

  return activities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  if (!fs.existsSync(ACTIVITIES_DIR)) return null;

  const files = fs.readdirSync(ACTIVITIES_DIR).filter(f => f.endsWith('.md'));

  for (const filename of files) {
    const filePath = path.join(ACTIVITIES_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fileSlug = data.slug || filename.replace(/\.md$/, '');

    if (fileSlug === slug) {
      return {
        slug: fileSlug,
        title: data.title || '',
        date: data.date || '',
        category: data.category || '',
        image: data.image || '',
        contentHtml: await markdownToHtml(content),
      };
    }
  }

  return null;
}

export function getAllActivitySlugs(): string[] {
  if (!fs.existsSync(ACTIVITIES_DIR)) return [];

  return fs.readdirSync(ACTIVITIES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(ACTIVITIES_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return data.slug || filename.replace(/\.md$/, '');
    });
}

// ── Blueprints ──

function splitBlueprintSections(content: string) {
  const sections: { rules?: string; procedure?: string; tips?: string } = {};
  const sectionRegex = /^## (.+)$/gm;
  const parts: { name: string; start: number }[] = [];
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    parts.push({ name: match[1].trim(), start: match.index + match[0].length });
  }

  for (let i = 0; i < parts.length; i++) {
    const end = i + 1 < parts.length ? parts[i + 1].start - parts[i + 1].name.length - 3 : content.length;
    const text = content.slice(parts[i].start, end).trim();
    const name = parts[i].name;

    if (name.includes('规则')) sections.rules = text;
    else if (name.includes('流程')) sections.procedure = text;
    else if (name.includes('注意')) sections.tips = text;
  }

  return sections;
}

export async function getAllBlueprints(): Promise<Blueprint[]> {
  if (!fs.existsSync(BLUEPRINTS_DIR)) return [];

  const files = fs.readdirSync(BLUEPRINTS_DIR).filter(f => f.endsWith('.md'));

  const blueprints = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(BLUEPRINTS_DIR, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);

      const rawSections = splitBlueprintSections(content);
      const sections = {
        rules: rawSections.rules ? await markdownToHtml(rawSections.rules) : undefined,
        procedure: rawSections.procedure ? await markdownToHtml(rawSections.procedure) : undefined,
        tips: rawSections.tips ? await markdownToHtml(rawSections.tips) : undefined,
      };

      const category = Array.isArray(data.category) ? data.category : [data.category].filter(Boolean);

      return {
        slug: data.slug || filename.replace(/\.md$/, ''),
        title: data.title || '',
        category,
        summary: data.summary || '',
        coverImage: data.coverImage || '',
        durationPerRound: data.durationPerRound,
        rounds: data.rounds,
        participantsPerRound: data.participantsPerRound,
        participantCriteria: data.participantCriteria,
        hardwareRequirements: data.hardwareRequirements,
        softwareRequirements: data.softwareRequirements,
        materialsNeeded: data.materialsNeeded,
        rewardSuggestion: data.rewardSuggestion,
        sections,
      } satisfies Blueprint;
    })
  );

  return blueprints.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
}

export async function getBlueprintBySlug(slug: string): Promise<Blueprint | null> {
  if (!fs.existsSync(BLUEPRINTS_DIR)) return null;

  const files = fs.readdirSync(BLUEPRINTS_DIR).filter(f => f.endsWith('.md'));

  for (const filename of files) {
    const filePath = path.join(BLUEPRINTS_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const fileSlug = data.slug || filename.replace(/\.md$/, '');

    if (fileSlug === slug) {
      const rawSections = splitBlueprintSections(content);
      const sections = {
        rules: rawSections.rules ? await markdownToHtml(rawSections.rules) : undefined,
        procedure: rawSections.procedure ? await markdownToHtml(rawSections.procedure) : undefined,
        tips: rawSections.tips ? await markdownToHtml(rawSections.tips) : undefined,
      };

      const category = Array.isArray(data.category) ? data.category : [data.category].filter(Boolean);

      return {
        slug: fileSlug,
        title: data.title || '',
        category,
        summary: data.summary || '',
        coverImage: data.coverImage || '',
        durationPerRound: data.durationPerRound,
        rounds: data.rounds,
        participantsPerRound: data.participantsPerRound,
        participantCriteria: data.participantCriteria,
        hardwareRequirements: data.hardwareRequirements,
        softwareRequirements: data.softwareRequirements,
        materialsNeeded: data.materialsNeeded,
        rewardSuggestion: data.rewardSuggestion,
        sections,
      };
    }
  }

  return null;
}

export function getAllBlueprintSlugs(): string[] {
  if (!fs.existsSync(BLUEPRINTS_DIR)) return [];

  return fs.readdirSync(BLUEPRINTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(BLUEPRINTS_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return data.slug || filename.replace(/\.md$/, '');
    });
}
