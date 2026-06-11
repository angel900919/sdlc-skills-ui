import { EventEmitter } from 'node:events';
import type { AuditEvent, AuditSource, ServerEvent } from '@sdlc/shared';
import { db } from './db.js';
import { logger } from './logger.js';

/**
 * In-process event bus. Everything observable flows through here:
 * persisted to SQLite (audit trail) and fanned out to WebSocket clients.
 */
class Bus extends EventEmitter {
  broadcast(event: ServerEvent) {
    this.emit('server-event', event);
  }

  /** Record an audit event (persist + log + broadcast). */
  audit(input: {
    source: AuditSource;
    kind: string;
    projectId?: string | null;
    sessionId?: string | null;
    summary: string;
    detail?: Record<string, unknown> | null;
  }): AuditEvent {
    const at = new Date().toISOString();
    const res = db
      .prepare(
        `INSERT INTO audit_events (at, source, kind, project_id, session_id, summary, detail)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        at,
        input.source,
        input.kind,
        input.projectId ?? null,
        input.sessionId ?? null,
        input.summary,
        input.detail ? JSON.stringify(input.detail) : null,
      );
    const event: AuditEvent = {
      id: Number(res.lastInsertRowid),
      at,
      source: input.source,
      kind: input.kind,
      projectId: input.projectId ?? null,
      sessionId: input.sessionId ?? null,
      summary: input.summary,
      detail: input.detail ?? null,
    };
    logger.info({ audit: { kind: event.kind, source: event.source, summary: event.summary, sessionId: event.sessionId } }, 'audit');
    this.broadcast({ type: 'audit-event', event });
    return event;
  }
}

export const bus = new Bus();
bus.setMaxListeners(100);
