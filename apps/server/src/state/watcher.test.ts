import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { ServerEvent } from '@sdlc/shared';

import { bus } from '../bus.js';
import { unwatchProject, watchProject } from './watcher.js';

/**
 * Integration test for the live property (NFR-2): an edit to the declared
 * architecture model under `.ai/architecture/` drives the debounced watcher to
 * broadcast an `architecture-changed` event, the signal the web client refetches
 * on. Real chokidar + a real tmp project — the watch is exercised, not mocked.
 */

const watchedProjects: string[] = [];
const tmpRoots: string[] = [];

afterEach(() => {
  for (const id of watchedProjects.splice(0)) unwatchProject(id);
  for (const root of tmpRoots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

/** A tmp project whose `.ai/architecture/02-components.md` exists to be touched. */
function makeWatchableProject(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-watch-'));
  fs.mkdirSync(path.join(root, '.ai', 'architecture'), { recursive: true });
  fs.writeFileSync(path.join(root, '.ai', 'architecture', '02-components.md'), '## Definitions\n');
  tmpRoots.push(root);
  return root;
}

/** Resolve with the first matching broadcast, or reject after `timeoutMs`. */
function waitForBroadcast(predicate: (event: ServerEvent) => boolean, timeoutMs: number): Promise<ServerEvent> {
  return new Promise((resolve, reject) => {
    const onEvent = (event: ServerEvent) => {
      if (!predicate(event)) return;
      cleanup();
      resolve(event);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timed out waiting for the broadcast'));
    }, timeoutMs);
    function cleanup() {
      clearTimeout(timer);
      bus.off('server-event', onEvent);
    }
    bus.on('server-event', onEvent);
  });
}

describe('watchProject — architecture-changed on a model edit (NFR-2)', () => {
  it('broadcasts architecture-changed for the project when the components model changes', async () => {
    const root = makeWatchableProject();
    const projectId = 'watch-test-project';
    watchProject(projectId, root);
    watchedProjects.push(projectId);

    // The watcher debounces 800ms + awaitWriteFinish ~300ms; give it headroom.
    const pending = waitForBroadcast(
      (e) => e.type === 'architecture-changed' && 'projectId' in e && e.projectId === projectId,
      5_000,
    );
    fs.appendFileSync(path.join(root, '.ai', 'architecture', '02-components.md'), '| Component |\n');

    const event = await pending;
    expect(event).toMatchObject({ type: 'architecture-changed', projectId });
  });
});
