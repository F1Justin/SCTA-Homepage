/**
 * One-time script: export all Contentful data to local Markdown files + download images.
 * Run with: node scripts/export-contentful.mjs
 */

import { createClient } from 'contentful';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SPACE_ID = 'nfiykxq7wxh1';
const ACCESS_TOKEN = 'dn5gLEeVXLo3vqXgSZaRbjK7ZQFMziNK0Ydb4UjjG4o';

const client = createClient({ space: SPACE_ID, accessToken: ACCESS_TOKEN });

// ── Helpers ──

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = url.startsWith('//') ? `https:${url}` : url;
    const file = fs.createWriteStream(destPath);
    https.get(fullUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function richTextToMarkdown(doc, assets = {}) {
  if (!doc || !doc.content) return '';
  return doc.content.map(node => nodeToMd(node, assets)).join('\n\n');
}

function nodeToMd(node, assets) {
  if (!node) return '';

  switch (node.nodeType) {
    case 'paragraph':
      return inlineContent(node.content, assets);
    case 'heading-1':
      return `# ${inlineContent(node.content, assets)}`;
    case 'heading-2':
      return `## ${inlineContent(node.content, assets)}`;
    case 'heading-3':
      return `### ${inlineContent(node.content, assets)}`;
    case 'heading-4':
      return `#### ${inlineContent(node.content, assets)}`;
    case 'unordered-list':
      return node.content.map(li => nodeToMd(li, assets)).join('\n');
    case 'ordered-list':
      return node.content.map((li, i) => {
        const text = li.content.map(c => nodeToMd(c, assets)).join('');
        return `${i + 1}. ${text.replace(/^- /, '')}`;
      }).join('\n');
    case 'list-item':
      return node.content.map(c => `- ${nodeToMd(c, assets)}`).join('\n');
    case 'blockquote':
      return node.content.map(c => `> ${nodeToMd(c, assets)}`).join('\n');
    case 'hr':
      return '---';
    case 'embedded-asset-block': {
      const assetId = node.data?.target?.sys?.id;
      const asset = assets[assetId] || node.data?.target;
      if (asset?.fields?.file) {
        const url = asset.fields.file.url;
        const alt = asset.fields.description || asset.fields.title || '';
        return `![${alt}](${url.startsWith('//') ? 'https:' + url : url})`;
      }
      return '';
    }
    case 'embedded-entry-block':
      return '';
    default:
      if (node.content) return node.content.map(c => nodeToMd(c, assets)).join('');
      return '';
  }
}

function inlineContent(nodes, assets) {
  if (!nodes) return '';
  return nodes.map(node => {
    if (node.nodeType === 'text') {
      let text = node.value || '';
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'bold') text = `**${text}**`;
          if (mark.type === 'italic') text = `*${text}*`;
          if (mark.type === 'code') text = `\`${text}\``;
          if (mark.type === 'underline') text = `<u>${text}</u>`;
        }
      }
      return text;
    }
    if (node.nodeType === 'hyperlink') {
      return `[${inlineContent(node.content, assets)}](${node.data.uri})`;
    }
    if (node.nodeType === 'embedded-entry-inline') return '';
    if (node.content) return inlineContent(node.content, assets);
    return '';
  }).join('');
}

// ── Export Activities ──

async function exportActivities() {
  console.log('Fetching activities...');
  const response = await client.getEntries({
    content_type: 'activity',
    order: ['-fields.date'],
    include: 10,
    limit: 100,
  });

  console.log(`Found ${response.items.length} activities`);

  const assetMap = {};
  if (response.includes?.Asset) {
    for (const asset of response.includes.Asset) {
      assetMap[asset.sys.id] = asset;
    }
  }

  let count = 0;
  for (const item of response.items) {
    const f = item.fields;
    if (!f.title) continue; // skip empty drafts

    const slug = slugify(f.title);
    const date = f.date || '';

    // Download cover image if exists
    let localImage = '';
    const imageUrl = f.imageUrl || '';
    if (imageUrl) {
      const fullUrl = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
      const ext = path.extname(new URL(fullUrl).pathname) || '.jpg';
      const imgFileName = `${slug}${ext}`;
      const imgDest = path.join(ROOT, 'public/content/activities', imgFileName);
      try {
        await downloadFile(fullUrl, imgDest);
        localImage = `/content/activities/${imgFileName}`;
        console.log(`  Downloaded image: ${imgFileName}`);
      } catch (e) {
        console.warn(`  Failed to download image for "${f.title}": ${e.message}`);
      }
    }

    // Convert rich text description to markdown
    const bodyMd = richTextToMarkdown(f.description, assetMap);

    // Download any embedded images from the body
    const embeddedImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
    let processedBody = bodyMd;
    let match;
    let imgIndex = 0;
    while ((match = embeddedImageRegex.exec(bodyMd)) !== null) {
      const [fullMatch, alt, imgUrl] = match;
      const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
      const embImgName = `${slug}-embed-${imgIndex}${ext}`;
      const embDest = path.join(ROOT, 'public/content/activities', embImgName);
      try {
        await downloadFile(imgUrl, embDest);
        processedBody = processedBody.replace(fullMatch, `![${alt}](/content/activities/${embImgName})`);
        console.log(`  Downloaded embedded image: ${embImgName}`);
      } catch (e) {
        console.warn(`  Failed to download embedded image: ${e.message}`);
      }
      imgIndex++;
    }

    // Build frontmatter
    const frontmatter = [
      '---',
      `title: "${f.title.replace(/"/g, '\\"')}"`,
      `date: "${date}"`,
      `category: "${(f.category || '').replace(/"/g, '\\"')}"`,
      localImage ? `image: "${localImage}"` : `image: ""`,
      `slug: "${slug}"`,
      '---',
    ].join('\n');

    const filePath = path.join(ROOT, 'content/activities', `${slug}.md`);
    fs.writeFileSync(filePath, `${frontmatter}\n\n${processedBody.trim()}\n`);
    count++;
    console.log(`  Exported: ${f.title}`);
  }
  console.log(`\nExported ${count} activities.\n`);
}

// ── Export Blueprints ──

async function exportBlueprints() {
  console.log('Fetching activity blueprints...');
  const response = await client.getEntries({
    content_type: 'activityBlueprint',
    include: 10,
    limit: 100,
  });

  console.log(`Found ${response.items.length} blueprints`);

  const assetMap = {};
  if (response.includes?.Asset) {
    for (const asset of response.includes.Asset) {
      assetMap[asset.sys.id] = asset;
    }
  }

  let count = 0;
  for (const item of response.items) {
    const f = item.fields;
    if (!f.title || !f.summary) continue;

    const slug = f.slug || slugify(f.title);

    // Download cover image
    let localCover = '';
    if (f.coverImage?.fields?.file?.url) {
      const imgUrl = f.coverImage.fields.file.url;
      const fullUrl = imgUrl.startsWith('//') ? `https:${imgUrl}` : imgUrl;
      const ext = path.extname(new URL(fullUrl).pathname) || '.jpg';
      const imgFileName = `${slug}${ext}`;
      const imgDest = path.join(ROOT, 'public/content/blueprints', imgFileName);
      try {
        await downloadFile(fullUrl, imgDest);
        localCover = `/content/blueprints/${imgFileName}`;
        console.log(`  Downloaded cover: ${imgFileName}`);
      } catch (e) {
        console.warn(`  Failed to download cover for "${f.title}": ${e.message}`);
      }
    }

    // Build frontmatter
    const categories = Array.isArray(f.category) ? f.category : [f.category].filter(Boolean);
    const fmLines = [
      '---',
      `title: "${f.title.replace(/"/g, '\\"')}"`,
      `slug: "${slug}"`,
      `category:`,
      ...categories.map(c => `  - "${c}"`),
      `summary: "${(f.summary || '').replace(/"/g, '\\"')}"`,
      localCover ? `coverImage: "${localCover}"` : `coverImage: ""`,
    ];

    if (f.durationPerRound) fmLines.push(`durationPerRound: "${f.durationPerRound}"`);
    if (f.rounds) fmLines.push(`rounds: "${f.rounds}"`);
    if (f.participantsPerRound) fmLines.push(`participantsPerRound: "${f.participantsPerRound}"`);
    if (f.participantCriteria) fmLines.push(`participantCriteria: "${f.participantCriteria}"`);

    if (f.hardwareRequirements) {
      const items = Array.isArray(f.hardwareRequirements) ? f.hardwareRequirements : [f.hardwareRequirements];
      fmLines.push(`hardwareRequirements:`);
      items.forEach(i => fmLines.push(`  - "${i}"`));
    }
    if (f.softwareRequirements) {
      const items = Array.isArray(f.softwareRequirements) ? f.softwareRequirements : [f.softwareRequirements];
      fmLines.push(`softwareRequirements:`);
      items.forEach(i => fmLines.push(`  - "${i}"`));
    }
    if (f.materialsNeeded) {
      const items = Array.isArray(f.materialsNeeded) ? f.materialsNeeded : [f.materialsNeeded];
      fmLines.push(`materialsNeeded:`);
      items.forEach(i => fmLines.push(`  - "${i}"`));
    }
    if (f.rewardSuggestion) fmLines.push(`rewardSuggestion: "${f.rewardSuggestion.replace(/"/g, '\\"')}"`);

    fmLines.push('---');

    // Build body sections from rich text
    const sections = [];
    if (f.rules) {
      sections.push(`## 活动规则\n\n${richTextToMarkdown(f.rules, assetMap)}`);
    }
    if (f.procedure) {
      sections.push(`## 活动流程\n\n${richTextToMarkdown(f.procedure, assetMap)}`);
    }
    if (f.tips) {
      sections.push(`## 注意事项\n\n${richTextToMarkdown(f.tips, assetMap)}`);
    }

    const filePath = path.join(ROOT, 'content/blueprints', `${slug}.md`);
    fs.writeFileSync(filePath, `${fmLines.join('\n')}\n\n${sections.join('\n\n').trim()}\n`);
    count++;
    console.log(`  Exported: ${f.title}`);
  }
  console.log(`\nExported ${count} blueprints.\n`);
}

// ── Main ──

async function main() {
  console.log('=== Contentful Export Script ===\n');
  await exportActivities();
  await exportBlueprints();
  console.log('=== Export complete! ===');
}

main().catch(console.error);
