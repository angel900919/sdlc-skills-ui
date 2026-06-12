---
name: coherence-check
disable-model-invocation: true
description: |-
  Read-only audit that scans SDLC artifacts (.ai/**, .ai/context.md) and reports contradictions between them with file:line citations. Never modifies, creates, or deletes any file — output is stdout only. Cross-references artifacts pair-by-pair (discovery↔understanding, anchor↔architecture, prd↔design, features↔prd, domain-model↔context, fitness↔sources) and flags stale name references (components, feature slugs, personas, ADR numbers). Use when "/coherence-check", "check coherence", "audit my docs", "are my .ai docs consistent", "look for contradictions", "lint my premises", or whenever upstream and downstream docs may have drifted. Do NOT use for: fixing contradictions (the user resolves them via the source skill), writing new artifacts (use the canonical skill), code-vs-doc checks, or code review (/code-review, /qa).
allowed-tools:
  - Read
  - Glob
  - Grep
---

# coherence-check — premise consistency audit

A read-only static analyzer for project premises. Scans every SDLC artifact,
cross-references them pair-by-pair, and reports **contradictions**. It does not fix
anything — the user resolves each by re-opening the relevant source artifact. A
cross-cutting skill, not part of the canonical chain. Run it whenever upstream and
downstream docs may have drifted (commonly: a decision made in `/understand` that
contradicts something written in `/discovery`, never reconciled).

<what-to-do>

## Critical rules (read before starting)

1. **READ-ONLY. Always.** Never uses `Write`/`Edit` or any mutating tool. Output is stdout only. Asked to fix a contradiction → refuse and name the source skill (e.g. "to update the target user, re-open `/discovery`").
2. **Binary verdict.** Every finding is a CONTRADICTION — no DRIFT/WARNING/INFO tiers. Not confident it's real → leave it out.
3. **Every finding needs two citations** with `path:line` (or `path:section`). A contradiction is a disagreement between two artifacts; one-sided "this seems weird" is not one — drop it.
4. **No file:line guesses.** Can't pin it to a line/section → drop it. Hallucinated citations are worse than missed contradictions.
5. **No external lookups.** No web, no URL fetch, no reading code outside the artifact set. Coherence is internal, doc-vs-doc only.
6. **Quote the conflicting text** — the short literal phrase from each side, so the user verifies without re-reading the file.
7. **Missing artifact → note once, continue.** Absence is not a contradiction.
8. **Don't grade or judge.** Detect disagreement between documents, not the quality of any one document.

Backstopped by [`references/anti-patterns.md`](references/anti-patterns.md) (single-source findings, quality judgments, stale-reference false positives, hallucinated citations, …).

## Procedure

```
coherence-check progress:
- [ ] Phase 0: Inventory artifacts that exist
- [ ] Phase 1: Run the cross-reference matrix
- [ ] Phase 2: Check stale name references (components, features, personas, ADRs)
- [ ] Phase 3: Compile the report
- [ ] Phase 4: Issue the verdict
```

### Phase 0 — Inventory

Use `Glob`/`Read` to discover which exist (note absent ones in the report header; skip them silently in the matrix — never synthesize findings about absent artifacts):

```
.ai/discovery/*.md · .ai/understanding/*.md · .ai/features.md · .ai/anchor.md
.ai/architecture.md (prototype) · .ai/architecture/**/*.md (mvp/production)
.ai/specs/*/prd.md · .ai/specs/*/design.md · .ai/specs/*/adr/*.md
.ai/architecture/domain-model.md · .ai/context.md
.ai/architecture/api-governance.md · .ai/architecture/threat-model.md
.ai/design-system.md · .ai/specs/*/ux.md · .ai/test-strategy.md
.ai/environments.md · .ai/specs/*/outcome.md
```

### Phase 1 — Cross-reference matrix

For each applicable pair: read both in full, extract the named claim in A, check whether B's corresponding claim agrees. Emit only on a literal disagreement. Skip a row if either artifact is absent; skip row 13 below production tier.

| # | Pair | Check |
|---|---|---|
| 1 | `discovery/<slug>` ↔ `understanding/<slug>` | Target user, problem, scope, success metric, kill criteria — same person, problem, numbers? |
| 2 | `discovery/<slug>` ↔ `features.md` | Every discovery scope item maps to ≥1 feature row; every P0/P1 feature traces back to discovery scope. |
| 3 | `understanding/<slug>` ↔ `.ai/context.md` | Glossary terms appear in context.md with the same meaning; invariants not contradicted. |
| 4 | `understanding/<slug>` ↔ `features.md` | Behaviors/journeys covered by features; no orphan feature without a journey trace. |
| 5 | `anchor.md` ↔ `architecture[.md\|/]` | `project_tier` = architecture tier; detected stack matches; AI block presence consistent. |
| 6 | `anchor.md` ↔ `specs/*/prd.md` | Per-feature PRD tier ≥ anchor tier; money/PII/SLA/regulated → PRD tier mvp+. |
| 7 | `features.md` ↔ `specs/*/prd.md` | Every PRD slug is a feature row; every P0 feature has a PRD or explicit "not yet specced". |
| 8 | `specs/<f>/prd.md` ↔ `specs/<f>/design.md` | PRD scope covered by design; user stories/EARS → modules/endpoints; NFRs reflected. |
| 9 | `architecture/02-components.md` ↔ `specs/*/design.md` | Every component referenced in design exists in the component list (no orphan components). |
| 10 | `architecture/adr/*` ↔ `01-style.md` + `00-characteristics.md` | ADR decisions don't contradict the declared style/characteristics. |
| 11 | `domain-model.md` ↔ `understanding/<slug>` | Aggregates/contexts align with stated invariants/entities; no aggregate violating an invariant. |
| 12 | `domain-model.md` ↔ `.ai/context.md` | Domain-model glossary terms have context.md entries with the same meaning. |
| 13 | `02-components.md § Invariants` + `00-characteristics.md` + `prd.md § NFRs`/`§ Unwanted-EARS` ↔ `fitness/` | **Production only.** Every invariant/characteristic/T-A NFR has a `fitness/` file; every `fitness/` file's `Source:` cites a `file:line` that still exists (orphans → Phase 2). |
| 14 | `specs/<f>/design.md` ↔ `architecture/api-governance.md` | When `.ai/architecture/api-governance.md` exists, every API-contract table in `.ai/specs/<feature>/design.md` conforms to its error envelope, pagination, auth, naming, and versioning conventions; a divergence with no per-feature ADR in `.ai/specs/<feature>/adr/` is a contradiction (cite both `file:line`). |
| 15 | `specs/<f>/ux.md` ↔ `design-system.md` | Every component a feature ux.md uses exists in the design-system inventory or is flagged in `new_components[]`; screen states/copy don't contradict the project interaction-state conventions or token roles. |
| 16 | `specs/<f>/design.md § Test plan` ↔ `test-strategy.md` | Test-plan levels, naming/locations, and fixture/entity-acquisition choices match the locked strategy's pyramid rows and canonical-acquisition table; the feature's mapped E2E journey spec is extended, not paralleled. |
| 17 | `environments.md` ↔ `anchor.md` (`/ship`'s command resolution) | Roster `deploy_mechanism`/`smoke_command` don't contradict `anchor.deploy_command`/`smoke_command`; `flag_system` agrees with the flag system anchor/design mention. |
| 18 | `architecture/threat-model.md` ↔ `architecture[.md\|/]` | `scored_against` components/edges still match `02-components.md` (stale snapshot = contradiction); every routed candidate marked `adopted` verifiably appears in the target artifact (an architecture invariant or a PRD U-id). |
| 19 | `specs/<f>/outcome.md` ↔ `specs/<f>/prd.md` | `outcome.md § Metric` quotes the PRD's success metric verbatim (same number, unit, timeframe); a reworded or renumbered metric is a contradiction. |

### Phase 2 — Stale name references

Identifiers used in one artifact that don't exist in their source-of-truth artifact — each is a CONTRADICTION: components in `design.md` not in `02-components.md`; feature slugs in PRD/design paths not in `features.md`; personas in understanding/PRDs not matching `discovery/<slug>`'s target user; aggregates/contexts not in `domain-model.md`; ADR numbers with no file in `adr/`; `fitness/` files whose `Source:` `file:line` no longer holds the cited rule (orphaned function → re-run `/to-fitness` or delete).

### Phase 3 — Compile

Use the format in [`references/template.md`](references/template.md) (stdout only — no file written). Order by downstream confusion: (1) tier mismatches, (2) target-user/scope/problem mismatches, (3) stale name references, (4) other. Merge a disagreement that appears across multiple pairs into a single finding citing all artifacts.

### Phase 4 — Verdict

End with **exactly one line**: `**COHERENT**` (zero contradictions) or `**N CONTRADICTIONS FOUND**` (no partial credit). No "consider running …". Contradiction-class → resolve-in-skill mapping: [`references/recovery-paths.md`](references/recovery-paths.md).

</what-to-do>

<supporting-info>

## How to actually run the checks

For each pair: (1) read both artifacts **in full** (partial reads cause false positives); (2) extract the named claim from A (e.g. `target_user = "Maya, solo freelancer"`); (3) search B for the same *concept*, not just the same word — absence is not contradiction; (4) compare **semantically** ("solo freelancer" vs "individual contractor" ≈ same; vs "agency owner" = contradiction); (5) **if ambiguous, drop it** — false positives erode trust faster than false negatives.

For stale references: extract proper-noun-ish identifiers, map each to its source-of-truth artifact (components→architecture, features→features.md, personas→discovery, aggregates→domain-model), verify it appears there; if not, emit a finding with both citations.

## What this skill refuses to do

- Edit, write, or delete any file; run another skill to "fix" a finding; archive or rename artifacts.
- Grade the quality of any single artifact (only cross-artifact disagreement is in scope).
- Hallucinate `file:line` citations (can't cite → drop), read code to verify designs, or fetch external URLs.

## When NOT to run

- Greenfield with only `/discovery` run, or only one `.ai/` artifact — coherence needs ≥2 artifacts.
- The user wants to revise an artifact (that's the source skill's job) or wants code-vs-doc coherence (out of scope — doc-vs-doc only).

</supporting-info>
