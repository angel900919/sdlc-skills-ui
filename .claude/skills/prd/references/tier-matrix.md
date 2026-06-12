# PRD tier matrix — sections, line caps, uplift

`/prd` writes the effective per-feature **`tier`** = `max(project_tier, feature_uplift)`. Downstream feature-scoped skills (`/design`, `/plan`, `/to-fitness`, `/qa`) read the PRD's `tier:` field — never `project_tier` directly — so an uplifted feature in a lower-tier project gets the rigor it needs.

## Section matrix — what each tier includes

| Section | prototype | mvp | production |
| :-- | :-- | :-- | :-- |
| Problem · Target user · JTBD · Scope · Success metric · Kill criteria | ✓ | ✓ | ✓ |
| User stories | — | 3–10 | extensive (cover all in-scope behavior) |
| Risks / Assumptions (+ falsifying test) | — | ✓ | ✓ |
| NFRs (lightweight prose, 3–5) | — | ✓ | — |
| NFRs (full table) | — | — | ✓ |
| Functional reqs | prose | prose | **EARS** + T/I/A/D verification |
| Unwanted-behavior EARS clauses (invariant defense) | — | — | ✓ |
| Open questions (numbered) | — | ✓ | ✓ |
| AI transparency card (if feature ships AI to users) | — | ✓ | ✓ (mandatory) |
| Prototype-snippet inlining | allowed | allowed | allowed (trimmed) |
| SMART check | skip | soft (warn) | strict (**blocks write**) |
| `.human/specs/<feature>/prd.md` mirror | — | derived | derived |

## Line caps (hard)

`.ai/specs/<feature>/prd.md`: **prototype ≤90 · mvp ≤185 · production ≤250** lines. Over cap → the feature is two features: cut to the JTBD-critical capabilities, split, and run `/prd` again for the second slice. The cap is a forcing function, not a target — don't extend it.

## Tier definitions (quick reference)

| Tier | Audience / stake | Buys |
| :-- | :-- | :-- |
| `prototype` | solo, ≤5 users, throwaway — wrong answer costs an afternoon | speed, minimal ceremony |
| `mvp` | 10–100s users, pre/paying — wrong answer costs a sprint | lightweight rigor: stories, light NFRs, AI card |
| `production` | 1000s+ users, public API, auditor-read — wrong answer is a CVE/outage/lawsuit | full rigor: EARS, T/I/A/D, invariant defenses, strict SMART |

## Uplift signals (define-once)

The canonical per-feature uplift list lives in [`../../anchor/references/defaults.md` § Tier uplift signals](../../anchor/references/defaults.md). Do not duplicate it here; read it. (A user's explicit "this needs to be solid" is not a separate signal — it is the plain-language tier override of rule 3, recorded as an upgrade.)

**Bump rule:** `prototype + signal → mvp`, `mvp + signal → production`, `production + signal → stays production`. The bump is automatic but **announced**; the user can override in plain language (downgrades warn loudly). Cross-check `anchor.md` frontmatter: if `uplift_signals` already lists the signal, that's expected; if your scan finds one anchor didn't list, mention it (*"anchor didn't flag this — worth revisiting `/anchor` if more features will hit it"*).
