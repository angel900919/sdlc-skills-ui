# DOGFOOD-LOG v2 — clean brownfield re-run

**Goal:** Fresh-session clean walk of the brownfield on-ramp to (a) dynamically validate the 9 gate/routing fixes from v1 (DOGFOOD-LOG I-4…I-8 + audit A-1/A-2/A-3) as an order-following brownfield user actually hits them, and (b) fire the **real `/mtdd-review` verifier delegation** on a feature diff (I-9 follow-through — direct-probe already Verified this session; the skill-driven delegate branch is the last owed corner).

**Setup (this session, 2026-06-13):**
- Branch `dogfood/brownfield-rerun-v2` off `develop` @ `9b1f16c`. **develop stays pristine** — the branch is the experiment; the durable output is the findings recorded here + in memory.
- v1 on-ramp artifacts renamed aside: `.ai/ → .ai.archived-v1/`, `.human/ → .human.archived-v1/` (committed; preserved for fresh-vs-prior diffing; invisible to `inject-state`, which reads exact `.ai/...` paths). Tier lock (`.ai/anchor.md` `project_tier`) thereby reset to `unknown` → genuine first-arrival condition.
- `.beads/` left intact (closed v1 feature issues don't block a new walk; Dolt reset is heavy/risky). Tracking bead: **scc-89u** (claimed).
- Constraint: all 10 on-ramp skills are `disable-model-invocation` → the **user types each `/<cmd>`**; I drive the analysis inside each step. The `mtdd-*` skills ARE model-invocable (that's what lets the verifier delegation fire at the loop stage).

**Verifier pre-result (before the walk):** a direct `subagent_type: verifier` probe fired cleanly in this fresh session (8 read-only tool uses, real vitest exit-0, `file:line` evidence, no chain-verdict tokens, plus a genuine fresh-eyes catch on the C1 "age" sub-clause). → I-9 registry-snapshot fix **Verified**; the **skill-driven** `/mtdd-review`→delegate branch is what this walk still owes.

---

## Canonical brownfield on-ramp order (the sequence to walk)

`/onboard` → `/anchor` → `/explore` → `/environments` → `/data-management` → `/comprehend` → `/architect` → `/feature-census` → `/test-strategy` → `/pipeline`
then a per-feature loop: `/prd` → `/ux-spec` → `/design` → `/plan` → `/to-issues` → `/publish-issues` → `/build` → `/mtdd-implement`/`/mtdd-review`/`/mtdd-verify` → `/qa` → `/ship`

## Stage log

| # | Stage | Verdict / gate hit | Notes |
|---|-------|--------------------|-------|
| — | setup | OK | branch + archive done |
| 1 | `/onboard` | **READY-FOR-ANCHOR → /anchor** ✓ | Phase-0 gates both correct: real source → brownfield (not GREENFIELD); `.ai/intake.md` absent → fresh arrival (not ALREADY-ONBOARDED). Wrote `.ai/intake.md` (`project_type: brownfield`, tier `mvp`), `.human/intake/idea.md`, seeded fresh `.ai/progress-tracker.md`. Product answers reused from archived v1 under standing auth. No gate impossibility. |
| 2 | `/anchor` | **READY-FOR-ARCHITECT** ✓ | **`BLOCKED-ON-INTAKE` correctly did NOT fire** (intake present) — the I-4…I-8 rename's positive path. Brownfield scan reused detected stack; `git-flow` branching detected from `.mtdd/config`+branches; no `v*` tags → versioning tentative (flagged). Locked tier `mvp`, `ai_in_core_path: false`, 3 tentative fields. CLAUDE.md: suggested-skipped (authoritative file present). Wrote `.ai/anchor.md` + human mirror. |
| 3 | `/explore` | **READY-FOR-COMPREHEND** ✓ | **I-3 validated live** — `general-purpose` sub-agent (NOT `Explore`) scanned read-only, wrote full report to `/tmp/recon-draft-…`, replied only the path + counts; parent read it back intact (118 citations, 130 lines, 9 components). 3 citations spot-checked accurate (no hallucination). **I-7 re-ordering confirmed** — hand-off prose routes `/environments`+`/data-management` between recon and `/comprehend`. Wrote `.ai/recon.md`. |
| 4 | `/environments` | **ENVIRONMENTS-LOCKED** ✓ | **RECOVERY mode** (brownfield) scanned disk, no greenfield gate fired (`BLOCKED-ON-BOOTSTRAP` is greenfield-only). Found no `.env*`/CI/Docker/IaC → 1 local env; 11 config vars all optional-with-defaults, 0 secrets; every row cited. Reused already-validated promotion-flow mermaid. Wrote `.ai/environments.md` + human mirror. |
| 5 | `/data-management` | **DATA-MANAGEMENT-LOCKED** ✓ | **A-1 fix exercised** — brownfield + architecture **absent** → WARN, not `BLOCKED-ON-ARCHITECT` (now greenfield-only); datastore gate read `anchor.db`(sqlite)+recon §A4; `SKIPPED-NO-DATASTORE` correctly silent. RECOVERY scan: no framework — boot DDL + `ensureColumn` additive migrations; reversibility=argued-irreversible (re-derivable local store). Citations refreshed for prune line-shifts. Wrote `.ai/data-management.md`. |
| 6 | `/comprehend` | **READY-FOR-ARCHITECT** ✓ | Brownfield domain-recovery door: recon present → `BLOCKED-ON-RECON` silent; not the `GREENFIELD → /understand` door. Confirmed recon §C9 (15 candidates → context.md 16 terms/11 entities) + §C10 (12 invariants, all domain-confirmed, citations refreshed for prune line-shifts) + 3 journeys + §E 3 mystery zones resolved. Wrote `.ai/context.md`, `.ai/understanding/<slug>.md`, human mirror (3 validated diagrams). |
| 7 | `/architect` | **READY-FOR-PRD** ✓ | **A-2/A-3 fix exercised** — brownfield + discovery **absent** → `BLOCKED-ON-DISCOVERY` silent (greenfield-only); JTBD from idea.md+understanding. Style modular-monolith-with-event-bus; 7 verb-noun components + 10 edges; **shared ADR counter** continued docs/adr/0001-0003 → bundle adr/0004-0007. api-governance written (citations refreshed). 2 C4 diagrams. Wrote `.ai/architecture/` bundle + human mirror. |
| 8 | `/feature-census` | **READY-FOR-PRD** ✓ | Brownfield census door (recon+understanding present → blocks silent; not GREENFIELD). 17 shipped features cataloged × components × behaviors; v1's planned P0 (pruning) now shipped → re-cataloged as inventory. planned_count=0 (build queue empty → human selects next). Wrote `.ai/features.md` + human mirror. |
| 9 | `/test-strategy` | **TEST-STRATEGY-LOCKED** ✓ | anchor+architecture present → blocks silent (confirms architect ran first; I-7 order census→test-strategy→pipeline holds). RECOVERY: vitest workspace, factory builders, tmp-dir SQLite (now established by prune tests), 3 named Playwright journey specs. Counts refreshed 16→19 files / 163 tests. Wrote `.ai/test-strategy.md` + mirror. |
| 10 | `/pipeline` | **PIPELINE-LOCKED** ✓ | anchor+environments present → blocks silent (confirms environments ran first). RECOVERY: no CI — 5 gates (2 agent-time enforced, 3 manual), 3 open gaps left for owner waiver. Citations refreshed (package.json:17, settings.json:18). **ON-RAMP COMPLETE (10/10).** Wrote `.ai/pipeline.md` + mirror. |

_(rows appended as each stage runs)_

## On-ramp verdict: 10/10 stages walked, every gate-fix validated

| v1 fix | guard | how it failed before | v2 result |
|---|---|---|---|
| I-4…I-8 | `BLOCKED-ON-INTAKE` rename (`/anchor`) | fired `BLOCKED-ON-DISCOVERY`, mis-routed to `/discovery` | ✓ silent (intake present), positive path |
| I-3 | `/explore` sub-agent contract | `Explore` agent can't write + compresses → cited report lost | ✓ live: 118-cite report survived via `/tmp` draft |
| I-7 | hand-off re-ordering | env/data-management/feature-census out of canonical order | ✓ order held across explore→…→pipeline |
| (greenfield-only) | `BLOCKED-ON-BOOTSTRAP` (`/environments`) | could block brownfield with no skeleton | ✓ silent on brownfield |
| A-1 | `BLOCKED-ON-ARCHITECT` (`/data-management`) | required architecture, impossible pre-architect on brownfield | ✓ WARN not block; read anchor.db + recon |
| A-2/A-3 | `BLOCKED-ON-DISCOVERY` (`/architect`) | required greenfield discovery artifact | ✓ silent on brownfield; used idea.md + understanding |

No gate impossibility encountered anywhere. The brownfield on-ramp is now walkable end-to-end by an order-following user.

## Per-feature loop: `storage-breakdown-by-table` (the verifier-firing vehicle)

Selected at the on-ramp→loop boundary (build queue was empty after the census). Drove the full loop on a feature branch off the dogfood line (`develop` untouched; `.mtdd/config` target temporarily repointed at the dogfood branch):

| Stage | Result | Note |
|---|---|---|
| `/prd` | READY-FOR-DESIGN | on roster (added as planned P0), 3 NFRs, invariant 1 defended by N3 |
| `/design` | READY-FOR-PLAN | **honest brownfield finding**: the per-kind table already renders → scope narrowed to largest-first + share-of-total via a new pure `@sdlc/shared` module |
| `/plan` | READY-FOR-ISSUES | 1 vertical tracer slice (small feature) |
| `/to-issues`+`/publish-issues` | bead `scc-10g` | acceptance criteria a-h |
| `/mtdd-implement` | branch + RED→GREEN→GREEN | `summarizeStorageBreakdown` pure module TDD'd (6 specs); StoragePanel wired; tdd-check PASS; 174/174 tests; typecheck clean |
| **`/mtdd-review`** | **COMPLETE** | **★ THE OWED I-9 ITEM — real skill-driven verifier delegation fired ★** |

### ★ Verifier delegation — Verified end-to-end (the headline result)
`/mtdd-review scc-10g` step 1.7 launched ONE `verifier` subagent via the actual skill delegation (not a direct probe). The verifier independently: ran tdd-check (exit 0) + `npm test` (174/174, exit 0) + `tsc` (exit 0); graded all 8 acceptance criteria with `file:line` evidence, mutation checks, and a full AI-code audit (Context-Gap / Phantom-deps / YAGNI / Test-Theater / Risk → ACCEPT); returned **evidence only, no verdict token** (contract held); and honestly flagged criterion (g)'s on-screen render as not-exercised-this-session. Parent spot-checked 3 citations (all accurate), carried the ticks, owned the COMPLETE verdict. **This closes I-9's last corner**: the same-context-bias value the verifier design exists for is now demonstrated in the real `/mtdd-review` path, not just a probe. (`/mtdd-verify` + `/qa` delegation paths are the same mechanism, still unfired — lower risk.)

### Loop stop point (human decisions pending)
Stopped after `/mtdd-review` — both primary re-run goals achieved (gate-fixes validated + verifier delegation fired). NOT done (need direction): `/mtdd-verify`/`/mtdd-merge`/`/qa`/`/ship`; whether to keep the feature (cherry-pick to `develop`) or discard with the dogfood branch; restore `.mtdd/config` target to `develop`; the still-deferred destructive prune `POST` + browser smokes; the eventual `develop → main` merge.

### Gate observations
- **Stage 1 (`/onboard`):** Phase-0 routing fork worked as designed for a brownfield fresh arrival — proceeded to capture+route rather than short-circuiting. Confirms the archive reset produced a genuine first-arrival state. No issue.
- **Stage 2 (`/anchor`):** The renamed `BLOCKED-ON-INTAKE → /onboard | /intake` gate (v1 fix, was the mis-routing `BLOCKED-ON-DISCOVERY`) read `.ai/intake.md`, found it present, and proceeded — its positive path. The negative path (intake absent → route by repo-vs-idea) wasn't exercised here but is the same one-line check. No gate impossibility; brownfield foundation locked cleanly. No issue.
- **Stage 3 (`/explore`):** Two v1 fixes exercised together. **I-3 (sub-agent contract):** the `general-purpose`/`/tmp`-draft mechanism worked end-to-end — a 32-tool-use scan produced a 118-citation report that reached the parent intact via the draft file (the exact failure mode the fix addressed: `Explore` agent type can't write + compresses output). **I-7 (hand-off re-ordering):** the `READY-FOR-COMPREHEND` hand-off prose correctly inserts `/environments` + `/data-management` (RECOVERY) between recon and `/comprehend`. No issue.
