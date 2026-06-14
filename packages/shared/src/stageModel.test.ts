import { describe, expect, it } from 'vitest';
import type { FeatureSliceState, FeatureState, ProjectState } from './types.js';
import { featureStageStatus, foundationStageStatus, phaseForSkill } from './stageModel.js';

type Foundation = ProjectState['foundation'];

function makeState(foundation: Partial<Foundation> = {}): ProjectState {
  return {
    root: '/p',
    projectName: 'p',
    generatedAt: at(),
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
      ...foundation,
    },
    features: [],
    fitness: { projectScope: [], perFeature: {}, hasCodeowners: false },
    progressTail: [],
    recentCommits: [],
    recentlyModified: [],
    nextActions: [],
    drift: [],
  };
}

function at(): string {
  return '2026-06-11T10:00:00.000Z';
}

function makeFeature(overrides: Partial<FeatureState> = {}): FeatureState {
  return {
    slug: 'kanban-board',
    status: 'Planned',
    priority: 'P1',
    prdLink: null,
    specs: {},
    slices: [],
    lastActivity: null,
    lastActivityDate: null,
    ...overrides,
  };
}

function makeSlice(overrides: Partial<FeatureSliceState> = {}): FeatureSliceState {
  return {
    id: 'SLICE-1',
    feature: 'kanban-board',
    title: 'tracer bullet',
    status: 'planned',
    rawStatus: 'planned',
    type: 'feature',
    priority: 'P1',
    dependsOn: [],
    backendRefs: {},
    file: '.ai/specs/kanban-board/issues/SLICE-1.md',
    lastActivity: null,
    ...overrides,
  };
}

describe('foundationStageStatus', () => {
  it('maps simple present flags to done/pending', () => {
    const empty = makeState();
    expect(foundationStageStatus(empty, 'discovery')).toBe('pending');
    expect(foundationStageStatus(empty, 'understand')).toBe('pending');
    expect(foundationStageStatus(empty, 'anchor')).toBe('pending');
    expect(foundationStageStatus(empty, 'architect')).toBe('pending');

    const full = makeState({
      discover: { present: true, files: ['.ai/discovery/x.md'] },
      understand: { present: true, files: ['.ai/understanding/x.md'], hasContext: true },
      anchor: { present: true, tier: 'mvp', projectType: 'web', language: 'ts' },
      architect: { present: true, bundled: true, adrCount: 3 },
    });
    expect(foundationStageStatus(full, 'discovery')).toBe('done');
    expect(foundationStageStatus(full, 'understand')).toBe('done');
    expect(foundationStageStatus(full, 'anchor')).toBe('done');
    expect(foundationStageStatus(full, 'architect')).toBe('done');
  });

  it('infers intake/onboard from downstream artifacts (discover or anchor)', () => {
    expect(foundationStageStatus(makeState(), 'intake')).toBe('pending');
    expect(foundationStageStatus(makeState(), 'onboard')).toBe('pending');

    const viaDiscover = makeState({ discover: { present: true, files: [] } });
    expect(foundationStageStatus(viaDiscover, 'intake')).toBe('done');

    const viaAnchor = makeState({
      anchor: { present: true, tier: 'prototype', projectType: 'cli', language: 'ts' },
    });
    expect(foundationStageStatus(viaAnchor, 'onboard')).toBe('done');
  });

  it('treats absent optional stages as skipped, not pending', () => {
    const state = makeState();
    expect(foundationStageStatus(state, 'event-storm')).toBe('skipped');
    expect(foundationStageStatus(state, 'ddd-strategy')).toBe('skipped');

    const withBoth = makeState({
      eventStorm: { present: true },
      dddStrategy: { present: true },
    });
    expect(foundationStageStatus(withBoth, 'event-storm')).toBe('done');
    expect(foundationStageStatus(withBoth, 'ddd-strategy')).toBe('done');
  });

  it('reports bootstrap as pending → in-progress → done', () => {
    expect(foundationStageStatus(makeState(), 'bootstrap')).toBe('pending');
    expect(
      foundationStageStatus(makeState({ bootstrap: { present: true, complete: false } }), 'bootstrap'),
    ).toBe('in-progress');
    expect(
      foundationStageStatus(makeState({ bootstrap: { present: true, complete: true } }), 'bootstrap'),
    ).toBe('done');
  });

  it('shares one flag between greenfield/brownfield aliases', () => {
    const state = makeState({ understand: { present: true, files: [], hasContext: false } });
    expect(foundationStageStatus(state, 'understand')).toBe('done');
    expect(foundationStageStatus(state, 'comprehend')).toBe('done');

    const census = makeState({ featureMap: { present: true } });
    expect(foundationStageStatus(census, 'feature-map')).toBe('done');
    expect(foundationStageStatus(census, 'feature-census')).toBe('done');
  });

  it('falls back to a camelCased extra foundation key for unmapped stages', () => {
    const state = makeState({ testStrategy: { present: true } } as Partial<Foundation>);
    expect(foundationStageStatus(state, 'test-strategy')).toBe('done');
    expect(foundationStageStatus(makeState(), 'test-strategy')).toBe('pending');
    // Stage the generator knows nothing about → pending, never a crash.
    expect(foundationStageStatus(makeState(), 'no-such-stage')).toBe('pending');
  });
});

describe('featureStageStatus', () => {
  it('maps spec presence for prd/design/plan and skips absent research', () => {
    const bare = makeFeature();
    expect(featureStageStatus(bare, 'prd')).toBe('pending');
    expect(featureStageStatus(bare, 'design')).toBe('pending');
    expect(featureStageStatus(bare, 'plan')).toBe('pending');
    expect(featureStageStatus(bare, 'research')).toBe('skipped');

    const specced = makeFeature({ specs: { prd: true, design: true, plan: true, research: true } });
    expect(featureStageStatus(specced, 'prd')).toBe('done');
    expect(featureStageStatus(specced, 'design')).toBe('done');
    expect(featureStageStatus(specced, 'plan')).toBe('done');
    expect(featureStageStatus(specced, 'research')).toBe('done');
  });

  it('marks to-issues done once slices exist', () => {
    expect(featureStageStatus(makeFeature(), 'to-issues')).toBe('pending');
    expect(featureStageStatus(makeFeature({ slices: [makeSlice()] }), 'to-issues')).toBe('done');
  });

  it('marks publish-issues done when any slice has backend refs or left planned status', () => {
    const planned = makeFeature({ slices: [makeSlice()] });
    expect(featureStageStatus(planned, 'publish-issues')).toBe('pending');

    const withRefs = makeFeature({ slices: [makeSlice({ backendRefs: { beads: 'bd-12' } })] });
    expect(featureStageStatus(withRefs, 'publish-issues')).toBe('done');

    const inFlight = makeFeature({ slices: [makeSlice({ status: 'in-progress' })] });
    expect(featureStageStatus(inFlight, 'publish-issues')).toBe('done');
  });

  it('derives the execution stages from live slice statuses', () => {
    for (const stage of ['build', 'mtdd-implement', 'mtdd-review', 'mtdd-verify', 'mtdd-merge']) {
      expect(featureStageStatus(makeFeature(), stage)).toBe('pending');

      const allMerged = makeFeature({
        slices: [makeSlice({ status: 'merged' }), makeSlice({ id: 'SLICE-2', status: 'merged' })],
      });
      expect(featureStageStatus(allMerged, stage)).toBe('done');

      const someInProgress = makeFeature({
        slices: [makeSlice({ status: 'merged' }), makeSlice({ id: 'SLICE-2', status: 'in-progress' })],
      });
      expect(featureStageStatus(someInProgress, stage)).toBe('in-progress');

      // No slice in progress, but the feature itself is flagged Building.
      const building = makeFeature({ status: 'Building', slices: [makeSlice()] });
      expect(featureStageStatus(building, stage)).toBe('in-progress');

      const idle = makeFeature({ status: 'Planned', slices: [makeSlice()] });
      expect(featureStageStatus(idle, stage)).toBe('pending');
    }
  });

  it('ignores removed slices when judging execution completion', () => {
    const feature = makeFeature({
      slices: [
        makeSlice({ status: 'merged' }),
        makeSlice({ id: 'SLICE-2', status: 'removed' }),
      ],
    });
    expect(featureStageStatus(feature, 'build')).toBe('done');

    const onlyRemoved = makeFeature({ slices: [makeSlice({ status: 'removed' })] });
    expect(featureStageStatus(onlyRemoved, 'build')).toBe('pending');
  });

  it('marks qa done via qa-report spec OR QA-Approved status', () => {
    expect(featureStageStatus(makeFeature(), 'qa')).toBe('pending');
    expect(featureStageStatus(makeFeature({ specs: { qaReport: true } }), 'qa')).toBe('done');
    expect(featureStageStatus(makeFeature({ status: 'QA-Approved' }), 'qa')).toBe('done');
  });

  it('maps ship and post-delivery stages', () => {
    expect(featureStageStatus(makeFeature(), 'ship')).toBe('pending');
    expect(featureStageStatus(makeFeature({ status: 'Shipped' }), 'ship')).toBe('done');
    expect(featureStageStatus(makeFeature(), 'as-built')).toBe('skipped');
    expect(featureStageStatus(makeFeature({ specs: { asBuilt: true } }), 'as-built')).toBe('done');
    expect(featureStageStatus(makeFeature(), 'unknown-stage')).toBe('pending');
  });
});

describe('phaseForSkill', () => {
  it('classifies stages, cross-cutting skills and utilities', () => {
    expect(phaseForSkill('anchor')).toBe('foundation');
    expect(phaseForSkill('prd')).toBe('per-feature');
    expect(phaseForSkill('mtdd-implement')).toBe('execution');
    expect(phaseForSkill('qa')).toBe('qa-release');
    expect(phaseForSkill('measure')).toBe('post-delivery');
    expect(phaseForSkill('status')).toBe('cross-cutting');
    expect(phaseForSkill('mermaid')).toBe('utility');
    expect(phaseForSkill('never-heard-of-it')).toBe('utility');
  });
});
