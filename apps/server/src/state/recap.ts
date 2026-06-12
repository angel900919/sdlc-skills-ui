import type { RecapHookEvent, SessionRecap, TranscriptContentBlock, TranscriptMessage } from '@sdlc/shared';
import { buildRecap } from '@sdlc/shared';
import { db } from '../db.js';

/**
 * Recap queries over the per-session "last seen" cursor. The cursor moves
 * only when the user actually views the session in the UI, so the recap and
 * the unseen badge describe exactly what they missed.
 */

export function getSessionRecap(sessionId: string): SessionRecap {
  const row = db.prepare('SELECT last_seen_at FROM sessions WHERE id = ?').get(sessionId) as
    | { last_seen_at: string | null }
    | undefined;
  const since = row?.last_seen_at ?? null;

  const msgRows = (since
    ? db.prepare('SELECT * FROM transcript_messages WHERE session_id = ? AND timestamp > ? ORDER BY timestamp').all(sessionId, since)
    : db.prepare('SELECT * FROM transcript_messages WHERE session_id = ? ORDER BY timestamp').all(sessionId)) as Record<string, unknown>[];
  const messages: TranscriptMessage[] = msgRows.map((r) => ({
    uuid: r.uuid as string,
    sessionId: r.session_id as string,
    role: r.role as TranscriptMessage['role'],
    entryType: r.entry_type as string,
    timestamp: r.timestamp as string,
    blocks: JSON.parse(r.blocks as string) as TranscriptContentBlock[],
  }));

  const hookRows = (since
    ? db.prepare('SELECT * FROM hook_events WHERE session_id = ? AND received_at > ? ORDER BY id').all(sessionId, since)
    : db.prepare('SELECT * FROM hook_events WHERE session_id = ? ORDER BY id').all(sessionId)) as Record<string, unknown>[];
  const hookEvents: RecapHookEvent[] = hookRows.map((r) => ({
    hookEventName: String(r.hook_event_name),
    receivedAt: String(r.received_at),
    toolName: r.tool_name === null ? null : String(r.tool_name),
    payload: JSON.parse(String(r.payload)) as Record<string, unknown>,
  }));

  return buildRecap({ sessionId, since, until: new Date().toISOString(), messages, hookEvents });
}

/** Roll the last-seen cursor forward to now. */
export function markSessionSeen(sessionId: string): string {
  const at = new Date().toISOString();
  db.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?').run(at, sessionId);
  return at;
}

/** Unseen transcript-message counts per session (the badge numbers). */
export function getUnseenCounts(projectId?: string): Record<string, number> {
  const rows = (projectId
    ? db.prepare(
        `SELECT s.id, COUNT(m.uuid) c FROM sessions s
         JOIN transcript_messages m ON m.session_id = s.id
           AND (s.last_seen_at IS NULL OR m.timestamp > s.last_seen_at)
         WHERE s.project_id = ? GROUP BY s.id`,
      ).all(projectId)
    : db.prepare(
        `SELECT s.id, COUNT(m.uuid) c FROM sessions s
         JOIN transcript_messages m ON m.session_id = s.id
           AND (s.last_seen_at IS NULL OR m.timestamp > s.last_seen_at)
         GROUP BY s.id`,
      ).all()) as { id: string; c: number }[];
  return Object.fromEntries(rows.map((r) => [r.id, r.c]));
}
