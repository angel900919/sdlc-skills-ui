import { db } from '../db.js';

/**
 * Read-only storage reporting for the observability store (CQS: this module
 * answers; storagePrune.ts — slice 2 — acts). The four prunable kinds map to
 * the tables that only ever grow; sessions/projects are deliberately absent.
 */

export type StorageKind = 'audit-events' | 'hook-events' | 'transcript-copies' | 'usage-samples';

export interface StorageKindStats {
  readonly kind: StorageKind;
  readonly rows: number;
  /** ISO timestamp of the oldest record, or null when the kind is empty. */
  readonly oldestAt: string | null;
}

export interface StorageStats {
  readonly fileSizeBytes: number;
  readonly kinds: StorageKindStats[];
}

/** kind → { table, timestamp column } — the one place the mapping lives. */
export const KIND_TABLES: Record<StorageKind, { table: string; timeColumn: string }> = {
  'audit-events': { table: 'audit_events', timeColumn: 'at' },
  'hook-events': { table: 'hook_events', timeColumn: 'received_at' },
  'transcript-copies': { table: 'transcript_messages', timeColumn: 'timestamp' },
  'usage-samples': { table: 'usage_samples', timeColumn: 'timestamp' },
};

export function reportStorageStats(): StorageStats {
  const pageCount = db.pragma('page_count', { simple: true }) as number;
  const pageSize = db.pragma('page_size', { simple: true }) as number;
  const kinds = (Object.keys(KIND_TABLES) as StorageKind[]).map((kind): StorageKindStats => {
    const { table, timeColumn } = KIND_TABLES[kind];
    const row = db
      .prepare(`SELECT COUNT(*) AS rows, MIN(${timeColumn}) AS oldestAt FROM ${table}`)
      .get() as { rows: number; oldestAt: string | null };
    return { kind, rows: row.rows, oldestAt: row.oldestAt };
  });
  return { fileSizeBytes: pageCount * pageSize, kinds };
}
