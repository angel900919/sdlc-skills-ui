import type { SearchHit, TranscriptMessage } from '@sdlc/shared';
import { db } from '../db.js';

/**
 * Full-text search over transcript text (SQLite FTS5). Rows are indexed as
 * the tailer persists messages; a startup backfill covers databases that
 * predate the index.
 */

/** Visible text of a message — what gets indexed and searched. */
export function searchableText(msg: TranscriptMessage): string {
  return msg.blocks
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

/**
 * FTS5 MATCH has its own query grammar where bare ", (, * etc. are syntax.
 * Treat user input as plain terms: split on non-word chars, quote each,
 * AND them together with a prefix match on the last term.
 */
export function toFtsQuery(input: string): string | null {
  const terms = input.split(/[^\p{L}\p{N}_-]+/u).filter(Boolean);
  if (terms.length === 0) return null;
  return terms.map((t, i) => `"${t.replaceAll('"', '')}"${i === terms.length - 1 ? '*' : ''}`).join(' ');
}

export function indexTranscriptMessage(msg: TranscriptMessage): void {
  const text = searchableText(msg);
  if (!text) return;
  db.prepare(
    `INSERT INTO transcript_fts (text, uuid, session_id, role, timestamp) VALUES (?, ?, ?, ?, ?)`,
  ).run(text, msg.uuid, msg.sessionId, msg.role, msg.timestamp);
}

/** One-time backfill for messages persisted before the FTS table existed. */
export function backfillSearchIndex(): number {
  const indexed = (db.prepare('SELECT COUNT(*) c FROM transcript_fts').get() as { c: number }).c;
  if (indexed > 0) return 0;
  const rows = db.prepare('SELECT * FROM transcript_messages').all() as Record<string, unknown>[];
  let count = 0;
  const insert = db.prepare(
    `INSERT INTO transcript_fts (text, uuid, session_id, role, timestamp) VALUES (?, ?, ?, ?, ?)`,
  );
  for (const r of rows) {
    try {
      const blocks = JSON.parse(r.blocks as string) as TranscriptMessage['blocks'];
      const text = searchableText({ blocks } as TranscriptMessage);
      if (!text) continue;
      insert.run(text, r.uuid, r.session_id, r.role, r.timestamp);
      count++;
    } catch {
      // Skip unparseable rows; the index is best-effort.
    }
  }
  return count;
}

export function searchTranscripts(query: string, projectId?: string, limit = 30): SearchHit[] {
  const fts = toFtsQuery(query);
  if (!fts) return [];
  const rows = db
    .prepare(
      `SELECT f.uuid, f.session_id, f.role, f.timestamp,
              snippet(transcript_fts, 0, '[', ']', '…', 18) AS snip,
              s.title AS session_title, s.project_id AS project_id
       FROM transcript_fts f
       LEFT JOIN sessions s ON s.id = f.session_id
       WHERE transcript_fts MATCH ?
         ${projectId ? 'AND s.project_id = ?' : ''}
       ORDER BY rank
       LIMIT ?`,
    )
    .all(...(projectId ? [fts, projectId, limit] : [fts, limit])) as Record<string, unknown>[];

  return rows.map((r) => ({
    sessionId: r.session_id as string,
    sessionTitle: (r.session_title as string) ?? 'unknown session',
    projectId: (r.project_id as string) ?? null,
    uuid: r.uuid as string,
    role: r.role as string,
    timestamp: r.timestamp as string,
    snippet: r.snip as string,
  }));
}
