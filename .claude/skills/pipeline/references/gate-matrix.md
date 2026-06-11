# The tier-gated gate matrix

What each tier **must** and **should** enforce. Mandatory rows the project lacks become
gap rows (SKILL.md rule 6) — waivable by the user on the record, never silently dropped.
The standards column is the grounding: the suite's tiers map onto the OpenSSF OSPS
Baseline's three maturity levels (L1 = any project, L2 = consistent users, L3 = large
user base — Baseline v2026.02.19), with Scorecard, SLSA, and DORA filling the gaps the
Baseline doesn't cover. When a standard moves, update this file — the SKILL.md never
hardcodes a control.

## prototype (≈ OSPS Level 1)

| Control | Status | Grounding |
| :-- | :-- | :-- |
| Secrets never in VCS (gitignored `.env`, names-only `.env.example`; scanning tool optional) | **mandatory — survives even SKIPPED-PROTOTYPE** | OSPS-BR-07.01 is a Level 1 MUST |
| Lockfile committed; installs use it (`--frozen-lockfile` discipline from `/bootstrap`) | **mandatory** | Scorecard Pinned-Dependencies (Medium risk) |
| One workflow: lint + typecheck + unit tests on push | recommended | DORA: CI = trunk + fast tests after each commit |
| Trunk-based discipline (short-lived branches, merge at least daily) | recommended | DORA trunk-based-development capability |

## mvp (≈ OSPS Level 2) — everything above, plus

| Control | Status | Grounding |
| :-- | :-- | :-- |
| Pre-merge automated test gate (blocking; the suite from `.ai/test-strategy.md`) | **mandatory** | OSPS-QA-06.01 becomes a MUST at Level 2 |
| Branch protection on trunk (the pre-merge gates by name; no direct pushes) | **mandatory** | OSPS-QA/AC Level 2 controls; DORA small-batch flow |
| Dependency-update automation (Renovate or Dependabot; cadence + automerge policy) | **mandatory** | Scorecard rates its absence High risk |
| Dependency vulnerability audit (advisory — visible, not yet blocking) | recommended | ramps to the Level 3 blocking gate below |
| Deploy per env wired to a trigger (merge/tag per `anchor.release_policy`) + post-deploy smoke | **mandatory** | `/ship` assumes it; environments names the commands |
| Secrets scanning as a real gate (e.g. provider-native or a scanner in CI) | recommended | hardens the L1 discipline |

## production (≈ OSPS Level 3) — everything above, plus

| Control | Status | Grounding |
| :-- | :-- | :-- |
| Dependency audit **blocking** on known-vulnerable/malicious deps, with a declared-non-exploitable suppression path | **mandatory** | OSPS-VM-05.03 (Level 3 MUST) |
| SBOM delivered with every release | **mandatory** | OSPS-QA-02.02 (Level 3 MUST) |
| Provenance attestation on release artifacts (≥ SLSA Build L2; isolated/reusable build for L3) | **mandatory** | SLSA v1.0; Scorecard Signed-Releases scores provenance 10/10 vs 8/10 for signature-only |
| Fitness functions wired as a CI gate (`fitness/` command from `/to-fitness`) | **mandatory** | the chain's own contract — invariants don't self-enforce |
| E2E journey suite as a gate (post-merge or pre-release; from `.ai/test-strategy.md`) | **mandatory** | test-strategy locks the journeys; this wires them |
| Named rollback mechanism (previous-artifact redeploy / revert+redeploy / platform) | **mandatory** | `/runbook` documents the procedure; this names the mechanism |
| Monitoring as code: alert rules + dashboards in-repo with an apply step | **mandatory** | design's alert thresholds need a home |
| Deploy ≠ release via flags (dark-ship, then expose) | recommended (mandatory if `flag_system != none`) | the `/ship` stance; DORA flag-decoupled release guidance |
| Scheduled full-suite + audit run (catches drift between merges) | recommended | standard CD hygiene |

## Trigger vocabulary

`pre-merge` (blocks the PR/MR) · `post-merge` (runs on trunk; failure = stop-the-line) ·
`release` (runs on tag/release; produces artifacts, SBOM, attestations) · `scheduled`
(cron; drift detection). Every gate row in `.ai/pipeline.md` uses exactly one.

## Sources (verified against the primary documents)

- OSPS Baseline v2026.02.19 — https://baseline.openssf.org/versions/2026-02-19.html
  (L1/L2/L3 model; OSPS-BR-07.01, OSPS-QA-06.01, OSPS-VM-05.03, OSPS-QA-02.02)
- OpenSSF Scorecard checks — https://github.com/ossf/scorecard/blob/main/docs/checks.md
  (Dependency-Update-Tool High; Pinned-Dependencies Medium; Signed-Releases provenance 10/10)
- SLSA v1.0 via GitHub artifact attestations — https://docs.github.com/en/actions/concepts/security/artifact-attestations
  (attestations alone = Build L2; reusable-workflow isolation for L3)
- DORA capability: trunk-based development — https://dora.dev/capabilities/trunk-based-development/
  (trunk + fast post-commit tests = CI; correlated with delivery performance)
