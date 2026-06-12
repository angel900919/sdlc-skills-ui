import { describe, expect, it } from 'vitest';
import { parseNumstat } from './diffStat.js';

describe('parseNumstat', () => {
  it('parses additions/deletions per file', () => {
    const out = parseNumstat('12\t3\tsrc/a.ts\n0\t40\tREADME.md\n');
    expect(out).toEqual([
      { path: 'src/a.ts', additions: 12, deletions: 3, binary: false },
      { path: 'README.md', additions: 0, deletions: 40, binary: false },
    ]);
  });

  it('marks binary files (numstat emits dashes)', () => {
    expect(parseNumstat('-\t-\tassets/logo.png\n')).toEqual([
      { path: 'assets/logo.png', additions: 0, deletions: 0, binary: true },
    ]);
  });

  it('handles renames with tab-separated old/new paths', () => {
    const out = parseNumstat('5\t1\told name.ts\tnew name.ts\n');
    expect(out).toEqual([{ path: 'old name.ts → new name.ts', additions: 5, deletions: 1, binary: false }]);
  });

  it('ignores blank lines and returns empty for empty input', () => {
    expect(parseNumstat('')).toEqual([]);
    expect(parseNumstat('\n\n')).toEqual([]);
  });
});
