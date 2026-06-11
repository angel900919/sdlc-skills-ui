/**
 * The SDLC stage model — encodes the skill chain documented in
 * .claude/skills/README.md as a graph the dashboard can render and reason
 * about. Verdict routing stays with the user/skills; this model is the map,
 * not the driver.
 */
import type { ProjectState } from './types.js';

export type StagePhase =
  | 'foundation'
  | 'per-feature'
  | 'execution'
  | 'qa-release'
  | 'post-delivery'
  | 'cross-cutting'
  | 'utility';

export interface StageDef {
  /** Skill name == slash command (without leading slash). */
  id: string;
  title: string;
  phase: StagePhase;
  optional: boolean;
  /** Which workflow branches include this stage. */
  branches: ('greenfield' | 'brownfield')[];
  /** Human description of the gate / artifact. */
  artifact: string;
  /** Default next stages (primary verdict routing). */
  next: string[];
}

export const FOUNDATION_GREENFIELD: StageDef[] = [
  { id: 'intake', title: 'Intake', phase: 'foundation', optional: false, branches: ['greenfield'], artifact: '.ai/intake.md', next: ['discovery'] },
  { id: 'discovery', title: 'Discovery', phase: 'foundation', optional: false, branches: ['greenfield'], artifact: '.ai/discovery/<slug>.md', next: ['understand'] },
  { id: 'understand', title: 'Understand', phase: 'foundation', optional: false, branches: ['greenfield'], artifact: '.ai/understanding/<slug>.md', next: ['feature-map', 'event-storm'] },
  { id: 'event-storm', title: 'Event Storm', phase: 'foundation', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/architecture/domain-model.md', next: ['feature-map'] },
  { id: 'feature-map', title: 'Feature Map', phase: 'foundation', optional: false, branches: ['greenfield'], artifact: '.ai/features.md', next: ['anchor'] },
  { id: 'anchor', title: 'Anchor', phase: 'foundation', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/anchor.md', next: ['architect', 'ddd-strategy'] },
  { id: 'ddd-strategy', title: 'DDD Strategy', phase: 'foundation', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/architecture/strategic-design.md', next: ['architect'] },
  { id: 'architect', title: 'Architect', phase: 'foundation', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/architecture[.md|/]', next: ['threat-model', 'ux-spec', 'test-strategy'] },
  { id: 'threat-model', title: 'Threat Model', phase: 'foundation', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/architecture/threat-model.md', next: ['test-strategy'] },
  { id: 'ux-spec', title: 'UX Spec', phase: 'foundation', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/design-system.md', next: ['test-strategy'] },
  { id: 'test-strategy', title: 'Test Strategy', phase: 'foundation', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/test-strategy.md', next: ['data-management', 'bootstrap'] },
  { id: 'data-management', title: 'Data Management', phase: 'foundation', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/data-management.md', next: ['bootstrap'] },
  { id: 'bootstrap', title: 'Bootstrap', phase: 'foundation', optional: false, branches: ['greenfield'], artifact: '.ai/bootstrap.md', next: ['environments'] },
  { id: 'environments', title: 'Environments', phase: 'foundation', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/environments.md', next: ['pipeline'] },
  { id: 'pipeline', title: 'Pipeline', phase: 'foundation', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/pipeline.md', next: ['prd'] },
];

export const FOUNDATION_BROWNFIELD: StageDef[] = [
  { id: 'onboard', title: 'Onboard', phase: 'foundation', optional: false, branches: ['brownfield'], artifact: '.ai/intake.md', next: ['anchor'] },
  { id: 'explore', title: 'Explore', phase: 'foundation', optional: false, branches: ['brownfield'], artifact: '.ai/recon.md', next: ['environments'] },
  { id: 'comprehend', title: 'Comprehend', phase: 'foundation', optional: false, branches: ['brownfield'], artifact: '.ai/understanding/<slug>.md', next: ['architect'] },
  { id: 'health-audit', title: 'Health Audit', phase: 'foundation', optional: true, branches: ['brownfield'], artifact: '.ai/health-report.md', next: ['feature-census'] },
  { id: 'feature-census', title: 'Feature Census', phase: 'foundation', optional: false, branches: ['brownfield'], artifact: '.ai/features.md', next: ['test-strategy'] },
];

export const PER_FEATURE: StageDef[] = [
  { id: 'prd', title: 'PRD', phase: 'per-feature', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/prd.md', next: ['ux-spec', 'research', 'design'] },
  { id: 'research', title: 'Research', phase: 'per-feature', optional: true, branches: ['brownfield'], artifact: '.ai/specs/<feature>/research.md', next: ['design'] },
  { id: 'design', title: 'Design (LLD)', phase: 'per-feature', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/design.md', next: ['to-fitness', 'plan'] },
  { id: 'to-fitness', title: 'Fitness Functions', phase: 'per-feature', optional: true, branches: ['greenfield', 'brownfield'], artifact: 'fitness/<feature>/*', next: ['plan'] },
  { id: 'plan', title: 'Plan', phase: 'per-feature', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/plan.md', next: ['to-issues'] },
  { id: 'to-issues', title: 'To Issues', phase: 'per-feature', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/issues/SLICE-N.md', next: ['publish-issues'] },
  { id: 'publish-issues', title: 'Publish Issues', phase: 'per-feature', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'tracker refs in SLICE-N.md', next: ['build'] },
];

export const EXECUTION: StageDef[] = [
  { id: 'build', title: 'Build (queue)', phase: 'execution', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'routes next slice', next: ['mtdd-implement', 'qa'] },
  { id: 'mtdd-implement', title: 'Implement', phase: 'execution', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'feature branch commits', next: ['mtdd-review'] },
  { id: 'mtdd-review', title: 'Review', phase: 'execution', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'COMPLETE | REJECT', next: ['mtdd-verify', 'mtdd-implement'] },
  { id: 'mtdd-verify', title: 'Verify', phase: 'execution', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'PASS | FAIL', next: ['mtdd-merge', 'mtdd-implement'] },
  { id: 'mtdd-merge', title: 'Merge', phase: 'execution', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'merged slice + tracker entry', next: ['build'] },
];

export const QA_RELEASE: StageDef[] = [
  { id: 'qa', title: 'QA Gate', phase: 'qa-release', optional: false, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/qa-report.md', next: ['runbook', 'docs', 'ship'] },
  { id: 'runbook', title: 'Runbook', phase: 'qa-release', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/runbooks/<feature>.md', next: ['docs', 'ship'] },
  { id: 'docs', title: 'Docs', phase: 'qa-release', optional: true, branches: ['greenfield', 'brownfield'], artifact: 'docs/<feature>.md', next: ['ship'] },
  { id: 'ship', title: 'Ship', phase: 'qa-release', optional: false, branches: ['greenfield', 'brownfield'], artifact: 'features.md → shipped', next: ['measure', 'as-built'] },
];

export const POST_DELIVERY: StageDef[] = [
  { id: 'measure', title: 'Measure', phase: 'post-delivery', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/outcome.md', next: [] },
  { id: 'as-built', title: 'As-Built', phase: 'post-delivery', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/as-built.md', next: [] },
  { id: 'sunset', title: 'Sunset', phase: 'post-delivery', optional: true, branches: ['greenfield', 'brownfield'], artifact: '.ai/specs/<feature>/sunset.md', next: [] },
];

export const CROSS_CUTTING_SKILLS = [
  'status', 'next', 'coherence-check', 'critic', 'promote', 'diagnose', 'triage',
  'improve-codebase-architecture', 'handoff-session',
];

export const UTILITY_SKILLS = [
  'mermaid', 'write-a-skill', 'using-beads', 'research-report', 'mtdd-init', 'mtdd-cycle',
];

export const ALL_STAGES: StageDef[] = [
  ...FOUNDATION_GREENFIELD,
  ...FOUNDATION_BROWNFIELD,
  ...PER_FEATURE,
  ...EXECUTION,
  ...QA_RELEASE,
  ...POST_DELIVERY,
];

export function phaseForSkill(name: string): StagePhase {
  const stage = ALL_STAGES.find((s) => s.id === name);
  if (stage) return stage.phase;
  if (CROSS_CUTTING_SKILLS.includes(name)) return 'cross-cutting';
  return 'utility';
}

export type StageStatus = 'done' | 'in-progress' | 'pending' | 'skipped' | 'blocked';

/**
 * Map project-state foundation flags onto foundation stage statuses.
 * Per-feature stages get status per feature elsewhere (FeatureState.specs).
 */
export function foundationStageStatus(state: ProjectState, stageId: string): StageStatus {
  const f = state.foundation;
  const present = (v: { present: boolean } | undefined) => (v?.present ? 'done' : 'pending');
  switch (stageId) {
    case 'intake':
    case 'onboard':
      // intake.md isn't surfaced by project-state.py; infer from downstream artifacts
      return f.discover.present || f.anchor.present ? 'done' : 'pending';
    case 'discovery': return present(f.discover);
    case 'understand':
    case 'comprehend': return present(f.understand);
    case 'event-storm': return f.eventStorm.present ? 'done' : 'skipped';
    case 'feature-map':
    case 'feature-census': return present(f.featureMap);
    case 'anchor': return present(f.anchor);
    case 'ddd-strategy': return f.dddStrategy.present ? 'done' : 'skipped';
    case 'architect': return present(f.architect);
    case 'bootstrap': return f.bootstrap.complete ? 'done' : f.bootstrap.present ? 'in-progress' : 'pending';
    case 'explore': return present(f.explore);
    default: {
      const extra = f[camelCase(stageId)];
      if (extra && typeof extra.present === 'boolean') return extra.present ? 'done' : 'pending';
      return 'pending';
    }
  }
}

function camelCase(id: string): string {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/** Per-feature stage completion derived from FeatureState.specs + status. */
export function featureStageStatus(
  feature: import('./types.js').FeatureState,
  stageId: string,
): StageStatus {
  const specs = feature.specs;
  switch (stageId) {
    case 'prd': return specs.prd ? 'done' : 'pending';
    case 'research': return specs.research ? 'done' : 'skipped';
    case 'design': return specs.design ? 'done' : 'pending';
    case 'plan': return specs.plan ? 'done' : 'pending';
    case 'to-issues': return feature.slices.length > 0 ? 'done' : 'pending';
    case 'publish-issues':
      return feature.slices.some((s) => Object.keys(s.backendRefs).length > 0 || s.status !== 'planned')
        ? 'done' : 'pending';
    case 'build':
    case 'mtdd-implement':
    case 'mtdd-review':
    case 'mtdd-verify':
    case 'mtdd-merge': {
      const live = feature.slices.filter((s) => s.status !== 'removed');
      if (live.length === 0) return 'pending';
      if (live.every((s) => s.status === 'merged')) return 'done';
      if (live.some((s) => s.status === 'in-progress')) return 'in-progress';
      return feature.status === 'Building' ? 'in-progress' : 'pending';
    }
    case 'qa':
      return specs.qaReport ? 'done' : feature.status === 'QA-Approved' ? 'done' : 'pending';
    case 'ship': return feature.status === 'Shipped' ? 'done' : 'pending';
    case 'as-built': return specs.asBuilt ? 'done' : 'skipped';
    default: return 'pending';
  }
}
