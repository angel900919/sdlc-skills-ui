import { describe, expect, it } from 'vitest';
import { formatBytes, formatPruneResultLine, pruneWarningCopy } from './pruneSummary.js';

describe('formatBytes', () => {
  it('scales bytes to B / KB / MB', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('formatPruneResultLine', () => {
  it('reports rows deleted, bytes reclaimed, and the before → after file size', () => {
    const line = formatPruneResultLine({
      totalRows: 1280,
      bytesReclaimed: 3 * 1024 * 1024,
      fileSizeBefore: 10 * 1024 * 1024,
      fileSizeAfter: 7 * 1024 * 1024,
    });
    expect(line).toBe('Deleted 1,280 records · reclaimed 3.0 MB (10.0 MB → 7.0 MB)');
  });

  it('handles a zero-row prune without crashing', () => {
    const line = formatPruneResultLine({
      totalRows: 0,
      bytesReclaimed: 0,
      fileSizeBefore: 1024,
      fileSizeAfter: 1024,
    });
    expect(line).toBe('Deleted 0 records · reclaimed 0 B (1.0 KB → 1.0 KB)');
  });
});

describe('pruneWarningCopy', () => {
  it('names the cutoff date and states the two promises verbatim', () => {
    const copy = pruneWarningCopy('2026-05-14T00:00:00Z');
    expect(copy).toContain('older than 2026-05-14');
    expect(copy).toContain('Live sessions are never touched');
    expect(copy).toContain('search');
  });
});
