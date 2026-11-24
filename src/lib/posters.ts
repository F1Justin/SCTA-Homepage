import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { ActivityPoster } from '@/types/content';

const publicDirectory = path.resolve(process.cwd(), 'public');

export async function readActivityPoster(src: string, width?: number, height?: number): Promise<ActivityPoster | null> {
  if (!src) return null;

  let url: URL;
  try {
    url = new URL(src, 'https://local.invalid');
  } catch {
    return null;
  }

  if (!src.startsWith('/') || src.startsWith('//')) {
    if (!['http:', 'https:'].includes(url.protocol) || url.hostname === 'local.invalid') return null;

    const dimensions = width && height && width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height)
      ? { width, height }
      : { width: 3, height: 4 };
    return { src: url.href, ...dimensions, unoptimized: true };
  }

  try {
    const file = path.resolve(publicDirectory, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(publicDirectory + path.sep)) return null;
    const bytes = await readFile(file);
    const { autoOrient } = await sharp(bytes).metadata();
    if (!autoOrient.width || !autoOrient.height) return null;
    url.searchParams.set('v', createHash('sha256').update(bytes).digest('hex').slice(0, 12));
    return { src: url.pathname + url.search, width: autoOrient.width, height: autoOrient.height };
  } catch (error) {
    console.warn(`Unable to read activity poster ${src}:`, error instanceof Error ? error.message : error);
    return null;
  }
}
