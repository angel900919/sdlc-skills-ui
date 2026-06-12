import { describe, expect, it } from 'vitest';
import type { DocNode } from './types.js';
import { flattenDocFiles, resolveArtifactPath } from './artifactPath.js';

/** Build a DocNode tree from flat file relPaths (mirrors the server's sorted walk). */
function fileTree(paths: string[]): DocNode[] {
  const roots: DocNode[] = [];
  for (const relPath of [...paths].sort()) {
    const segments = relPath.split('/');
    let level = roots;
    let prefix = '';
    for (const [i, name] of segments.entries()) {
      prefix = prefix ? `${prefix}/${name}` : name;
      const isFile = i === segments.length - 1;
      let node = level.find((n) => n.relPath === prefix);
      if (!node) {
        node = isFile
          ? { name, relPath: prefix, type: 'file' }
          : { name, relPath: prefix, type: 'dir', children: [] };
        level.push(node);
      }
      if (!isFile) level = node.children!;
    }
  }
  return roots;
}

describe('flattenDocFiles', () => {
  it('returns file relPaths in tree order', () => {
    const tree = fileTree(['.ai/anchor.md', '.ai/specs/kanban/prd.md', 'README.md']);
    expect(flattenDocFiles(tree)).toEqual(['.ai/anchor.md', '.ai/specs/kanban/prd.md', 'README.md']);
  });

  it('returns empty for an empty tree', () => {
    expect(flattenDocFiles([])).toEqual([]);
  });
});

describe('resolveArtifactPath', () => {
  const tree = fileTree([
    '.ai/anchor.md',
    '.ai/features.md',
    '.ai/discovery/todo-app.md',
    '.ai/specs/kanban-board/prd.md',
    '.ai/specs/kanban-board/design.md',
    'fitness/kanban-board/no-cycles.test.ts',
    'docs/kanban-board.md',
  ]);

  it('resolves a concrete path that exists', () => {
    expect(resolveArtifactPath('.ai/anchor.md', null, tree)).toBe('.ai/anchor.md');
  });

  it('returns null for a concrete path that does not exist', () => {
    expect(resolveArtifactPath('.ai/pipeline.md', null, tree)).toBeNull();
  });

  it('returns null for prose artifacts', () => {
    for (const prose of [
      'routes next slice',
      'COMPLETE | REJECT',
      'PASS | FAIL',
      'merged slice + tracker entry',
      'tracker refs in SLICE-N.md',
      'feature branch commits',
      'features.md → shipped',
      '',
    ]) {
      expect(resolveArtifactPath(prose, 'kanban-board', tree)).toBeNull();
    }
  });

  it('substitutes <feature> with the selected slug', () => {
    expect(resolveArtifactPath('.ai/specs/<feature>/prd.md', 'kanban-board', tree))
      .toBe('.ai/specs/kanban-board/prd.md');
    expect(resolveArtifactPath('docs/<feature>.md', 'kanban-board', tree))
      .toBe('docs/kanban-board.md');
  });

  it('does not resolve a substituted path for a feature with no artifacts', () => {
    expect(resolveArtifactPath('.ai/specs/<feature>/prd.md', 'ghost-feature', tree)).toBeNull();
  });

  it('treats unsubstituted placeholders as single-segment wildcards', () => {
    expect(resolveArtifactPath('.ai/discovery/<slug>.md', null, tree))
      .toBe('.ai/discovery/todo-app.md');
  });

  it('wildcards do not cross path segments', () => {
    expect(resolveArtifactPath('.ai/<slug>.md', null, fileTree(['.ai/specs/kanban/prd.md'])))
      .toBeNull();
  });

  it('resolves * globs within a directory', () => {
    expect(resolveArtifactPath('fitness/<feature>/*', 'kanban-board', tree))
      .toBe('fitness/kanban-board/no-cycles.test.ts');
  });

  it('expands [a|b] alternations — single-file architecture', () => {
    const single = fileTree(['.ai/architecture.md']);
    expect(resolveArtifactPath('.ai/architecture[.md|/]', null, single)).toBe('.ai/architecture.md');
  });

  it('expands [a|b] alternations — bundle directory resolves to its first file', () => {
    const bundle = fileTree(['.ai/architecture/01-style.md', '.ai/architecture/02-components.md']);
    expect(resolveArtifactPath('.ai/architecture[.md|/]', null, bundle))
      .toBe('.ai/architecture/01-style.md');
  });

  it('returns null when the docs tree is empty', () => {
    expect(resolveArtifactPath('.ai/anchor.md', null, [])).toBeNull();
  });
});
