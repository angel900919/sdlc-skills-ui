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

  it('returns null when the next step is a human decision, not a skill launch', () => {
    expect(nextSkillFor('BLOCKED-ON')).toBeNull();
    // RESUME-FULL-CHAIN targets the first missing artifact (/prd, /design, or
    // /plan) — only the emitting run knows which; its trailing text names it.
    expect(nextSkillFor('RESUME-FULL-CHAIN')).toBeNull();
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

  it('treats tokens outside the vocabulary as non-advancing', () => {
    expect(verdictAdvances('SOMETHING-NEW')).toBe(false);
  });
});
