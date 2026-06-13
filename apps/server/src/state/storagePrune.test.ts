import { beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// tmp-dir SQLite per .ai/test-strategy.md — env set before the db import binds it.
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scc-storage-prune-'));
process.env.SDLC_DATA_DIR = tmpDir;

const { previewPrune, pruneObservabilityRecords } = await import('./storagePrune.js');
const { reportStorageStats } = await import('./storageStats.js');
const { db } = await import('../db.js');

const OLD = '2020-01-01T00:00:00Z'; // well before any sane cutoff
const recent = new Date().toISOString(); // within the cutoff window

function reset() {
  for (const t of ['audit_events', 'hook_events', 'transcript_messages', 'usage_samples', 'sessions', 'projects']) {
    db.prepare(`DELETE FROM ${t}`).run();
  }
  db.prepare(`DELETE FROM transcript_fts`).run();
}

function seed() {
  // sessions.project_id has a NOT NULL FK to projects — seed the parent first.
  db.prepare(`INSERT INTO projects (id, name, root_path, created_at) VALUES ('p1', 'p1', '/x', ?)`).run(OLD);
  // sessions: one live (running), one finished (exited)
  db.prepare(
    `INSERT INTO sessions (id, project_id, cwd, title, status, created_at)
     VALUES ('live-1', 'p1', '/x', 'live', 'running', ?),
            ('dead-1', 'p1', '/x', 'dead', 'exited', ?)`,
  ).run(OLD, OLD);
  // audit: old+null (prunable), old+live (protected), recent (too new)
  db.prepare(`INSERT INTO audit_events (at, source, kind, session_id, summary) VALUES (?, 'server', 'k', NULL, 'old-null')`).run(OLD);
  db.prepare(`INSERT INTO audit_events (at, source, kind, session_id, summary) VALUES (?, 'server', 'k', 'live-1', 'old-live')`).run(OLD);
  db.prepare(`INSERT INTO audit_events (at, source, kind, session_id, summary) VALUES (?, 'server', 'k', NULL, 'recent')`).run(recent);
  // hook: old+null (prunable)
  db.prepare(`INSERT INTO hook_events (received_at, hook_event_name, session_id, payload) VALUES (?, 'PostToolUse', NULL, '{}')`).run(OLD);
  // transcripts: old+dead (prunable, with FTS row), old+live (protected)
  db.prepare(`INSERT INTO transcript_messages (uuid, session_id, role, entry_type, timestamp, blocks) VALUES ('t-dead', 'dead-1', 'assistant', 'message', ?, '[]')`).run(OLD);
  db.prepare(`INSERT INTO transcript_messages (uuid, session_id, role, entry_type, timestamp, blocks) VALUES ('t-live', 'live-1', 'assistant', 'message', ?, '[]')`).run(OLD);
  db.prepare(`INSERT INTO transcript_fts (text, uuid, session_id, role, timestamp) VALUES ('hello', 't-dead', 'dead-1', 'assistant', ?)`).run(OLD);
  // usage: old+dead (prunable)
  db.prepare(
    `INSERT INTO usage_samples (uuid, session_id, timestamp, model, input_tokens, output_tokens, cache_read_tokens, cache_write_5m_tokens, cache_write_1h_tokens)
     VALUES ('us-dead', 'dead-1', ?, 'm', 1, 1, 0, 0, 0)`,
  ).run(OLD);
}

function rowsByKind(kinds: { kind: string; rows: number }[]) {
  return Object.fromEntries(kinds.map((k) => [k.kind, k.rows]));
}

describe('storage prune', () => {
  beforeEach(() => {
    reset();
    seed();
  });

  it('preview counts only old, non-live records — and deletes nothing', () => {
    const before = reportStorageStats();
    const preview = previewPrune(30);
    const after = reportStorageStats();

    const c = rowsByKind(preview.kinds);
    expect(c['audit-events']).toBe(1); // old-null only; old-live protected, recent too new
    expect(c['hook-events']).toBe(1);
    expect(c['transcript-copies']).toBe(1); // t-dead only; t-live protected
    expect(c['usage-samples']).toBe(1);
    expect(preview.totalRows).toBe(4);
    // preview is read-only (NFR N4 — the confirm count is computed without mutating)
    expect(after.kinds).toEqual(before.kinds);
  });

  it('prune deletes old non-live rows, protects live sessions, and drops FTS with its transcript', async () => {
    const result = await pruneObservabilityRecords(30);

    expect(result.totalRows).toBe(4);
    expect(rowsByKind(result.deleted)).toEqual({
      'audit-events': 1,
      'hook-events': 1,
      'transcript-copies': 1,
      'usage-samples': 1,
    });

    // Live-session records survive any cutoff. (NFR N1 — pruning never disturbs live observation)
    expect(db.prepare(`SELECT COUNT(*) AS n FROM audit_events WHERE session_id = 'live-1'`).get()).toMatchObject({ n: 1 });
    expect(db.prepare(`SELECT COUNT(*) AS n FROM transcript_messages WHERE uuid = 't-live'`).get()).toMatchObject({ n: 1 });
    // Recent record survives.
    expect(db.prepare(`SELECT COUNT(*) AS n FROM audit_events WHERE summary = 'recent'`).get()).toMatchObject({ n: 1 });
    // FTS row for the pruned transcript is gone; the protected one is irrelevant (no FTS row seeded for it).
    expect(db.prepare(`SELECT COUNT(*) AS n FROM transcript_fts WHERE uuid = 't-dead'`).get()).toMatchObject({ n: 0 });

    // NFR N3 — reclaim is real (reported bytes track the actual file-size delta, never negative).
    expect(result.bytesReclaimed).toBeGreaterThanOrEqual(0);
    expect(result.fileSizeAfter).toBeLessThanOrEqual(result.fileSizeBefore);
  });

  it('writes a storage.prune audit event recording the result', async () => {
    await pruneObservabilityRecords(30);
    const row = db
      .prepare(`SELECT detail FROM audit_events WHERE kind = 'storage.prune' ORDER BY id DESC LIMIT 1`)
      .get() as { detail: string } | undefined;
    expect(row).toBeDefined();
    const detail = JSON.parse(row!.detail) as { cutoffDays: number; totalRows: number };
    expect(detail.cutoffDays).toBe(30);
    expect(detail.totalRows).toBe(4);
  });

  it('is idempotent — a second prune at the same cutoff deletes nothing new', async () => {
    await pruneObservabilityRecords(30);
    const second = await pruneObservabilityRecords(30);
    expect(second.totalRows).toBe(0);
  });

  it('rejects a non-positive or non-integer cutoff', () => {
    expect(() => previewPrune(0)).toThrow();
    expect(() => previewPrune(-5)).toThrow();
    expect(() => previewPrune(1.5)).toThrow();
  });
});
