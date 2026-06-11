---
name: critic
description: |-
  Clean-context review gate for a single SDLC artifact. Spawns one fresh-context subagent that adversarially grades a .ai document against its explicit contract — schema, effective tier, and direct upstream inputs — and reports severity-rated findings plus a CRITIC-PASS or CRITIC-REVISE verdict routing back to the source skill's update mode. Treats bloat and gaps as equal defects; never edits the artifact. With --verify it also fact-checks externally-falsifiable claims (Context7 for library claims, web for market/security claims). Use when the user says "/critic", "critique this doc", "review the PRD/design/plan artifact", "grade this spec", "fact-check this artifact", or asks whether a freshly written artifact is good enough. Do NOT use for: cross-artifact contradictions (/coherence-check), code or diff review (/code-review, /mtdd-review), feature verification (/qa), fixing the artifact (the source skill's update mode), or auto-running after another skill — run only on explicit request.
argument-hint: "[artifact-path] [--verify] [--write]"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Agent
  - Write
---

# critic — clean-context artifact review gate

One artifact in, one structured critique out. A cross-cutting advisory gate, not a
chain stage: a fresh-context subagent grades a single `.ai` artifact against its
contract — schema, effective tier, direct upstream inputs — unbiased by the
conversation that generated it. The critic reports; the source skill fixes.

<what-to-do>

## Critical rules

1. **Never edit the artifact.** No Write/Edit on the reviewed file or its upstreams. Fixes happen in the source skill's update mode — `CRITIC-REVISE` names that skill; the user runs it (never auto-invoke it).
2. **The sub-agent does the review.** Assemble the brief, then spawn ONE `general-purpose` Agent with the filled skeleton from [references/sub-agent-prompt.md](references/sub-agent-prompt.md). The parent never grades the artifact itself — the clean window is the point. Parent work is brief assembly before, citation spot-checks (≤5 Reads) after.
3. **Contract, not taste.** Every finding cites the artifact location (`:line` or `§section`) + the contract clause it violates (a schema requirement, a tier rule, or a contradicted/unsatisfied upstream claim with its own citation) + a concrete fix. A finding that can't name its clause is dropped.
4. **Tier-aware in BOTH directions.** Completeness is judged against the effective tier's contract, never maximal coverage — a prototype artifact without production sections is correct. Excess is a defect with the same weight as a gap: over-cap length, restated rules, sections beyond schema, narrative where the schema wants structure.
5. **Severity gates the verdict.** `blocker` (schema violation, contradicted upstream, missing required section/trace, leaked secret value, refuted load-bearing claim) / `major` (weakens the contract: ambiguous requirement, untestable criterion, unexplained deviation) / `suggestion` (improvement). **Only blockers cause CRITIC-REVISE** — majors and suggestions ship with a PASS.
6. **Bounded loop — two rounds max.** An existing `NAME.critique.md` beside the artifact, or a prior critique of it this session, makes this round 2. Round 2 with blockers still emits CRITIC-REVISE plus the note that accept-or-revise is now the human's call (advisory gate — [`../_shared/conventions.md` § Gates](../_shared/conventions.md#gates-are-advisory-not-blocking)). Never a third round.
7. **External verification is selective.** Run it only when `--verify` is passed OR the Phase-2 scan finds externally-falsifiable claims. Library/package/version claims → Context7; market/competitor/security claims → web. A project's own decisions (scope, priorities, slicing, naming) are not externally verifiable — never web-search those.
8. **Single-artifact depth.** Verify only against the artifact's *direct* upstreams from the registry. Pair-wise breadth across the whole `.ai/` set is `/coherence-check` — don't duplicate it.
9. **Mirrors are projections — review the source.** Given a `.human/**` path, switch to its `.ai/` source and say so (a wrong mirror is regenerated from the source, not critiqued).
10. **Stdout-first.** Print the critique; write nothing by default. `--write` saves it beside the artifact as `NAME.critique.md` — a disposable feedback file for the revision (delete it once the revision lands), not a chain artifact: no ai-schema block, no `.human` mirror, no tracker append.

## Procedure

Copy this checklist:

```
critic progress:
- [ ] Phase 0: Resolve target + registry row + round
- [ ] Phase 1: Assemble the brief (schema section, tier, upstreams)
- [ ] Phase 2: Claim scan (verification on/off)
- [ ] Phase 3: Spawn the clean-context reviewer
- [ ] Phase 4: Validate findings, spot-check citations
- [ ] Phase 5: Report + verdict
```

### Phase 0 — Resolve the target

Explicit path → use it. No path → `Glob` `.ai/**/*.md` and `reports/*.md` (results come most-recently-modified first), propose the top non-mirror, non-critique candidate, confirm before reviewing. Match the path to its [registry row](#artifact-registry) for kind, source skill, and upstreams. No row → **generic mode**: grade against [`../_shared/downstream-integration.md` §4](../_shared/downstream-integration.md) (frontmatter-is-index, fixed sections, structure over narrative) and state that no kind-specific schema applies.

### Phase 1 — Assemble the brief

Read the artifact's frontmatter. Grep the kind's schema heading in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Resolve the **effective tier**: artifact frontmatter `tier:` → else `.ai/anchor.md` `project_tier` → else `.ai/intake.md` `predicted_tier` → else say "no tier found, grading at mvp". List the registry upstreams that exist on disk; note absent ones in the report header (absence of an upstream is a note, not a finding).

### Phase 2 — Claim scan

Skim the artifact for externally-falsifiable claims: named packages/libraries/CLI tools/versions; market, competitor, or pricing statements; security claims (CVEs, attack patterns, compliance assertions). Any found, or `--verify` passed → verification ON, claim types listed. Otherwise OFF — say so in one line and skip it in the sub-agent prompt.

### Phase 3 — Spawn the reviewer

Fill every `{{...}}` in [references/sub-agent-prompt.md](references/sub-agent-prompt.md) and run it as ONE `general-purpose` Agent. Pass **paths, not pasted content** — the subagent reads the files itself; that is the clean context. Do not pass this conversation's history or any opinion of the artifact.

### Phase 4 — Validate findings

Drop any returned finding missing a location, a violated clause, or a fix. Spot-check ≤5 citations with `Read` — one hallucinated citation kills that finding and means re-checking every other finding of the same severity. De-duplicate overlapping findings.

### Phase 5 — Report + verdict

Print the report (format below); `--write` → also save it as `NAME.critique.md`. End with exactly one verdict line:

- `CRITIC-PASS` — zero blockers (majors/suggestions may exist; they're listed, not blocking).
- `CRITIC-REVISE → /SOURCE-SKILL` — ≥1 blocker. Name the source skill from the registry; the user reruns it in update mode with this critique as input.
- Round 2 and still blocked → append: **second round — accept or revise is the human's call.**

## Report format

```markdown
# Critique — PATH (round N)
kind: KIND · source: /SKILL · tier: TIER · upstreams read: N (absent: …) · verification: on (M claims) | off

## Findings
- [BLOCKER] §section-or-:line — what is wrong (violates: CLAUSE) → fix: …
- [MAJOR] …
- [SUGGESTION] …

## Claims checked            ← only when verification ran
- "claim" — CONFIRMED | REFUTED | UNVERIFIABLE (source)

## Verdict
CRITIC-PASS | CRITIC-REVISE → /SKILL (blockers: N)
```

</what-to-do>

<supporting-info>

## Artifact registry

The schema for every kind is the matching section of [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Upstreams are the *direct* inputs to verify traceability against (F = a feature slug).

| Artifact | Source skill | Direct upstreams | Review emphasis |
|---|---|---|---|
| `.ai/intake.md` | `/intake` (greenfield) · `/onboard` (brownfield) | — front door | slug kebab ≤30; tier, uplift signals, technical_user present |
| `.ai/discovery/SLUG.md` | `/discovery` | intake.md | JTBD + SMART metric + kill criteria; scope matches the captured idea |
| `.ai/understanding/SLUG.md` | `/understand` · `/comprehend` (brownfield: + recon.md) | discovery, context.md | invariants testable; terms defined once in context.md |
| `.ai/context.md` | `/understand` | understanding | one definition per term; entity YAML parses |
| `.ai/features.md` | `/feature-map` · `/feature-census` (brownfield: + recon §B) | understanding (behaviors), discovery (scope) | every feature traces to a journey; forced 1–N priority; tier cap |
| `.ai/anchor.md` | `/anchor` | intake.md | stack consistent with approved_dependencies; tier honors uplift |
| `.ai/recon.md` | `/explore` | anchor (stack) | facts-only; every claim cited path:line; zero recommendations |
| `.ai/architecture.md` or `.ai/architecture/*` | `/architect` | anchor, features.md, context (+ strategic-design, domain-model if present) | verb-noun components; dependency edges named; ADRs numbered |
| `.ai/architecture/strategic-design.md` | `/ddd-strategy` | understanding, context.md | subdomain classification justified; integration matrix complete |
| `.ai/architecture/domain-model.md` | `/event-storm` | understanding, context.md | aggregates don't violate stated invariants |
| `.ai/architecture/threat-model.md` | `/threat-model` | architecture (components/edges), anchor (uplift) | threats scored 1–9; claims: CVEs, attack patterns |
| `.ai/design-system.md` · `.ai/specs/F/ux.md` | `/ux-spec` | features.md · per-feature: prd, design-system.md | screens/states trace to user stories |
| `.ai/test-strategy.md` | `/test-strategy` | anchor (stack), architecture | claims: framework names/versions |
| `.ai/data-management.md` | `/data-management` | anchor, architecture | migration reversibility + retention/PII covered |
| `.ai/environments.md` | `/environments` | anchor | config NAMES only — a secret value present = blocker |
| `.ai/pipeline.md` | `/pipeline` | anchor (release_policy), environments, test-strategy | gates cite real suites; every mandatory-for-tier control present or in the gap table; brownfield rows cited file:line; claims: tool names |
| `.ai/bootstrap.md` | `/bootstrap` | anchor (approved_dependencies), architecture | claims: EVERY package/CLI command; tier cap 90/185/250 |
| `.ai/health-report.md` | `/health-audit` | recon.md | findings cited; verdict matches the evidence |
| `.ai/specs/F/prd.md` | `/prd` | features.md row, anchor, architecture, context.md | effective tier = max(project, uplift); SMART metric; EARS at production |
| `.ai/specs/F/research.md` | `/research` | prd (tier + placement), anchor | facts-only; path:line citations; cap 90/185/250; ≤5 open questions |
| `.ai/specs/F/design.md` | `/design` | prd, architecture components, anchor approved_dependencies (+ research, test-strategy if present) | orphan component = blocker; claims: new libraries |
| `.ai/specs/F/plan.md` | `/plan` | design (paths + deps verbatim), prd | slice 1 = tracer bullet; every slice traces to an F-ID/story |
| `.ai/specs/F/issues/SLICE-N.md` | `/to-issues` | plan, prd | faithful transform — invented scope = blocker |
| `.ai/specs/F/qa-report.md` | `/qa` | prd, issues | evidence per tier; misses reported as misses |
| `.ai/runbooks/F.md` | `/runbook` | design, environments | compiled from specs, not invented |
| `.ai/specs/F/outcome.md` | `/measure` | prd | PRD metric quoted verbatim; a miss written as a miss |
| `.ai/specs/F/sunset.md` | `/sunset` | features.md, outcome | dependants checked before deprecate/remove |
| `.ai/specs/F/as-built.md` | `/as-built` | design (drift), slice manifests | drift table honest; commit-pinned |
| `.ai/refactors/TARGET.md` | `/improve-codebase-architecture` | health-report or diagnose post-mortem | proposal-only; candidates ranked |
| `reports/*.md` | `research-report` | — | claims: ALL of them; two-source rule; sources real and dated |

## Bloat heuristics (excess findings)

- Over the kind's hard line cap where one exists (research, bootstrap: 90/185/250 by tier).
- The same rule stated more than twice; prose paragraphs where the schema wants YAML/tables.
- Sections outside the schema's fixed order; content duplicated from an upstream instead of referenced ("define once" — downstream-integration §4).
- Diagrams in `.ai/` (they belong in `.human/` only).

## Claim types → verifier

| Claim | Verifier | Blocker when |
|---|---|---|
| Package/library/CLI exists, version, API syntax | Context7 (`resolve-library-id` → `query-docs`) | named package doesn't exist (slopsquat) or version is fabricated |
| Market/competitor/pricing/adoption statement | WebSearch + WebFetch, two independent sources | load-bearing claim refuted (unverifiable → major, flagged) |
| Security: CVE, attack pattern, compliance assertion | WebSearch (advisories, vendor docs) | cited CVE/control doesn't exist or doesn't say that |
| The project's own scope/priorities/naming/slicing | none — judgment, not fact | — (grade against upstreams only) |

</supporting-info>
