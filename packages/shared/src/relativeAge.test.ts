import { describe, expect, it } from 'vitest';
import { formatRelativeAge } from './relativeAge.js';

const NOW = Date.parse('2026-06-13T12:00:00Z');

describe('formatRelativeAge', () => {
  it('reads "today" for the same instant and any sub-day age', () => {
    expect(formatRelativeAge('2026-06-13T12:00:00Z', NOW)).toBe('today');
    expect(formatRelativeAge('2026-06-13T01:00:00Z', NOW)).toBe('today'); // 11h earlier
  });

  it('reads "1 day ago" at the singular boundary and floors partial days down', () => {
    expect(formatRelativeAge('2026-06-12T12:00:00Z', NOW)).toBe('1 day ago'); // exactly 1d
    expect(formatRelativeAge('2026-06-12T00:00:00Z', NOW)).toBe('1 day ago'); // 1.5d floors to 1
  });

  it('reads "N days ago" in whole days for older records', () => {
    expect(formatRelativeAge('2026-04-11T12:00:00Z', NOW)).toBe('63 days ago');
  });

  it('clamps a future timestamp (clock skew) to "today", never a negative (N3)', () => {
    expect(formatRelativeAge('2026-06-20T12:00:00Z', NOW)).toBe('today');
  });

  it('falls back to "today" for an unparseable timestamp instead of "NaN days ago"', () => {
    expect(formatRelativeAge('not-a-date', NOW)).toBe('today');
  });
});
