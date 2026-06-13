import type { FastifyInstance } from 'fastify';
import type { HookEvent, MetricsSummary } from '@sdlc/shared';
import { buildTrace } from '@sdlc/shared';
import { db } from '../db.js';
import { bus } from '../bus.js';
import {
  addProject,
  getProject,
  listProjects,
  removeProject,
} from '../state/projects.js';
import { getProjectState, refreshProjectState } from '../state/projectState.js';
import { loadArchitecture } from '../state/parseComponentsModel.js';
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
import {
  getStatus as getGlobalHooksStatus,
  install as installGlobalHooks,
  uninstall as uninstallGlobalHooks,
} from '../claude/globalHooks.js';
import { resolvePermissionMode } from '../claude/claudeArgs.js';
import { listSubagents } from '../claude/subagents.js';
import { removeSessionWorktree } from '../claude/worktrees.js';
import { getSessionUsage, getUsageBySession, getUsageTotals } from '../state/usageTracker.js';
import { getAttention, listAttention } from '../state/attention.js';
import { getSessionRecap, getUnseenCounts, markSessionSeen } from '../state/recap.js';
import { createPr, getPrContext } from '../state/prFlow.js';
import { detectDevServers } from '../state/devServers.js';
import { getSessionDiff, listBranches } from '../state/gitDiff.js';
import { searchTranscripts } from '../state/search.js';
import { reportStorageStats } from '../state/storageStats.js';
import { previewPrune, pruneObservabilityRecords } from '../state/storagePrune.js';
import { transcriptToMarkdown } from '@sdlc/shared';

export function registerApiRoutes(app: FastifyInstance) {
  // ---- health -------------------------------------------------------------
  app.get('/api/health', async () => ({
    ok: true,
    service: 'sdlc-command-center',
    now: new Date().toISOString(),
    activeSessions: listSessions().filter((s) => s.status === 'running' || s.status === 'starting').length,
  }));

  // ---- storage ------------------------------------------------------------
  app.get('/api/storage/stats', async () => reportStorageStats());

  app.get('/api/storage/prune-preview', async (req, reply) => {
    const cutoffDays = Number((req.query as { cutoffDays?: string }).cutoffDays);
    if (!Number.isInteger(cutoffDays) || cutoffDays <= 0) {
      return reply.code(400).send({ error: 'cutoffDays must be a positive integer' });
    }
    return previewPrune(cutoffDays);
  });

  app.post('/api/storage/prune', async (req, reply) => {
    const cutoffDays = Number((req.body as { cutoffDays?: number }).cutoffDays);
    if (!Number.isInteger(cutoffDays) || cutoffDays <= 0) {
      return reply.code(400).send({ error: 'cutoffDays must be a positive integer' });
    }
    return pruneObservabilityRecords(cutoffDays);
  });

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

  app.get('/api/projects/:id/architecture', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    const architecture = loadArchitecture(project.rootPath);
    if (!architecture) return reply.code(404).send({ error: 'architecture not found' });
    return architecture;
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
    const usage = getUsageBySession(projectId);
    const unseen = getUnseenCounts(projectId);
    return listSessions(projectId).map((s) => ({
      ...s,
      live: isLive(s.id),
      usage: usage[s.id] ?? null,
      attention: getAttention(s.id),
      unseenCount: unseen[s.id] ?? 0,
    }));
  });

  app.get('/api/attention', async () => listAttention());

  app.post('/api/projects/:id/sessions', async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = getProject(id);
    if (!project) return reply.code(404).send({ error: 'not found' });
    const body = (req.body ?? {}) as {
      prompt?: string; title?: string; resumeSessionId?: string;
      skipPermissions?: boolean; permissionMode?: string; useWorktree?: boolean;
      cols?: number; rows?: number;
    };
    try {
      const session = spawnSession({
        projectId: id,
        cwd: project.rootPath,
        prompt: body.prompt,
        title: body.title,
        resumeSessionId: body.resumeSessionId,
        permissionMode: resolvePermissionMode(body.permissionMode, body.skipPermissions),
        useWorktree: body.useWorktree,
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

  app.get('/api/sessions/:id/recap', async (req, reply) => {
    const { id } = req.params as { id: string };
    if (!getSession(id)) return reply.code(404).send({ error: 'not found' });
    return getSessionRecap(id);
  });

  app.post('/api/sessions/:id/seen', async (req, reply) => {
    const { id } = req.params as { id: string };
    if (!getSession(id)) return reply.code(404).send({ error: 'not found' });
    return { ok: true, lastSeenAt: markSessionSeen(id) };
  });

  app.get('/api/sessions/:id/usage', async (req, reply) => {
    const { id } = req.params as { id: string };
    if (!getSession(id)) return reply.code(404).send({ error: 'not found' });
    return getSessionUsage(id);
  });

  app.get('/api/sessions/:id/agents', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    return listSubagents(id, session.cwd);
  });

  app.get('/api/sessions/:id/diff', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { base } = req.query as { base?: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    try {
      return getSessionDiff(session.cwd, base || 'develop');
    } catch (err) {
      return reply.code(400).send({ error: `diff failed: ${(err as Error).message}` });
    }
  });

  app.get('/api/sessions/:id/branches', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    try {
      return listBranches(session.cwd);
    } catch {
      return [];
    }
  });

  app.get('/api/sessions/:id/pr', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { base } = req.query as { base?: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    try {
      return getPrContext(session, base || 'develop');
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  });

  app.post('/api/sessions/:id/pr', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as { base?: string; title?: string; body?: string; draft?: boolean };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    if (!body.base || !body.title?.trim()) return reply.code(400).send({ error: 'base and title required' });
    try {
      const pr = createPr(session, {
        base: body.base,
        title: body.title.trim(),
        body: body.body ?? '',
        draft: body.draft,
      });
      bus.audit({
        source: 'user',
        kind: 'pr_created',
        projectId: session.projectId,
        sessionId: id,
        summary: `Pushed ${pr.branch} and opened PR ${pr.number ? `#${pr.number}` : ''} → ${pr.base}: ${pr.title}`,
        detail: { url: pr.url, branch: pr.branch, base: pr.base, number: pr.number },
      });
      return pr;
    } catch (err) {
      req.log.error({ err }, 'pr creation failed');
      return reply.code(400).send({ error: (err as Error).message });
    }
  });

  app.get('/api/sessions/:id/export.md', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session) return reply.code(404).send({ error: 'not found' });
    let messages = getTranscript(id);
    if (messages.length === 0) {
      transcriptTailer.backfill(id, session.projectId, session.cwd);
      messages = getTranscript(id);
    }
    const md = transcriptToMarkdown(session, messages);
    reply
      .header('content-type', 'text/markdown; charset=utf-8')
      .header('content-disposition', `attachment; filename="session-${id.slice(0, 8)}.md"`);
    return md;
  });

  app.delete('/api/sessions/:id/worktree', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    if (!session?.worktreePath) return reply.code(404).send({ error: 'no worktree' });
    if (isLive(id)) return reply.code(409).send({ error: 'session is live; kill it first' });
    const project = getProject(session.projectId);
    if (!project) return reply.code(404).send({ error: 'project not found' });
    try {
      removeSessionWorktree(project.rootPath, session.worktreePath);
      bus.audit({
        source: 'user',
        kind: 'worktree_removed',
        projectId: session.projectId,
        sessionId: id,
        summary: `Removed worktree ${session.worktreePath}`,
      });
      return { ok: true };
    } catch (err) {
      return reply.code(400).send({ error: (err as Error).message });
    }
  });

  // ---- preview pane ---------------------------------------------------------
  app.get('/api/preview/detect', async () => detectDevServers());

  // ---- transcript full-text search -----------------------------------------
  app.get('/api/search', async (req) => {
    const { q, projectId, limit } = req.query as { q?: string; projectId?: string; limit?: string };
    if (!q || q.trim().length < 2) return [];
    return searchTranscripts(q, projectId, Math.min(Number(limit ?? 30), 100));
  });

  app.get('/api/sessions/:id/trace', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = getSession(id);
    const rows = db
      .prepare('SELECT * FROM hook_events WHERE session_id = ? ORDER BY id')
      .all(id) as Record<string, unknown>[];
    // Hooks may observe sessions we did not spawn; only 404 when we know
    // nothing at all about this id.
    if (!session && rows.length === 0) return reply.code(404).send({ error: 'not found' });
    const events: HookEvent[] = rows.map((r) => ({
      id: Number(r.id),
      receivedAt: String(r.received_at),
      hookEventName: String(r.hook_event_name),
      sessionId: r.session_id === null ? null : String(r.session_id),
      cwd: r.cwd === null ? null : String(r.cwd),
      toolName: r.tool_name === null ? null : String(r.tool_name),
      payload: JSON.parse(String(r.payload)) as Record<string, unknown>,
    }));
    return buildTrace(id, events);
  });

  // ---- global hook install (observe sessions started outside the dashboard)
  app.get('/api/global-hooks', async () => getGlobalHooksStatus());

  app.post('/api/global-hooks/install', async (req, reply) => {
    try {
      const result = installGlobalHooks();
      bus.audit({
        source: 'user',
        kind: 'global_hooks_installed',
        summary: result.changed
          ? `Global observation hooks installed into ${result.status.settingsPath}`
          : 'Global observation hooks already installed',
        detail: {
          settingsPath: result.status.settingsPath,
          backupPath: result.backupPath,
          backupCreated: result.backupCreated,
          changed: result.changed,
        },
      });
      return result;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode ?? 500;
      req.log.error({ err }, 'global hook install failed');
      return reply.code(status).send({ error: (err as Error).message });
    }
  });

  app.post('/api/global-hooks/uninstall', async (req, reply) => {
    try {
      const result = uninstallGlobalHooks();
      bus.audit({
        source: 'user',
        kind: 'global_hooks_uninstalled',
        summary: result.changed
          ? `Global observation hooks removed from ${result.status.settingsPath}`
          : 'Global observation hooks were not installed',
        detail: { settingsPath: result.status.settingsPath, changed: result.changed },
      });
      return result;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode ?? 500;
      req.log.error({ err }, 'global hook uninstall failed');
      return reply.code(status).send({ error: (err as Error).message });
    }
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

    // Skill leaderboard: slash commands from session launches + submitted prompts.
    const launchRows = db
      .prepare(`SELECT launch_prompt p FROM sessions ${sessionFilter ? sessionFilter + ' AND' : 'WHERE'} launch_prompt LIKE '/%'`)
      .all(...sessionParams) as { p: string }[];
    const promptRows = db
      .prepare(
        `SELECT json_extract(payload, '$.prompt') p FROM hook_events
         WHERE hook_event_name = 'UserPromptSubmit' AND json_extract(payload, '$.prompt') LIKE '/%'`,
      )
      .all() as { p: string | null }[];
    const skillCounts = new Map<string, number>();
    for (const { p } of [...launchRows, ...promptRows]) {
      const skill = p?.match(/^\/([\w:-]+)/)?.[1];
      if (skill) skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1);
    }
    const skillLeaderboard = [...skillCounts.entries()]
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 90-day heatmap: sessions + prompts per day.
    const heatSessions = db
      .prepare(`SELECT substr(created_at, 1, 10) day, COUNT(*) c FROM sessions ${sessionFilter} GROUP BY day ORDER BY day DESC LIMIT 90`)
      .all(...sessionParams) as { day: string; c: number }[];
    const heatPrompts = db
      .prepare(`SELECT substr(received_at, 1, 10) day, COUNT(*) c FROM hook_events WHERE hook_event_name = 'UserPromptSubmit' GROUP BY day ORDER BY day DESC LIMIT 90`)
      .all() as { day: string; c: number }[];
    const heat = new Map<string, { sessions: number; prompts: number }>();
    for (const r of heatSessions) heat.set(r.day, { sessions: r.c, prompts: 0 });
    for (const r of heatPrompts) heat.set(r.day, { ...(heat.get(r.day) ?? { sessions: 0, prompts: 0 }), prompts: r.c });
    const activityByDay = [...heat.entries()]
      .map(([day, v]) => ({ day, ...v }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const fileEditsTotal = (db
      .prepare(`SELECT COUNT(*) c FROM hook_events WHERE hook_event_name = 'PostToolUse' AND tool_name IN ('Edit', 'Write', 'NotebookEdit', 'MultiEdit')`)
      .get() as { c: number }).c;

    const usage = getUsageTotals(q.projectId);

    const summary: MetricsSummary = {
      sessionsTotal,
      sessionsActive,
      hookEventsTotal,
      toolCallsTotal,
      toolCallsByName: Object.fromEntries(toolRows.map((r) => [r.tool_name, r.c])),
      promptsTotal,
      sessionsByDay: dayRows.map((r) => ({ day: r.day, count: r.c })).reverse(),
      avgSessionMinutes: avgRow.m === null ? null : Math.round(avgRow.m * 10) / 10,
      skillLeaderboard,
      activityByDay,
      fileEditsTotal,
      tokens: {
        input: usage.inputTokens,
        output: usage.outputTokens,
        cacheRead: usage.cacheReadTokens,
        cacheWrite: usage.cacheWriteTokens,
      },
      estCostUsd: usage.estCostUsd,
    };
    return summary;
  });
}
