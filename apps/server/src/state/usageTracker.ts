import fs from 'node:fs';
import path from 'node:path';
import type { SessionUsage, UsageSample } from '@sdlc/shared';
import { aggregateUsage, extractUsageSample } from '@sdlc/shared';
import { db } from '../db.js';
import { bus } from '../bus.js';
import { transcriptDirFor } from '../config.js';

/**
 * Persists token-usage samples parsed from the transcript tail and serves
 * per-session / per-project aggregates. Pure display telemetry — sessions
 * bill to the user's subscription; estCostUsd is the API-equivalent value.
 */

const insert = () =>
  db.prepare(
    `INSERT OR IGNORE INTO usage_samples
       (uuid, session_id, timestamp, model, input_tokens, output_tokens,
        cache_read_tokens, cache_write_5m_tokens, cache_write_1h_tokens)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

/** Ingest one raw transcript entry; broadcasts the refreshed session rollup on change. */
export function ingestUsage(entry: Record<string, unknown>, sessionId: string): void {
  const sample = extractUsageSample(entry);
  if (!sample || !sample.uuid) return;
  const res = insert().run(
    sample.uuid,
    sessionId,
    sample.timestamp,
    sample.model,
    sample.inputTokens,
    sample.outputTokens,
    sample.cacheReadTokens,
    sample.cacheWrite5mTokens,
    sample.cacheWrite1hTokens,
  );
  if (res.changes > 0) {
    bus.broadcast({ type: 'session-usage', sessionId, usage: getSessionUsage(sessionId) });
  }
}

/**
 * Startup backfill: parse on-disk transcripts of sessions that predate the
 * usage_samples table so historical telemetry isn't a blind spot.
 */
export function backfillUsageSamples(): number {
  const rows = db
    .prepare(
      `SELECT s.id, s.cwd FROM sessions s
       WHERE NOT EXISTS (SELECT 1 FROM usage_samples u WHERE u.session_id = s.id)`,
    )
    .all() as { id: string; cwd: string }[];

  let inserted = 0;
  const stmt = insert();
  for (const { id, cwd } of rows) {
    const file = path.join(transcriptDirFor(cwd), `${id}.jsonl`);
    let raw: string;
    try {
      raw = fs.readFileSync(file, 'utf-8');
    } catch {
      continue;
    }
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      try {
        const sample = extractUsageSample(JSON.parse(line) as Record<string, unknown>);
        if (!sample?.uuid) continue;
        const res = stmt.run(
          sample.uuid, id, sample.timestamp, sample.model,
          sample.inputTokens, sample.outputTokens, sample.cacheReadTokens,
          sample.cacheWrite5mTokens, sample.cacheWrite1hTokens,
        );
        inserted += res.changes;
      } catch {
        // Malformed line — skip.
      }
    }
  }
  return inserted;
}

function rowToSample(r: Record<string, unknown>): UsageSample {
  return {
    uuid: r.uuid as string,
    timestamp: r.timestamp as string,
    model: r.model as string,
    isSidechain: false,
    inputTokens: r.input_tokens as number,
    outputTokens: r.output_tokens as number,
    cacheReadTokens: r.cache_read_tokens as number,
    cacheWrite5mTokens: r.cache_write_5m_tokens as number,
    cacheWrite1hTokens: r.cache_write_1h_tokens as number,
  };
}

export function getSessionUsage(sessionId: string): SessionUsage {
  const rows = db
    .prepare('SELECT * FROM usage_samples WHERE session_id = ? ORDER BY timestamp')
    .all(sessionId) as Record<string, unknown>[];
  return aggregateUsage(rows.map(rowToSample));
}

/** Bulk rollup for session lists: sessionId → usage. */
export function getUsageBySession(projectId?: string): Record<string, SessionUsage> {
  const rows = (projectId
    ? db
        .prepare(
          `SELECT u.* FROM usage_samples u
           JOIN sessions s ON s.id = u.session_id
           WHERE s.project_id = ? ORDER BY u.timestamp`,
        )
        .all(projectId)
    : db.prepare('SELECT * FROM usage_samples ORDER BY timestamp').all()) as Record<string, unknown>[];

  const grouped = new Map<string, UsageSample[]>();
  for (const r of rows) {
    const sid = r.session_id as string;
    const list = grouped.get(sid) ?? [];
    list.push(rowToSample(r));
    grouped.set(sid, list);
  }
  return Object.fromEntries([...grouped.entries()].map(([sid, samples]) => [sid, aggregateUsage(samples)]));
}

/** Project-wide totals for the metrics endpoint. */
export function getUsageTotals(projectId?: string): SessionUsage {
  const rows = (projectId
    ? db
        .prepare(
          `SELECT u.* FROM usage_samples u
           JOIN sessions s ON s.id = u.session_id
           WHERE s.project_id = ? ORDER BY u.timestamp`,
        )
        .all(projectId)
    : db.prepare('SELECT * FROM usage_samples ORDER BY timestamp').all()) as Record<string, unknown>[];
  return aggregateUsage(rows.map(rowToSample));
}
