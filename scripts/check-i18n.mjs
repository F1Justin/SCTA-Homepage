import { readFile } from 'node:fs/promises';
import { parse, TYPE } from '@formatjs/icu-messageformat-parser';
import { routing } from '../src/i18n/routing.ts';

function messageEntries(value, path = '') {
  if (typeof value === 'string' && value.trim()) return [[path, value]];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path}: expected a nonempty message or a namespace`);
  }
  return Object.entries(value).flatMap(([key, child]) => {
    if (key.includes('.')) throw new Error(`${key}: message keys cannot contain dots`);
    return messageEntries(child, path ? `${path}.${key}` : key);
  });
}

function signature(message, locale) {
  const argumentsByKind = new Set();
  const pluralRules = {
    cardinal: new Intl.PluralRules(locale).resolvedOptions().pluralCategories,
    ordinal: new Intl.PluralRules(locale, { type: 'ordinal' }).resolvedOptions().pluralCategories,
  };

  function visit(nodes) {
    for (const node of nodes) {
      if (node.type === TYPE.literal || node.type === TYPE.pound) continue;
      let type = TYPE[node.type];

      if (node.type === TYPE.plural) {
        const alternatives = Object.keys(node.options);
        for (const alternative of alternatives) {
          if (!alternative.startsWith('=') && !pluralRules[node.pluralType].includes(alternative)) {
            throw new Error(`${node.value}: invalid ${node.pluralType} category "${alternative}" for ${locale}`);
          }
        }
        const exactMatches = alternatives.filter(key => key.startsWith('=')).sort();
        type += `:${node.pluralType}:${node.offset}:${exactMatches.join(',')}`;
      }
      if (node.type === TYPE.select) type += `:${Object.keys(node.options).sort().join(',')}`;
      argumentsByKind.add(`${node.value}:${type}`);

      if ('options' in node) Object.values(node.options).forEach(option => visit(option.value));
      if ('children' in node) visit(node.children);
    }
  }

  visit(parse(message));
  return [...argumentsByKind].sort().join(' | ');
}

const errors = [];
const dictionaries = new Map();
for (const locale of routing.locales) {
  try {
    const url = new URL(`../messages/${locale}.json`, import.meta.url);
    const messages = messageEntries(JSON.parse(await readFile(url, 'utf8')));
    const entries = new Map();
    dictionaries.set(locale, entries);
    for (const [key, message] of messages) {
      try {
        entries.set(key, signature(message, locale));
      } catch (error) {
        errors.push(`${locale}:${key}: ${error.message}`);
      }
    }
  } catch (error) {
    errors.push(`${locale}: ${error.message}`);
  }
}

const source = dictionaries.get(routing.defaultLocale);
if (source) {
  for (const [locale, entries] of dictionaries) {
    if (locale === routing.defaultLocale) continue;
    for (const [key, expected] of source) {
      if (!entries.has(key)) errors.push(`${locale}:${key}: missing message`);
      else if (entries.get(key) !== expected) {
        errors.push(`${locale}:${key}: expected ICU arguments "${expected}", found "${entries.get(key)}"`);
      }
    }
    for (const key of entries.keys()) {
      if (!source.has(key)) errors.push(`${locale}:${key}: extra message`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${source.size} messages verified in ${routing.locales.join(', ')}`);
}
