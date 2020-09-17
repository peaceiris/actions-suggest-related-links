// eslint-disable-next-line @typescript-eslint/no-var-requires
const unified = require('unified');
import parse from 'remark-parse';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toString = require('mdast-util-to-string');

export function md2text(md: string): string {
  const tree = unified().use(parse).parse(md.replace(/\r?\n/g, ' 45cnwy5ugwyeiurgywuer '));
  const text = toString(tree);
  return text.replace(/45cnwy5ugwyeiurgywuer/g, ' ').replace(/\s+/g, ' ');
}

export function removeSymbols(txt: string): string {
  return txt
    .replace(/"/g, ' ')
    .replace(/;\s/g, ' ')
    .replace(/;$/g, ' ')
    .replace(/(--)+/g, ' ')
    .replace(/\s-\s/g, ' ')
    .replace(/-$/g, ' ')
    .replace(/:\s/g, ' ')
    .replace(/\s:\s/g, ' ')
    .replace(/:$/g, ' ')
    .replace(/\s-\s/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/,\s/g, ' ')
    .replace(/,$/g, ' ')
    .replace(/\.\s/g, ' ')
    .replace(/\.$/g, ' ')
    .replace(/\(\)/g, ' ')
    .replace(/\(/g, ' ')
    .replace(/\)/g, ' ')
    .replace(/\sx\s/g, ' ')
    .replace(/\$\{\{/g, ' ')
    .replace(/\}\}/g, ' ')
    .replace(/\$\{/g, ' ')
    .replace(/}/g, ' ')
    .replace(/>/g, ' ')
    .replace(/</g, ' ')
    .replace(/&&/g, ' ')
    .replace(/=/g, ' ')
    .replace(/\?/g, ' ')
    .replace(/\[/g, ' ')
    .replace(/\]/g, ' ')
    .replace(/\/\s/g, ' ')
    .replace(/\s\//g, ' ')
    .replace(/'/g, ' ')
    .replace(/`/g, ' ')
    .replace(/\s+/g, ' ');
}
