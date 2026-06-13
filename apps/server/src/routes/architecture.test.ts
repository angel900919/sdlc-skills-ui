import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Fastify, { type FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// apps/server/src/routes → repo root, to copy the real declared model.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const realModel = path.join(repoRoot, '.ai/architecture/02-components.md');

/** A hermetic project dir whose declared model is a copy of the real one. */
function makeProjectWithModel(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-arch-proj-'));
  fs.mkdirSync(path.join(root, '.ai', 'architecture'), { recursive: true });
  fs.copyFileSync(realModel, path.join(root, '.ai', 'architecture', '02-components.md'));
  return root;
}

const tmpRoots: string[] = [];
let app: FastifyInstance;
let dataDir: string;
let knownId: string;
let addProject: (rootPath: string, name?: string) => { id: string };

beforeAll(async () => {
  // Point the SQLite store at a throwaway dir BEFORE the db-touching modules load.
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-arch-data-'));
  process.env.SDLC_DATA_DIR = dataDir;

  const projectRoot = makeProjectWithModel();
  tmpRoots.push(projectRoot);

  ({ addProject } = await import('../state/projects.js'));
  const { registerApiRoutes } = await import('./api.js');
  knownId = addProject(projectRoot, 'arch-test').id;

  app = Fastify();
  registerApiRoutes(app);
  await app.ready();
});

afterAll(async () => {
  await app?.close();
  for (const root of tmpRoots) fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('GET /api/projects/:id/architecture', () => {
  it('returns 200 with the derived, status-colored model for a known project', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/projects/${knownId}/architecture` });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      components: Array<{ id: string; status: string }>;
      edges: unknown[];
    };
    expect(body.components).toHaveLength(7);
    expect(body.edges).toHaveLength(10);
    // every node carries a derived status (coarse as-built = done in slice 1).
    expect(body.components.every((c) => c.status === 'done')).toBe(true);
  });

  it('returns 404 for an unknown project', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/projects/no-such-project/architecture' });
    expect(res.statusCode).toBe(404);
  });

  it('parses off the request path — reads the model once across repeated calls (NFR-4)', async () => {
    // A fresh project → cold cache, so the read count is attributable to this test.
    const root = makeProjectWithModel();
    tmpRoots.push(root);
    const id = addProject(root, 'arch-cache').id;

    const readSpy = vi.spyOn(fs, 'readFileSync');
    await app.inject({ method: 'GET', url: `/api/projects/${id}/architecture` });
    await app.inject({ method: 'GET', url: `/api/projects/${id}/architecture` });
    const modelReads = readSpy.mock.calls.filter((call) => String(call[0]).startsWith(root)).length;
    readSpy.mockRestore();

    expect(modelReads).toBe(1);
  });
});
