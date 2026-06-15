import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from 'ws';
import type { ClientEvent, ServerEvent } from '@sdlc/shared';
import { bus } from './bus.js';
import { logger } from './logger.js';
import { isAllowedOrigin } from './originGuard.js';
import { getScrollback, resizeSession, writeToSession } from './claude/sessionManager.js';

/**
 * Single multiplexed WebSocket. Clients subscribe to topics:
 *   "all" | "project:<id>" | "session:<id>"
 * Terminal input/resize flows client -> server on the same socket.
 */

function topicsFor(event: ServerEvent): string[] {
  switch (event.type) {
    case 'terminal-data':
    case 'transcript-message':
      return ['all', `session:${'sessionId' in event ? event.sessionId : (event as { message: { sessionId: string } }).message.sessionId}`];
    case 'session-update':
      return ['all', `session:${event.session.id}`, `project:${event.session.projectId}`];
    case 'hook-event':
      return ['all', ...(event.event.sessionId ? [`session:${event.event.sessionId}`] : [])];
    case 'audit-event':
      return [
        'all',
        ...(event.event.projectId ? [`project:${event.event.projectId}`] : []),
        ...(event.event.sessionId ? [`session:${event.event.sessionId}`] : []),
      ];
    case 'state-changed':
    case 'fs-changed':
    case 'architecture-changed':
      return ['all', `project:${event.projectId}`];
    default:
      return ['all'];
  }
}

export function registerWebSocket(app: FastifyInstance) {
  const clients = new Map<WebSocket, Set<string>>();

  bus.on('server-event', (event: ServerEvent) => {
    const topics = topicsFor(event);
    const payload = JSON.stringify(event);
    for (const [socket, subs] of clients) {
      if (socket.readyState !== socket.OPEN) continue;
      if (topics.some((t) => subs.has(t))) socket.send(payload);
    }
  });

  app.get('/ws', { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    // Reject cross-site WebSocket hijacking: a WS handshake bypasses CORS, so a
    // foreign page could otherwise open this socket, stream every terminal/
    // transcript, and inject keystrokes into a live session (scc-7ru). Reject
    // before wiring any subscription or message handler. (The Host/rebinding
    // angle is covered by originHostGuard running on this upgrade GET.)
    if (!isAllowedOrigin(req.headers.origin)) {
      socket.close(1008, 'forbidden origin');
      return;
    }
    clients.set(socket, new Set(['all']));

    socket.on('message', (raw: Buffer) => {
      let msg: ClientEvent;
      try {
        msg = JSON.parse(raw.toString()) as ClientEvent;
      } catch {
        return;
      }
      switch (msg.type) {
        case 'subscribe': {
          const subs = new Set(msg.topics);
          clients.set(socket, subs);
          // Replay scrollback for newly attached terminals.
          for (const topic of subs) {
            if (topic.startsWith('session:')) {
              const sessionId = topic.slice('session:'.length);
              const scrollback = getScrollback(sessionId);
              if (scrollback) {
                socket.send(JSON.stringify({ type: 'terminal-data', sessionId, data: scrollback } satisfies ServerEvent));
              }
            }
          }
          break;
        }
        case 'terminal-input':
          writeToSession(msg.sessionId, msg.data);
          break;
        case 'terminal-resize':
          resizeSession(msg.sessionId, msg.cols, msg.rows);
          break;
      }
    });

    socket.on('close', () => clients.delete(socket));
    socket.on('error', (err: Error) => {
      logger.warn({ err }, 'websocket error');
      clients.delete(socket);
    });
  });
}
