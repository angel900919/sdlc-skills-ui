import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// The db module binds to SDLC_DATA_DIR at import time, so the env override must
// precede the dynamic imports — this is the test-strategy tmp-dir rule in action.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scc-storage-stats-'));
process.env.SDLC_DATA_DIR = tmpDir;

const { reportStorageStats } = await import('./storageStats.js');
const { db } = await import('../db.js');

function seedObservabilityRows() {
  db.prepare(
    `INSERT INTO audit_events (at, source, kind, summary) VALUES (?, 'server', 'test', 'seed')`,
  ).run('2026-01-01T00:00:00Z');
  db.prepare(
    `INSERT INTO audit_events (at, source, kind, summary) VALUES (?, 'server', 'test', 'seed')`,
  ).run('2026-02-01T00:00:00Z');
  db.prepare(
    `INSERT INTO hook_events (received_at, hook_event_name, payload) VALUES (?, 'PostToolUse', '{}')`,
  ).run('2026-01-05T00:00:00Z');
  db.prepare(
    `INSERT INTO transcript_messages (uuid, session_id, role, entry_type, timestamp, blocks)
     VALUES ('u1', 's1', 'assistant', 'message', ?, '[]')`,
  ).run('2026-01-10T00:00:00Z');
  db.prepare(
    `INSERT INTO usage_samples (uuid, session_id, timestamp, model, input_tokens, output_tokens,
       cache_read_tokens, cache_write_5m_tokens, cache_write_1h_tokens)
     VALUES ('u1', 's1', ?, 'claude-fable-5', 1, 1, 0, 0, 0)`,
  ).run('2026-01-15T00:00:00Z');
}

describe('reportStorageStats', () => {
  it('reports zero rows and null oldest dates on an empty store, with a real file size', () => {
    const stats = reportStorageStats();
    expect(stats.fileSizeBytes).toBeGreaterThan(0);
    expect(stats.kinds.map((k) => k.kind)).toEqual([
      'audit-events',
      'hook-events',
      'transcript-copies',
      'usage-samples',
    ]);
    for (const kind of stats.kinds) {
      expect(kind.rows).toBe(0);
      expect(kind.oldestAt).toBeNull();
    }
  });

  it('reports exact seeded counts and the oldest date per kind, within the N2 budget', () => {
    seedObservabilityRows();
    const startedAt = performance.now();
    const stats = reportStorageStats();
    const elapsedMs = performance.now() - startedAt;

    const byKind = Object.fromEntries(stats.kinds.map((k) => [k.kind, k]));
    expect(byKind['audit-events']).toMatchObject({ rows: 2, oldestAt: '2026-01-01T00:00:00Z' });
    expect(byKind['hook-events']).toMatchObject({ rows: 1, oldestAt: '2026-01-05T00:00:00Z' });
    expect(byKind['transcript-copies']).toMatchObject({ rows: 1, oldestAt: '2026-01-10T00:00:00Z' });
    expect(byKind['usage-samples']).toMatchObject({ rows: 1, oldestAt: '2026-01-15T00:00:00Z' });
    expect(elapsedMs).toBeLessThan(500); // NFR N2 on the seeded store
  });
});
