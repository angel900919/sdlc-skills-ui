import { describe, expect, it } from 'vitest';
import { extractVerdicts, nextSkillFor } from './verdicts.js';

describe('extractVerdicts', () => {
  it('finds chain verdict tokens in assistant text', () => {
    const text = 'All slices merged and verified.\n\n**Verdict: READY-FOR-QA** — run /qa checkout next.';
    expect(extractVerdicts(text)).toEqual([{ token: 'READY-FOR-QA', blockedReason: null }]);
  });

  it('finds every token of the chain vocabulary', () => {
    for (const token of [
      'READY-FOR-MTDD',
      'READY-FOR-QA',
      'READY-FOR-BUILD',
      'READY-FOR-SHIP',
      'READY-TO-PUBLISH',
    ]) {
      expect(extractVerdicts(`status: ${token} ok`)).toEqual([{ token, blockedReason: null }]);
    }
  });

  it('captures the reason after BLOCKED-ON', () => {
    expect(extractVerdicts('Cannot continue. BLOCKED-ON: SLICE-2 depends on unmerged SLICE-1.')).toEqual([
      { token: 'BLOCKED-ON', blockedReason: 'SLICE-2 depends on unmerged SLICE-1.' },
    ]);
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
  });

  it('returns null for BLOCKED-ON — a human decision, not a skill launch', () => {
    expect(nextSkillFor('BLOCKED-ON')).toBeNull();
  });
});
