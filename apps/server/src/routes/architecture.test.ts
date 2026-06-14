import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Fastify, { type FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import type { ProjectState } from '@sdlc/shared';

import { loadArchitecture, readArchitecture } from '../state/parseComponentsModel.js';

// apps/server/src/routes → repo root, to copy the real declared model.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const realModel = path.join(repoRoot, '.ai/architecture/02-components.md');
const realFeatures = path.join(repoRoot, '.ai/features.md');

/** A hermetic project dir whose declared model is a copy of the real one. */
function makeProjectWithModel(withFeatures = false): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-arch-proj-'));
  fs.mkdirSync(path.join(root, '.ai', 'architecture'), { recursive: true });
  fs.copyFileSync(realModel, path.join(root, '.ai', 'architecture', '02-components.md'));
  if (withFeatures) fs.copyFileSync(realFeatures, path.join(root, '.ai', 'features.md'));
  return root;
}

/** A minimal ProjectState whose `system-map` feature has a single in-progress slice. */
function makeStateWithSystemMap(root: string): ProjectState {
  return {
    root,
    projectName: 'p',
    generatedAt: '2026-06-14T10:00:00.000Z',
    generatedAtSha: null,
    foundation: {
      discover: { present: false, files: [] },
      understand: { present: false, files: [], hasContext: false },
      eventStorm: { present: false },
      featureMap: { present: false },
      anchor: { present: false, tier: '', projectType: '', language: '' },
      dddStrategy: { present: false },
      architect: { present: false, bundled: false, adrCount: 0 },
      bootstrap: { present: false, complete: false },
      explore: { present: false },
    },
    features: [
      {
        slug: 'system-map',
        status: 'Building',
        priority: 'P0',
        prdLink: null,
        specs: {},
        slices: [
          {
            id: 'SLICE-2',
            feature: 'system-map',
            title: 'Component inspector with the work join',
            status: 'in-progress',
            rawStatus: 'in_progress',
            type: 'feature',
            priority: 'P2',
            dependsOn: ['SLICE-1'],
            backendRefs: { beads: 'scc-byg' },
            file: '.ai/specs/system-map/issues/SLICE-2.md',
            lastActivity: null,
          },
        ],
        lastActivity: null,
        lastActivityDate: null,
      },
    ],
    fitness: { projectScope: [], perFeature: {}, hasCodeowners: false },
    progressTail: [],
    recentCommits: [],
    recentlyModified: [],
    nextActions: [],
  };
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
  it('returns 200 with the model, every node done as-built and unlinked when no state/features', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/projects/${knownId}/architecture` });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      components: Array<{ id: string; status: string; feature?: string; slices: unknown[] }>;
      edges: unknown[];
    };
    expect(body.components).toHaveLength(7);
    expect(body.edges).toHaveLength(10);
    // No features.md / no project state → every component is honestly unlinked,
    // status falling back to the coarse as-built done (never fabricated progress).
    expect(body.components.every((c) => c.status === 'done')).toBe(true);
    expect(body.components.every((c) => c.feature === undefined && c.slices.length === 0)).toBe(true);
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
    const modelReads = readSpy.mock.calls.filter((call) =>
      String(call[0]).startsWith(root) && String(call[0]).endsWith('02-components.md'),
    ).length;
    readSpy.mockRestore();

    expect(modelReads).toBe(1);
  });
});

describe('loadArchitecture — the work join off the request path', () => {
  it('enriches the mapped component with real status, feature, slices and issue refs', () => {
    const root = makeProjectWithModel(true);
    tmpRoots.push(root);
    const state = makeStateWithSystemMap(root);

    // Cold cache for this root → join runs once and is cached.
    const model = loadArchitecture(root, state, 0);
    expect(model).not.toBeNull();
    const derive = model!.components.find((c) => c.id === 'DeriveProjectState');
    expect(derive?.status).toBe('in-progress');
    expect(derive?.feature).toBe('system-map');
    expect(derive?.slices).toHaveLength(1);
    expect(derive!.slices[0]).toMatchObject({ id: 'SLICE-2', issueRefs: { beads: 'scc-byg' } });
  });

  it('leaves a component with no mapped feature honestly unlinked and done as-built', () => {
    const root = makeProjectWithModel(true);
    tmpRoots.push(root);
    const state = makeStateWithSystemMap(root);

    const model = loadArchitecture(root, state, 0);
    // RunClaudeSessions is satisfied by no feature in the (real) features.md →
    // it must not be synthesized into the system-map join.
    const run = model!.components.find((c) => c.id === 'RunClaudeSessions');
    expect(run?.feature).toBeUndefined();
    expect(run?.slices).toHaveLength(0);
    expect(run?.status).toBe('done');
  });

  it('reads features.md off the request path — joins once per TTL window (NFR-4)', () => {
    const root = makeProjectWithModel(true);
    tmpRoots.push(root);
    const state = makeStateWithSystemMap(root);

    const readSpy = vi.spyOn(fs, 'readFileSync');
    loadArchitecture(root, state); // cold build, default TTL
    loadArchitecture(root, state); // warm hit — must not re-read features.md
    const featuresReads = readSpy.mock.calls.filter((call) =>
      String(call[0]).startsWith(root) && String(call[0]).endsWith('features.md'),
    ).length;
    readSpy.mockRestore();

    expect(featuresReads).toBe(1);
  });
});

describe('readArchitecture — reports cache_hit for the serve-latency log (NFR-1)', () => {
  it('reports cacheHit=false on the cold build and true on the warm hit', () => {
    const root = makeProjectWithModel();
    tmpRoots.push(root);

    const cold = readArchitecture(root, null); // cold: parse + derive, then cache
    expect(cold.model).not.toBeNull();
    expect(cold.cacheHit).toBe(false);

    const warm = readArchitecture(root, null); // warm: served from the per-TTL cache
    expect(warm.model).not.toBeNull();
    expect(warm.cacheHit).toBe(true);
  });

  it('reports cacheHit=false with a null model when the project declares no model', () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'sdlc-arch-empty-'));
    tmpRoots.push(empty);

    const res = readArchitecture(empty, null);
    expect(res.model).toBeNull();
    expect(res.cacheHit).toBe(false);
  });
});
