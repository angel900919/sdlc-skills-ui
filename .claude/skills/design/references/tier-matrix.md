# Design tier matrix — sections, line caps, what each tier adds

`/design` **inherits** the effective `tier:` from `.ai/specs/<feature>/prd.md` (`max(project_tier, feature_uplift)`, computed once by `/prd`). It never recomputes the tier. Downstream feature-scoped skills (`/plan`, `/to-fitness`, `/qa`) read the design's `tier:` — never `project_tier` directly.

## Section matrix — what each tier includes

| Section | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| Status · Architectural placement (`maps_to_component` + invariants honored) | ✓ | ✓ | ✓ ← placement non-negotiable, all tiers |
| Surface checklist (light, from `references/surfaces.md`) | ✓ | ✓ | ✓ ← AI/LLM mandatory if `ai_in_core_path` |
| Module decomposition (verb-noun, additive) | ✓ 1–3 | ✓ 2–5 | ✓ 3–8 |
| File / folder layout (anchor stack conventions) | ✓ | ✓ | ✓ |
| External dependencies (governed, trust-judged) | ✓ | ✓ | ✓ ← non-negotiable, all tiers |
| Call-flow step list (the `.ai` structure) | ✓ | ✓ | ✓ ← `.human` sequenceDiagram renders from this |
| Schema deltas (migration + rollback + backfill) | — | ✓ | ✓ |
| API contracts | — | ✓ light | ✓ full (versioning + 4xx/5xx error shapes) |
| Idempotency (state-changing endpoints) | — | ✓ | ✓ |
| Failure modes & resilience | — | ✓ | ✓ (+ SLO impact, runbook, paging) |
| Observability hooks | — | ✓ | ✓ (+ alert thresholds, dashboards) |
| Characteristics check | — | — | ✓ (**blocks write** if a PRD-claimed characteristic is unsupported) |
| Test plan (unit / integration / e2e + prior art) | — | ✓ | ✓ |
| Per-feature ADRs (`adr/NNNN-*.md`, 3-trigger) | — | if hard | if hard |
| Non-obvious dependencies | — | — | ✓ |
| Prototype-snippet inlining | allowed | allowed | allowed (trimmed) |
| `.human/specs/<feature>/design.md` mirror (sequenceDiagram) | **✓ always** | **✓ always** | **✓ always** |

The `.human` mirror is the one constant across tiers: **design always mirrors**, because the sequence diagram cannot live in `.ai/`.

## Line caps (hard)

`.ai/specs/<feature>/design.md`: **prototype ≤90 · mvp ≤185 · production ≤250** lines. Over cap → the feature is two features: cut to the JTBD-critical modules, split, run `/design` again for the second slice. The cap is a forcing function, not a target.

## Tier definitions (quick reference)

| Tier | What the design buys |
| :-- | :-- |
| `prototype` | placement + modules + file list + call flow + governed deps. Enough to build a throwaway slice; no schema/API/test ceremony. |
| `mvp` | + schema deltas, light API contracts, failure modes, observability, test plan. Lightweight rigor. |
| `production` | + full API contracts (versioning + 4xx/5xx), characteristics check, per-feature ADRs, non-obvious deps, SLO/runbook/paging. Full rigor; routes to `/to-fitness` before `/plan`. |

## Inheritance note

Design does **not** re-scan for uplift signals — that is the PRD's job. If the user claims the tier is wrong, the fix is upstream: re-run `/prd <feature>` (or `/promote` for the whole project). Design reads the tier and obeys it.
