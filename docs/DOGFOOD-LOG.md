# Dogfood log — running the SDLC chain on its own repo

**Date:** 2026-06-13 · **Branch:** `develop` · **Mode:** autonomous (user-authorized)

## Run conditions (deviations from designed usage — read first)

The chain is designed human-in-the-loop: a human types each slash command, answers
interviews one question at a time, and signs the human gates. This run deviates,
with the user's explicit blanket authorization:

1. **Autonomous driving.** The agent runs each stage itself instead of the human
   typing commands. Chain skills are `disable-model-invocation`, so invocation
   mechanics differ from real usage (noted per stage below).
2. **Defaults assumed.** Every interview takes the skill's own proposed answer.
   Where the agent substitutes session knowledge for a human answer, the artifact
   says so.
3. **Human gates auto-passed on the record.** Gates (`/qa` acceptance, `/ship` go)
   are passed under the user's standing authorization and flagged in the artifact —
   the chain's own override-on-the-record convention.

**What this run live-verifies for the first time:** verifier subagent delegation
(mtdd-review / mtdd-verify / qa), guard-paths `ask` escalation, inject-state
orientation block with real artifacts, mtdd-init seeding in the source repo.

## Stage log

| # | Stage | Verdict | Issues hit | Fixes applied |
|---|---|---|---|---|
| 1 | /onboard | READY-FOR-ANCHOR | I-1, I-2 | I-2 fixed (schema comment) |
| 2 | /anchor | READY-FOR-ARCHITECT | — (2 observations) | none needed |
| 3 | /explore | READY-FOR-COMPREHEND | I-3, I-4 | both fixed (skill edits) |
| 4 | /environments | ENVIRONMENTS-LOCKED | — | — (mermaid sub-invocation worked first try, kroki-validated) |
| 5 | /data-management | DATA-MANAGEMENT-LOCKED | I-5 | fixed (greenfield-only architecture gate) |
| 6 | /comprehend | READY-FOR-ARCHITECT | — | — (triage + mystery-zone walk worked as designed; 3/3 diagrams kroki-validated) |
| 7 | /architect | READY-FOR-PRD (→ /feature-census) | I-6, I-7 | both fixed (skill edits) |
| 8 | /feature-census | READY-FOR-PRD | — | — (two-population model worked; P0 sourced from the run's own data-management finding) |
| 9 | /test-strategy | TEST-STRATEGY-LOCKED | I-8 | fixed (footer order matched to canonical) |
| 10 | /pipeline | PIPELINE-LOCKED | — | — (recovery honest about zero CI; gaps left open, never auto-waived) |

**Foundation complete** — 10 stages, 8 issues found, 7 fixed, 1 by-design.

### Per-feature loop — observability-data-pruning (the P0 planned feature)

| # | Stage | Verdict | Issues hit | Fixes applied |
|---|---|---|---|---|
| 11 | /prd | READY-FOR-DESIGN | — | — (mvp PRD; also fixed /research's latent I-3 sub-agent bug preemptively) |
| 12 | /ux-spec (feature) | READY-FOR-DESIGN | — | — (no design-system doc → WARN-and-proceed worked as designed) |
| 13 | /design | READY-FOR-PLAN | — | — (chunked-vacuum feature ADR; sequence diagram kroki-validated) |
| 14 | /plan | READY-FOR-ISSUES | — | — (3 vertical slices, tracer first) |
| 15 | /to-issues | READY-TO-PUBLISH | — | — (planned→building flip; slice 2 HITL) |
| 16 | /publish-issues (beads) | READY-FOR-BUILD | — | — (3 beads, dep edges, refs written back; frozen-spec ask fired live) |
| 17 | /build | READY-FOR-MTDD (scc-m7w) | — | — (done-detection + dep-gate picked the tracer correctly) |
| 18 | /mtdd-implement SLICE-1 | implement done | — | — (TDD red→green→green; 159 tests pass, typecheck clean) |
| 19 | /mtdd-review SLICE-1 | COMPLETE (degraded) | I-9 | fixed (fallback diagnostics in 3 skills) |
| 20 | /mtdd-verify + /mtdd-merge SLICE-1 | merged 0327f3f, bead closed | I-10 | noted (beads tracked-export tree-dance) |
| 21 | /build → SLICE-2 | READY-FOR-MTDD | — | bd ready picked scc-b51 |
| 22 | /mtdd-* SLICE-2 (HITL prune engine) | merged e644a28, bead closed | — | 5 engine tests; reclaim-loop infinite-loop guard added |
| 23 | /build → SLICE-3 | READY-FOR-MTDD | — | bd ready picked scc-0bb |
| 24 | /mtdd-* SLICE-3 (confirm UI) | merged 6ea9e24, bead closed | — | pure formatters TDD'd in shared; UI smoke-deferred |
| 25 | /build | READY-FOR-QA | — | all 3 slices done |
| 26 | /qa | READY-FOR-SHIP | I-11 | fixed (tagged NFR ids in tests so check e traces) |
| 27 | /ship | SHIPPED | — | local-first: shipped = merged + runs-from-source; no deploy/tag; flip on standing auth |

**CHAIN COMPLETE END-TO-END.** Brownfield on-ramp (onboard→…→pipeline) + one full
per-feature loop (prd→…→ship) on a real P0 feature. 27 stages, 11 issues found
(I-1…I-11), 9 fixed in-session, 2 environmental/by-design and noted. ~45 commits;
168 tests (11 new); 8 mermaid diagrams kroki-validated; 3 beads minted+closed.
`observability-data-pruning` shipped; success metric due ~2026-06-27 (`/measure`).

## Issues & fixes (detail)

_(numbered as I-1, I-2, … — referenced from the table above)_

- **I-1 (by design, no fix)** — The Skill tool refuses `disable-model-invocation`
  skills (`Skill onboard cannot be used with Skill tool due to
  disable-model-invocation`). Autonomous orchestration therefore executes each
  SKILL.md's content manually after reading it. This exercises the skill
  *instructions* faithfully but not the harness's slash-command loading path —
  a structural limit of any autonomous dogfood of this chain.
- **I-2 (fixed)** — `_shared/ai-schema.md` intake-stub template: the `ready_for`
  comment listed only `discovery`/`feature-map`, but `/onboard` (brownfield)
  always routes to `anchor`. One-line comment fix.
- **I-3 (fixed — the big one so far)** — `/explore` Phase 3 mandated
  `subagent_type=Explore` with the report returned as the agent's final message.
  **The Explore agent type compresses its final message to a conclusion and
  cannot write files** — two live runs returned a *summary of* the report
  instead of the report, the second despite an explicit hard output contract
  (it even misread the 300-line cap as a word cap). The skill's design was
  structurally incompatible with its own template. Fix: general-purpose
  sub-agent under read-only discipline writes the full report to a `/tmp`
  draft path; the parent reads, spot-checks, and slots it. Third run: 183-line
  report, 161 citations, 3/3 spot-checks accurate. Files: `explore/SKILL.md`
  (rule 3, Phase 3), `explore/references/sub-agent-prompt.md`, schema prose in
  `_shared/ai-schema.md`. **`/research` uses the same Explore-returns-report
  pattern — same latent bug; fix when the loop reaches it.**
- **I-4 (fixed)** — Routing contradiction: README/QUICKSTART and the canonical
  order in `_shared/downstream-integration.md` place `/environments` (RECOVERY)
  and `/data-management` (RECOVERY) **between** `/explore` and `/comprehend`,
  but `/explore`'s verdict + hand-off prose routed straight to `/comprehend`,
  silently skipping both. A verdict-following user would never run them. Fix:
  canonical-order note added to `explore/references/hand-off.md` + SKILL.md
  Phase 8 bullet.
- **I-5 (fixed)** — I-4's sibling, one level deeper: `/data-management` rule 3
  hard-required `.ai/architecture` (`BLOCKED-ON-ARCHITECT`), but the canonical
  brownfield order runs it BEFORE `/comprehend → /architect` — every
  order-following brownfield run would block. The gate exists for greenfield
  (architecture decides where data lives); in RECOVERY the datastore is on
  disk and `anchor.db` + recon §A4 answer the gate. Fix: architecture
  requirement made greenfield-only (warn on brownfield), rule 3 + Phase 1
  table. Pattern worth a sweep: foundation skills written greenfield-first may
  carry more brownfield-impossible gates.
- **I-6 (fixed)** — `/architect` rule 1 hard-required `.ai/discovery/`
  (`BLOCKED-ON-DISCOVERY`), but brownfield skips `/discovery` by design
  (`/onboard` → `/anchor` directly). Every brownfield run would block. Same
  class as I-5 (greenfield-written gate impossible on brownfield). Fix: gate
  made greenfield-only; brownfield substitutes `idea.md` + understanding.
- **I-7 (fixed)** — `/architect`'s brownfield success verdict hands off to
  `/prd`, but `/feature-census` (which `/prd` needs for its roster) runs AFTER
  `/architect` in the canonical order — `features.md` doesn't exist yet, so
  the verdict-follower blocks. Fix: hand-off now routes to `/feature-census`
  first when `features.md` is absent. Third routing bug in the brownfield
  on-ramp (with I-4, I-5): **the brownfield order was documented but its
  verdict tokens/gates were never walked end-to-end before this dogfood.**
- **I-8 (fixed)** — `/test-strategy`'s "Position in the SDLC" footer put it
  BEFORE `/feature-census`, contradicting the canonical order (census first —
  correctly so: the E2E table maps journeys to owning features, which need
  the roster to exist). One-line footer fix. Fourth ordering inconsistency in
  the brownfield on-ramp.
- **I-9 (fixed — the verifier delegation's first live test, and it surfaced a
  real gap)** — At `/mtdd-review` SLICE-1 the `verifier` subagent launch failed:
  `Agent type 'verifier' not found. Available agents: claude, claude-code-guide,
  Explore, general-purpose, Plan, statusline-setup`. The agent file **was**
  seeded — `/mtdd-init --write` wrote `.claude/agents/verifier.md` earlier this
  same turn (confirmed on disk) — but the harness **snapshots the agent registry
  at session start**, so an agent seeded mid-session isn't registered until the
  next session. Consequence for the memory note `verifier-subagent-design.md`
  ("delegation not yet live-verified"): now live-tested, and the result is that
  **the very first session after seeding always falls into the degraded
  in-context fallback** — the delegation can never fire in the same session that
  seeds it. The skill's fallback behaviour is correct (the Agent tool errors, the
  skill grades in-context and labels the degradation — done here), but its
  *diagnostic advice* was wrong for this case: it said "point the user at
  `/mtdd-init --write`", which re-writes an already-correct file and changes
  nothing. Fix: all three delegating skills (`mtdd-review` §1.7 fallback,
  `mtdd-verify` step 2.5 fallback, `qa` rule 3) now distinguish **not seeded**
  (→ `/mtdd-init --write`) from **seeded-but-not-registered-this-session**
  (→ restart the session; another `/mtdd-init` won't help). This run's SLICE-1
  review used the honest in-context grade, labelled "degraded — same-context,
  agent seeded but not yet registered". The clean same-context bias case the
  verifier was built to fix will get its true live test on the **next** session's
  `/mtdd-review` (SLICE-2 or a re-review), now that the agent is on disk.
- **I-10 (noted, no skill fix — environmental)** — Each `bd` write (`note`,
  `update`, `close`) re-exports `.beads/issues.jsonl`, which this repo
  git-tracks. During the mtdd loop this repeatedly dirtied the tree at the
  exact moment `/mtdd-merge` does `git checkout <target>`, twice aborting the
  checkout ("Aborting … local changes would be overwritten"). The merge skill
  already warns about the tracked-export revert hazard and tells the human to
  commit issues.jsonl before any branch switch — so this is *documented*, but
  the dogfood shows it's not a rare edge: it happens on essentially every
  merge because verify/review write bead notes right before. Workable
  (commit the export, then checkout) but it adds a commit-dance to every
  slice. Candidate improvement (not made — it's a setup choice, not a skill
  bug): recommend gitignoring `.beads/issues.jsonl` in the chain's beads
  setup so the Dolt DB is the single source of truth and the export never
  dirties the tree. Logged for the maintainer; BEADS-SETUP.md already covers
  the safe config.
- **I-11 (fixed)** — `/qa` check e greps **test source** for each NFR's id
  token (`grep tests for NFR-2`). The feature's tests covered N1/N3/N4
  behaviourally but didn't carry the id tokens, so a mechanical trace found
  only N2 — a strict reading would FAIL the gate over a tagging gap while real
  coverage existed. Fixed the substance: tagged the covering assertions in
  `storagePrune.test.ts` with `NFR N1 / N3 / N4` comments (comment-only, no
  assertion changed) so the trace is honest. **Process lesson:** nothing
  upstream forces NFR-id tokens into test code — `/plan` acceptance and
  `/to-issues` carry `satisfies_nfrs`, but the *test* that proves an NFR isn't
  required to name it, so `/qa`'s grep can't follow the thread. Candidate
  hardening (not made — bigger than this run): have `mtdd-implement`'s red
  phase tag the NFR id in the test it writes for an NFR-bearing slice.
- **Observation (no fix)** — `/data-management`'s frontmatter enums
  (`migration_tool`, `naming`, `ordering: timestamps | sequential-ids`) assume
  file-based migration tooling; a boot-DDL app (inline `CREATE TABLE` +
  `ensureColumn`) fits none of them. Used `n-a-*` values following the
  schema's own `backup_last_tested: n-a` precedent. The schema could bless
  `none`/`n-a` for these fields explicitly.

## Verdict on the dogfood (what it proved)

**The chain is sound; its brownfield on-ramp had never been walked end-to-end.**
Of 11 findings, the load-bearing cluster (I-4 → I-8) was a single class:
**greenfield-first authoring left brownfield gates and verdict-routing that no
order-following brownfield user could pass** — every one would have hard-blocked
a real adopter at `/data-management`, `/architect`, or `/test-strategy`. Documented
order ≠ verified order; the dogfood is what turned the prose contract into a walked
one. I-3 (Explore agent can't return a cited report) and I-9 (verifier seeded
mid-session isn't registered) were structural: skills depending on subagent
behaviour that the harness doesn't actually provide the way the skill assumed.
Everything downstream of the on-ramp (the per-feature loop, beads, mermaid,
guard-paths, the TDD gate) worked close to as-designed. **Still unverified after
this run:** the verifier's *same-context-bias* value — it degraded to in-context
on all three reviews because it can't fire in its own seeding session (I-9); the
true test is the next session. And every live UI/app smoke was human-deferred —
the chain's automated evidence is real (168 tests, integration over a real DB),
but no browser/curl was driven this run.

## Follow-up: static gate audit (post-run, generalize the I-4…I-8 class)

The walk fixed five gate/routing bugs (I-4…I-8) as I tripped them — on **one** path,
**one** feature, **one** tier. To catch the rest of the *class* without re-walking, I
swept all 55 `SKILL.md` gates statically against the canonical orders. Method + result:

**The class reduces to one artifact.** The brownfield twins write the *same* files as
the greenfield front (`onboard`→intake, `comprehend`→understanding+context,
`feature-census`→features), so the **only greenfield-exclusive artifact is
`.ai/discovery/<slug>.md`**. Therefore every "brownfield-impossible gate" is a hard
dependency on `discovery` (or a verdict that routes to `/discovery`). That made the
audit a closed search, not a vibe check.

**Enumerated all `BLOCKED-ON-*` gates (78 across 39 skills); cross-checked each against
the greenfield / brownfield / per-feature / prototype-express orders.** Everything
non-discovery is satisfiable on every path it runs (the path-scoped gates —
`environments`/`pipeline` BLOCKED-ON-BOOTSTRAP, `bootstrap` greenfield-only — were
authored correctly; `quick-spec` correctly accepts the thin prototype architecture).
The discovery-coupled set, fully resolved:

| Skill | Gate | Verdict | Fix |
| :-- | :-- | :-- | :-- |
| architect | discovery hard-required | already fixed I-6 | greenfield-only ✓ |
| feature-map / understand | discovery | safe — greenfield-only skills | none |
| **prd** (A-1) | `BLOCKED-ON-DISCOVERY` verdict | **fixed** | fuzzy-JTBD on brownfield now routes `/onboard`\|`/comprehend` (`BLOCKED-ON-INTENT`), not `/discovery` |
| **measure** (A-2) | PROJECT mode hard-requires discovery | **fixed** | brownfield (no bet by design) → new `NO-PROJECT-BET` verdict → `/measure <feature>`\|`/discovery`-to-retrofit; greenfield still `BLOCKED-ON-DISCOVERY` |
| **anchor** (A-3) | `BLOCKED-ON-DISCOVERY` (fires on missing *intake*) | **fixed** | renamed `BLOCKED-ON-INTAKE` → `/onboard`\|`/intake` (token + schema enum + hand-off + probes); never `/discovery` |

**Audit verdict:** the gate-impossibility bug class is now **closed** — 5 found by walking
+ 3 found by sweeping = the complete discovery-dependency set; no other artifact creates
the hazard. A-1/A-2 are latent (brownfield-only, off the path this run took); A-3 was a
mislabel that only bites if intake is missing. All three fixed by tracing, which is the
right tool for a markdown gate (you can't unit-test it; you trace its precondition
against the order). **Caveat, same as the walk:** these fixes are trace-verified, not
walked — a brownfield re-run is still the gold-standard confirmation.

## Post-ship LIVE smoke (the "never actually ran it" caveat, partly closed)

Curled the shipped endpoints against the **already-running** Command Center on :4317
(its `tsx watch` had hot-reloaded the merged code) — read-only, against the owner's real DB:

- `GET /api/storage/stats` → real counts (344 audit · 171 hook · 38 transcript · 166 usage,
  790 KB, oldest 2026-06-11). **Slice 1 data path VERIFIED live** — not a fixture.
- `GET /api/storage/prune-preview?cutoffDays=30` → `totalRows: 0`, `cutoffDate 2026-05-14`
  — **correct**: the store is ~2 days old, nothing is older than 30d. Proves the
  cutoff-date math + the age/live predicate, not just a 200. **Slice 2 preview VERIFIED live.**
- `cutoffDays=0` → **400**. Input validation VERIFIED live.

NOT run: `POST /api/storage/prune` (deletes the owner's real observability data — needs an
explicit go; a no-op at 30d regardless) and the browser UI click-through (S1 table / S2
dialog / S3 readout still human-deferred — but the data they render is now proven).

## Live verifications banked

- `inject-state.sh` fired at session start (minimal block — no `.ai/` yet). ✓
- `guard-paths.sh` allow path: silent pass-through on `.ai/`/`.human/`/root
  writes, and on the (unguarded by design) `_shared/ai-schema.md` edit. ✓
- `guard-paths.sh` **frozen-spec ask path fired live** during /publish-issues:
  the slice-2 write-back ran as two edits instead of the skill's mandated one
  atomic write, so edit #2 hit an already-`published` file → ask (probe
  confirms the decision + reason verbatim). Lesson: the adapter's "write
  atomically" rule is load-bearing — non-atomic write-backs trip the freeze. ✓
- mermaid skill sub-invocation: 8 diagrams generated, 8/8 kroki-validated
  across environments/understanding/architecture/features/test-strategy/
  pipeline/ux/design mirrors. ✓
- beads adapter end-to-end: bd init (prefix scc), 3 beads created with full
  label vocabulary + acceptance blobs, 2 dependency edges, refs written back.
  Note: bd init wires its own `bd prime` hooks into .claude/settings.json —
  the chain's hooks and beads' hooks now demonstrably coexist. ✓

## Lessons learned

_(running list — consolidated at end of run)_

- **L-1 (/anchor)** — A monorepo with two frameworks (react-vite web + fastify
  server) has no schema guidance for the single `framework:` field; a compound
  value absorbed it fine, but the schema could say so explicitly. No fix applied
  — worked naturally.
- **L-2 (/anchor)** — The brownfield detection table maps *existing* `v*` tags →
  semver but has no row for "no tags at all", so an autonomous run falls to the
  mvp default (semver, tentative) when the repo state arguably implies `none`.
  A human would have caught this in the interview — autonomous defaults are
  measurably worse than a 5-second human answer here. Left as tentative + TODO,
  which is exactly what the tentative mechanism is for. ✓ (mechanism validated)
- **L-3 (/anchor)** — CLAUDE.md collision behavior (rule 10) fired correctly:
  existing curated CLAUDE.md untouched, seed written to `CLAUDE.md.suggested`.
