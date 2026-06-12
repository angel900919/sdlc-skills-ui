import type { FastifyInstance } from 'fastify';
import type { HookEvent } from '@sdlc/shared';
import { db } from '../db.js';
import { bus } from '../bus.js';
import { projectForCwd, touchProject } from '../state/projects.js';
import { applyHookToAttention } from '../state/attention.js';

/**
 * Ingest endpoint for Claude Code hooks. Each spawned session carries a
 * generated --settings file whose hooks POST their stdin JSON here.
 * This is the structured observability spine: prompts, tool calls, stops,
 * session lifecycle — with zero impact on Claude's billing path.
 */

function summarize(event: string, payload: Record<string, unknown>): string {
  const tool = payload.tool_name ? String(payload.tool_name) : null;
  switch (event) {
    case 'PreToolUse': {
      const input = payload.tool_input as Record<string, unknown> | undefined;
      const hint =
        (input?.file_path && `→ ${input.file_path}`) ||
        (input?.command && `$ ${String(input.command).slice(0, 80)}`) ||
        (input?.pattern && `pattern: ${input.pattern}`) ||
        '';
      return `Tool start: ${tool ?? '?'} ${hint}`.trim();
    }
    case 'PostToolUse':
      return `Tool done: ${tool ?? '?'}`;
    case 'UserPromptSubmit':
      return `Prompt: ${String(payload.prompt ?? '').slice(0, 120)}`;
    case 'SessionStart':
      return `Session started (${payload.source ?? 'startup'})`;
    case 'SessionEnd':
      return `Session ended (${payload.reason ?? 'unknown'})`;
    case 'Stop':
      return 'Claude finished responding';
    case 'SubagentStop':
      return 'Subagent finished';
    case 'Notification':
      return `Notification: ${String(payload.message ?? '').slice(0, 120)}`;
    default:
      return event;
  }
}

export function registerHookRoutes(app: FastifyInstance) {
  app.post('/api/hooks/:event', async (req, reply) => {
    const eventName = (req.params as { event: string }).event;
    // External sessions (global hook install) may send anything; never crash
    // on a non-object body.
    const raw = req.body;
    const payload = (raw && typeof raw === 'object' && !Array.isArray(raw)
      ? raw
      : {}) as Record<string, unknown>;
    const sessionId = payload.session_id ? String(payload.session_id) : null;
    const cwd = payload.cwd ? String(payload.cwd) : null;
    const toolName = payload.tool_name ? String(payload.tool_name) : null;
    const receivedAt = new Date().toISOString();

    const res = db
      .prepare(
        `INSERT INTO hook_events (received_at, hook_event_name, session_id, cwd, tool_name, payload)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(receivedAt, eventName, sessionId, cwd, toolName, JSON.stringify(payload));

    const hookEvent: HookEvent = {
      id: Number(res.lastInsertRowid),
      receivedAt,
      hookEventName: eventName,
      sessionId,
      cwd,
      toolName,
      payload,
    };
    bus.broadcast({ type: 'hook-event', event: hookEvent });
    applyHookToAttention(eventName, sessionId, String(payload.message ?? ''));

    const project = projectForCwd(cwd);
    if (project) touchProject(project.id);
    bus.audit({
      source: 'hook',
      kind: `hook_${eventName}`,
      projectId: project?.id ?? null,
      sessionId,
      summary: summarize(eventName, payload),
      detail: toolName ? { toolName } : null,
    });

    reply.send({ ok: true });
  });
}
