/** Pure formatters for the observability-data-pruning UI (no DOM, no fetch). */

export interface PruneResultLike {
  readonly totalRows: number;
  readonly bytesReclaimed: number;
  readonly fileSizeBefore: number;
  readonly fileSizeAfter: number;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatPruneResultLine(result: PruneResultLike): string {
  const rows = result.totalRows.toLocaleString('en-US');
  return (
    `Deleted ${rows} records · reclaimed ${formatBytes(result.bytesReclaimed)} ` +
    `(${formatBytes(result.fileSizeBefore)} → ${formatBytes(result.fileSizeAfter)})`
  );
}

/** The verbatim confirm-dialog body — the two promises the UX spec mandates. */
export function pruneWarningCopy(cutoffDateIso: string): string {
  const date = cutoffDateIso.slice(0, 10);
  return (
    `Records older than ${date} will be permanently deleted. ` +
    `Live sessions are never touched. Old transcript copies disappear from search results.`
  );
}
