/** Pure transform for the storage breakdown UI (no DOM, no fetch). */

export interface BreakdownRow {
  readonly kind: string;
  readonly rows: number;
  readonly pctOfTotal: number;
}

export interface StorageBreakdown {
  readonly totalRows: number;
  readonly rows: BreakdownRow[];
}

/**
 * Orders per-kind row stats largest-first and computes each kind's whole-number
 * share of the total. Pure: builds new rows and sorts a fresh array, so the
 * caller's input is never mutated; an empty store yields 0% for every kind
 * rather than NaN (no divide-by-zero).
 */
export function summarizeStorageBreakdown(
  kinds: ReadonlyArray<{ kind: string; rows: number }>,
): StorageBreakdown {
  const totalRows = kinds.reduce((sum, k) => sum + k.rows, 0);
  const rows = kinds
    .map((k): BreakdownRow => ({
      kind: k.kind,
      rows: k.rows,
      pctOfTotal: totalRows === 0 ? 0 : Math.round((k.rows / totalRows) * 100),
    }))
    .sort((a, b) => b.rows - a.rows);
  return { totalRows, rows };
}
