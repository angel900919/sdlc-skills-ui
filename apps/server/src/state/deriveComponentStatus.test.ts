import { describe, expect, it } from 'vitest';

import type {
  ComponentDecl,
  FeatureSliceState,
  FeatureState,
  ProjectState,
} from '@sdlc/shared';

import { joinComponentWork } from './deriveComponentStatus.js';
import { parseComponentFeatureMap } from './parseComponentsModel.js';

// Local builders (factory fixture style, test-strategy.md § Fixture & factory).
// makeState/makeFeature/makeSlice mirror the recovered idiom in
// stageModel.test.ts; promotion to packages/shared/src/testing/builders.ts is
// the documented second-use follow-up, out of this slice's file boundary.
function makeSlice(overrides: Partial<FeatureSliceState> = {}): FeatureSliceState {
  return {
    id: 'SLICE-1',
    feature: 'system-map',
    title: 'tracer bullet',
    status: 'merged',
    rawStatus: 'merged',
    type: 'feature',
    priority: 'P1',
    dependsOn: [],
    backendRefs: {},
    file: '.ai/specs/system-map/issues/SLICE-1.md',
    lastActivity: null,
    ...overrides,
  };
}

function makeFeature(overrides: Partial<FeatureState> = {}): FeatureState {
  return {
    slug: 'system-map',
    status: 'Building',
    priority: 'P0',
    prdLink: null,
    specs: {},
    slices: [],
    lastActivity: null,
    lastActivityDate: null,
    ...overrides,
  };
}

function makeState(features: FeatureState[] = []): ProjectState {
  return {
    root: '/p',
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
    features,
    fitness: { projectScope: [], perFeature: {}, hasCodeowners: false },
    progressTail: [],
    recentCommits: [],
    recentlyModified: [],
    nextActions: [],
  };
}

function makeComponent(id: string): ComponentDecl {
  return { id, role: 'does a thing', livesAt: 'src/x', apiBearing: false };
}

describe('joinComponentWork — work join + status derivation', () => {
  it('joins the component to its feature, slices, and issue refs (R-2)', () => {
    const slice = makeSlice({
      id: 'SLICE-2',
      status: 'in-progress',
      backendRefs: { beads: 'scc-byg' },
    });
    const state = makeState([makeFeature({ slug: 'system-map', slices: [slice] })]);
    const map = new Map([['DeriveProjectState', ['system-map']]]);

    const join = joinComponentWork(makeComponent('DeriveProjectState'), map, state);

    expect(join.feature).toBe('system-map');
    expect(join.slices).toHaveLength(1);
    expect(join.slices[0]).toMatchObject({
      id: 'SLICE-2',
      title: 'tracer bullet',
      status: 'in-progress',
      issueRefs: { beads: 'scc-byg' },
    });
  });

  it('maps all-merged slices to done', () => {
    const state = makeState([
      makeFeature({ slices: [makeSlice({ status: 'merged' }), makeSlice({ id: 'SLICE-2', status: 'merged' })] }),
    ]);
    const map = new Map([['ShareDomainModel', ['system-map']]]);

    expect(joinComponentWork(makeComponent('ShareDomainModel'), map, state).status).toBe('done');
  });

  it('maps any in-progress slice to in-progress', () => {
    const state = makeState([
      makeFeature({ slices: [makeSlice({ status: 'merged' }), makeSlice({ id: 'SLICE-2', status: 'in-progress' })] }),
    ]);
    const map = new Map([['DeriveProjectState', ['system-map']]]);

    expect(joinComponentWork(makeComponent('DeriveProjectState'), map, state).status).toBe('in-progress');
  });

  it('maps any blocked slice to blocked — blocked outranks in-progress', () => {
    const state = makeState([
      makeFeature({
        slices: [makeSlice({ status: 'in-progress' }), makeSlice({ id: 'SLICE-2', status: 'blocked' })],
      }),
    ]);
    const map = new Map([['DeriveProjectState', ['system-map']]]);

    expect(joinComponentWork(makeComponent('DeriveProjectState'), map, state).status).toBe('blocked');
  });

  it('falls back to done as-built for a component with no resolvable feature (unlinked)', () => {
    const state = makeState([makeFeature({ slug: 'system-map', slices: [makeSlice()] })]);
    const emptyMap = new Map<string, string[]>();

    const join = joinComponentWork(makeComponent('PersistAndBroadcast'), emptyMap, state);

    expect(join.feature).toBeUndefined();
    expect(join.slices).toHaveLength(0);
    expect(join.status).toBe('done');
  });

  it('falls back to done as-built when the mapped feature is absent from project state', () => {
    const state = makeState([]); // no features generated yet
    const map = new Map([['DeriveProjectState', ['system-map']]]);

    const join = joinComponentWork(makeComponent('DeriveProjectState'), map, state);

    expect(join.feature).toBeUndefined();
    expect(join.slices).toHaveLength(0);
    expect(join.status).toBe('done');
  });

  it('treats removed slices as not counting toward progress (all-merged-or-removed → done)', () => {
    const state = makeState([
      makeFeature({ slices: [makeSlice({ status: 'merged' }), makeSlice({ id: 'SLICE-2', status: 'removed' })] }),
    ]);
    const map = new Map([['ShareDomainModel', ['system-map']]]);

    expect(joinComponentWork(makeComponent('ShareDomainModel'), map, state).status).toBe('done');
  });
});

describe('parseComponentFeatureMap — inverts features.md satisfies column', () => {
  const featuresMd = [
    '| id | title | priority | status | tier | depends_on | satisfies |',
    '| :-- | :-- | :-- | :-- | :-- | :-- | :-- |',
    '| system-map | Architecture tab | P0 | building | mvp | — | DeriveProjectState, RenderFlightDeck, ShareDomainModel · behavior: orient-on-system-shape (new — fold in) |',
    '| transcript-search | FTS search | — | shipped | mvp | — | PersistAndBroadcast (FTS5) |',
  ].join('\n');

  it('inverts feature→components into component→features', () => {
    const map = parseComponentFeatureMap(featuresMd);

    expect(map.get('DeriveProjectState')).toEqual(['system-map']);
    expect(map.get('RenderFlightDeck')).toEqual(['system-map']);
    expect(map.get('PersistAndBroadcast')).toEqual(['transcript-search']);
  });

  it('strips the · behavior annotation and parenthetical notes from component names', () => {
    const map = parseComponentFeatureMap(featuresMd);

    // "ShareDomainModel · behavior: …" must yield the bare component name.
    expect(map.has('ShareDomainModel')).toBe(true);
    expect([...map.keys()]).not.toContain('ShareDomainModel · behavior: orient-on-system-shape');
    // "PersistAndBroadcast (FTS5)" must drop the parenthetical.
    expect(map.has('PersistAndBroadcast')).toBe(true);
    expect([...map.keys()]).not.toContain('PersistAndBroadcast (FTS5)');
  });

  it('collects multiple features under one component', () => {
    const md = [
      '| id | title | priority | status | tier | depends_on | satisfies |',
      '| :-- | :-- | :-- | :-- | :-- | :-- | :-- |',
      '| feat-a | A | — | shipped | mvp | — | DeriveProjectState |',
      '| feat-b | B | — | shipped | mvp | — | DeriveProjectState, ShareDomainModel |',
    ].join('\n');

    expect(parseComponentFeatureMap(md).get('DeriveProjectState')).toEqual(['feat-a', 'feat-b']);
  });

  it('returns an empty map when there is no satisfies column', () => {
    const md = ['| id | title |', '| :-- | :-- |', '| feat-a | A |'].join('\n');

    expect(parseComponentFeatureMap(md).size).toBe(0);
  });
});
