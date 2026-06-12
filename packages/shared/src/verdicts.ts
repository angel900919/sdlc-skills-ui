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
  | 'READY-FOR-ISSUES'
  | 'NEEDS-FULL-CHAIN'
  | 'RESUME-FULL-CHAIN'
  | 'NEEDS-ARCHITECTURE-UPDATE'
  | 'BLOCKED-ON-ANCHOR'
  | 'BLOCKED-ON-ARCHITECTURE'
  | 'BLOCKED-ON';

interface VerdictMeta {
  /** The skill that consumes this verdict (null = needs a human). */
  nextSkill: string | null;
  /** True when the stage completed; false when the run halted or rerouted. */
  advances: boolean;
}

const VERDICT_META: Record<VerdictToken, VerdictMeta> = {
  'READY-FOR-MTDD': { nextSkill: 'mtdd-implement', advances: true },
  'READY-FOR-QA': { nextSkill: 'qa', advances: true },
  'READY-FOR-BUILD': { nextSkill: 'build', advances: true },
  'READY-FOR-SHIP': { nextSkill: 'ship', advances: true },
  'READY-TO-PUBLISH': { nextSkill: 'publish-issues', advances: true },
  'READY-FOR-ISSUES': { nextSkill: 'to-issues', advances: true },
  // quick-spec refusals route to the skill that owns the overridden decision.
  'NEEDS-FULL-CHAIN': { nextSkill: 'prd', advances: false },
  // Targets the first missing artifact (/prd, /design, or /plan) — only the
  // emitting run knows which; its trailing text names it.
  'RESUME-FULL-CHAIN': { nextSkill: null, advances: false },
  'NEEDS-ARCHITECTURE-UPDATE': { nextSkill: 'architect', advances: false },
  'BLOCKED-ON-ANCHOR': { nextSkill: 'anchor', advances: false },
  'BLOCKED-ON-ARCHITECTURE': { nextSkill: 'architect', advances: false },
  'BLOCKED-ON': { nextSkill: null, advances: false },
};

// Built from the vocabulary, longest token first, so a prefix (BLOCKED-ON)
// never shadows a longer sibling (BLOCKED-ON-ANCHOR). Hyphenated forms
// outside the vocabulary match nothing rather than degrading to BLOCKED-ON.
const TOKEN_PATTERN = new RegExp(
  `(?<![A-Z-])(${(Object.keys(VERDICT_META) as VerdictToken[])
    .sort((a, b) => b.length - a.length)
    .join('|')})(?![A-Z-])`,
  'g',
);

export interface Verdict {
  token: VerdictToken;
  /** Trailing text after a halting verdict (reason or reroute target), when present. */
  blockedReason: string | null;
}

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
      blockedReason: VERDICT_META[token].advances
        ? null
        : blockedReasonAfter(text, match.index! + match[0].length),
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
  return VERDICT_META[token].nextSkill;
}

/** False for halting verdicts and unknown tokens — the UI must not render "stage complete". */
export function verdictAdvances(token: string): boolean {
  return VERDICT_META[token as VerdictToken]?.advances ?? false;
}
