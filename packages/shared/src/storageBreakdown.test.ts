import { describe, it, expect } from 'vitest';
import { summarizeStorageBreakdown } from './storageBreakdown.js';

describe('summarizeStorageBreakdown', () => {
  it('sorts kinds largest-first by row count', () => {
    const result = summarizeStorageBreakdown([
      { kind: 'audit-events', rows: 5 },
      { kind: 'usage-samples', rows: 50 },
      { kind: 'hook-events', rows: 20 },
    ]);
    expect(result.rows.map((r) => r.kind)).toEqual(['usage-samples', 'hook-events', 'audit-events']);
    expect(result.totalRows).toBe(75);
  });

  it('keeps input order for ties (stable sort)', () => {
    const result = summarizeStorageBreakdown([
      { kind: 'a', rows: 10 },
      { kind: 'b', rows: 10 },
      { kind: 'c', rows: 10 },
    ]);
    expect(result.rows.map((r) => r.kind)).toEqual(['a', 'b', 'c']);
  });

  it('computes each kind share as a whole-number percent of the total', () => {
    const result = summarizeStorageBreakdown([
      { kind: 'x', rows: 1 },
      { kind: 'y', rows: 3 },
    ]);
    const byKind = Object.fromEntries(result.rows.map((r) => [r.kind, r.pctOfTotal]));
    expect(byKind.y).toBe(75);
    expect(byKind.x).toBe(25);
    expect(result.rows.reduce((sum, r) => sum + r.pctOfTotal, 0)).toBe(100);
  });

  it('handles an empty store without dividing by zero', () => {
    const result = summarizeStorageBreakdown([
      { kind: 'audit-events', rows: 0 },
      { kind: 'usage-samples', rows: 0 },
    ]);
    expect(result.totalRows).toBe(0);
    expect(result.rows.every((r) => r.pctOfTotal === 0)).toBe(true);
    expect(result.rows.some((r) => Number.isNaN(r.pctOfTotal))).toBe(false);
  });

  it('returns an empty breakdown for no kinds', () => {
    const result = summarizeStorageBreakdown([]);
    expect(result).toEqual({ totalRows: 0, rows: [] });
  });

  it('does not mutate its input array or the kind objects', () => {
    const input = [
      { kind: 'audit-events', rows: 5 },
      { kind: 'usage-samples', rows: 50 },
    ];
    const snapshot = JSON.parse(JSON.stringify(input));
    summarizeStorageBreakdown(input);
    expect(input).toEqual(snapshot);
  });
});
