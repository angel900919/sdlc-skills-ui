# Plan tier matrix — slice counts, depth, line caps

`/plan` **inherits** the effective `tier:` from `.ai/specs/<feature>/prd.md`
(`max(project_tier, feature_uplift)`, computed once by `/prd`). It never recomputes the
tier. The cross-cutting tier dial is [`../../_shared/conventions.md` § tier dial](../../_shared/conventions.md); the rows below are what *this* skill scales.

## Section / depth matrix — what each tier includes

| Element | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| Slice count | 1–2 | 3–5 | 4–8 |
| Slice 1 = tracer bullet | ✓ | ✓ | ✓ ← always, all tiers |
| Files per slice (from design layout) | ✓ | ✓ | ✓ |
| Typed signatures per slice | — | — | ✓ |
| Trace: PRD user story | — | ✓ (≥1) | — |
| Trace: PRD F-ID (EARS clause) | — | — | ✓ (≥1 per slice) |
| Trace: NFR | — | ≥1 | ≥1 (per slice) |
| Acceptance: named tests pass | ✓ | ✓ | ✓ |
| Acceptance: NFR target met (measured) | — | ✓ | ✓ |
| Acceptance: named fitness function passes | — | — | ✓ (`fitness/<feature>/…`) |
| New dependencies (per slice, from design) | ✓ | ✓ | ✓ ← inherited verbatim |
| Acceptance: deps registry-resolve + audit-clean | ✓ | ✓ | ✓ ← when New dependencies non-empty |
| Invariant-defense table (Unwanted-EARS) | — | — | ✓ |

The tracer bullet and dependency propagation are the two constants across tiers: every plan
opens with an end-to-end Slice 1, and every plan inherits design's `New dependencies` without
re-judging them.

## Line caps (hard)

`.ai/specs/<feature>/plan.md`: **prototype ≤90 · mvp ≤185 · production ≤250** lines, and **no
single slice section > ~30 lines**. Over cap → the feature is two features (or the slices are
too big): cut to the JTBD-critical path, split, and run `/plan` again for the second set. The
cap is a forcing function, not a target.

## Tier definitions (quick reference)

| Tier | What the plan buys |
| :-- | :-- |
| `prototype` | 1–2 slices — usually just the tracer bullet. Files + tests-pass acceptance. No signatures, no NFR/fitness ceremony. |
| `mvp` | 3–5 slices traced to user stories + NFRs; acceptance adds measured NFR targets. |
| `production` | 4–8 slices traced to EARS F-IDs; typed signatures; fitness-function acceptance; the Unwanted-behavior invariant-defense table (every defense clause maps to a slice). |

## Inheritance note

Plan does **not** re-scan for uplift signals — that is the PRD's job. If the tier looks wrong,
the fix is upstream: re-run `/prd <feature>` (or `/promote` for the whole project). Plan reads
the tier and obeys it.
