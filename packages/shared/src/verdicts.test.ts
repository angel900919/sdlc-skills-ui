import { describe, expect, it } from 'vitest';
import { extractVerdicts, nextSkillFor, verdictAdvances } from './verdicts.js';

describe('extractVerdicts', () => {
  it('finds chain verdict tokens in assistant text', () => {
    const text = 'All slices merged and verified.\n\n**Verdict: READY-FOR-QA** — run /qa checkout next.';
    expect(extractVerdicts(text)).toEqual([{ token: 'READY-FOR-QA', blockedReason: null }]);
  });

  it('finds every advancing token of the chain vocabulary', () => {
    for (const token of [
      'READY-FOR-MTDD',
      'READY-FOR-QA',
      'READY-FOR-BUILD',
      'READY-FOR-SHIP',
      'READY-TO-PUBLISH',
      'READY-FOR-ISSUES',
    ]) {
      expect(extractVerdicts(`status: ${token} ok`)).toEqual([{ token, blockedReason: null }]);
    }
  });

  it('captures the reason after BLOCKED-ON', () => {
    expect(extractVerdicts('Cannot continue. BLOCKED-ON: SLICE-2 depends on unmerged SLICE-1.')).toEqual([
      { token: 'BLOCKED-ON', blockedReason: 'SLICE-2 depends on unmerged SLICE-1.' },
    ]);
  });

  it('treats hyphenated quick-spec blockers as their own tokens, not BLOCKED-ON', () => {
    expect(extractVerdicts('No anchor on disk. BLOCKED-ON-ANCHOR → /anchor')).toEqual([
      { token: 'BLOCKED-ON-ANCHOR', blockedReason: '→ /anchor' },
    ]);
    expect(extractVerdicts('BLOCKED-ON-ARCHITECTURE → /architect first.')).toEqual([
      { token: 'BLOCKED-ON-ARCHITECTURE', blockedReason: '→ /architect first.' },
    ]);
  });

  it('captures the trailing text of halting verdicts as context', () => {
    expect(extractVerdicts('Tier gate fired. NEEDS-FULL-CHAIN → /prd checkout — money signal.')).toEqual([
      { token: 'NEEDS-FULL-CHAIN', blockedReason: '→ /prd checkout — money signal.' },
    ]);
    expect(extractVerdicts('Partial trio found. RESUME-FULL-CHAIN → /design checkout')).toEqual([
      { token: 'RESUME-FULL-CHAIN', blockedReason: '→ /design checkout' },
    ]);
    expect(extractVerdicts('Verdict: NEEDS-ARCHITECTURE-UPDATE')).toEqual([
      { token: 'NEEDS-ARCHITECTURE-UPDATE', blockedReason: null },
    ]);
  });

  it('ignores hyphenated continuations outside the vocabulary instead of firing BLOCKED-ON', () => {
    expect(extractVerdicts('BLOCKED-ON-SOMETHING-ELSE entirely')).toEqual([]);
  });

  it('finds foundation, post-ship, and cross-cutting stage verdicts', () => {
    for (const token of [
      'READY-FOR-ARCHITECT',
      'PIPELINE-LOCKED',
      'ENVIRONMENTS-LOCKED',
      'AUDIT-COMPLETE',
      'DOCS-WRITTEN',
      'METRIC-MET',
      'CRITIC-PASS',
      'SKIPPED-PROTOTYPE',
    ]) {
      expect(extractVerdicts(`status: ${token} ok`)).toEqual([{ token, blockedReason: null }]);
    }
  });

  it('matches the longest token when one is a prefix of another', () => {
    expect(extractVerdicts('Verdict: THREAT-MODEL-LOCKED-WITH-OPEN-THREATS (2 open)')).toEqual([
      { token: 'THREAT-MODEL-LOCKED-WITH-OPEN-THREATS', blockedReason: null },
    ]);
    expect(extractVerdicts('AS-BUILT-WRITTEN-WITH-DRIFT — 3 divergences')).toEqual([
      { token: 'AS-BUILT-WRITTEN-WITH-DRIFT', blockedReason: null },
    ]);
    expect(extractVerdicts('BLOCKED-ON-FEATURES → /feature-map')).toEqual([
      { token: 'BLOCKED-ON-FEATURES', blockedReason: '→ /feature-map' },
    ]);
  });

  it('does not fire a token embedded inside a longer one', () => {
    // ALREADY-STARTED must not also match a phantom READY-* token.
    expect(extractVerdicts('ALREADY-STARTED → /discovery')).toEqual([
      { token: 'ALREADY-STARTED', blockedReason: null },
    ]);
  });

  it('excludes single-word and collision-prone verdicts from detection', () => {
    // SHIPPED / PROCEED / KILL / COMPLETE / REJECT / PARTIAL / NO-OP /
    // IN-PROGRESS are real chain verdicts but collide with ordinary prose —
    // a false "SHIPPED" banner is worse than a missed one.
    expect(extractVerdicts('SHIPPED PROCEED KILL COMPLETE REJECT PARTIAL NO-OP IN-PROGRESS')).toEqual([]);
  });

  it('dedupes repeated tokens and keeps document order', () => {
    const text = 'READY-FOR-QA mentioned twice: READY-FOR-QA. Then READY-FOR-SHIP.';
    expect(extractVerdicts(text).map((v) => v.token)).toEqual(['READY-FOR-QA', 'READY-FOR-SHIP']);
  });

  it('requires exact uppercase tokens at word boundaries', () => {
    expect(extractVerdicts('ready-for-qa lowercase is prose')).toEqual([]);
    expect(extractVerdicts('XREADY-FOR-QA glued to a word')).toEqual([]);
    expect(extractVerdicts('')).toEqual([]);
  });
});

describe('nextSkillFor', () => {
  it('maps verdicts to the next chain skill', () => {
    expect(nextSkillFor('READY-FOR-MTDD')).toBe('mtdd-implement');
    expect(nextSkillFor('READY-FOR-QA')).toBe('qa');
    expect(nextSkillFor('READY-FOR-BUILD')).toBe('build');
    expect(nextSkillFor('READY-FOR-SHIP')).toBe('ship');
    expect(nextSkillFor('READY-TO-PUBLISH')).toBe('publish-issues');
    expect(nextSkillFor('READY-FOR-ISSUES')).toBe('to-issues');
  });

  it('routes quick-spec refusals to the skill that owns the decision', () => {
    expect(nextSkillFor('NEEDS-FULL-CHAIN')).toBe('prd');
    expect(nextSkillFor('NEEDS-ARCHITECTURE-UPDATE')).toBe('architect');
    expect(nextSkillFor('BLOCKED-ON-ANCHOR')).toBe('anchor');
    expect(nextSkillFor('BLOCKED-ON-ARCHITECTURE')).toBe('architect');
  });

  it('routes every explicitly-routed chain verdict to its consumer', () => {
    const routed: Array<[Parameters<typeof nextSkillFor>[0], string]> = [
      ['READY-FOR-ARCHITECT', 'architect'],
      ['READY-FOR-BOOTSTRAP', 'bootstrap'],
      ['READY-FOR-PRD', 'prd'],
      ['READY-FOR-DESIGN', 'design'],
      ['READY-FOR-PLAN', 'plan'],
      ['READY-FOR-FEATURE-MAP', 'feature-map'],
      ['READY-FOR-ANCHOR', 'anchor'],
      ['READY-FOR-DISCOVERY', 'discovery'],
      ['READY-FOR-COMPREHEND', 'comprehend'],
      ['PROTOTYPE-FAST-PATH', 'feature-map'],
      ['ALREADY-STARTED', 'discovery'],
      ['ALREADY-ONBOARDED', 'anchor'],
      ['SAFE-TO-PROCEED', 'prd'],
      ['THREAT-MODEL-LOCKED', 'prd'],
      ['THREAT-MODEL-LOCKED-WITH-OPEN-THREATS', 'prd'],
      ['ENVIRONMENTS-LOCKED', 'pipeline'],
      ['SKIPPED-BROWNFIELD', 'research'],
      ['SKIPPED-NO-UI', 'design'],
      ['NEEDS-STRATEGIC-DESIGN', 'ddd-strategy'],
      ['NEEDS-EVENT-STORM', 'event-storm'],
      ['NEEDS-RESEARCH', 'research'],
      ['NEEDS-RESLICE', 'plan'],
      ['NEEDS-STATUS-RESOLUTION', 'feature-map'],
      ['NEEDS-DECOMPOSITION', 'feature-map'],
      ['RESCOPE-NEEDED', 'prd'],
      ['NOT-LOOP-BUILT', 'explore'],
      ['NO-CODE-YET', 'build'],
      ['NO-SEAM', 'improve-codebase-architecture'],
      ['ARCHITECTURE-BLOCKS-FEATURE', 'improve-codebase-architecture'],
      ['BLOCKED-ON-ARCHITECT', 'architect'],
      ['BLOCKED-ON-PRD', 'prd'],
      ['BLOCKED-ON-DESIGN', 'design'],
      ['BLOCKED-ON-PLAN', 'plan'],
      ['BLOCKED-ON-DISCOVERY', 'discovery'],
      ['BLOCKED-ON-UNDERSTANDING', 'understand'],
      ['BLOCKED-ON-CONTEXT', 'understand'],
      ['BLOCKED-ON-RECON', 'explore'],
      ['BLOCKED-ON-COMPREHEND', 'comprehend'],
      ['BLOCKED-ON-FEATURES', 'feature-map'],
      ['BLOCKED-ON-ISSUES', 'to-issues'],
      ['BLOCKED-ON-PUBLISH', 'publish-issues'],
      ['BLOCKED-ON-SCHEMA', 'to-issues'],
      ['BLOCKED-ON-QA', 'qa'],
      ['BLOCKED-ON-FITNESS', 'to-fitness'],
      ['BLOCKED-ON-BOOTSTRAP', 'bootstrap'],
      ['BLOCKED-ON-ENVIRONMENTS', 'environments'],
      ['BLOCKED-ON-CONTRADICTION', 'coherence-check'],
      ['BLOCKED-ON-STATE', 'status'],
    ];
    for (const [token, skill] of routed) {
      expect(nextSkillFor(token), token).toBe(skill);
    }
  });

  it('returns null when the next step is a human decision, not a skill launch', () => {
    expect(nextSkillFor('BLOCKED-ON')).toBeNull();
    // RESUME-FULL-CHAIN targets the first missing artifact (/prd, /design, or
    // /plan) — only the emitting run knows which; its trailing text names it.
    expect(nextSkillFor('RESUME-FULL-CHAIN')).toBeNull();
    // Origin-branched or variable destinations stay null too.
    expect(nextSkillFor('TEST-STRATEGY-LOCKED')).toBeNull();
    expect(nextSkillFor('DESIGN-SYSTEM-LOCKED')).toBeNull();
    expect(nextSkillFor('PIPELINE-LOCKED')).toBeNull();
    expect(nextSkillFor('BLOCKED-ON-STATUS')).toBeNull();
    expect(nextSkillFor('BLOCKED-ON-SHIP')).toBeNull();
    expect(nextSkillFor('CRITIC-REVISE')).toBeNull();
    expect(nextSkillFor('FIX-CRITICAL-FIRST')).toBeNull();
    expect(nextSkillFor('METRIC-MISSED')).toBeNull();
  });
});

describe('verdictAdvances', () => {
  it('is true for stage-complete verdicts and false for halts/reroutes', () => {
    expect(verdictAdvances('READY-FOR-QA')).toBe(true);
    expect(verdictAdvances('READY-FOR-ISSUES')).toBe(true);
    expect(verdictAdvances('BLOCKED-ON')).toBe(false);
    expect(verdictAdvances('BLOCKED-ON-ANCHOR')).toBe(false);
    expect(verdictAdvances('NEEDS-FULL-CHAIN')).toBe(false);
    expect(verdictAdvances('RESUME-FULL-CHAIN')).toBe(false);
  });

  it('treats deliberate skips and recorded outcomes as advancing, waits as halts', () => {
    expect(verdictAdvances('SKIPPED-PROTOTYPE')).toBe(true);
    expect(verdictAdvances('SKIPPED-TIER')).toBe(true);
    expect(verdictAdvances('METRIC-MET')).toBe(true);
    expect(verdictAdvances('SUNSET-PLANNED')).toBe(true);
    expect(verdictAdvances('FIXED-INLINE')).toBe(true);
    expect(verdictAdvances('AWAITING-DEPLOY')).toBe(false);
    expect(verdictAdvances('AWAITING-APPROVAL')).toBe(false);
    expect(verdictAdvances('GATE-NOT-MET')).toBe(false);
    expect(verdictAdvances('METRIC-MISSED')).toBe(false);
    expect(verdictAdvances('EVIDENCE-INCOMPLETE')).toBe(false);
    expect(verdictAdvances('SPEC-DRIFT')).toBe(false);
  });

  it('treats tokens outside the vocabulary as non-advancing', () => {
    expect(verdictAdvances('SOMETHING-NEW')).toBe(false);
  });
});
