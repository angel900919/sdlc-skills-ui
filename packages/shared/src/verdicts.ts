/**
 * Chain verdict detection. Every SDLC skill ends its runs with an uppercase
 * verdict token (e.g. /build emits READY-FOR-QA, /pipeline emits
 * PIPELINE-LOCKED). Spotting them in the transcript lets the dashboard
 * advance the Pipeline focus live and offer a one-click next launch.
 *
 * The vocabulary below was compiled from each skill's verdict section in
 * .claude/skills; routing is included only where the verdict
 * deterministically names ONE consumer — origin-branched or variable
 * destinations (e.g. TEST-STRATEGY-LOCKED → /bootstrap|/prd) stay null.
 *
 * Deliberately excluded, with a real verdict left undetected as the cost:
 * single-word and collision-prone tokens — SHIPPED, PROMOTED, DEPRECATED,
 * REMOVED, REJECTED, PARTIAL, TRIAGED, ROUTED, PARKED, COHERENT,
 * PROCEED, INVESTIGATE, KILL (discovery), COMPLETE, REJECT (mtdd-review),
 * NO-OP, IN-PROGRESS — because they appear in ordinary prose and a false
 * "SHIPPED" banner is worse than a missed one. NEEDS-REFRESH is excluded as
 * a mid-run announcement, not a run verdict.
 */

interface VerdictMeta {
  /** The skill that consumes this verdict (null = needs a human). */
  nextSkill: string | null;
  /** True when the stage completed or was deliberately skipped; false when the run halted or rerouted. */
  advances: boolean;
}

const VERDICT_META = {
  // ---- per-feature execute spine ----
  'READY-FOR-ISSUES': { nextSkill: 'to-issues', advances: true },
  'READY-TO-PUBLISH': { nextSkill: 'publish-issues', advances: true },
  'READY-FOR-BUILD': { nextSkill: 'build', advances: true },
  'READY-FOR-MTDD': { nextSkill: 'mtdd-implement', advances: true },
  'READY-FOR-QA': { nextSkill: 'qa', advances: true },
  'READY-FOR-SHIP': { nextSkill: 'ship', advances: true },

  // ---- foundation + per-feature advance ----
  'READY-FOR-DISCOVERY': { nextSkill: 'discovery', advances: true },
  'READY-FOR-ANCHOR': { nextSkill: 'anchor', advances: true },
  'READY-FOR-ARCHITECT': { nextSkill: 'architect', advances: true },
  'READY-FOR-BOOTSTRAP': { nextSkill: 'bootstrap', advances: true },
  'READY-FOR-FEATURE-MAP': { nextSkill: 'feature-map', advances: true },
  'READY-FOR-COMPREHEND': { nextSkill: 'comprehend', advances: true },
  'READY-FOR-PRD': { nextSkill: 'prd', advances: true },
  'READY-FOR-DESIGN': { nextSkill: 'design', advances: true },
  'READY-FOR-PLAN': { nextSkill: 'plan', advances: true },
  'PROTOTYPE-FAST-PATH': { nextSkill: 'feature-map', advances: true },
  'ALREADY-STARTED': { nextSkill: 'discovery', advances: true },
  'ALREADY-ONBOARDED': { nextSkill: 'anchor', advances: true },
  'ALREADY-AT-PRODUCTION': { nextSkill: null, advances: true },

  // ---- stage-complete locks, records, and outcomes ----
  'SAFE-TO-PROCEED': { nextSkill: 'prd', advances: true },
  'AUDIT-COMPLETE': { nextSkill: null, advances: true },
  'THREAT-MODEL-LOCKED': { nextSkill: 'prd', advances: true },
  'THREAT-MODEL-LOCKED-WITH-OPEN-THREATS': { nextSkill: 'prd', advances: true },
  'DESIGN-SYSTEM-LOCKED': { nextSkill: null, advances: true },
  'TEST-STRATEGY-LOCKED': { nextSkill: null, advances: true },
  'DATA-MANAGEMENT-LOCKED': { nextSkill: null, advances: true },
  'ENVIRONMENTS-LOCKED': { nextSkill: 'pipeline', advances: true },
  'PIPELINE-LOCKED': { nextSkill: null, advances: true },
  'DOCS-WRITTEN': { nextSkill: null, advances: true },
  'DOCS-UPDATED': { nextSkill: null, advances: true },
  'RUNBOOK-WRITTEN': { nextSkill: null, advances: true },
  'SLO-LOCKED': { nextSkill: null, advances: true },
  'AS-BUILT-WRITTEN': { nextSkill: null, advances: true },
  'AS-BUILT-WRITTEN-WITH-DRIFT': { nextSkill: null, advances: true },
  'METRIC-MET': { nextSkill: null, advances: true },
  'ON-TRACK': { nextSkill: null, advances: true },
  'FIXED-INLINE': { nextSkill: null, advances: true },
  'ROUTED-AS-BUG': { nextSkill: null, advances: true },
  'PROPOSALS-READY': { nextSkill: null, advances: true },
  'DEEPENING-ROUTED': { nextSkill: null, advances: true },
  'RECORDED-AS-ADR': { nextSkill: null, advances: true },
  'NO-FRICTION-FOUND': { nextSkill: null, advances: true },
  'CRITIC-PASS': { nextSkill: null, advances: true },
  'STATUS-REPORTED': { nextSkill: null, advances: true },
  'ROSTER-REPORTED': { nextSkill: null, advances: true },
  'STATUS-PERSISTED': { nextSkill: null, advances: true },
  'STATUS-COMPLETE': { nextSkill: null, advances: true },
  'RECOMMENDATION-MADE': { nextSkill: null, advances: true },
  'RECAP-AND-RECOMMENDATION': { nextSkill: null, advances: true },
  'SUNSET-PLANNED': { nextSkill: null, advances: true },
  'REMOVAL-ROUTED': { nextSkill: null, advances: true },
  'SURVEY-ONLY': { nextSkill: null, advances: true },

  // ---- deliberate skips (stage resolved, chain proceeds) ----
  'SKIPPED-TIER': { nextSkill: null, advances: true },
  'SKIPPED-PROTOTYPE': { nextSkill: null, advances: true },
  'SKIPPED-GREENFIELD': { nextSkill: null, advances: true },
  'SKIPPED-BROWNFIELD': { nextSkill: 'research', advances: true },
  'SKIPPED-NO-UI': { nextSkill: 'design', advances: true },
  'SKIPPED-NO-DATASTORE': { nextSkill: null, advances: true },
  'SKIPPED-NON-PRODUCTION': { nextSkill: null, advances: true },
  'SKIPPED-CHAIN-TICKET': { nextSkill: null, advances: true },
  'NOTHING-TO-DOCUMENT': { nextSkill: null, advances: true },

  // ---- reroutes: the work bounced to the skill that owns the decision ----
  'NEEDS-FULL-CHAIN': { nextSkill: 'prd', advances: false },
  // Targets the first missing artifact (/prd, /design, or /plan) — only the
  // emitting run knows which; its trailing text names it.
  'RESUME-FULL-CHAIN': { nextSkill: null, advances: false },
  'NEEDS-ARCHITECTURE-UPDATE': { nextSkill: 'architect', advances: false },
  'NEEDS-STRATEGIC-DESIGN': { nextSkill: 'ddd-strategy', advances: false },
  'NEEDS-EVENT-STORM': { nextSkill: 'event-storm', advances: false },
  'NEEDS-MORE-MODELING': { nextSkill: null, advances: false },
  'NEEDS-MORE-CLARITY': { nextSkill: null, advances: false },
  'NEEDS-RESEARCH': { nextSkill: 'research', advances: false },
  'NEEDS-PROTOTYPE': { nextSkill: null, advances: false },
  'NEEDS-DECOMPOSITION': { nextSkill: 'feature-map', advances: false },
  'NEEDS-RESLICE': { nextSkill: 'plan', advances: false },
  'NEEDS-STATUS-RESOLUTION': { nextSkill: 'feature-map', advances: false },
  'NEEDS-MECHANIZATION': { nextSkill: null, advances: false },
  'NEEDS-ORPHAN-CLEANUP': { nextSkill: null, advances: false },
  'NEEDS-FEATURE-ARG': { nextSkill: null, advances: false },
  'NOT-LOOP-BUILT': { nextSkill: 'explore', advances: false },
  'NO-CODE-YET': { nextSkill: 'build', advances: false },
  'NO-SEAM': { nextSkill: 'improve-codebase-architecture', advances: false },
  'RESCOPE-NEEDED': { nextSkill: 'prd', advances: false },
  'FIX-CRITICAL-FIRST': { nextSkill: null, advances: false },
  'ARCHITECTURE-BLOCKS-FEATURE': { nextSkill: 'improve-codebase-architecture', advances: false },
  'CRITIC-REVISE': { nextSkill: null, advances: false },
  'NEW-PROJECT': { nextSkill: null, advances: false },

  // ---- blocked: a required upstream artifact or state is missing ----
  'BLOCKED-ON-ANCHOR': { nextSkill: 'anchor', advances: false },
  'BLOCKED-ON-ARCHITECTURE': { nextSkill: 'architect', advances: false },
  'BLOCKED-ON-ARCHITECT': { nextSkill: 'architect', advances: false },
  'BLOCKED-ON-PRD': { nextSkill: 'prd', advances: false },
  'BLOCKED-ON-DESIGN': { nextSkill: 'design', advances: false },
  'BLOCKED-ON-PLAN': { nextSkill: 'plan', advances: false },
  'BLOCKED-ON-DISCOVERY': { nextSkill: 'discovery', advances: false },
  'BLOCKED-ON-UNDERSTANDING': { nextSkill: 'understand', advances: false },
  'BLOCKED-ON-CONTEXT': { nextSkill: 'understand', advances: false },
  'BLOCKED-ON-RECON': { nextSkill: 'explore', advances: false },
  'BLOCKED-ON-COMPREHEND': { nextSkill: 'comprehend', advances: false },
  'BLOCKED-ON-FEATURES': { nextSkill: 'feature-map', advances: false },
  'BLOCKED-ON-FEATURE': { nextSkill: null, advances: false },
  'BLOCKED-ON-ISSUES': { nextSkill: 'to-issues', advances: false },
  'BLOCKED-ON-PUBLISH': { nextSkill: 'publish-issues', advances: false },
  'BLOCKED-ON-SCHEMA': { nextSkill: 'to-issues', advances: false },
  'BLOCKED-ON-QA': { nextSkill: 'qa', advances: false },
  'BLOCKED-ON-FITNESS': { nextSkill: 'to-fitness', advances: false },
  'BLOCKED-ON-BOOTSTRAP': { nextSkill: 'bootstrap', advances: false },
  'BLOCKED-ON-ENVIRONMENTS': { nextSkill: 'environments', advances: false },
  'BLOCKED-ON-CONTRADICTION': { nextSkill: 'coherence-check', advances: false },
  'BLOCKED-ON-STATE': { nextSkill: 'status', advances: false },
  // Variable destinations (e.g. ship's BLOCKED-ON-STATUS → /qa|/feature-map).
  'BLOCKED-ON-STATUS': { nextSkill: null, advances: false },
  'BLOCKED-ON-SHIP': { nextSkill: null, advances: false },
  'BLOCKED-ON-DEPENDENCY': { nextSkill: null, advances: false },
  'BLOCKED-ON-DEPENDANTS': { nextSkill: null, advances: false },
  'BLOCKED-ON-AUTH': { nextSkill: null, advances: false },
  'BLOCKED-ON-CONFLICT': { nextSkill: null, advances: false },
  'BLOCKED-NO-REPRO': { nextSkill: null, advances: false },
  'BLOCKED-ON': { nextSkill: null, advances: false },

  // ---- waiting on a human gate or an unmet condition ----
  'GATE-NOT-MET': { nextSkill: null, advances: false },
  'AWAITING-APPROVAL': { nextSkill: null, advances: false },
  'AWAITING-CONFIRMATION': { nextSkill: null, advances: false },
  'AWAITING-DEPLOY': { nextSkill: null, advances: false },
  'EVIDENCE-INCOMPLETE': { nextSkill: null, advances: false },
  'SPEC-DRIFT': { nextSkill: null, advances: false },
  'TOO-EARLY': { nextSkill: null, advances: false },
  'NOT-SHIPPED': { nextSkill: null, advances: false },
  'NOTHING-SHIPPED': { nextSkill: null, advances: false },
  'KILL-CRITERIA-MET': { nextSkill: null, advances: false },
  'METRIC-MISSED': { nextSkill: null, advances: false },
  'METRIC-PARTIAL': { nextSkill: null, advances: false },
  'NO-MEASUREMENT-SOURCE': { nextSkill: null, advances: false },
} as const satisfies Record<string, VerdictMeta>;

export type VerdictToken = keyof typeof VERDICT_META;

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
  return (VERDICT_META as Record<string, VerdictMeta>)[token]?.advances ?? false;
}
