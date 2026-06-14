import path from 'node:path';
import chokidar, { type FSWatcher } from 'chokidar';
import { bus } from '../bus.js';
import { logger } from '../logger.js';
import { refreshProjectState } from './projectState.js';

/**
 * Watches a project's artifact directories (.ai, .human, docs, fitness,
 * tickets) and (a) broadcasts fs-changed, (b) regenerates state.json with a
 * debounce. dashboard/ itself is NOT watched to avoid regen feedback loops.
 */
const watchers = new Map<string, FSWatcher>();
const debounces = new Map<string, NodeJS.Timeout>();
const pendingPaths = new Map<string, Set<string>>();

const ARCHITECTURE_DIR = path.join('.ai', 'architecture');

/** True when a project-relative path lives under `.ai/architecture/`. */
function isArchitecturePath(relPath: string): boolean {
  return relPath === ARCHITECTURE_DIR || relPath.startsWith(`${ARCHITECTURE_DIR}${path.sep}`);
}

export function watchProject(projectId: string, projectRoot: string) {
  if (watchers.has(projectId)) return;
  const targets = ['.ai', '.human', 'docs', 'fitness', 'tickets'].map((d) => path.join(projectRoot, d));
  const watcher = chokidar.watch(targets, {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
  });

  watcher.on('all', (event, changedPath) => {
    const rel = path.relative(projectRoot, changedPath);
    let pend = pendingPaths.get(projectId);
    if (!pend) {
      pend = new Set();
      pendingPaths.set(projectId, pend);
    }
    pend.add(rel);

    const existing = debounces.get(projectId);
    if (existing) clearTimeout(existing);
    debounces.set(
      projectId,
      setTimeout(async () => {
        const paths = [...(pendingPaths.get(projectId) ?? [])];
        pendingPaths.delete(projectId);
        bus.broadcast({ type: 'fs-changed', projectId, paths });
        // The declared architecture model changed (e.g. /architect or a slice
        // merge rewrote it) — signal the Architecture tab to refetch (NFR-2).
        if (paths.some(isArchitecturePath)) {
          bus.broadcast({ type: 'architecture-changed', projectId });
        }
        bus.audit({
          source: 'fs',
          kind: 'artifact_changed',
          projectId,
          summary: paths.length === 1 ? `Artifact changed: ${paths[0]}` : `${paths.length} artifacts changed`,
          detail: { paths: paths.slice(0, 50) },
        });
        await refreshProjectState(projectRoot);
        bus.broadcast({ type: 'state-changed', projectId });
      }, 800),
    );
  });

  watcher.on('error', (err) => logger.warn({ err, projectRoot }, 'watcher error'));
  watchers.set(projectId, watcher);
  logger.info({ projectId, projectRoot }, 'watching project artifacts');
}

export function unwatchProject(projectId: string) {
  watchers.get(projectId)?.close();
  watchers.delete(projectId);
}
