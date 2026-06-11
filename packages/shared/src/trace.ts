import type { HookEvent, HookEventName } from './types.js';

/**
 * Session trace model: the raw hook event stream assembled into a timeline.
 * Each PreToolUse→PostToolUse pair becomes a duration span; lifecycle events
 * (SessionStart/End, UserPromptSubmit, Stop, SubagentStop, Notification)
 * become instant markers. Pure functions only — no I/O — so the pairing
 * logic is trivially testable.
 */

export interface TraceSpan {
  kind: 'span';
  /** id of the PreToolUse hook event that opened the span. */
  id: number;
  tool: string;
  startedAt: string;
  /** null while the span is still open (no matching PostToolUse yet). */
  endedAt: string | null;
  durationMs: number | null;
  /** Short human hint extracted from tool_input (file path, command, …). */
  inputSummary: string | null;
  status: 'ok' | 'error' | 'open';
}

export interface TraceMarker {
  kind: 'marker';
  /** id of the underlying hook event. */
  id: number;
  event: HookEventName;
  at: string;
  /** Short human label, e.g. the truncated prompt text. */
  label: string;
}

export type TraceEntry = TraceSpan | TraceMarker;

export interface SessionTrace {
  sessionId: string;
  /** receivedAt of the first / last hook event, if any. */
  startedAt: string | null;
  endedAt: string | null;
  totalDurationMs: number | null;
  /** Longest closed-span duration — the denominator for proportional bars. */
  maxSpanDurationMs: number;
  spanCount: number;
  openSpanCount: number;
  /** Ordered by event arrival; spans sit at their PreToolUse position. */
  entries: TraceEntry[];
}

const TRUNCATE = 140;

function truncate(value: unknown, max = TRUNCATE): string {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Pull the most descriptive scalar out of a tool_input payload. */
export function summarizeToolInput(payload: Record<string, unknown>): string | null {
  const input = payload.tool_input as Record<string, unknown> | undefined;
  if (!input || typeof input !== 'object') return null;
  const candidate =
    input.file_path ??
    input.command ??
    input.pattern ??
    input.path ??
    input.url ??
    input.query ??
    input.description ??
    input.prompt;
  if (candidate === undefined || candidate === null) return null;
  const text = truncate(candidate, 120);
  return text || null;
}

function markerLabel(event: HookEventName, payload: Record<string, unknown>): string {
  switch (event) {
    case 'UserPromptSubmit':
      return truncate(payload.prompt);
    case 'SessionStart':
      return `source: ${payload.source ?? 'startup'}`;
    case 'SessionEnd':
      return `reason: ${payload.reason ?? 'unknown'}`;
    case 'Stop':
      return 'response complete';
    case 'SubagentStop':
      return 'subagent finished';
    case 'Notification':
      return truncate(payload.message);
    default:
      return '';
  }
}

/** True when a PostToolUse payload reports a failed tool call. */
export function postToolUseFailed(payload: Record<string, unknown>): boolean {
  const resp = payload.tool_response as Record<string, unknown> | undefined;
  if (!resp || typeof resp !== 'object') return false;
  return resp.is_error === true || resp.success === false;
}

/**
 * Assemble ordered hook events for one session into a trace.
 *
 * Pairing: events are walked in arrival (id) order. A PreToolUse opens a
 * span and joins a FIFO queue keyed by tool name; a PostToolUse closes the
 * EARLIEST still-open span for the same tool. Unmatched PreToolUse events
 * (tool still running, or never completed) stay as open spans. A PostToolUse
 * with no open span (missed Pre) degrades to a marker so nothing is lost.
 */
export function buildTrace(sessionId: string, events: HookEvent[]): SessionTrace {
  const ordered = [...events].sort((a, b) => a.id - b.id);
  const entries: TraceEntry[] = [];
  const openByTool = new Map<string, TraceSpan[]>();
  let spanCount = 0;

  for (const ev of ordered) {
    const name = ev.hookEventName;
    if (name === 'PreToolUse') {
      const tool = ev.toolName ?? '?';
      const span: TraceSpan = {
        kind: 'span',
        id: ev.id,
        tool,
        startedAt: ev.receivedAt,
        endedAt: null,
        durationMs: null,
        inputSummary: summarizeToolInput(ev.payload),
        status: 'open',
      };
      entries.push(span);
      spanCount += 1;
      const queue = openByTool.get(tool) ?? [];
      queue.push(span);
      openByTool.set(tool, queue);
      continue;
    }
    if (name === 'PostToolUse') {
      const tool = ev.toolName ?? '?';
      const queue = openByTool.get(tool);
      const span = queue?.shift();
      if (span) {
        span.endedAt = ev.receivedAt;
        const delta = Date.parse(ev.receivedAt) - Date.parse(span.startedAt);
        span.durationMs = Number.isFinite(delta) ? Math.max(0, delta) : null;
        span.status = postToolUseFailed(ev.payload) ? 'error' : 'ok';
      } else {
        entries.push({
          kind: 'marker',
          id: ev.id,
          event: name,
          at: ev.receivedAt,
          label: `${tool} (unmatched PostToolUse)`,
        });
      }
      continue;
    }
    entries.push({
      kind: 'marker',
      id: ev.id,
      event: name,
      at: ev.receivedAt,
      label: markerLabel(name, ev.payload),
    });
  }

  const first = ordered[0]?.receivedAt ?? null;
  const last = ordered.length ? ordered[ordered.length - 1].receivedAt : null;
  const total = first && last ? Date.parse(last) - Date.parse(first) : null;
  const maxSpanDurationMs = entries.reduce(
    (max, e) => (e.kind === 'span' && e.durationMs !== null ? Math.max(max, e.durationMs) : max),
    0,
  );
  const openSpanCount = entries.filter((e) => e.kind === 'span' && e.status === 'open').length;

  return {
    sessionId,
    startedAt: first,
    endedAt: last,
    totalDurationMs: total !== null && Number.isFinite(total) ? Math.max(0, total) : null,
    maxSpanDurationMs,
    spanCount,
    openSpanCount,
    entries,
  };
}
