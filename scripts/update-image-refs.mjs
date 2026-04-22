/**
 * 根据 scripts/renamed-images.json 更新代码和 Markdown 中的图片路径
 *
 * 运行：node scripts/update-image-refs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const renamedPath = path.join(__dirname, 'renamed-images.json');

if (!fs.existsSync(renamedPath)) {
  console.error('未找到 scripts/renamed-images.json，请先运行 node scripts/compress-images.mjs');
  process.exit(1);
}

const renamed = JSON.parse(fs.readFileSync(renamedPath, 'utf-8'));
if (renamed.length === 0) {
  console.log('没有需要更新的路径。');
  process.exit(0);
}

/** 递归收集指定目录下符合扩展名的文本文件 */
function getTextFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json']) {
  const results = [];
  const skip = ['node_modules', '.next', '.git', 'scripts'];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getTextFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

const textFiles = getTextFiles(projectRoot);
let totalFileChanged = 0;
let totalReplacements = 0;

for (const file of textFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  for (const { from, to } of renamed) {
    if (content.includes(from)) {
      const count = (content.match(new RegExp(escapeRegExp(from), 'g')) || []).length;
      content = content.replaceAll(from, to);
      totalReplacements += count;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✓ 更新: ${path.relative(projectRoot, file)}`);
    totalFileChanged++;
  }
}

console.log(`\n共更新 ${totalFileChanged} 个文件，${totalReplacements} 处引用。`);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
