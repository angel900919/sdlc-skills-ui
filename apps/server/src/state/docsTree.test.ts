import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { DocNode } from '@sdlc/shared';
import { buildDocsTree, readDocFile } from './docsTree.js';

/**
 * Hermetic fixture layout:
 *
 *   <outer>/secret.md            ← exists, but OUTSIDE the project root
 *   <outer>/project-evil/x.md    ← sibling dir sharing the root as a prefix
 *   <outer>/project/             ← the project root under test
 *     README.md
 *     .ai/anchor.md
 *     docs/guide.md
 *     docs/adr/0001-test.md
 *     docs/script.sh             ← non-renderable
 *     docs/.hidden.md            ← dotfile, excluded from the tree
 *     docs/img/logo.png          ← dir with no renderable children
 */
let outer: string;
let root: string;

beforeAll(() => {
  outer = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-docs-'));
  root = path.join(outer, 'project');
  fs.mkdirSync(path.join(root, 'docs', 'adr'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs', 'img'), { recursive: true });
  fs.mkdirSync(path.join(root, '.ai'), { recursive: true });
  fs.mkdirSync(path.join(outer, 'project-evil'), { recursive: true });
  fs.writeFileSync(path.join(root, 'README.md'), '# readme');
  fs.writeFileSync(path.join(root, '.ai', 'anchor.md'), '# anchor');
  fs.writeFileSync(path.join(root, 'docs', 'guide.md'), '# guide');
  fs.writeFileSync(path.join(root, 'docs', 'adr', '0001-test.md'), '# adr');
  fs.writeFileSync(path.join(root, 'docs', 'script.sh'), 'echo nope');
  fs.writeFileSync(path.join(root, 'docs', '.hidden.md'), 'hidden');
  fs.writeFileSync(path.join(root, 'docs', 'img', 'logo.png'), 'png-bytes');
  fs.writeFileSync(path.join(outer, 'secret.md'), 'TOP SECRET');
  fs.writeFileSync(path.join(outer, 'project-evil', 'x.md'), 'evil sibling');
});

afterAll(() => {
  fs.rmSync(outer, { recursive: true, force: true });
});

describe('readDocFile path-traversal guard', () => {
  it('serves legit files, including nested paths', () => {
    expect(readDocFile(root, 'README.md')?.content).toBe('# readme');
    expect(readDocFile(root, 'docs/guide.md')?.content).toBe('# guide');
    expect(readDocFile(root, 'docs/adr/0001-test.md')?.content).toBe('# adr');
    expect(readDocFile(root, '.ai/anchor.md')?.content).toBe('# anchor');
  });

  it('allows ../ that still normalizes INSIDE the root', () => {
    expect(readDocFile(root, 'docs/../README.md')?.content).toBe('# readme');
  });

  it('rejects ../ traversal to an existing file outside the root', () => {
    expect(readDocFile(root, '../secret.md')).toBeNull();
    expect(readDocFile(root, 'docs/../../secret.md')).toBeNull();
    expect(readDocFile(root, 'docs/adr/../../../secret.md')).toBeNull();
  });

  it('rejects absolute paths outside the root', () => {
    expect(readDocFile(root, path.join(outer, 'secret.md'))).toBeNull();
    expect(readDocFile(root, '/etc/hosts')).toBeNull();
  });

  it('rejects a sibling directory that shares the root path as a string prefix', () => {
    // "<outer>/project-evil" startsWith "<outer>/project" — the guard must
    // compare against root + path.sep, not the bare root string.
    expect(readDocFile(root, '../project-evil/x.md')).toBeNull();
  });

  it('treats percent-encoded traversal as a literal (missing) filename', () => {
    expect(readDocFile(root, '..%2Fsecret.md')).toBeNull();
    expect(readDocFile(root, '%2e%2e/secret.md')).toBeNull();
  });

  it('rejects the root itself, directories, missing and non-renderable files', () => {
    expect(readDocFile(root, '')).toBeNull();
    expect(readDocFile(root, '.')).toBeNull();
    expect(readDocFile(root, 'docs')).toBeNull();
    expect(readDocFile(root, 'docs/missing.md')).toBeNull();
    expect(readDocFile(root, 'docs/script.sh')).toBeNull();
  });
});

describe('buildDocsTree', () => {
  const findRoot = (nodes: DocNode[], name: string) => nodes.find((n) => n.name === name);

  it('lists only the knowledge roots that exist and have renderable content', () => {
    const tree = buildDocsTree(root);
    expect(tree.map((n) => n.name)).toEqual(['.ai', 'docs', 'README.md']);
    expect(findRoot(tree, 'README.md')).toEqual({ name: 'README.md', relPath: 'README.md', type: 'file' });
  });

  it('walks nested dirs with project-root-relative paths', () => {
    const docs = findRoot(buildDocsTree(root), 'docs')!;
    const adr = docs.children!.find((n) => n.name === 'adr')!;
    expect(adr.type).toBe('dir');
    expect(adr.children).toEqual([
      { name: '0001-test.md', relPath: path.join('docs', 'adr', '0001-test.md'), type: 'file' },
    ]);
  });

  it('excludes dotfiles, non-renderable files, and dirs left empty by filtering', () => {
    const docs = findRoot(buildDocsTree(root), 'docs')!;
    const names = docs.children!.map((n) => n.name);
    expect(names).not.toContain('.hidden.md');
    expect(names).not.toContain('script.sh');
    expect(names).not.toContain('img'); // only a .png inside → pruned
    expect(names).toContain('guide.md');
  });
});
