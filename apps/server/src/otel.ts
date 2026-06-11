import type { Span } from '@opentelemetry/api';
import type { AuditEvent, HookEvent, ServerEvent } from '@sdlc/shared';
import { postToolUseFailed, summarizeToolInput } from '@sdlc/shared';
import { bus } from './bus.js';
import { logger } from './logger.js';
import { projectForCwd } from './state/projects.js';

/**
 * Opt-in OpenTelemetry trace export — the extension point documented in
 * docs/architecture.md.
 *
 * Strictly off by default: when neither OTEL_EXPORTER_OTLP_ENDPOINT nor
 * OTEL_EXPORTER_OTLP_TRACES_ENDPOINT is set, initTelemetry() returns null
 * before importing any OTel package — zero SDK initialization, zero overhead,
 * no log noise. When enabled, the module subscribes to the in-process bus
 * (no changes to the hook/PTY hot paths) and assembles:
 *
 * - one root span per Claude session (opened lazily on the first event that
 *   names the session id, closed by SessionEnd / session_exited /
 *   session_interrupted);
 * - one child span per tool call (PreToolUse opens, the earliest still-open
 *   PostToolUse of the same tool closes — the same FIFO pairing semantics as
 *   buildTrace() in packages/shared/src/trace.ts, but streaming);
 * - lifecycle hooks (UserPromptSubmit, Stop, SubagentStop, Notification) and
 *   server audit events (session spawned/resumed, prompt injected, user
 *   input) as span events on the session span.
 *
 * Open-span bookkeeping is capped and swept so a missed PostToolUse or an
 * abandoned session can never leak memory. Exporter failures are non-fatal:
 * OTLP errors route through the OTel diag logger, which stays a no-op unless
 * SDLC_OTEL_DIAG=1.
 */

const MAX_TRACKED_SESSIONS = 64;
const MAX_OPEN_TOOL_SPANS_PER_SESSION = 128;
const TOOL_SPAN_MAX_AGE_MS = 10 * 60_000; // open tool span with no PostToolUse
const SESSION_MAX_IDLE_MS = 6 * 60 * 60_000; // session span with no events at all
const SWEEP_INTERVAL_MS = 60_000;

/** Audit kinds recorded as span events on the session span. */
const SESSION_EVENT_KINDS = new Set(['session_started', 'session_resumed', 'prompt_injected', 'user_input']);
/** Audit kinds that close the session span. */
const SESSION_END_KINDS = new Set(['session_exited', 'session_interrupted']);

interface OpenToolSpan {
  span: Span;
  openedAtMs: number;
}

interface SessionEntry {
  span: Span;
  projectId: string | null;
  /** FIFO queues of open tool spans, keyed by tool name. */
  openTools: Map<string, OpenToolSpan[]>;
  openCount: number;
  lastActivityMs: number;
}

export interface Telemetry {
  /** Flush pending spans and shut the provider down (idempotent). */
  shutdown(): Promise<void>;
}

function truncate(value: unknown, max = 140): string {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export async function initTelemetry(): Promise<Telemetry | null> {
  const endpoint =
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ?? process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) return null;

  // Lazy-import the whole OTel stack so the disabled path loads nothing.
  const [api, sdk, { OTLPTraceExporter }, { resourceFromAttributes }, semconv] = await Promise.all([
    import('@opentelemetry/api'),
    import('@opentelemetry/sdk-trace-node'),
    import('@opentelemetry/exporter-trace-otlp-http'),
    import('@opentelemetry/resources'),
    import('@opentelemetry/semantic-conventions'),
  ]);

  if (process.env.SDLC_OTEL_DIAG === '1') {
    api.diag.setLogger(new api.DiagConsoleLogger(), api.DiagLogLevel.WARN);
  }

  const provider = new sdk.NodeTracerProvider({
    resource: resourceFromAttributes({
      [semconv.ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME ?? 'sdlc-command-center',
      [semconv.ATTR_SERVICE_VERSION]: '0.1.0',
    }),
    // OTLPTraceExporter reads OTEL_EXPORTER_OTLP_* env vars itself; export
    // failures are dropped quietly by the batch processor (diag is a no-op).
    spanProcessors: [new sdk.BatchSpanProcessor(new OTLPTraceExporter())],
  });
  // Not register()ed globally — the tracer is used explicitly, nothing else
  // in the process is instrumented.
  const tracer = provider.getTracer('sdlc-command-center');

  const sessions = new Map<string, SessionEntry>();

  function endSessionEntry(sessionId: string, endTime?: Date, note?: string) {
    const entry = sessions.get(sessionId);
    if (!entry) return;
    sessions.delete(sessionId);
    for (const queue of entry.openTools.values()) {
      for (const open of queue) {
        open.span.addEvent(note ?? 'session ended before PostToolUse');
        open.span.end(endTime);
      }
    }
    if (note) entry.span.addEvent(note, undefined, endTime);
    entry.span.end(endTime);
  }

  function evictOldestSession() {
    let oldestId: string | null = null;
    let oldestAt = Infinity;
    for (const [id, entry] of sessions) {
      if (entry.lastActivityMs < oldestAt) {
        oldestAt = entry.lastActivityMs;
        oldestId = id;
      }
    }
    if (oldestId) endSessionEntry(oldestId, undefined, 'evicted: tracked-session cap reached');
  }

  function ensureSession(sessionId: string, at: Date, projectId: string | null): SessionEntry {
    const existing = sessions.get(sessionId);
    if (existing) {
      existing.lastActivityMs = Date.now();
      if (projectId && !existing.projectId) {
        existing.projectId = projectId;
        existing.span.setAttribute('sdlc.project.id', projectId);
      }
      return existing;
    }
    if (sessions.size >= MAX_TRACKED_SESSIONS) evictOldestSession();
    const span = tracer.startSpan(
      'claude.session',
      {
        startTime: at,
        attributes: {
          'claude.session.id': sessionId,
          ...(projectId ? { 'sdlc.project.id': projectId } : {}),
        },
      },
      api.ROOT_CONTEXT,
    );
    const entry: SessionEntry = {
      span,
      projectId,
      openTools: new Map(),
      openCount: 0,
      lastActivityMs: Date.now(),
    };
    sessions.set(sessionId, entry);
    return entry;
  }

  function expireOldestToolSpan(entry: SessionEntry, note: string) {
    let oldestQueue: OpenToolSpan[] | null = null;
    let oldestAt = Infinity;
    for (const queue of entry.openTools.values()) {
      if (queue.length && queue[0].openedAtMs < oldestAt) {
        oldestAt = queue[0].openedAtMs;
        oldestQueue = queue;
      }
    }
    const stale = oldestQueue?.shift();
    if (!stale) return;
    entry.openCount -= 1;
    stale.span.addEvent(note);
    stale.span.end();
  }

  function openToolSpan(sessionId: string, entry: SessionEntry, ev: HookEvent, at: Date) {
    const tool = ev.toolName ?? '?';
    if (entry.openCount >= MAX_OPEN_TOOL_SPANS_PER_SESSION) {
      expireOldestToolSpan(entry, 'expired: open-tool-span cap reached');
    }
    const inputSummary = summarizeToolInput(ev.payload);
    const span = tracer.startSpan(
      `claude.tool ${tool}`,
      {
        startTime: at,
        attributes: {
          'claude.tool.name': tool,
          'claude.session.id': sessionId,
          ...(entry.projectId ? { 'sdlc.project.id': entry.projectId } : {}),
          ...(inputSummary ? { 'claude.tool.input': inputSummary } : {}),
        },
      },
      api.trace.setSpan(api.ROOT_CONTEXT, entry.span),
    );
    const queue = entry.openTools.get(tool) ?? [];
    queue.push({ span, openedAtMs: Date.now() });
    entry.openTools.set(tool, queue);
    entry.openCount += 1;
  }

  function closeToolSpan(entry: SessionEntry, ev: HookEvent, at: Date) {
    const tool = ev.toolName ?? '?';
    const queue = entry.openTools.get(tool);
    const open = queue?.shift();
    if (queue && queue.length === 0) entry.openTools.delete(tool);
    if (!open) {
      // Missed the PreToolUse (e.g. server restart mid-call) — degrade to a
      // span event so nothing is lost, mirroring buildTrace().
      entry.span.addEvent('claude.tool.unmatched_post', { 'claude.tool.name': tool }, at);
      return;
    }
    entry.openCount -= 1;
    const failed = postToolUseFailed(ev.payload);
    if (failed) {
      open.span.setAttribute('claude.tool.error', true);
      open.span.setStatus({ code: api.SpanStatusCode.ERROR, message: 'tool reported an error' });
    } else {
      open.span.setStatus({ code: api.SpanStatusCode.OK });
    }
    open.span.end(at);
  }

  function handleHook(ev: HookEvent) {
    if (!ev.sessionId) return;
    const at = new Date(ev.receivedAt);
    if (ev.hookEventName === 'SessionEnd') {
      const entry = sessions.get(ev.sessionId);
      if (entry) {
        entry.span.addEvent('claude.session_end', { reason: truncate(ev.payload.reason ?? 'unknown') }, at);
        endSessionEntry(ev.sessionId, at);
      }
      return;
    }
    const projectId = projectForCwd(ev.cwd)?.id ?? null;
    const entry = ensureSession(ev.sessionId, at, projectId);
    switch (ev.hookEventName) {
      case 'PreToolUse':
        openToolSpan(ev.sessionId, entry, ev, at);
        break;
      case 'PostToolUse':
        closeToolSpan(entry, ev, at);
        break;
      case 'SessionStart':
        entry.span.addEvent('claude.session_start', { source: truncate(ev.payload.source ?? 'startup') }, at);
        break;
      case 'UserPromptSubmit':
        entry.span.addEvent('claude.prompt', { 'claude.prompt': truncate(ev.payload.prompt) }, at);
        break;
      case 'Stop':
        entry.span.addEvent('claude.stop', undefined, at);
        break;
      case 'SubagentStop':
        entry.span.addEvent('claude.subagent_stop', undefined, at);
        break;
      case 'Notification':
        entry.span.addEvent('claude.notification', { message: truncate(ev.payload.message) }, at);
        break;
      default:
        entry.span.addEvent(`claude.${ev.hookEventName}`, undefined, at);
    }
  }

  function handleAudit(ev: AuditEvent) {
    // hook_* audit kinds duplicate the hook-event stream handled above.
    if (!ev.sessionId || ev.kind.startsWith('hook_')) return;
    const at = new Date(ev.at);
    if (SESSION_END_KINDS.has(ev.kind)) {
      const entry = sessions.get(ev.sessionId);
      if (entry) {
        entry.span.addEvent(`sdlc.${ev.kind}`, { summary: truncate(ev.summary) }, at);
        endSessionEntry(ev.sessionId, at);
      }
      return;
    }
    if (!SESSION_EVENT_KINDS.has(ev.kind)) return;
    const entry = ensureSession(ev.sessionId, at, ev.projectId);
    entry.span.addEvent(`sdlc.${ev.kind}`, { summary: truncate(ev.summary) }, at);
  }

  const onServerEvent = (event: ServerEvent) => {
    try {
      if (event.type === 'hook-event') handleHook(event.event);
      else if (event.type === 'audit-event') handleAudit(event.event);
    } catch (err) {
      // Telemetry must never break the observability spine.
      logger.debug({ err }, 'otel span assembly error (ignored)');
    }
  };
  bus.on('server-event', onServerEvent);

  // Sweep: expire tool spans whose PostToolUse never arrived and sessions
  // that went silent, so the open-span maps cannot grow unbounded.
  const sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [sessionId, entry] of sessions) {
      for (const [tool, queue] of entry.openTools) {
        while (queue.length && now - queue[0].openedAtMs > TOOL_SPAN_MAX_AGE_MS) {
          const stale = queue.shift()!;
          entry.openCount -= 1;
          stale.span.addEvent('expired: no PostToolUse within max age');
          stale.span.end();
        }
        if (queue.length === 0) entry.openTools.delete(tool);
      }
      if (now - entry.lastActivityMs > SESSION_MAX_IDLE_MS) {
        endSessionEntry(sessionId, undefined, 'expired: session idle past max age');
      }
    }
  }, SWEEP_INTERVAL_MS);
  sweepTimer.unref();

  logger.info({ endpoint }, 'OpenTelemetry trace export enabled (OTLP/HTTP)');

  let shutdownPromise: Promise<void> | null = null;
  return {
    shutdown() {
      shutdownPromise ??= (async () => {
        clearInterval(sweepTimer);
        bus.off('server-event', onServerEvent);
        for (const sessionId of [...sessions.keys()]) {
          endSessionEntry(sessionId, undefined, 'server shutdown');
        }
        try {
          await provider.forceFlush();
        } catch {
          /* exporter unreachable — fine, spans are best-effort */
        }
        try {
          await provider.shutdown();
        } catch {
          /* ignore */
        }
      })();
      return shutdownPromise;
    },
  };
}
