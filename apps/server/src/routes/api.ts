import type { FastifyInstance } from 'fastify';
import type { MetricsSummary } from '@sdlc/shared';
import { db } from '../db.js';
import { bus } from '../bus.js';
import {
  addProject,
  getProject,
  listProjects,
  removeProject,
} from '../state/projects.js';
import { getProjectState, refreshProjectState } from '../state/projectState.js';
import { loadSkills } from '../state/skillsCatalog.js';
import { buildDocsTree, readDocFile } from '../state/docsTree.js';
import {
  getSession,
  isLive,
  killSession,
  listSessions,
  spawnSession,
  writeToSession,
} from '../claude/sessionManager.js';
import { getTranscript, transcriptTailer } from '../claude/transcriptTailer.js';

export function registerApiRoutes(app: FastifyInstance) {
  // ---- health -------------------------------------------------------------
  app.get('/api/health', async () => ({
    ok: true,
    service: 'sdlc-command-center',
    now: new Date().toISOString(),
    activeSessions: listSessions().filter((s) => s.status === 'running' || s.status === 'starting').length,
  }));

  // ---- projects -----------------------------------------------------------
  app.get('/api/projects', async () => listProjects());

  app.post('/api/projects', async (req, reply) => {
    const body = (req.body ?? {}) as { rootPath?: string; name?: string };
    if (!body.rootPath) return reply.code(400).send({ error: 'rootPath required' });
    const project = addProject(body.rootPath, body.name);
    void refreshProjectState(project.rootPath);
    return project;
  });

  app.delete('/api/projects/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    if (!removeProject(id)) return reply.code(404).send({ error: 'not found' });
    return { ok: true };
  });

  app.get('/api/projects/:id/state', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    const state = await getProjectState(project.rootPath);
    return { project, state };
  });

  app.post('/api/projects/:id/state/refresh', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    const state = await refreshProjectState(project.rootPath);
    bus.broadcast({ type: 'state-changed', projectId: id });
    return { project, state };
  });

  app.get('/api/projects/:id/skills', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    return loadSkills(project.rootPath);
  });

  app.get('/api/projects/:id/docs', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    return buildDocsTree(project.rootPath);
  });

  app.get('/api/projects/:id/docs/file', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { path: relPath } = req.query as { path?: string };
    const project = getProject(id);
    if (!project || !relPath) return reply.code(404).send({ error: 'not found' });
    const doc = readDocFile(project.rootPath, relPath);
    if (!doc) return reply.code(404).send({ error: 'not found' });
    return doc;
  });

  // ---- sessions -----------------------------------------------------------
  app.get('/api/sessions', async (req) => {
    const { projectId } = req.query as { projectId?: string };
    return listSessions(projectId).map((s) => ({ ...s, live: isLive(s.id) }));
  });

  app.post('/api/projects/:id/sessions', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    const body = (req.body ?? {}) as { prompt?: string; title?: string; resumeSessionId?: string; cols?: number; rows?: number };
    try {
      const session = spawnSession({
        projectId: id,
        cwd: project.rootPath,
        prompt: body.prompt,
        title: body.title,
        resumeSessionId: body.resumeSessionId,
        cols: body.cols,
        rows: body.rows,
      });
      return session;
    } catch (err) {
      req.log.error({ err }, 'failed to spawn claude session');
      return reply.code(500).send({ error: `Failed to start Claude: ${(err as Error).message}` });
    }
  });

  app.get('/api/sessions/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    return { ...session, live: isLive(id) };
  });

  app.post('/api/sessions/:id/input', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as { data?: string; submit?: boolean };
    const data = body.data ?? '';
    const ok = writeToSession(id, body.submit === false ? data : `${data}\r`);
    if (!ok) return reply.code(409).send({ error: 'session not live' });
    const session = getSession(id);
    bus.audit({
      source: 'user',
      kind: 'user_input',
      projectId: session?.projectId ?? null,
      sessionId: id,
      summary: `Input: ${data.slice(0, 120)}`,
    });
    return { ok: true };
  });

  app.post('/api/sessions/:id/kill', async (req, reply) => {
    const { id } = req.params as { id: string };
    if (!killSession(id)) return reply.code(409).send({ error: 'session not live' });
    return { ok: true };
  });

  app.post('/api/sessions/:id/resume', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    if (isLive(id)) return reply.code(409).send({ error: 'session already live' });
    const resumed = spawnSession({
      projectId: session.projectId,
      cwd: session.cwd,
      title: session.title,
      resumeSessionId: id,
    });
    return resumed;
  });

  app.get('/api/sessions/:id/transcript', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    let messages = getTranscript(id);
    if (messages.length === 0) {
      // Recovery: backfill from the on-disk transcript if we missed it live.
      transcriptTailer.backfill(id, session.projectId, session.cwd);
      messages = getTranscript(id);
    }
    return messages;
  });

  // ---- observability ------------------------------------------------------
  app.get('/api/events', async (req) => {
    const q = req.query as { projectId?: string; sessionId?: string; kind?: string; limit?: string; before?: string };
    const limit = Math.min(Number(q.limit ?? 200), 1000);
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (q.projectId) { clauses.push('project_id = ?'); params.push(q.projectId); }
    if (q.sessionId) { clauses.push('session_id = ?'); params.push(q.sessionId); }
    if (q.kind) { clauses.push('kind LIKE ?'); params.push(`${q.kind}%`); }
    if (q.before) { clauses.push('id < ?'); params.push(Number(q.before)); }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = db
      .prepare(`SELECT * FROM audit_events ${where} ORDER BY id DESC LIMIT ?`)
      .all(...params, limit) as Record<string, unknown>[];
    return rows.map((r) => ({
      id: r.id,
      at: r.at,
      source: r.source,
      kind: r.kind,
      projectId: r.project_id,
      sessionId: r.session_id,
      summary: r.summary,
      detail: r.detail ? JSON.parse(r.detail as string) : null,
    }));
  });

  app.get('/api/metrics', async (req) => {
    const q = req.query as { projectId?: string };
    const sessionFilter = q.projectId ? 'WHERE project_id = ?' : '';
    const sessionParams = q.projectId ? [q.projectId] : [];

    const sessionsTotal = (db.prepare(`SELECT COUNT(*) c FROM sessions ${sessionFilter}`).get(...sessionParams) as { c: number }).c;
    const sessionsActive = (db.prepare(`SELECT COUNT(*) c FROM sessions ${sessionFilter ? sessionFilter + ' AND' : 'WHERE'} status IN ('starting','running')`).get(...sessionParams) as { c: number }).c;
    const hookEventsTotal = (db.prepare('SELECT COUNT(*) c FROM hook_events').get() as { c: number }).c;
    const toolCallsTotal = (db.prepare(`SELECT COUNT(*) c FROM hook_events WHERE hook_event_name = 'PreToolUse'`).get() as { c: number }).c;
    const promptsTotal = (db.prepare(`SELECT COUNT(*) c FROM hook_events WHERE hook_event_name = 'UserPromptSubmit'`).get() as { c: number }).c;

    const toolRows = db
      .prepare(`SELECT tool_name, COUNT(*) c FROM hook_events WHERE hook_event_name = 'PreToolUse' AND tool_name IS NOT NULL GROUP BY tool_name ORDER BY c DESC LIMIT 20`)
      .all() as { tool_name: string; c: number }[];

    const dayRows = db
      .prepare(`SELECT substr(created_at, 1, 10) day, COUNT(*) c FROM sessions ${sessionFilter} GROUP BY day ORDER BY day DESC LIMIT 30`)
      .all(...sessionParams) as { day: string; c: number }[];

    const avgRow = db
      .prepare(
        `SELECT AVG((julianday(ended_at) - julianday(created_at)) * 24 * 60) m
         FROM sessions ${sessionFilter ? sessionFilter + ' AND' : 'WHERE'} ended_at IS NOT NULL`,
      )
      .get(...sessionParams) as { m: number | null };

    const summary: MetricsSummary = {
      sessionsTotal,
      sessionsActive,
      hookEventsTotal,
      toolCallsTotal,
      toolCallsByName: Object.fromEntries(toolRows.map((r) => [r.tool_name, r.c])),
      promptsTotal,
      sessionsByDay: dayRows.map((r) => ({ day: r.day, count: r.c })).reverse(),
      avgSessionMinutes: avgRow.m === null ? null : Math.round(avgRow.m * 10) / 10,
    };
    return summary;
  });
}
