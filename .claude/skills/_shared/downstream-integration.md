# Downstream integration guide

Handoff for any session building or refactoring **downstream** skills (`/anchor`, `/promote`, `/architect`, `/prd`, `/design`, `/plan`, the build loop, etc.) so they integrate with the already-built front-of-chain (`/intake` → `/discovery` → `/understand` → `/feature-map`).

This file is about **structure and contracts**, not the interview content of the upstream skills. The canonical detail lives in [conventions.md](conventions.md) (folder model) and [ai-schema.md](ai-schema.md) (artifact schemas) — read those before writing a downstream skill.

**Built so far (canonical, in `.claude/skills/`):** `mermaid`, `intake`, `onboard`, `discovery`, `explore`, `understand`, `comprehend`, `feature-map`, `feature-census`, `anchor`, `promote`, `architect`, `health-audit`, `prd`, `design`, `to-fitness`, `plan`, `research`, `to-issues`, `publish-issues`, `build`, `qa`, `ship`, `as-built`, `mtdd-implement`, `mtdd-review`, `mtdd-verify`, `mtdd-merge`, `mtdd-cycle`, `mtdd-init`, `diagnose`, `triage`, `improve-codebase-architecture`, `status`, `next`, `coherence-check`, `bootstrap`, `ddd-strategy`, `event-storm`, `threat-model`, `ux-spec`, `test-strategy`, `data-management`, `environments`, `runbook`, `docs`, `measure`, `sunset`, `critic`, `pipeline`. (**Brownfield on-ramp:** `/onboard` (front door — `/intake` twin; `.ai/intake.md` with `project_type: brownfield`, routes to `/anchor`, skips `/discovery`) → `/anchor` → `/explore` (whole-repo recon → facts-only `.ai/recon.md` via an `Explore` sub-agent) → `/comprehend` (the `/understand` twin; confirms recon's code-derived Section C draft into the **same** `.ai/understanding/<slug>.md` + `.ai/context.md`, with `source_recon`; routes to `/architect`) → `/architect` → optional `/health-audit` gate (lens fan-out + adversarial verify wave → `.ai/health-report.md` + a `.human` gate summary; publishes findings to beads; answers "safe to build on?" before `/prd`) → `/feature-census` (the `/feature-map` twin; inventories SHIPPED features from `recon.md` §B components into the **same** `.ai/features.md`, plus any new `planned` work; `source_recon`; routes to `/prd`). **The brownfield on-ramp is now complete end-to-end** (`/onboard → /anchor → /explore → /environments (RECOVERY) → /data-management (RECOVERY) → /comprehend → /architect → [/health-audit] → /feature-census → /test-strategy → /pipeline (RECOVERY) → /prd`). The feature-boundary `as-built` map is now **built** too (`/as-built` — cross-cutting, origin-agnostic, post-build per-feature code map + drift vs `design.md`; serves greenfield and brownfield features built through the loop). **Batch A (foundation) is complete**; **Batch C (per-feature loop) is complete** (`prd` → `research` → `design` → `to-fitness` → `plan`); the **planning→execution seam is complete** — `to-issues` ✅ and `publish-issues` ✅ both built (Phase 1: beads + Jira/md adapters). **Batch D is underway**: `build` ✅ built (the lean queue-brain + router — the `READY-FOR-BUILD` destination). The chain is `plan → to-issues → publish-issues → build → mtdd-* cycle → qa`, with the verdict tokens `READY-FOR-ISSUES → READY-TO-PUBLISH → READY-FOR-BUILD → READY-FOR-MTDD → READY-FOR-QA`. Only the *autonomous* runner (`ralph-loop-afk`) is Phase 2. **Batch D is now built out**: the `mtdd-*` atoms ✅ (`mtdd-implement` — which also authors the `_build_share` rule-pack briefing — `mtdd-review`, `mtdd-verify`, `mtdd-merge`, `mtdd-cycle`, plus the portable `mtdd-init` setup; the bundle was refactored to drop into any git repo — free-form is the portable core, beads/canonical are opt-in task-source adapters; `mtdd-cycle` drives its implement→review→verify run via a durable, id-matched `.mtdd/cycle-state` state machine — schema in `_build_share/cycle-state.md`, sole-writer orchestrator, fail-loud + resumable — which retired the old free-text `MTDD-AUTONOMOUS` sentinel), `qa` ✅, `ship` ✅, and `diagnose` ✅ (the origin-agnostic **defect entry point** — near-zero preconditions, no `.ai/` artifact; reached standalone or from `/qa`, `/health-audit`, `/as-built`, the build loop; fixes trivial+local bugs inline, routes larger ones as a free-form task or a `category: bug` slice via `/to-issues`; verdicts `FIXED-INLINE` / `ROUTED-AS-BUG` / `NO-SEAM` / `BLOCKED-NO-REPRO`), and `triage` ✅ (the **non-chain inbox** — classifies human-filed bugs/requests + `/health-audit` findings into category/state/priority, **detects and skips** chain-origin tickets, routes bugs to `/diagnose` and ready work into the build path (free-form task or a `category: bug` slice via `/to-issues`); recommend-only, no `.ai/` artifact, no progress-tracker append; verdicts `TRIAGED` / `ROUTED` / `PARKED` / `SURVEY-ONLY` / `SKIPPED-CHAIN-TICKET`. The triage build **decoupled the chain producers**: removed every `/triage` reference + the `needs-triage` emission from `/publish-issues` and `/to-issues`, and renamed `triage_label_map → tracker_label_map` (anchor-owned, used by both `/publish-issues` and `/triage`); only `/health-audit` (feeds findings) and `/diagnose` (receives bugs) still partner with triage), and `improve-codebase-architecture` ✅ (the brownfield **deepening designer** — ranks shallow→deep refactor candidates, designs the chosen one via a design loop + optional design-it-twice, persists `.ai/refactors/<target>.md`, routes the refactor as a `category: enhancement` slice via `/to-issues`; proposal-only, never writes the refactor code; closes `/diagnose`'s `NO-SEAM` post-mortem loop and `/health-audit`'s `ARCHITECTURE-BLOCKS-FEATURE`; verdicts `PROPOSALS-READY` / `DEEPENING-ROUTED` / `RECORDED-AS-ADR` / `NO-FRICTION-FOUND`). **Batch E reporting is now built**: the read-only/reporting set consolidated 6 legacy skills → 3 canonical + 1 shared engine — `status` ✅ (text + HTML lens; merged the old `/status` + `/dashboard`, `--html` writes `dashboard/index.html`, `--write` persists `.ai/specs/<f>/status.md`), `next` ✅ (boundary-aware guidance; merged the old `/next` + `/resume`, `--resume` prepends a staleness-banded backward recap), `coherence-check` ✅ (read-only contradiction audit across `.ai/**`), all three reading the shared `_build_share/project-state.py` generator (a stdlib-Python port of the old TS dashboard scanner — runs uniformly on any target-project language; writes `dashboard/state.json` + optional `index.html`). The legacy `/handoff` was **dropped** (covered by the harness `handoff-session` skill). **`bootstrap` is now built** — the greenfield project-skeleton checklist between `/architect` and the first `/prd` (the foundation-walk step `/anchor`, `/next`, and `/status` already referenced); greenfield-only with a two-layer brownfield refusal (anchor claim + filesystem probe), tier-gated (90/185/250 cap), and — the headline — it **grounds every tool/scaffolder/version it emits via Context7** (`resolve-library-id` + `query-docs`) so commands never name a phantom or stale package, staying within `anchor.approved_dependencies` and applying the same slopsquatting trust bar as `/design` (names the major version + `--frozen-lockfile`; the executable-command arm of `design/references/deps-governance.md`). **The DDD modeling pair is now built**: `ddd-strategy` ✅ (the strategic pre-phase for `/architect` — subdomain classification + bounded-context map + integration matrix → `.ai/architecture/strategic-design.md`; shared ADR counter; closes `/architect`'s `NEEDS-STRATEGIC-DESIGN`) and `event-storm` ✅ (the tactical session — events·aggregates·policies·read-models → `.ai/architecture/domain-model.md`; **origin-branched success verdict** — greenfield→`/feature-map`, brownfield→`/architect`; closes `/understand` + `/comprehend`'s `NEEDS-EVENT-STORM`). Both write structure to `.ai/architecture/` (consumed verbatim by `/architect`) + a `.human` diagram via the mermaid skill; both are conditional (most projects skip them). The legacy `ddd-strategy`'s EventStorming **workshop-session-plan** mode was deliberately dropped (meeting logistics, not a chain artifact). **All three remaining legacy DDD skills are now RETIRED** (dropped — will not be rebuilt, like `dashboard`/`resume-job`/`handoff` before them): `ddd-scaffold` ❌ (copied static skeleton files — superseded by the Context7-grounded `/bootstrap` for project wiring and `/design` + the mtdd build loop for per-feature/domain code; its DDD pattern-selection heuristic already lives in `ddd-strategy/references/heuristics.md`); `grill-with-docs` ❌ (dissolved into already-built skills — one-question terminology grilling + inline glossary updates → `/understand`; stress-testing a plan against ADRs/docs → `/coherence-check`; the 3-trigger ADR offer is a universal convention); and `ddd-audit` ❌ (its DDD domain-smell discipline — anemic models, leaky aggregates, primitive obsession, missing ubiquitous language — is **folded permanently inline into `/health-audit`'s tech-debt lens**, briefed to the lens sub-agent like every other borrowed discipline; there is no separate DDD-audit skill, and `/explore` + `/improve-codebase-architecture` now point at the `/health-audit` lens for domain-smell judgment). Next: **Batch B wrappers** (deliberately skipped so far — manual workflow for now). Everything else still lives in `old_skills_phase2/skills/` and needs refactoring to this contract. The full inventory + suggested order is in [§12](#12-full-skill-inventory--refactor-order). **SDLC-gap wave (now built — these are NEW skills authored to this contract, not ports from `old_skills_phase2/`):** `threat-model` ✅, `ux-spec` ✅, `test-strategy` ✅, `data-management` ✅, `environments` ✅, `runbook` ✅, `docs` ✅, `measure` ✅, `sunset` ✅, plus `pipeline` ✅ (the **delivery-contract lock** between `/environments` and the loop — tier-gated gate matrix grounded in `pipeline/references/gate-matrix.md` mapping the tier dial onto the OSPS Baseline L1–L3 + Scorecard + SLSA + DORA; deploy-vs-release stance; supply-chain controls; dep-update automation; monitoring-as-code `[Pr]`; and a gap table whose rows route as ordinary slices per conventions.md § CI/CD changes are ordinary slices — never workflow-file writes; brownfield RECOVERY scans CI/dep-update/release/signing configs with `file:line` citations; re-run at `/promote` / `/to-fitness`; verdicts `PIPELINE-LOCKED` / `SKIPPED-PROTOTYPE` / `BLOCKED-ON-ANCHOR|ENVIRONMENTS|BOOTSTRAP`; consumed by `/design`, `/qa`, `/ship`, `/promote`) — the chain is now complete end-to-end; only the optional Batch B front-door wrappers (`idea`/`orchestrate`/`prototype`) remain unbuilt, deliberately (manual workflow for now). **Canonical routing (encoded in `README.md` + the §2 diagram below):** greenfield foundation `/architect → [/threat-model (prod/uplift)] → [/ux-spec (UI)] → /test-strategy → [/data-management (datastore)] → /bootstrap → /environments → /pipeline → [/docs readme (mvp+ external)] → per-feature loop`; brownfield `/explore → /environments (RECOVERY) → /data-management (RECOVERY) → /comprehend → /architect → … → /feature-census → /test-strategy → /pipeline (RECOVERY) → loop`; per-feature `/prd → [/ux-spec] → [/research] → /design → /plan → /to-issues → /publish-issues → /build → mtdd-* → /qa → [/runbook (prod)] → [/docs] → /ship → [/measure (post-timeframe)]`, with `/sunset` (`shipped → deprecated → removed`) owning the lifecycle tail.

---

## 1. The two-folder model (non-negotiable)

```
.human/        HUMAN-facing. Prose + Mermaid. The only place a person reads/edits.
.ai/           MACHINE-facing source of truth. Structured (YAML/tables/fixed sections). Agents read this.
```

Every downstream skill writes its **machine artifact to `.ai/`** and, if a human needs to see/approve the result, a **plain-English mirror to `.human/summaries/`**. Humans never parse `.ai/`; agents never scrape `.human/`.

---

## 2. The chain & where artifacts land

```
/onboard      → .human/intake/idea.md          + .ai/intake.md (project_type: brownfield)             [BUILT]  ← brownfield front door; routes to /anchor (skips /discovery)
/explore      → .ai/recon.md                                                                          [BUILT]  ← brownfield, once-per-project, after /anchor; facts-only sub-agent recon; no .human mirror; READY-FOR-COMPREHEND / READY-FOR-ARCHITECT
/comprehend   → .ai/understanding/<slug>.md   + .ai/context.md + .human/summaries/understanding.md     [BUILT]  ← brownfield /understand twin; confirms recon Section C draft; source_recon; READY-FOR-ARCHITECT
/health-audit → .ai/health-report.md          + .human/summaries/health-audit.md                       [BUILT]  ← brownfield, optional gate (after /architect, before /prd) or standalone; lens fan-out + verify wave + tracker publish; SAFE-TO-PROCEED / FIX-CRITICAL-FIRST / ARCHITECTURE-BLOCKS-FEATURE / AUDIT-COMPLETE
/feature-census → .ai/features.md             + .human/summaries/features.md                           [BUILT]  ← brownfield /feature-map twin; inventories SHIPPED features from recon §B (+ planned new work); same features.md schema; source_recon; READY-FOR-PRD
/intake       → .human/intake/idea.md          + .ai/intake.md (project_type: greenfield)            [BUILT]
/discovery    → .ai/discovery/<slug>.md         + .human/summaries/discovery.md                       [BUILT]
/understand   → .ai/understanding/<slug>.md     + .ai/context.md + .human/summaries/understanding.md  [BUILT]
/feature-map  → .ai/features.md                 + .human/summaries/features.md                        [BUILT]
──────────────────────────── downstream (to refactor) ────────────────────────────
/anchor       → .ai/anchor.md  + .human/summaries/anchor.md  (+ seeds progress-tracker.md, CLAUDE.md)   [BUILT]
/promote      → mutates anchor lifecycle_stage/project_tier + .human/summaries/promotion.md  (lifecycle gate; pairs with /anchor)  [BUILT]
/architect    → .ai/architecture.md  OR  .ai/architecture/*  + .human/summaries/architecture(.md|/)  (HLD; diagrams in .human only)  [BUILT]
/threat-model → .ai/architecture/threat-model.md  + .human boundary diagram  [BUILT]  ← production/uplift (pii·money·regulatory·external-dependants); STRIDE-lite over the locked architecture; routes draft invariants → /architect + Unwanted-EARS → /prd (→ /to-fitness); refreshed at /promote; THREAT-MODEL-LOCKED[-WITH-OPEN-THREATS] / SKIPPED-TIER
/ux-spec      → .ai/design-system.md (project)  OR  .ai/specs/<feature>/ux.md (per UI feature)  + .human mirror  [BUILT]  ← UI projects only; locks the design system / per-feature screens+states; DESIGN-SYSTEM-LOCKED / READY-FOR-DESIGN / SKIPPED-NO-UI
/test-strategy → .ai/test-strategy.md            + .human mirror (mvp+)  [BUILT]  ← locks the project test contract (pyramid·fixtures·canonical entity acquisition·E2E journeys); brownfield recovers conventions; every red-first slice + /qa regression cite it
/data-management → .ai/data-management.md        + .human mirror (prod)  [BUILT]  ← project data policy (skip if no datastore); migration reversibility + retention/PII; brownfield RECOVERY mode; read by /design, /to-issues, /ship
/bootstrap    → .ai/bootstrap.md                 (greenfield only)
/environments → .ai/environments.md              + .human mirror (mvp+)  [BUILT]  ← env roster + config inventory (names + where SET, NEVER values) + secrets policy + flags + IaC; brownfield RECOVERY mode; re-run when a slice adds config; ENVIRONMENTS-LOCKED
/pipeline     → .ai/pipeline.md                  + .human mirror (mvp+)  [BUILT]  ← delivery contract (gate matrix · deploy-vs-release · branch protection · rollback mechanism · supply chain · dep-update automation · monitoring-as-code [Pr] · gap table); contract only — gaps route as ordinary slices (conventions.md § CI/CD); brownfield RECOVERY mode; re-run at /promote, /to-fitness, or env/suite changes; read by /design, /qa, /ship, /promote; PIPELINE-LOCKED
/docs         → root README.md / docs/<feature>.md / docs/api.md  (real project files)  [BUILT]  ← faithful end-user docs assembler (mvp+ external users); marker-owned sections only; /docs readme after /bootstrap, /docs <feature> between /qa and /ship; DOCS-WRITTEN
/prd          → .ai/specs/<feature>/prd.md       (N×, per feature)  + .human/specs/<feature>/prd.md (mvp+ derived mirror)  [BUILT]
/design       → .ai/specs/<feature>/design.md    (N×)  + .human/specs/<feature>/design.md (ALWAYS — sequence diagram)  [BUILT]
/plan         → .ai/specs/<feature>/plan.md       (N×)  (vertical slices, tracer-bullet first; NO .human mirror; READY-FOR-ISSUES)  [BUILT]
/to-issues    → .ai/specs/<feature>/issues/SLICE-N.md (N× per feature)  + flips features.md planned→building  (no .human mirror; READY-TO-PUBLISH)  [BUILT]
/publish-issues → mutates SLICE-N.md (backend_refs + status open→published); --backend=md also materializes tickets/<feature>/SLICE-N-<slug>.md  (one backend/run; no new artifact; READY-FOR-BUILD)  [BUILT]
/build        → no artifact; reads issues/SLICE-N.md + backend state, picks next ready slice, routes  (queue-brain; only side effect: progress-tracker append on READY-FOR-QA; emits READY-FOR-MTDD / READY-FOR-QA / BLOCKED-ON-*)  [BUILT]
/qa           → .ai/specs/<feature>/qa-report.md  + .human/specs/<feature>/qa-report.md  [BUILT]  ← feature-boundary gate; /build's READY-FOR-QA destination; tier-aware evidence (closure·coverage·regression·security·a11y·fitness) via built-ins, human acceptance+exploratory gate; flips features.md building→qa-approved; READY-FOR-SHIP → /ship
/runbook      → .ai/runbooks/<feature>.md  + .human/runbooks/<feature>.md (MANDATORY prose)  [BUILT]  ← production; compiles the incident runbook from the specs (compile-not-invent); /ship's checklist cites it, /diagnose reads it FIRST in an incident; /runbook --slo → .ai/slo.md; RUNBOOK-WRITTEN / SLO-LOCKED
/ship         → no new artifact; flips features.md qa-approved→shipped (+ tracker, optional CHANGELOG)  [BUILT]  ← the release gate (/sunset owns the lifecycle tail); lean continuous-delivery; reads qa-report.md; release notes to chat; CD-aware (delegates deploy to the pipeline/human, never deploys); SHIPPED / AWAITING-DEPLOY / NO-OP / BLOCKED-ON-STATUS|QA
/measure      → .ai/specs/<feature>/outcome.md  (+ project .ai/outcomes.md)  [BUILT]  ← post-ship feedback-loop closer (after the metric timeframe); ACTUAL vs PRD target (human-supplied — a miss is written as a miss); routes keep | iterate (→ /feature-map|/prd) | remove (→ /sunset); METRIC-MET / METRIC-MISSED / METRIC-PARTIAL
/sunset       → .ai/specs/<feature>/sunset.md  [BUILT]  ← lifecycle tail shipped→deprecated→removed (human-gated at both flips, like /ship); blocks on live dependants; routes removal as build work — never deletes code/flags/data itself; the /measure decision:remove destination
/as-built     → .ai/specs/<feature>/as-built.md  + .human/specs/<feature>/as-built.md  [BUILT]  ← cross-cutting, post-build, per-feature; origin-agnostic; slice-manifest-fed (untouched shipped feature → NOT-LOOP-BUILT → /explore); .ai structured + .human Mermaid; AS-BUILT-WRITTEN[-WITH-DRIFT]
/ddd-strategy → .ai/architecture/strategic-design.md  + .human/summaries/strategic-design.md  [BUILT]  ← DDD pre-phase for /architect (optional; /architect or /event-storm routes here on NEEDS-STRATEGIC-DESIGN); subdomains + bounded-context map + integration matrix; shared ADR counter; READY-FOR-ARCHITECT / NEEDS-EVENT-STORM / BLOCKED-ON-UNDERSTANDING
/event-storm  → .ai/architecture/domain-model.md  + .human/summaries/domain-model.md  [BUILT]  ← tactical model (optional; /understand or /comprehend routes here on NEEDS-EVENT-STORM); events·aggregates·policies·read-models; origin-branched verdict — greenfield → READY-FOR-FEATURE-MAP, brownfield → READY-FOR-ARCHITECT; also NEEDS-STRATEGIC-DESIGN / NEEDS-MORE-MODELING / BLOCKED-ON-CONTEXT
```

`slug` is set once by `/intake` (kebab-case, ≤30 chars, names the idea) and reused unchanged by every stage. `<feature>` slugs are minted by `/feature-map`.

> The legacy versions of these downstream skills are in `old_skills_phase2/skills/`. They already read `.ai/discovery/<slug>.md`, `.ai/understanding/<slug>.md`, `.ai/anchor.md`, `.ai/features.md`, `.ai/progress-tracker.md`. Refactor them to the rules below; the upstream artifacts now match their `<slug>` path expectations. **Heads-up:** they reference the old skill name `/discover` and the old `CONTEXT.md` — see the naming reconciliation in [§12](#12-full-skill-inventory--refactor-order).

---

## 3. What downstream skills consume (the new inputs)

| Read this | For | Notes |
| :--- | :--- | :--- |
| `.ai/intake.md` | slug, `predicted_tier`, `technical_user`, `uplift_signals`, `project_type` | the cheap orchestration index — read it first |
| `.ai/discovery/<slug>.md` | JTBD, success metric, scope (v0_1/deferred/non_goals), `entities`, verdict | frontmatter is the index; load only the sections you need |
| `.ai/understanding/<slug>.md` | invariants, behaviors, boundaries, assumptions | references `context.md` for term/entity definitions |
| `.ai/context.md` | glossary + entity models + relationships | the cross-skill reuse hotspot; read this instead of re-deriving the domain |

**Read the frontmatter first.** Every `.ai` artifact carries a YAML frontmatter index (verdict, tier, entities, `consumed_by`, links). Decide from ~15 lines whether you need the body, then extract only the fixed-order sections you consume. Do not load whole files by default.

---

## 4. Artifact contract — rules every `.ai` file must follow

1. **Frontmatter is the index.** High-signal fields up top: `slug`, `stage`, `status`, `verdict` (if gated), `tier`/`tier_signal`, key lists (`entities`, etc.), `consumed_by`, and `source`/links to upstream + the human mirror. `created: YYYY-MM-DD`.
2. **Fixed section order.** Same `##` headings in the same order for every artifact of a kind, so a consumer can grep one section without reading the rest.
3. **Structure over narrative.** YAML lists, tables, `key: value`. A one-line definition is fine; a paragraph of prose is a smell.
4. **No diagrams in `.ai/`.** Use state lists, ER tables, entity YAML. Mermaid is `.human/` only.
5. **Define once.** Domain terms/entities live only in `.ai/context.md`; reference them by name elsewhere. No duplication across artifacts (it drifts).
6. **Slug discipline.** Reuse the upstream `slug`; never re-slug. Feature artifacts nest under `.ai/specs/<feature>/`.
7. **Declare `consumed_by`.** List which downstream skills read this artifact so the dependency graph is explicit.

Add a new schema block to [ai-schema.md](ai-schema.md) for each new `.ai` artifact kind you introduce, following the existing four as the pattern.

---

## 5. The `.human` mirror rule

A downstream skill writes a `.human/summaries/<stage>.md` mirror **when a human needs to see or approve the output** (a verdict, a plan, a design they sign off on). Internal mechanical artifacts (e.g. a build plan only the agent executes) may skip it — use judgement.

When you do write a mirror:
- Lead with the verdict/recommendation in **one plain sentence**.
- 3–6 jargon-free bullets for the *why*.
- **One Mermaid diagram** that earns its place, generated via the **mermaid skill** (so it's validated before it ships).
- Link back to the `.ai/` artifact.
- Diagrams live in `.human/` only.

---

## 6. Gates are advisory, not blocking

Any gated downstream skill (e.g. `/architect` readiness, a `/plan` go/no-go) follows the same pattern as `/discovery` and `/understand`:

- Run the full analysis; issue the real verdict with reasons.
- The user may override a negative verdict → set `verdict_overridden: true` in frontmatter, record their stated reason in the decision section, and still write the artifact.
- Never water down the analysis or silently flip a verdict to avoid blocking. Gatekeep by honesty, not by refusal.

---

## 7. The tier dial

Read `predicted_tier` from `.ai/intake.md` and scale rigor:
- **prototype** — minimal. Skip or condense heavy stages; lean toward proceeding. Note what you skipped.
- **mvp** — full depth.
- **production** — full depth + extra rigor (security, observability, eval gates).

`uplift_signals` (money, pii, sla, external-dependants, regulatory) in `.ai/intake.md` may bump the effective tier. Honor them.

---

## 8. Progress tracker

`.ai/progress-tracker.md` is the append-only session log. Every skill:
- reads the top 5 entries at start (session context),
- appends one entry on a success verdict, format:

```markdown
## YYYY-MM-DD — <stage> landed (<slug>)
- Artifact: `.ai/<path>` — verdict: <VERDICT>.
- Key decisions: <one or two>.
- Next: <next skill + why>.
```

Seed it from the stub in [conventions.md](conventions.md) if absent (`/intake` normally does this).

---

## 9. Mermaid skill contract

Whenever a downstream skill produces a `.human` diagram, it calls the **mermaid skill** rather than hand-writing Mermaid. Contract: hand it the intent + data; it returns a fenced ```mermaid block that has passed `.claude/skills/mermaid/scripts/validate_mermaid.py`. Diagrams never go into `.ai/`.

---

## 10. Skill-authoring rules (apply to every downstream SKILL.md)

These mirror what the front-of-chain skills follow (validated against `write-a-skill`):

- **Plain-English questioning (interactive skills).** Any skill that asks the user questions states a one-line pointer to [`conventions.md` § Talking to the human](conventions.md#talking-to-the-human-every-skill-that-asks-questions) as a critical rule: plain English, one question at a time, propose a recommended answer, offer simple options when stuck, adapt to `technical_user` from `.ai/intake.md`, and keep the skill's jargon (entity, invariant, NFR, slice…) in the `.ai/` artifact — never in the question.
- **Lean `SKILL.md`** — keep the body well under 500 lines; push question banks, anti-patterns, schemas, examples into `references/`.
- **References one level deep.** `SKILL.md → references/x.md` only. Cross-skill links to `../_shared/*.md` are fine (one hop). Never chain `references/a.md → references/b.md` as a load path.
- **Frontmatter rules (blocking):** third person, ≤1024 chars, WHAT + WHEN triggers, `Do NOT use for …` negatives, **no angle brackets** (`<` `>`) anywhere in frontmatter — so don't write `<slug>` in a description; say "under .ai/discovery/" instead. Name has no "claude"/"anthropic".
- **Body structure:** directive/interview skills use the XML `<what-to-do>` / `<supporting-info>` split; reference/lookup skills use Markdown headers.
- **Validate before done:** `python .claude/skills/write-a-skill/scripts/validate_frontmatter.py <path>` (must show no FAIL), then the write-a-skill quality checklist.
- **Shared contracts:** reference `../_shared/conventions.md` and `../_shared/ai-schema.md` rather than re-stating the folder model or schemas inline.

---

## 11. Canonical files (the source of truth)

```
.claude/skills/_shared/conventions.md            folder model, chain, advisory gates, tier dial, tracker
.claude/skills/_shared/ai-schema.md              schemas for every .ai artifact kind (intake · discovery · understanding · context · features · anchor · architecture · per-feature specs · and the SDLC-gap artifacts: threat-model · data-management · environments · pipeline · test-strategy · runbook/slo · measure · sunset)
.claude/skills/_shared/downstream-integration.md this file
.claude/skills/mermaid/                           validated-diagram skill + scripts/validate_mermaid.py
.claude/skills/{intake,discovery,understand,feature-map}/  the built front-of-chain (read for house style)
old_skills_phase2/skills/                         legacy skills to refactor (the source you port FROM)
old_skills/                                       earlier legacy of intake/discover/understand/anchor (superseded)
```

**First moves for a downstream session:** (1) read `conventions.md` + `ai-schema.md`; (2) read the legacy version of the skill you're refactoring in `old_skills_phase2/skills/<name>/`; (3) map its old artifact reads to the contract above; (4) add any new `.ai` schema to `ai-schema.md`; (5) decide whether it needs a `.human` mirror; (6) keep `SKILL.md` lean and validate frontmatter. Read `.claude/skills/feature-map/` as the most recent worked example.

---

## 12. Full skill inventory & refactor order

The complete suite lives in `old_skills_phase2/skills/` (44 skills). Refactor in batches, in chain order — each batch builds on the contract the previous one locks in. Don't do all at once.

**Status (current):** every chain skill in the table below is ✅ BUILT. Beyond the 44 ports, the **SDLC-gap wave** added 10 NEW skills authored directly to this contract — `threat-model` · `ux-spec` · `test-strategy` · `data-management` · `environments` · `pipeline` · `runbook` · `docs` · `measure` · `sunset` — which complete the chain end-to-end (foundation pre-phases, the UI/test/data/env/threat/delivery locks, and the post-`/qa` runbook → docs → ship → measure → sunset tail; see §2, the canonical-routing summary in the intro above, and `README.md`). The only unbuilt items are the optional Batch B front-door wrappers (`idea`/`orchestrate`/`prototype`), skipped by choice.

| Batch | Skills | Status / notes |
| :--- | :--- | :--- |
| **Front of chain** | `mermaid` · `intake` · `discovery` · `understand` · `feature-map` | ✅ **BUILT** in `.claude/skills/` — canonical |
| **A — Foundation** | `anchor` ✅ → `promote` ✅ → `architect` ✅ | `anchor` ✅ **BUILT** (read ~30×, highest fan-out; locks `project_tier`, seeds `lifecycle_stage`). `promote` ✅ **BUILT** — advisory lifecycle gate; mutates `lifecycle_stage`/`project_tier` in lockstep (the field anchor seeds; only `/promote` moves it), appends `stage_history`, writes `.human/summaries/promotion.md`, routes back into `/anchor` update mode for the new tier's fields. `architect` ✅ **BUILT** — one-time HLD; inherits the locked `project_tier`; `.ai` holds STRUCTURE (style, components, dependency-edge table, characteristics YAML, ADRs), every C4 diagram goes to `.human/summaries/architecture` via the mermaid skill; ADR counter shared with `/ddd-strategy`. **Batch A complete. Do next: Batch B (`idea` · `orchestrate` · `prototype`).** Conditionals now built: `ddd-strategy` ✅ (DDD strategic pre-phase — `NEEDS-STRATEGIC-DESIGN` destination), `event-storm` ✅ (tactical modeling — `NEEDS-EVENT-STORM` destination), `explore` ✅, `bootstrap` ✅ — invoked only when a real project needs them. |
| **B — Front-door wrappers** | `idea` · `orchestrate` · `prototype` | After A. `idea`/`orchestrate` only *sequence* other skills — update their routing to the rebuilt names/paths, don't duplicate logic. Only fully testable once the skills they call are done. |
| **C — Per-feature loop** ✅ **COMPLETE** (+ seam ✅) | `prd` ✅ → `research` ✅(opt) → `design` ✅ → `to-fitness` ✅(prod) → `plan` ✅ → `to-issues` ✅ → `publish-issues` ✅ | N× per feature. All nest under `.ai/specs/<feature>/` (folder convention + `prd.md`/`design.md`/`plan.md`/`research.md`/`issues/SLICE-N.md` schemas now in ai-schema.md). The chain is `plan → to-issues → publish-issues → build loop`; both are Phase 1 (only the autonomous runner is Phase 2). `prd` ✅ **BUILT** — per-feature contract; computes effective `tier = max(project_tier, feature_uplift)`; EARS + invariant-defense at production; architecture required at mvp+; derived `.human/specs/<feature>/prd.md` mirror at mvp+ only. `design` ✅ **BUILT** — per-feature LLD; **inherits** the effective `tier` from `prd.md` (never recomputes) + the stack from `anchor` + components/invariants from `architect`; **decides** the HOW (modules, file layout, schema deltas, API contracts, call flow, test plan, per-feature ADRs); refuses orphan features (`NEEDS-ARCHITECTURE-UPDATE`); governs new libs against `anchor.approved_dependencies` (flags `dep_adds[]`; anchor owns the list); call flow is a step list in `.ai`, the `sequenceDiagram` is the **always-on** `.human` mirror; lean per-surface checklist (incl. mandatory AI/LLM rigor) in `design/references/surfaces.md`. `plan` ✅ **BUILT** — per-feature build contract; **inherits** the effective `tier` from `prd.md` (never recomputes) + file paths from `design.md` (verbatim) + `New dependencies` from `design.md § External dependencies`/`dep_adds[]` (propagation, never re-judges or invents — a missing import bounces `BLOCKED-ON-DESIGN`); **decides** vertical, dependency-ordered, independently-mergeable slices (Slice 1 always the tracer bullet) with mechanical per-slice acceptance (tests + NFR target + production fitness function); production invariant-defense table maps every Unwanted-EARS clause to a slice; success verdict `READY-FOR-ISSUES → /to-issues` (names the immediate next skill — `READY-FOR-BUILD` is reserved for `/publish-issues`, emitted where beads are minted and the build loop actually opens; a quick prototype may skip the tracker and build straight from `plan.md`); `plan.md` schema now in ai-schema.md. `to-fitness` ✅ **BUILT** — production-tier-only **code generator** (not a `.ai` artifact → no ai-schema block, no `.human` mirror); mechanizes architecture invariants + `characteristics.yaml` `fitness_fn`s + anchor `codebase_legibility_rules` (project scope) and a feature's PRD NFRs + Unwanted-behavior EARS defenses (feature scope) into runnable `fitness/` (or `fitness/<feature>/`) assertion files, one per rule, each citing `file:line` + a red-first `FAILS WHEN:`; picks the ArchUnit-family lib from `anchor.language`; CODEOWNERS-protects `fitness/`; idempotent (orphans listed, never auto-deleted); generator-not-executor (emits the test command, never runs it); reuses `architect/references/characteristics.md § Fitness function library`; verdicts `READY-FOR-PLAN` (feature) / `READY-FOR-PRD` (project) / `NEEDS-MECHANIZATION` / `NEEDS-ORPHAN-CLEANUP` / `SKIPPED-NON-PRODUCTION` / `BLOCKED-ON-*`. `research` ✅ **BUILT** — optional **brownfield-only** per-feature scout; spawns an `Explore` sub-agent (parent reads ≤5 files), writes a citation-heavy, **facts-only** `.ai/specs/<feature>/research.md` (no `.human` mirror, no diagrams) — existing tooling, comparable patterns, conventions, constraints, library options (NOT decided), prior art, and ≤5 Open questions for `/design`; **inherits** `tier` + `placement` from `prd.md`; greenfield short-circuits to `/design`; destination for design's `NEEDS-RESEARCH`; verdicts `READY-FOR-DESIGN` / `RESCOPE-NEEDED → /prd` / `BLOCKED-ON-PRD` / `BLOCKED-ON-ANCHOR`; `research.md` schema now in ai-schema.md. `to-issues` ✅ **BUILT** — the planning→execution seam; decomposes `plan.md` into one **canonical, tracker-agnostic** `.ai/specs/<feature>/issues/SLICE-N.md` per slice (faithful transformer — mirrors plan/prd, invents nothing); classifies each slice (AFK/HITL + `hitl_reason`, language, tests, category) and stamps tier-scaled traceability (`satisfies_*`); writes **files only, no tracker side effects** + flips features.md `planned → building`; **no `.human` mirror** (the human view of issues is the Jira/md projection `/publish-issues` writes); verdicts `READY-TO-PUBLISH → /publish-issues` / `NEEDS-STATUS-RESOLUTION → /feature-map` / `NEEDS-RESLICE` / `BLOCKED-ON-PLAN|PRD|ANCHOR`; `issues/SLICE-N.md` schema now in ai-schema.md. `publish-issues` ✅ **BUILT** — the side-effecting half of the seam and `/to-issues`'s `READY-TO-PUBLISH` destination; a **pure idempotent adapter** that pushes `SLICE-N.md` files to **ONE** backend per run (`--backend=beads|jira|md`) and **mutates the canonical files in place** (writes `backend_refs.<backend>` + flips `status: open→published`) — it authors **no new artifact and no `.human` mirror** (the `md` backend, materialized at `tickets/<feature>/SLICE-N-<slug>.md`, IS the human projection; beads is the machine build-loop queue; Jira/md are human views); idempotent via `backend_refs` × `status` (CREATE/UPDATE/CLOSE/SKIP), topological create order, schema-validates every file upfront (one bad file refuses the whole run → `BLOCKED-ON-SCHEMA`), refuses to close in-progress upstream (`BLOCKED-ON-CONFLICT`), auth fail-fast (`BLOCKED-ON-AUTH`), single-bd-writer guard (`.ralph-state/` — kept as a correctness guard though the autonomous runner is Phase 2), write-back is the last step per slice (crash-resumable → `PARTIAL`), pure `--dry-run`, AI-generated disclaimer on every body; Jira adapter prefers the **Atlassian Rovo MCP** tools (env/`acli` fallback); keeps the label-vocabulary + `tracker_label_map` contract (anchor-owned label remapping; no triage coupling); success verdict **`READY-FOR-BUILD → /build`** (the Batch-D build loop — built; for now beads slices run the manual `mtdd` loop, jira/md hand to an operator). Mirror rule for the loop (per-skill "review OR diagram" test): **prd** → mvp+ only; **design** → always (sequence diagram → `.human`); **plan**/**to-fitness**/**research**/**to-issues** → never (machine artifacts; to-issues' human view is the Jira/md projection). EARS folded into `prd/references/ears.md` (cross-linked one-hop by `/design` + `/to-fitness` + `/plan` + `/to-issues`). **Batch C + the full planning→execution seam (`to-issues` ✅ + `publish-issues` ✅) done. Batch D underway: `build` ✅ (lean queue-brain + router — reads `issues/SLICE-N.md` + backend terminal state, done-detects across beads/jira/md, dependency-gates, routes the next ready slice; frozen-canonical — "done" is a runtime fact on the bead/jira/materialized-md, never a canonical `status`; no artifact, no `.human` mirror; tier-agnostic; verdicts `READY-FOR-MTDD → /mtdd-implement` / `READY-FOR-QA → /qa` / `BLOCKED-ON-PUBLISH|DEPENDENCY|ISSUES`). Now built out: the `mtdd-*` atoms (`mtdd-implement` also authors the `_build_share` rule-pack briefing — NOT `/build`), `qa` ✅, `ship` ✅, `diagnose` ✅ (defect entry point — no `.ai/` artifact; standalone or routed from `/qa`/`/health-audit`/`/as-built`/build loop). `/triage` ✅ built (non-chain inbox; decoupled from the chain producers). `/improve-codebase-architecture` ✅ built (Batch E — brownfield deepening designer; `/diagnose`'s `NO-SEAM` + `/health-audit`'s `ARCHITECTURE-BLOCKS-FEATURE` target). Remaining: the autonomous `ralph-loop-afk` runner (Phase 2), Batch B wrappers, and the Batch E read-only/reporting + DDD set.** |
| **D — Execute / ship** | `build` → `mtdd-implement` → `mtdd-review` → `mtdd-verify` → `mtdd-merge` → `qa` → `ship`; plus `diagnose`, `triage`, `mtdd-cycle-i-r-v` | The build/verify/release loop. |
| **E — Brownfield + DDD + read-only** | `health-audit` ✅ · `explore` ✅ · `ddd-strategy` ✅ · `event-storm` ✅ · `improve-codebase-architecture` ✅ · `coherence-check` ✅ · `critic` ✅ · `as-built` ✅ · `status` ✅ · `next` ✅ · ~~`ddd-audit`~~ ❌ retired · ~~`ddd-scaffold`~~ ❌ retired · ~~`grill-with-docs`~~ ❌ retired | Lowest priority. Read-only/utility skills mostly *walk* `.ai/`+`dashboard/state.json` — low risk; do last. `health-audit` is the brownfield discovery front door (counterpart to intake→discovery→understand for existing code). `improve-codebase-architecture` ✅ built — brownfield deepening designer (proposal-only; persists `.ai/refactors/<target>.md`; `/diagnose` + `/health-audit` route to it). **The DDD modeling pair is built**: `ddd-strategy` ✅ (strategic — `.ai/architecture/strategic-design.md`) + `event-storm` ✅ (tactical — `.ai/architecture/domain-model.md`), both conditional, both consumed verbatim by `/architect`. Reporting trio (`status`/`next`/`coherence-check`) ✅ over `_build_share/project-state.py`. **Retired legacy skills** (dropped, not rebuilt): `dashboard`→`/status --html`, `resume-job`→`/next --resume`, `handoff`→dropped, `ddd-scaffold`→superseded by `/bootstrap` + `/design` + build loop, `grill-with-docs`→dissolved into `/understand` + `/coherence-check`, `ddd-audit`→folded into `/health-audit`'s tech-debt lens. **The entire legacy DDD set is now resolved** — modeling pair built, scaffold/audit/grill retired. `critic` ✅ built (NEW, not a port — cross-cutting clean-context **single-artifact review gate**: one fresh-context subagent grades one `.ai` artifact against its contract — ai-schema section + effective tier + direct upstreams via its registry; bloat and gaps weigh the same; only `blocker` findings flip the verdict; two rounds max then human accept gate; `--verify` fact-checks falsifiable claims via Context7/web; stdout-first, `--write` → disposable `NAME.critique.md` (not a chain artifact — no ai-schema block); verdicts `CRITIC-PASS` / `CRITIC-REVISE → /source-skill` update mode; never edits; the depth twin of `/coherence-check`'s pair-wise breadth). |

### Naming reconciliation (do this in every refactor)

The rebuilt front-of-chain renamed/relocated things the legacy skills still reference. When porting a skill, fix:

| Legacy reference | New canonical |
| :--- | :--- |
| `/discover` (skill + verdicts like `BLOCKED-ON-DISCOVERY → /discover`) | **`/discovery`** |
| `CONTEXT.md` (root) | **`.ai/context.md`** (glossary + entity models; schema in ai-schema.md) |
| `.ai/discovery/SLUG.md` / `.ai/understanding/SLUG.md` (uppercase SLUG) | lowercase **`<slug>`** |
| front door writes only `.ai/intake.md` | also writes **`.human/intake/idea.md`**; routes to `/discovery` |
| machine artifacts carrying prose/diagrams | structured `.ai/` + a **`.human/summaries/<stage>.md`** mirror |

Standardize on **`discovery`** (not `discover`) everywhere — update each skill's reads, verdicts, and hand-off routing as you port it.

### Note on overlap

`old_skills_phase2/skills/` still physically contains earlier copies of skills that have since been rebuilt (`discover`→`discovery`, `understand`, `anchor`, `intake`, `write-a-skill`, `event-storm`, `ddd-strategy`, …). Wherever a `.claude/skills/` version exists it is **canonical** — the phase2 copy is only the *source it was ported from*, never the working reference. The phase2 dir remains the port source solely for skills not yet rebuilt (the remaining Batch B wrappers). `ddd-audit`, `ddd-scaffold`, and `grill-with-docs` are **retired** — their phase2 copies are dead source, kept only for history.
