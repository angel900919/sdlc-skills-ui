/**
 * Chain verdict detection. The SDLC skills end their runs with uppercase
 * verdict tokens (e.g. /build emits READY-FOR-QA, /to-issues emits
 * READY-TO-PUBLISH). Spotting them in the transcript lets the dashboard
 * advance the Pipeline focus live and offer a one-click next launch.
 */

export type VerdictToken =
  | 'READY-FOR-MTDD'
  | 'READY-FOR-QA'
  | 'READY-FOR-BUILD'
  | 'READY-FOR-SHIP'
  | 'READY-TO-PUBLISH'
  | 'BLOCKED-ON';

export interface Verdict {
  token: VerdictToken;
  /** Text following "BLOCKED-ON", when present. */
  blockedReason: string | null;
}

/** Verdict → the skill that consumes it (null = needs a human). */
const NEXT_SKILL: Record<VerdictToken, string | null> = {
  'READY-FOR-MTDD': 'mtdd-implement',
  'READY-FOR-QA': 'qa',
  'READY-FOR-BUILD': 'build',
  'READY-FOR-SHIP': 'ship',
  'READY-TO-PUBLISH': 'publish-issues',
  'BLOCKED-ON': null,
};

const TOKEN_PATTERN =
  /(?<![A-Z-])(READY-FOR-MTDD|READY-FOR-QA|READY-FOR-BUILD|READY-FOR-SHIP|READY-TO-PUBLISH|BLOCKED-ON)(?![A-Z-])/g;

/** Scan free text for verdict tokens; deduped, in document order. */
export function extractVerdicts(text: string): Verdict[] {
  const out: Verdict[] = [];
  const seen = new Set<VerdictToken>();
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const token = match[1] as VerdictToken;
    if (seen.has(token)) continue;
    seen.add(token);
    out.push({
      token,
      blockedReason: token === 'BLOCKED-ON' ? blockedReasonAfter(text, match.index! + match[0].length) : null,
    });
  }
  return out;
}

function blockedReasonAfter(text: string, offset: number): string | null {
  const rest = text.slice(offset).replace(/^[:\s—-]+/, '');
  const line = rest.split('\n')[0].trim();
  return line || null;
}

export function nextSkillFor(token: VerdictToken): string | null {
  return NEXT_SKILL[token];
}
