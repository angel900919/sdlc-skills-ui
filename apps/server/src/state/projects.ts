import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Project } from '@sdlc/shared';
import { db } from '../db.js';
import { bus } from '../bus.js';
import { watchProject, unwatchProject } from './watcher.js';

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    rootPath: row.root_path as string,
    createdAt: row.created_at as string,
    lastActivityAt: (row.last_activity_at as string) ?? null,
  };
}

export function listProjects(): Project[] {
  const rows = db.prepare('SELECT * FROM projects ORDER BY created_at').all() as Record<string, unknown>[];
  return rows.map(rowToProject);
}

export function getProject(id: string): Project | null {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? rowToProject(row) : null;
}

export function findProjectByPath(rootPath: string): Project | null {
  const row = db.prepare('SELECT * FROM projects WHERE root_path = ?').get(path.resolve(rootPath)) as
    | Record<string, unknown>
    | undefined;
  return row ? rowToProject(row) : null;
}

export function addProject(rootPath: string, name?: string): Project {
  const resolved = path.resolve(rootPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw Object.assign(new Error(`Not a directory: ${resolved}`), { statusCode: 400 });
  }
  const existing = findProjectByPath(resolved);
  if (existing) return existing;
  const project: Project = {
    id: randomUUID(),
    name: name?.trim() || path.basename(resolved),
    rootPath: resolved,
    createdAt: new Date().toISOString(),
    lastActivityAt: null,
  };
  db.prepare('INSERT INTO projects (id, name, root_path, created_at) VALUES (?, ?, ?, ?)').run(
    project.id,
    project.name,
    project.rootPath,
    project.createdAt,
  );
  watchProject(project.id, project.rootPath);
  bus.audit({ source: 'user', kind: 'project_added', projectId: project.id, summary: `Project registered: ${project.name}`, detail: { rootPath: resolved } });
  return project;
}

export function removeProject(id: string): boolean {
  const project = getProject(id);
  if (!project) return false;
  unwatchProject(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  bus.audit({ source: 'user', kind: 'project_removed', projectId: id, summary: `Project removed: ${project.name}` });
  return true;
}

export function touchProject(id: string) {
  db.prepare('UPDATE projects SET last_activity_at = ? WHERE id = ?').run(new Date().toISOString(), id);
}

/** Find the registered project whose root contains (or equals) a cwd. */
export function projectForCwd(cwd: string | null | undefined): Project | null {
  if (!cwd) return null;
  const resolved = path.resolve(cwd);
  for (const p of listProjects()) {
    if (resolved === p.rootPath || resolved.startsWith(p.rootPath + path.sep)) return p;
  }
  return null;
}

/** Boot: start watchers for all registered projects. */
export function watchAllProjects() {
  for (const p of listProjects()) watchProject(p.id, p.rootPath);
}
