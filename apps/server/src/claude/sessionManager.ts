import { randomUUID } from 'node:crypto';
import pty from 'node-pty';
import type { ClaudeSession, SessionStatus } from '@sdlc/shared';
import { config } from '../config.js';
import { db } from '../db.js';
import { bus } from '../bus.js';
import { logger } from '../logger.js';
import { ensureHookSettingsFile } from './hookSettings.js';
import { transcriptTailer } from './transcriptTailer.js';

/**
 * Drives INTERACTIVE Claude Code CLI sessions through pseudo-terminals.
 *
 * Why interactive (PTY) and not `claude -p`: from 2026-06-15, headless/-p
 * usage on subscription plans bills to a separate Agent SDK credit pool.
 * Interactive sessions keep using the normal subscription limits, so the
 * dashboard wraps the real TUI: structured telemetry comes from hooks and
 * the session transcript, while the raw terminal stays available in the UI
 * (and is the escape hatch for permission prompts).
 */

const OUTPUT_BUFFER_LIMIT = 400_000; // chars of scrollback replayed to late joiners

/**
 * If this server was itself launched from inside a Claude Code session, the
 * inherited CLAUDECODE/CLAUDE_CODE_* vars make spawned CLIs behave as nested
 * child sessions (suppressing transcript persistence, among other things).
 * Strip them; keep CLAUDE_CONFIG_DIR, which is a deliberate user setting.
 */
function cleanEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v === undefined) continue;
    if ((k === 'CLAUDECODE' || k.startsWith('CLAUDE_')) && k !== 'CLAUDE_CONFIG_DIR') continue;
    env[k] = v;
  }
  env.TERM = 'xterm-256color';
  return env;
}

interface LiveSession {
  term: pty.IPty;
  buffer: string;
}

const live = new Map<string, LiveSession>();

function rowToSession(row: Record<string, unknown>): ClaudeSession {
  return {
    id: row.id as string,
    projectId: row.project_id as string,
    cwd: row.cwd as string,
    title: row.title as string,
    status: row.status as SessionStatus,
    pid: (row.pid as number) ?? null,
    exitCode: (row.exit_code as number) ?? null,
    launchPrompt: (row.launch_prompt as string) ?? null,
    createdAt: row.created_at as string,
    endedAt: (row.ended_at as string) ?? null,
    resumedFromSessionId: (row.resumed_from as string) ?? null,
  };
}

export function getSession(id: string): ClaudeSession | null {
  const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToSession(row) : null;
}

export function listSessions(projectId?: string): ClaudeSession[] {
  const rows = (projectId
    ? db.prepare('SELECT * FROM sessions WHERE project_id = ? ORDER BY created_at DESC').all(projectId)
    : db.prepare('SELECT * FROM sessions ORDER BY created_at DESC').all()) as Record<string, unknown>[];
  return rows.map(rowToSession);
}

function updateSession(id: string, patch: Partial<{ status: SessionStatus; pid: number | null; exitCode: number | null; endedAt: string | null }>) {
  const current = getSession(id);
  if (!current) return;
  db.prepare('UPDATE sessions SET status = ?, pid = ?, exit_code = ?, ended_at = ? WHERE id = ?').run(
    patch.status ?? current.status,
    patch.pid !== undefined ? patch.pid : current.pid,
    patch.exitCode !== undefined ? patch.exitCode : current.exitCode,
    patch.endedAt !== undefined ? patch.endedAt : current.endedAt,
    id,
  );
  const updated = getSession(id);
  if (updated) bus.broadcast({ type: 'session-update', session: updated });
}

export interface SpawnOptions {
  projectId: string;
  cwd: string;
  title?: string;
  /** Text typed into the session once the TUI is ready (e.g. "/prd checkout"). */
  prompt?: string;
  /** Resume an earlier Claude session (crash recovery / continue work). */
  resumeSessionId?: string;
  /** Launch with `--dangerously-skip-permissions` (skip all permission prompts). */
  skipPermissions?: boolean;
  cols?: number;
  rows?: number;
}

export function spawnSession(opts: SpawnOptions): ClaudeSession {
  const id = opts.resumeSessionId ?? randomUUID();
  const settingsFile = ensureHookSettingsFile();

  const args: string[] = ['--settings', settingsFile];
  if (opts.skipPermissions) args.push('--dangerously-skip-permissions');
  if (opts.resumeSessionId) args.push('--resume', opts.resumeSessionId);
  else args.push('--session-id', id);

  const term = pty.spawn(config.claudeBin, args, {
    name: 'xterm-256color',
    cols: opts.cols ?? 140,
    rows: opts.rows ?? 38,
    cwd: opts.cwd,
    env: cleanEnv(),
  });

  const createdAt = new Date().toISOString();
  const title = opts.title ?? opts.prompt?.slice(0, 60) ?? `Session ${id.slice(0, 8)}`;

  if (opts.resumeSessionId) {
    // Re-activate the existing row rather than inserting a duplicate.
    db.prepare(
      `INSERT INTO sessions (id, project_id, cwd, title, status, pid, launch_prompt, created_at, resumed_from)
       VALUES (?, ?, ?, ?, 'starting', ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET status='starting', pid=excluded.pid, exit_code=NULL, ended_at=NULL`,
    ).run(id, opts.projectId, opts.cwd, title, term.pid, opts.prompt ?? null, createdAt, opts.resumeSessionId);
  } else {
    db.prepare(
      `INSERT INTO sessions (id, project_id, cwd, title, status, pid, launch_prompt, created_at, resumed_from)
       VALUES (?, ?, ?, ?, 'starting', ?, ?, ?, NULL)`,
    ).run(id, opts.projectId, opts.cwd, title, term.pid, opts.prompt ?? null, createdAt);
  }

  live.set(id, { term, buffer: '' });

  term.onData((data) => {
    const entry = live.get(id);
    if (entry) {
      entry.buffer = (entry.buffer + data).slice(-OUTPUT_BUFFER_LIMIT);
    }
    bus.broadcast({ type: 'terminal-data', sessionId: id, data });
  });

  term.onExit(({ exitCode }) => {
    live.delete(id);
    updateSession(id, { status: 'exited', exitCode, endedAt: new Date().toISOString() });
    bus.audit({
      source: 'server',
      kind: 'session_exited',
      projectId: opts.projectId,
      sessionId: id,
      summary: `Claude session exited (code ${exitCode})`,
    });
  });

  // Mark running on first output, then deliver the launch prompt once the
  // TUI has settled (no new output for 900ms).
  let sawOutput = false;
  let promptSent = !opts.prompt;
  let settleTimer: NodeJS.Timeout | null = null;
  const disposable = term.onData(() => {
    if (!sawOutput) {
      sawOutput = true;
      updateSession(id, { status: 'running', pid: term.pid });
    }
    if (!promptSent) {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (!promptSent && live.has(id)) {
          promptSent = true;
          term.write(`${opts.prompt}\r`);
          bus.audit({
            source: 'server',
            kind: 'prompt_injected',
            projectId: opts.projectId,
            sessionId: id,
            summary: `Launched: ${opts.prompt}`,
          });
        }
        disposable.dispose();
      }, 900);
    }
  });

  transcriptTailer.track(id, opts.projectId, opts.cwd);

  bus.audit({
    source: 'server',
    kind: opts.resumeSessionId ? 'session_resumed' : 'session_started',
    projectId: opts.projectId,
    sessionId: id,
    summary: opts.resumeSessionId
      ? `Resumed Claude session ${id.slice(0, 8)}`
      : `Started Claude session ${id.slice(0, 8)}${opts.prompt ? ` with "${opts.prompt}"` : ''}${opts.skipPermissions ? ' [skip-permissions]' : ''}`,
    detail: { cwd: opts.cwd },
  });

  logger.info({ sessionId: id, pid: term.pid, cwd: opts.cwd, resume: !!opts.resumeSessionId }, 'spawned claude session');
  const session = getSession(id);
  if (!session) throw new Error('session row missing after insert');
  return session;
}

export function writeToSession(id: string, data: string): boolean {
  const entry = live.get(id);
  if (!entry) return false;
  entry.term.write(data);
  return true;
}

export function resizeSession(id: string, cols: number, rows: number): boolean {
  const entry = live.get(id);
  if (!entry) return false;
  try {
    entry.term.resize(Math.max(20, cols), Math.max(5, rows));
    return true;
  } catch {
    return false;
  }
}

export function killSession(id: string): boolean {
  const entry = live.get(id);
  if (!entry) return false;
  entry.term.kill();
  return true;
}

export function getScrollback(id: string): string {
  return live.get(id)?.buffer ?? '';
}

export function isLive(id: string): boolean {
  return live.has(id);
}

/** On boot: any session still marked running was orphaned by a crash. */
export function recoverOrphanedSessions() {
  const rows = db
    .prepare(`SELECT id FROM sessions WHERE status IN ('starting','running')`)
    .all() as { id: string }[];
  for (const { id } of rows) {
    updateSession(id, { status: 'interrupted', endedAt: new Date().toISOString() });
    bus.audit({
      source: 'server',
      kind: 'session_interrupted',
      sessionId: id,
      summary: `Session ${id.slice(0, 8)} marked interrupted after server restart (resumable)`,
    });
  }
  if (rows.length) logger.warn({ count: rows.length }, 'marked orphaned sessions interrupted');
}

/** Graceful shutdown: terminate PTYs so no zombie claude processes linger. */
export function shutdownAllSessions() {
  for (const [id, entry] of live) {
    try {
      entry.term.kill();
    } catch {
      /* already gone */
    }
    updateSession(id, { status: 'interrupted', endedAt: new Date().toISOString() });
  }
  live.clear();
}
