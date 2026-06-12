---
name: pipeline
disable-model-invocation: true
description: |-
  Locks the project delivery contract into .ai/pipeline.md — the tier-gated quality-gate matrix (pre-merge, post-merge, release), deploy-vs-release stance per environment, rollback mechanism, supply-chain controls (secrets scanning, dependency audit, SBOM, provenance), dependency-update automation, and monitoring-as-code location — plus a gap table comparing the contract against the CI that actually exists. Contract only: never writes workflow files, runs pipelines, or deploys; gap closure routes as ordinary slices. Runs after /environments (greenfield) or /test-strategy (brownfield RECOVERY: cites workflow files file:line, never invents); re-run after /promote or /to-fitness. Use when the user says "/pipeline", "CI/CD", "delivery pipeline", "quality gates", "what does our CI enforce", "branch protection", "supply-chain security", or "Renovate/Dependabot". Do NOT use for: the initial CI scaffold (/bootstrap), deploying (/ship), env roster and config (/environments), or test conventions (/test-strategy).
---

# Pipeline — the delivery-contract lock

<what-to-do>

You lock the **project delivery contract** — which quality gates run at which trigger,
how a merge becomes a deploy and a deploy becomes a release, the rollback mechanism, the
supply-chain controls, dependency-update automation, and (production) the
monitoring-as-code location — into `.ai/pipeline.md`, which `/design`, `/qa`, `/ship`,
and `/promote` read. You record the contract and the gaps; you never build the pipeline.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory
gates, tier dial, tracker, Talking to the human, **CI/CD changes are ordinary slices**)
and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/pipeline.md` schema)
before writing. Don't restate them — reference them.

## Critical rules (read before starting)

1. **Contract, never mechanization.** Never write or edit a workflow file, never run a
   pipeline, never deploy, push, tag, or provision. `/bootstrap` scaffolds CI once on
   greenfield; after that every pipeline change is an ordinary slice through the normal
   loop (conventions.md § CI/CD changes are ordinary slices) — this artifact is the spec
   those slices trace to. Only side effects: the two artifact files + a tracker append.
2. **Anchor required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`. It supplies
   `project_tier` (INHERIT — never recompute), `project_type`, `hosting`,
   `deployment_target`, and `release_policy` (branching, versioning, hotfix_path).
   Never re-choose hosting or branching here — those are `/anchor`'s locks.
3. **Environments required at mvp+.** The env roster + per-env deploy mechanisms are the
   stages this contract wires. Missing `.ai/environments.md` at mvp+ →
   `BLOCKED-ON-ENVIRONMENTS → /environments`. Prototype: warn, proceed single-env.
4. **Greenfield needs a skeleton.** `project_type: greenfield` and the filesystem probe
   finds no manifests and no CI files → `BLOCKED-ON-BOOTSTRAP → /bootstrap`; there is
   no pipeline to assess yet. A missing `.ai/bootstrap.md` with a real skeleton on disk
   is only a warning.
5. **Brownfield = RECOVERY mode: scan first, propose, confirm.** Scan CI workflow files,
   dep-update configs, release/deploy configs, and scanning/signing wiring per
   [references/brownfield-scan.md](references/brownfield-scan.md); propose the
   **detected** gate matrix + deploy wiring with a `file:line` citation per claim and let
   the user confirm or correct. **Never invent** a gate, trigger, or tool the scan didn't
   find. Unfindable facts (branch protection, org-level settings) become direct
   questions, then Open questions — never guesses.
6. **The gate matrix is tier-mandated, not improvised.** Walk
   [references/gate-matrix.md](references/gate-matrix.md) for the tier: it maps each tier
   to its mandatory and recommended gates (grounded in the OpenSSF OSPS Baseline levels,
   Scorecard checks, SLSA, and DORA's CI definition). A mandatory gate the project lacks
   becomes a **gap row** — never silently dropped. The user may waive a gap on the
   record (`status: waived` + reason); waiving is theirs, dropping is never yours.
7. **The gap table routes, never fixes.** Each gap row: contract requirement · detected
   state (`file:line` or `missing`) · status `open | waived | routed` · route. The route
   is a slice through the normal loop; on greenfield before slice 1 it may instead
   extend the `/bootstrap` checklist. Closing gaps is build work, not this skill's.
8. **Tool naming is grounded.** A tool the contract names that is neither in the repo
   nor in `anchor.approved_dependencies` gets Context7 grounding (`resolve-library-id` +
   `query-docs`) for the real package name + current major — the same slopsquatting bar
   as `/design` ([`../design/references/deps-governance.md`](../design/references/deps-governance.md)).
   Name tools, never emit install/run commands; flag additions in
   `dep_adds[]` (anchor owns the list).
9. **Tier dial + hard line caps 90 / 185 / 250.** prototype: optional — offer
   `SKIPPED-PROTOTYPE`; even the skip states the two never-skip disciplines (secrets
   never in VCS, lockfile committed). If the user proceeds: one workflow, one-pager.
   mvp: required — pre-merge test gate, branch protection, dep-update automation,
   deploy + smoke wiring. production: full — adds blocking dependency audit, SBOM,
   provenance/signing, fitness-function wiring, E2E gate, monitoring-as-code location,
   named rollback mechanism. Over cap → prune detail, never drop a required section.
10. **Update mode.** If `.ai/pipeline.md` exists, restate it (gate count, open gaps),
    ask what changed (usually `/promote` bumped the tier, `/to-fitness` landed,
    an environment or suite was added), refresh only that, preserve the rest —
    the expected steady state.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to
    the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) —
    one question at a time, always with a proposed answer, adapted to `technical_user`.
    Say "checks that run before code can merge," not "pre-merge quality gates," to a
    non-technical user.
12. **Two registers + advisory gate + tracker + one verdict.** `.ai/pipeline.md` is
    structured (frontmatter index + fixed-order tables, no diagrams). At **mvp+**, also
    write `.human/summaries/pipeline.md` — plain English + ONE validated Mermaid diagram
    (the merge → gates → deploy → release flow) via the **mermaid skill**. Issue the real
    verdict with reasons; an override sets `verdict_overridden: true` + the reason. Read
    `.ai/progress-tracker.md` top 5 at Phase 0; append one entry **only** on
    `PIPELINE-LOCKED`. Exactly one verdict per run.

## Procedure

Copy this checklist:

```
pipeline progress:
- [ ] Phase 0: Tracker top 5; detect existing pipeline.md (update mode if present)
- [ ] Phase 1: Load anchor (REQUIRED) + environments (REQUIRED mvp+) + test-strategy + data-management + bootstrap/recon + fitness/ probe; gates; announce tier + mode
- [ ] Phase 2: Prototype offer (SKIPPED-PROTOTYPE) / brownfield RECOVERY scan (cited proposal)
- [ ] Phase 3: Quality-gate matrix for the tier (gate · trigger · tool/suite · source · blocking)
- [ ] Phase 4: Deploy & release stance (per-env wiring, deploy≠release, branch protection, rollback)
- [ ] Phase 5: Supply chain + dependency updates + monitoring-as-code (tier-gated)
- [ ] Phase 6: Gap table (contract vs detected; route each); read back
- [ ] Phase 7: Write .ai/pipeline.md (tier cap) + .human mirror at mvp+ (mermaid skill)
- [ ] Phase 8: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker + mode
Read `.ai/progress-tracker.md` top 5 (expect `environments landed` on greenfield,
`test-strategy landed` on brownfield — the RECOVERY run sits at the end of the
on-ramp, after the suites are locked). If
`.ai/pipeline.md` exists → **update mode** (rule 10): restate, ask what changed,
touch only that.

### Phase 1 — Load inputs + gates
Frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (INHERIT), `project_type`, `hosting`, `deployment_target`, `release_policy`, approved deps | **BLOCKED-ON-ANCHOR** |
| `.ai/environments.md` | env roster + per-env deploy mechanism + smoke commands + flag system | **BLOCKED-ON-ENVIRONMENTS** at mvp+; warn at prototype |
| `.ai/test-strategy.md` | the suites + E2E journeys the gates run | warn ("gates name suites I can't cite") |
| `.ai/data-management.md` | the migration step a deploy must run | warn (if datastore) |
| `.ai/bootstrap.md` | greenfield: the scaffolded CI step to seed from | warn (greenfield) |
| `.ai/recon.md` | brownfield: Section A (deploy surface) seeds the scan | warn (brownfield) |
| `fitness/` on disk | production: the fitness command to wire as a gate | warn (production) |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Greenfield + no skeleton on disk (rule 4 probe) → `BLOCKED-ON-BOOTSTRAP → /bootstrap`.
**Announce:** *"Anchor: tier `mvp`, greenfield, hosting Fly.io, trunk branching. Running
mvp-tier pipeline: gate matrix + deploy wiring + supply-chain baseline + dep-update
automation, ≤185 lines, plus a human summary with the merge-to-release diagram. Proceed?"*

### Phase 2 — Tier offer / RECOVERY scan
- **prototype:** offer the skip — *"At prototype tier a delivery contract is optional:
  usually one workflow running lint + tests. Two things stay non-negotiable either way —
  secrets never go into git, and the lockfile is committed. Skip for now, or write the
  one-pager?"* Skip → `SKIPPED-PROTOTYPE` (nothing written). Proceed → one-pager, ≤90.
- **brownfield (any tier):** run the RECOVERY scan per
  [references/brownfield-scan.md](references/brownfield-scan.md) before asking anything.
  Present the detected contract as a cited proposal (*"CI runs tests pre-merge —
  `.github/workflows/ci.yml:12`; no dependency audit found anywhere — confirm?"*) and let
  the user correct per row.
- **greenfield:** seed from `.ai/bootstrap.md`'s CI step + anchor's hosting + the
  environments roster; the scaffold defines the starting state the gap table measures.
  Record `ci_provider` from the scaffolded CI (nothing scaffolded → `none`).

### Phase 3 — Quality-gate matrix
Walk [references/gate-matrix.md](references/gate-matrix.md) for the tier. One row per
gate: **gate · trigger (`pre-merge | post-merge | release | scheduled`) · tool or suite
(cite `.ai/test-strategy.md` / `fitness/` — never invent a suite) · source spec · blocking
yes/no.** Mandatory-for-tier gates the project lacks go to Phase 6 as gap rows. Table
shape: [references/template.md](references/template.md).

### Phase 4 — Deploy & release stance
Per environment from the roster: what triggers the deploy (merge/tag per
`anchor.release_policy`) → which pipeline → which smoke command (from environments).
Record the **deploy ≠ release** note: if a flag system exists (environments), shipped =
merged + flag-ready, exposure is a product flip — the stance `/ship` cites. Then
**branch protection** (what the trunk requires before merge — the pre-merge gates by
name) and the **rollback mechanism** (redeploy previous artifact, revert + redeploy, or
platform rollback; the procedure itself lives in `/runbook`, the mechanism is named here).

### Phase 5 — Supply chain + maintenance (tier-gated)
- **Supply chain:** secrets scanning (all tiers — the one L1-mandatory control) ·
  lockfile/pinning discipline · dependency vulnerability audit (`[M]` advisory, `[Pr]`
  blocking with a declared-non-exploitable suppression path) · SBOM on release `[Pr]` ·
  provenance/signing `[Pr]`. Per-tier bar: [references/gate-matrix.md](references/gate-matrix.md).
- **Dependency updates** `[M+]`: the automation tool (ground per rule 8), cadence,
  and the auto-merge policy (e.g. patch-level automerge, minor+ reviewed).
- **Monitoring as code** `[Pr]`: where alert rules + dashboards live in the repo and
  what applies them. None yet → `monitoring_as_code: none` + a gap row (the alert
  thresholds in each feature's design need a home).

### Phase 6 — Gap table + read back
Assemble the gap table (rule 7): every mandatory-for-tier control that is `missing`,
plus anything detected that contradicts the contract. Propose a route per row; the user
confirms, waives (on the record), or reorders. Then assemble the full draft from
[references/template.md](references/template.md) and read it back: *"Is every gate row
real? Is anything listed as a gap actually covered somewhere I missed?"* Their
corrections win.

### Phase 7 — Write the artifacts
1. **`.ai/pipeline.md`** — per the schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md);
   enforce the tier line cap (90/185/250). Update mode preserves untouched rows.
2. **`.human/summaries/pipeline.md`** (mvp+) — one plain sentence ("here is what stands
   between a code change and your users"), 3–6 jargon-free bullets (the gates, the
   deploy path, the biggest open gap), ONE validated merge → gates → deploy → release
   flowchart via the **mermaid skill**, link back to the `.ai` file.

### Phase 8 — Tracker + verdict
Append a tracker entry on `PIPELINE-LOCKED` only (update-mode runs note which rows
changed). Issue exactly one verdict:

| Verdict | When | Hand-off |
|---|---|---|
| `PIPELINE-LOCKED` | artifact written (first run or update) | *"Delivery contract locked: N gates; gaps M open, R routed (as slices — pipeline changes go through the normal loop), W waived. Next: `/docs readme` (mvp+ external users) or `/prd` for the first feature. Re-run `/pipeline` after `/promote`, after `/to-fitness`, or when an environment or suite is added."* |
| `SKIPPED-PROTOTYPE` | prototype tier, user took the skip | nothing written; *"Keeping the two non-negotiables anyway: secrets out of git, lockfile committed. Re-run after `/promote`, or when you add a second environment or real users."* |
| `BLOCKED-ON-ANCHOR → /anchor` | `.ai/anchor.md` missing | nothing written |
| `BLOCKED-ON-ENVIRONMENTS → /environments` | mvp+ and `.ai/environments.md` missing | nothing written |
| `BLOCKED-ON-BOOTSTRAP → /bootstrap` | greenfield + no skeleton on disk | nothing written |

If the user overrides a negative verdict, set `verdict_overridden: true`, record the
reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/pipeline.md`** — MACHINE-facing delivery contract (schema in
  [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). No diagrams. Read by `/design`
  (pipeline-touching slices trace here), `/qa` (which gates already ran mechanically),
  `/ship` (deploy trigger + rollback mechanism), `/promote` (the to-production gate
  cites the gap table).
- **`.human/summaries/pipeline.md`** (mvp+) — plain-English mirror + ONE validated
  merge-to-release flowchart via the mermaid skill.

## References
- Skeleton + gate/gap table shapes + human-mirror shape: [references/template.md](references/template.md)
- Tier-gated gate matrix with standards grounding (OSPS Baseline, Scorecard, SLSA, DORA): [references/gate-matrix.md](references/gate-matrix.md)
- Brownfield RECOVERY scan checklist: [references/brownfield-scan.md](references/brownfield-scan.md)

</supporting-info>
