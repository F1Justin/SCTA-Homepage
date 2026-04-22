/**
 * 批量压缩 public/ 目录下的图片
 *
 * 策略：
 *  - School-Logos/   PNG → 最大 400×400，WebP Q80，覆盖原文件（改后缀）
 *  - content/activities/ JPG/PNG/JPEG → 最大 1920×1080，WebP Q82，覆盖原文件
 *  - Logos/          PNG → 最大 800×800，保留 PNG 格式（Q9 压缩），覆盖原文件
 *
 * 运行：node scripts/compress-images.mjs
 * 注意：脚本会修改文件，请先确认 git 已提交或备份。
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

/** 递归获取指定目录下符合扩展名的文件 */
function getImageFiles(dir, exts = ['.jpg', '.jpeg', '.png', '.webp']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getImageFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}M`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}K`;
  return `${bytes}B`;
}

async function compressToWebP(filePath, maxWidth, maxHeight, quality) {
  const originalSize = fs.statSync(filePath).size;
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const outputPath = path.join(dir, `${base}.webp`);

  await sharp(filePath)
    .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath + '.tmp');

  // 写成功后替换
  fs.renameSync(outputPath + '.tmp', outputPath);

  // 如果原文件不是 .webp，删除原文件
  if (filePath !== outputPath) {
    fs.unlinkSync(filePath);
  }

  const newSize = fs.statSync(outputPath).size;
  return { originalPath: filePath, outputPath, originalSize, newSize };
}

async function compressPNG(filePath, maxWidth, maxHeight) {
  const originalSize = fs.statSync(filePath).size;

  const tmpPath = filePath + '.tmp';
  await sharp(filePath)
    .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toFile(tmpPath);

  fs.renameSync(tmpPath, filePath);
  const newSize = fs.statSync(filePath).size;
  return { originalPath: filePath, outputPath: filePath, originalSize, newSize };
}

async function main() {
  console.log('开始压缩图片...\n');

  const tasks = [
    // School-Logos: 最大 400×400，转 WebP
    ...getImageFiles(path.join(publicDir, 'School-Logos')).map((f) => ({
      file: f,
      type: 'webp',
      maxW: 400,
      maxH: 400,
      quality: 85,
    })),
    // content/activities: 最大 1920×1080，转 WebP
    ...getImageFiles(path.join(publicDir, 'content', 'activities')).map((f) => ({
      file: f,
      type: 'webp',
      maxW: 1920,
      maxH: 1080,
      quality: 82,
    })),
    // Logos: 最大 800×800，压缩 PNG（这几个文件已经不大，保守处理）
    ...getImageFiles(path.join(publicDir, 'Logos'), ['.png']).map((f) => ({
      file: f,
      type: 'png',
      maxW: 800,
      maxH: 800,
    })),
  ];

  let totalOriginal = 0;
  let totalNew = 0;
  const renamed = []; // { from, to }

  for (const task of tasks) {
    let result;
    try {
      if (task.type === 'webp') {
        result = await compressToWebP(task.file, task.maxW, task.maxH, task.quality);
      } else {
        result = await compressPNG(task.file, task.maxW, task.maxH);
      }
      totalOriginal += result.originalSize;
      totalNew += result.newSize;

      const reduction = (((result.originalSize - result.newSize) / result.originalSize) * 100).toFixed(0);
      const arrow = result.originalPath !== result.outputPath ? ' →' : '';
      const newName = result.originalPath !== result.outputPath ? ` ${path.basename(result.outputPath)}` : '';
      console.log(
        `✓ ${path.relative(publicDir, result.originalPath)}${arrow}${newName}  ` +
          `${formatBytes(result.originalSize)} → ${formatBytes(result.newSize)} (-${reduction}%)`
      );

      if (result.originalPath !== result.outputPath) {
        renamed.push({
          from: '/' + path.relative(publicDir, result.originalPath).replace(/\\/g, '/'),
          to: '/' + path.relative(publicDir, result.outputPath).replace(/\\/g, '/'),
        });
      }
    } catch (err) {
      console.error(`✗ ${path.relative(publicDir, task.file)}: ${err.message}`);
    }
  }

  console.log(`\n总计：${formatBytes(totalOriginal)} → ${formatBytes(totalNew)} (-${((1 - totalNew / totalOriginal) * 100).toFixed(0)}%)`);

  if (renamed.length > 0) {
    console.log('\n以下文件路径已变更（需要同步更新代码/Markdown 引用）：');
    for (const r of renamed) {
      console.log(`  ${r.from}  →  ${r.to}`);
    }
    // 输出到 JSON 供后续脚本使用
    fs.writeFileSync(
      path.join(__dirname, 'renamed-images.json'),
      JSON.stringify(renamed, null, 2)
    );
    console.log('\n已将映射写入 scripts/renamed-images.json');
  }
}

main().catch(console.error);
