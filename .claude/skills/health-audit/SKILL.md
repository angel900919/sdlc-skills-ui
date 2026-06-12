---
name: health-audit
disable-model-invocation: true
description: |-
  Brownfield discovery orchestrator and gate. Fans out read-only sub-agents across up to seven lenses (critical bugs, security, architecture, tech debt, performance, UX, dependency currency), verifies the P0/P1 findings, consolidates them into .ai/health-report.md with file:line evidence, optionally publishes each to the tracker (beads default) with health and triage labels, and writes a plain-English gate summary. Ends with a human-approved verdict answering the brownfield rule — must anything be fixed before new feature work. Tier-aware; brownfield-only; runs after /explore. Use when the user says "/health-audit", "audit this codebase", "what's wrong with this repo", "is this safe to build on", "find the bugs/security/perf/debt", or before major work on an inherited codebase. Do NOT use for: greenfield (nothing to audit), facts-only recon (/explore), root-causing one bug (/diagnose), one refactor (/improve-codebase-architecture), or feature-boundary verification (/qa).
---

# Health-audit — brownfield categorized discovery + gate

Judges **how healthy** a brownfield codebase is and answers the **brownfield rule** — *before adding major features, is anything critical broken, can the architecture support the work, and is the technical debt an acceptable risk?* An **orchestrator, not a re-implementation:** each lens fans out a read-only sub-agent carrying the discipline of the skill that owns that concern; `/health-audit` consolidates, severity-grades, writes one register, publishes to the tracker, and gates. Deep work stays with the owning skills — this one **finds and routes**.

<what-to-do>

## Critical rules (read before starting)

1. **Brownfield only.** Probe the filesystem; no real source (greenfield) → `SKIPPED-GREENFIELD`. Nothing to audit.
2. **Findings, not fixes.** Diagnose and register — never edit source. The worst items hand forward to `/diagnose` (root-cause a bug) or `/improve-codebase-architecture` (a deepening refactor) — both built.
3. **Reuse, don't reinvent.** Brief each lens sub-agent with the discipline of the skill that owns it ([references/lenses.md](references/lenses.md)). The security lens mirrors the **`/security-review`** built-in's discipline; architecture/debt mirror **`/code-review`**/**`/simplify`**; the dependencies lens mirrors `/design`'s deps-governance discipline plus the ecosystem's audit command (degrade gracefully when absent). Don't write a new checklist inline.
4. **Every finding cites `path:line`.** No evidence in the code → it's a hypothesis, not a finding. Drop it, or mark `needs_confirmation: true` and route to `/diagnose`.
5. **Read `.ai/recon.md` if present.** `/explore` Section B (components) frames the architecture lens; Section E (gaps) seeds the audit. Missing and the repo is unfamiliar → recommend `/explore` first (**warn, don't hard-block**).
6. **Consolidate + dedupe.** The same `path:line` from two lenses is **one** finding at the higher severity, cross-referenced — never two.
7. **Publish through the existing tracker path.** Default **beads** (mirror `/publish-issues` conventions); respect `anchor.tracker_backend`. No tracker → write the report anyway and say so. *(These labels feed `/triage`, the consumer for non-chain findings.)*
8. **Tier-aware depth.** Scale lenses + report cap by `anchor.project_tier` ([references/lenses.md](references/lenses.md)). Never run a 7-lens production audit on a prototype.
9. **Verify before you publish.** Every P0/P1 passes the adversarial verify wave (Phase 2.5) before it reaches the report or the tracker. An unconfirmed P0 erodes trust in the gate.
10. **The gate is the point — human-approved.** Always end with a gate verdict; never auto-pass because the fan-out ran autonomously. Get the user's acknowledgement before new feature work.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — the one scope question (Phase 1) is jargon-free with a recommended default.
12. **Tracker + progress discipline.** Load `.ai/progress-tracker.md` top 5 at Phase 0; append a `health-audit landed` entry on the success path.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan findings against it before publishing.

## Procedure

```
health-audit progress:
- [ ] Phase 0: Probe brownfield + read anchor (tier/type/backend) + recon.md; detect tracker; tracker top 5
- [ ] Phase 1: Scope — full vs focused; is a specific upcoming feature being gated?
- [ ] Phase 2: Fan out the tier-applicable lens sub-agents IN PARALLEL (read-only, structured)
- [ ] Phase 2.5: Verify wave — adversarially confirm every P0/P1 finding (parallel)
- [ ] Phase 3: Consolidate + dedupe + severity-grade (verified findings only)
- [ ] Phase 4: Write .ai/health-report.md + .human/summaries/health-audit.md
- [ ] Phase 5: Publish findings to the tracker (beads default); write IDs back into the report
- [ ] Phase 6: Gate + verdict + progress-tracker
```

### Phase 0 — Probe and ground
Filesystem probe for application source — greenfield → `SKIPPED-GREENFIELD`. Read `.ai/anchor.md` (need `project_tier`, `language`, `project_type`, `tracker_backend`) — absent → `BLOCKED-ON-ANCHOR → /anchor`; confirm `project_type: brownfield`. Read `.ai/recon.md` if present (Sections B + E); absent + unfamiliar repo → recommend `/explore` first (warn, continue). Detect the tracker: beads (`bd` on PATH + `.beads/`) is the default, else `anchor.tracker_backend`; none → plan report-only. Load `.ai/progress-tracker.md` top 5.

### Phase 1 — Scope
Ask (one question, recommended answer): *"Full health audit, or focused on a specific area?"* and the gating question: *"A specific feature you're about to build that this should clear first? (name it, or 'general audit')."* A named feature drives Phase 6's gate; "general" → `AUDIT-COMPLETE`.

### Phase 2 — Fan out the lenses (read-only sub-agents, parallel)
Spawn one read-only `Explore` sub-agent per **applicable** lens, **all in one message** so they run concurrently — never one at a time. Brief each with the repo's `language`, the `recon.md` component map (if any), the Phase-1 focus, and the owning discipline. Each returns **structured findings only** (the JSON shape + the full lens table + tier mapping are in [references/lenses.md](references/lenses.md)). *(When the user has opted into workflow mode, Phases 2 + 2.5 may instead be authored as one `Workflow` pipeline so each lens's findings verify as it returns — same concurrency either way; the default needs no opt-in.)*

### Phase 2.5 — Verify wave (adversarial, parallel)
Every P0/P1 finding is a *claim* until a second, independent skeptic sub-agent confirms it. For each, spawn a fresh read-only agent (all in one message) prompted to **refute** it — open the cited `path:line`, check the claim holds, default to refuted if the evidence doesn't clearly support it. Drop the unconfirmed; keep survivors (or keep with `corrected_evidence` + `needs_confirmation` if the skeptic found the real location). P2/P3 skip the wave (cheap to leave for triage). Skip the wave only when zero P0/P1 came back. Spec: [references/lenses.md](references/lenses.md).

### Phase 3 — Consolidate
Merge verified findings (Phase-2.5 survivors + the unverified P2/P3 tail): dedupe by `path:line` (keep highest severity, note secondary lenses), assign stable IDs (`H-001…`), confirm every finding has `path:line`. Drop or downgrade-to-`needs-confirmation` anything uncited.

### Phase 4 — Write the artifacts
1. **`.ai/health-report.md`** — the structured register, tier-capped (150/300/450), one section per lens that ran, an `H-NNN` finding block per item, per the schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md).
2. **`.human/summaries/health-audit.md`** — plain-English gate summary: the verdict in one sentence, top P0/P1 risks as jargon-free bullets, the recommendation, and one optional severity-distribution diagram via the **mermaid skill**. Link back to the register.

### Phase 5 — Publish to the tracker
Default **beads** (mirror `/publish-issues`): one ticket per finding — `bd create` (title; body = Impact + Evidence `path:line` + Recommended fix + the `H-NNN` ID), `bd update --priority` from P0–P3, labels `health-audit` + `health:<lens>` + the triage category (`category-bug` | `category-enhancement`) + `needs-triage`. Write the created ref back next to the finding (`<tracker-ref>`). Non-beads (`jira`/`md`) → follow `/publish-issues`' mapping. No tracker → skip, leave `<tracker-ref>` as `—`, tell the user the report is the source of record. (Backend specifics: [references/lenses.md](references/lenses.md).)

### Phase 6 — Gate + verdict
Present the summary + gate. If a feature was named (Phase 1), judge:
- any **P0** in `health:critical`/`health:security` → **FIX-CRITICAL-FIRST → <bead IDs>** (the feature waits behind these);
- an `health:architecture` finding the feature would build directly on → **ARCHITECTURE-BLOCKS-FEATURE → /improve-codebase-architecture** (or `/architect` update mode);
- otherwise → **SAFE-TO-PROCEED → /prd <feature>** (debt/perf/UX logged, not blockers).

Get the user's acknowledgement (rule 10). Append a `health-audit landed` entry to `.ai/progress-tracker.md`, then issue exactly one:

- **`SAFE-TO-PROCEED → /prd <feature>`** — no blockers for the named feature.
- **`FIX-CRITICAL-FIRST → <bead IDs>`** — P0 bug/security must land first (route to `/diagnose`, or run the fix as a `category: bug` slice via `/to-issues`).
- **`ARCHITECTURE-BLOCKS-FEATURE → /improve-codebase-architecture`** — structure can't support the feature yet (or `/architect` update mode for a macro change).
- **`AUDIT-COMPLETE`** — general audit (no feature gated); register + tickets produced.
- **`SKIPPED-GREENFIELD`** — no code to audit.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no `anchor.md`.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/health-report.md`** — read-only findings register (`H-NNN` blocks; schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md); tier-capped 150/300/450).
- **`.human/summaries/health-audit.md`** — plain-English gate summary the human reads to make the gate call.

## References
- The seven lenses (owning discipline · what each hunts · tier), the finding JSON schema, and the verify-wave spec: [references/lenses.md](references/lenses.md)
- Rejection list to scan before publishing: [references/anti-patterns.md](references/anti-patterns.md)

</supporting-info>
