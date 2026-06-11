import fs from 'node:fs';
import path from 'node:path';
import type { DocNode } from '@sdlc/shared';

/**
 * Documentation browser over the project's knowledge directories.
 * Read-only; path traversal is blocked by resolving inside the root.
 */
const DOC_ROOTS = ['.ai', '.human', 'docs', 'dashboard', 'README.md', 'CLAUDE.md'];
const RENDERABLE = /\.(md|markdown|human|txt|json|mermaid|mmd|html)$/i;

export function buildDocsTree(projectRoot: string): DocNode[] {
  const nodes: DocNode[] = [];
  for (const rootEntry of DOC_ROOTS) {
    const abs = path.join(projectRoot, rootEntry);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      const children = walk(projectRoot, abs);
      if (children.length) nodes.push({ name: rootEntry, relPath: rootEntry, type: 'dir', children });
    } else if (RENDERABLE.test(rootEntry)) {
      nodes.push({ name: rootEntry, relPath: rootEntry, type: 'file' });
    }
  }
  return nodes;
}

function walk(projectRoot: string, dir: string): DocNode[] {
  const out: DocNode[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const abs = path.join(dir, entry.name);
    const rel = path.relative(projectRoot, abs);
    if (entry.isDirectory()) {
      const children = walk(projectRoot, abs);
      if (children.length) out.push({ name: entry.name, relPath: rel, type: 'dir', children });
    } else if (RENDERABLE.test(entry.name)) {
      out.push({ name: entry.name, relPath: rel, type: 'file' });
    }
  }
  return out;
}

export function readDocFile(projectRoot: string, relPath: string): { content: string; relPath: string } | null {
  const abs = path.resolve(projectRoot, relPath);
  if (!abs.startsWith(path.resolve(projectRoot) + path.sep)) return null;
  if (!RENDERABLE.test(abs) || !fs.existsSync(abs)) return null;
  const stat = fs.statSync(abs);
  if (!stat.isFile() || stat.size > 2_000_000) return null;
  return { content: fs.readFileSync(abs, 'utf-8'), relPath };
}
