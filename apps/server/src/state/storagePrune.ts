import { db } from '../db.js';
import { bus } from '../bus.js';
import { KIND_TABLES, reportStorageStats, type StorageKind } from './storageStats.js';

/**
 * Observability-store pruning (CQS act side; storageStats.ts answers). Deletes
 * derived records older than a cutoff, never touching records of a live session,
 * then reclaims freed pages incrementally so a large prune can't stall the event
 * loop (see .ai/specs/observability-data-pruning/adr/0001-chunked-incremental-vacuum.md).
 */

// Sessions whose records are never pruned, whatever the cutoff.
const LIVE_STATUSES = ['starting', 'running'] as const;
// Pages reclaimed per incremental_vacuum step — bounds each PRAGMA's work (ADR-0001).
const VACUUM_PAGE_BUDGET = 256;

export interface PruneKindCount {
  readonly kind: StorageKind;
  readonly rows: number;
}

export interface PrunePreview {
  readonly cutoffDate: string;
  readonly totalRows: number;
  readonly kinds: PruneKindCount[];
}

export interface PruneResult {
  readonly cutoffDate: string;
  readonly totalRows: number;
  readonly deleted: PruneKindCount[];
  readonly bytesReclaimed: number;
  readonly fileSizeBefore: number;
  readonly fileSizeAfter: number;
}

function cutoffDateFor(cutoffDays: number): string {
  if (!Number.isInteger(cutoffDays) || cutoffDays <= 0) {
    throw new RangeError('cutoffDays must be a positive integer');
  }
  return new Date(Date.now() - cutoffDays * 86_400_000).toISOString();
}

// "older than cutoff AND not owned by a live session" — the one predicate both
// preview and prune share, so the count you confirm is exactly what gets deleted.
function whereClause(timeColumn: string): string {
  const liveList = LIVE_STATUSES.map((s) => `'${s}'`).join(', ');
  return `${timeColumn} < ?
    AND (session_id IS NULL
         OR session_id NOT IN (SELECT id FROM sessions WHERE status IN (${liveList})))`;
}

export function previewPrune(cutoffDays: number): PrunePreview {
  const cutoffDate = cutoffDateFor(cutoffDays);
  const kinds = (Object.keys(KIND_TABLES) as StorageKind[]).map((kind): PruneKindCount => {
    const { table, timeColumn } = KIND_TABLES[kind];
    const { rows } = db
      .prepare(`SELECT COUNT(*) AS rows FROM ${table} WHERE ${whereClause(timeColumn)}`)
      .get(cutoffDate) as { rows: number };
    return { kind, rows };
  });
  return { cutoffDate, totalRows: kinds.reduce((sum, k) => sum + k.rows, 0), kinds };
}

export async function pruneObservabilityRecords(cutoffDays: number): Promise<PruneResult> {
  const cutoffDate = cutoffDateFor(cutoffDays);
  const fileSizeBefore = reportStorageStats().fileSizeBytes;

  // One transaction across all four kinds: a mid-prune failure rolls everything
  // back, so the UI's "nothing was deleted, the database is unchanged" holds.
  const deleteAll = db.transaction((): PruneKindCount[] => {
    const kinds = Object.keys(KIND_TABLES) as StorageKind[];
    return kinds.map((kind): PruneKindCount => {
      const { table, timeColumn } = KIND_TABLES[kind];
      const where = whereClause(timeColumn);
      // Transcript FTS rows must die with their transcript_messages rows.
      if (table === 'transcript_messages') {
        db.prepare(
          `DELETE FROM transcript_fts WHERE uuid IN (SELECT uuid FROM transcript_messages WHERE ${where})`,
        ).run(cutoffDate);
      }
      const { changes } = db.prepare(`DELETE FROM ${table} WHERE ${where}`).run(cutoffDate);
      return { kind, rows: changes };
    });
  });

  const deleted = deleteAll();
  const totalRows = deleted.reduce((sum, k) => sum + k.rows, 0);

  if (totalRows > 0) {
    await reclaimIncrementally();
  }

  const fileSizeAfter = reportStorageStats().fileSizeBytes;
  const result: PruneResult = {
    cutoffDate,
    totalRows,
    deleted,
    bytesReclaimed: Math.max(0, fileSizeBefore - fileSizeAfter),
    fileSizeBefore,
    fileSizeAfter,
  };

  // Cleanup is observable too — and this event is the PRD success-metric source.
  bus.audit({
    source: 'server',
    kind: 'storage.prune',
    summary: `Pruned ${totalRows} observability records older than ${cutoffDays} days`,
    detail: { cutoffDays, totalRows, deleted, bytesReclaimed: result.bytesReclaimed },
  });

  return result;
}

// Reclaim freed pages in bounded chunks, yielding to the event loop between each
// so a large prune never blocks live observation (ADR-0001 / NFR N1).
async function reclaimIncrementally(): Promise<void> {
  // incremental_vacuum only frees pages in INCREMENTAL mode; in any other mode it
  // is a silent no-op that would never drain the freelist — guard the loop so a
  // misconfigured DB can't spin forever. (auto_vacuum 2 = INCREMENTAL.)
  if ((db.pragma('auto_vacuum', { simple: true }) as number) !== 2) return;
  while ((db.pragma('freelist_count', { simple: true }) as number) > 0) {
    db.pragma(`incremental_vacuum(${VACUUM_PAGE_BUDGET})`);
    await new Promise((resolve) => setImmediate(resolve));
  }
}
