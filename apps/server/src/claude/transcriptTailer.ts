import fs from 'node:fs';
import path from 'node:path';
import type { TranscriptContentBlock, TranscriptMessage } from '@sdlc/shared';
import { transcriptDirFor } from '../config.js';
import { db } from '../db.js';
import { bus } from '../bus.js';
import { logger } from '../logger.js';

/**
 * Tails Claude Code session transcripts (~/.claude/projects/<dir>/<id>.jsonl).
 * Claude writes them live during interactive sessions; parsing them gives the
 * dashboard a fully structured message stream (text, tool_use, tool_result)
 * without touching the model's billing path at all.
 */

interface Tracked {
  sessionId: string;
  projectId: string;
  file: string;
  offset: number;
  partial: string;
  watcher: fs.FSWatcher | null;
  pollTimer: NodeJS.Timeout | null;
}

class TranscriptTailer {
  private tracked = new Map<string, Tracked>();

  track(sessionId: string, projectId: string, cwd: string) {
    if (this.tracked.has(sessionId)) return;
    const dir = transcriptDirFor(cwd);
    const file = path.join(dir, `${sessionId}.jsonl`);
    const t: Tracked = { sessionId, projectId, file, offset: 0, partial: '', watcher: null, pollTimer: null };
    this.tracked.set(sessionId, t);

    // The file may not exist yet (claude creates it on first message), and
    // fs.watch on a missing file throws — poll until it appears, then watch.
    const tryAttach = () => {
      if (!this.tracked.has(sessionId)) return;
      if (fs.existsSync(file)) {
        this.readNew(t);
        try {
          t.watcher = fs.watch(file, () => this.readNew(t));
        } catch (err) {
          logger.warn({ err, file }, 'fs.watch failed, falling back to polling');
        }
        // Belt-and-braces poll: fs.watch can miss events on some platforms.
        t.pollTimer = setInterval(() => this.readNew(t), 2000);
      } else {
        t.pollTimer = setTimeout(tryAttach, 1000) as unknown as NodeJS.Timeout;
      }
    };
    tryAttach();
  }

  untrack(sessionId: string) {
    const t = this.tracked.get(sessionId);
    if (!t) return;
    t.watcher?.close();
    if (t.pollTimer) clearInterval(t.pollTimer);
    this.tracked.delete(sessionId);
  }

  /** Re-read an entire transcript from disk into the DB (recovery path). */
  backfill(sessionId: string, projectId: string, cwd: string) {
    const file = path.join(transcriptDirFor(cwd), `${sessionId}.jsonl`);
    if (!fs.existsSync(file)) return 0;
    const t: Tracked = { sessionId, projectId, file, offset: 0, partial: '', watcher: null, pollTimer: null };
    return this.readNew(t, true);
  }

  private readNew(t: Tracked, quiet = false): number {
    let stat: fs.Stats;
    try {
      stat = fs.statSync(t.file);
    } catch {
      return 0;
    }
    if (stat.size <= t.offset) return 0;
    const fd = fs.openSync(t.file, 'r');
    const buf = Buffer.alloc(stat.size - t.offset);
    fs.readSync(fd, buf, 0, buf.length, t.offset);
    fs.closeSync(fd);
    t.offset = stat.size;

    const text = t.partial + buf.toString('utf-8');
    const lines = text.split('\n');
    t.partial = lines.pop() ?? '';

    let count = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line) as Record<string, unknown>;
        const msg = this.normalize(entry, t.sessionId);
        if (msg) {
          this.persist(msg);
          count++;
          if (!quiet) bus.broadcast({ type: 'transcript-message', message: msg });
        }
      } catch {
        // Tolerate malformed/unknown lines; the transcript format is not ours.
      }
    }
    return count;
  }

  private normalize(entry: Record<string, unknown>, sessionId: string): TranscriptMessage | null {
    const entryType = String(entry.type ?? '');
    if (!['user', 'assistant', 'system'].includes(entryType)) return null;
    const message = (entry.message ?? {}) as Record<string, unknown>;
    const role = (message.role as string) ?? entryType;
    const rawContent = message.content ?? entry.content ?? '';

    let blocks: TranscriptContentBlock[];
    if (typeof rawContent === 'string') {
      blocks = rawContent ? [{ type: 'text', text: rawContent }] : [];
    } else if (Array.isArray(rawContent)) {
      blocks = rawContent as TranscriptContentBlock[];
    } else {
      blocks = [];
    }
    if (blocks.length === 0) return null;

    return {
      uuid: String(entry.uuid ?? `${sessionId}-${entry.timestamp ?? Math.random()}`),
      sessionId,
      role: (['user', 'assistant', 'system'].includes(role) ? role : 'system') as TranscriptMessage['role'],
      timestamp: String(entry.timestamp ?? new Date().toISOString()),
      blocks,
      entryType,
    };
  }

  private persist(msg: TranscriptMessage) {
    db.prepare(
      `INSERT OR IGNORE INTO transcript_messages (uuid, session_id, role, entry_type, timestamp, blocks)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(msg.uuid, msg.sessionId, msg.role, msg.entryType, msg.timestamp, JSON.stringify(msg.blocks));
  }
}

export const transcriptTailer = new TranscriptTailer();

export function getTranscript(sessionId: string): TranscriptMessage[] {
  const rows = db
    .prepare('SELECT * FROM transcript_messages WHERE session_id = ? ORDER BY timestamp')
    .all(sessionId) as Record<string, unknown>[];
  return rows.map((r) => ({
    uuid: r.uuid as string,
    sessionId: r.session_id as string,
    role: r.role as TranscriptMessage['role'],
    entryType: r.entry_type as string,
    timestamp: r.timestamp as string,
    blocks: JSON.parse(r.blocks as string) as TranscriptContentBlock[],
  }));
}
