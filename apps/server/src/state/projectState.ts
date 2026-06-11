import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { ProjectState } from '@sdlc/shared';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { skillsDirFor } from './skillsCatalog.js';

const execFileP = promisify(execFile);

/**
 * Project state comes from the chain's own read-only generator
 * (_build_share/project-state.py -> dashboard/state.json), so the dashboard
 * sees exactly what /status and /next see. We run it, then read the JSON.
 */

const stateCache = new Map<string, { at: number; state: ProjectState }>();
const inflight = new Map<string, Promise<ProjectState | null>>();

function generatorFor(projectRoot: string): string | null {
  const candidates = [
    path.join(skillsDirFor(projectRoot), '_build_share', 'project-state.py'),
    path.join(config.defaultSkillsDir, '_build_share', 'project-state.py'),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

export async function refreshProjectState(projectRoot: string): Promise<ProjectState | null> {
  const existing = inflight.get(projectRoot);
  if (existing) return existing;
  const job = (async () => {
    const generator = generatorFor(projectRoot);
    if (!generator) {
      logger.warn({ projectRoot }, 'no project-state.py generator found');
      return null;
    }
    try {
      await execFileP(config.pythonBin, [generator, projectRoot], { timeout: 30_000 });
    } catch (err) {
      logger.error({ err, projectRoot }, 'project-state.py failed');
      return readStateFile(projectRoot); // stale state beats no state
    } finally {
      inflight.delete(projectRoot);
    }
    const state = readStateFile(projectRoot);
    if (state) stateCache.set(projectRoot, { at: Date.now(), state });
    return state;
  })();
  inflight.set(projectRoot, job);
  return job;
}

export function readStateFile(projectRoot: string): ProjectState | null {
  const file = path.join(projectRoot, 'dashboard', 'state.json');
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as ProjectState;
  } catch {
    return null;
  }
}

export async function getProjectState(projectRoot: string, maxAgeMs = 15_000): Promise<ProjectState | null> {
  const cached = stateCache.get(projectRoot);
  if (cached && Date.now() - cached.at < maxAgeMs) return cached.state;
  return refreshProjectState(projectRoot);
}
