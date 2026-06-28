# Workflow conventions — `.human` vs `.ai`

Shared by `/intake`, `/discovery`, `/understand` (and read by downstream skills). This file defines **where artifacts live, who writes what, and how a stage hands off to the next.** The machine schemas themselves are in [ai-schema.md](ai-schema.md).

## The two-folder model

```
.human/                       # HUMAN-facing. Prose + Mermaid. The only place a person reads or edits.
├── intake/
│   └── idea.md               # the living idea doc — the user may seed it; /intake refines it in place
└── summaries/
    ├── discovery.md          # plain-English verdict + why + diagram      (written by /discovery)
    └── understanding.md      # plain-English journeys + boundaries + diagram (written by /understand)

.ai/                          # MACHINE-facing source of truth. Structured, parseable, terse.
├── intake.md                 # tiny handoff stub: slug, tier, technical_level, project_type, status
├── discovery/<slug>.md       # structured discovery artifact   (schema in ai-schema.md)
├── understanding/<slug>.md   # structured understanding artifact (schema in ai-schema.md)
├── context.md                # shared glossary + entity models (YAML) — the cross-skill reuse hotspot
└── progress-tracker.md       # append-only session log
```

**The rule of thumb:** humans read `.human/`, agents read `.ai/`. Same knowledge, two registers. Never make a human parse the structured `.ai` files; never make a downstream agent scrape prose out of `.human`.

## Who interacts with what

| Actor | Reads | Writes |
| :--- | :--- | :--- |
| **The person with the idea** | `.human/` only | may seed `.human/intake/idea.md` |
| **/intake** | `idea.md` (if seeded), filesystem probe | `.human/intake/idea.md` + `.ai/intake.md` |
| **/strategy** *(optional)* | `.ai/intake.md`, `idea.md` | `.ai/strategy/<slug>.md` + `.human/summaries/strategy.md` |
| **/discovery** | `.ai/intake.md`, `idea.md`, `.ai/strategy/<slug>.md` (if present) | `.ai/discovery/<slug>.md` + `.human/summaries/discovery.md` |
| **/understand** | `.ai/discovery/<slug>.md`, `.ai/intake.md` | `.ai/understanding/<slug>.md` + `.ai/context.md` + `.human/summaries/understanding.md` |
| **Downstream** (`/feature-map`, `/architect`, `/prd`) | `.ai/*` (by section) | their own `.ai/*` artifacts |

> "The human only interacts with `.human/`" means their **persistent files** live there. They still converse in chat during each stage — that conversation is how the gates reach mutual understanding. What they never have to do is read or edit a structured `.ai/` file.

## The chain & handoff contract

```
/intake      →  capture the idea          →  .human/intake/idea.md   + .ai/intake.md (slug, tier, ...)
/strategy    →  set direction (opt-in)     →  .ai/strategy/<slug>.md  + .human/summaries/strategy.md
/discovery   →  validate it (gated)        →  .ai/discovery/<slug>.md + .human/summaries/discovery.md
/understand  →  define it (gated)          →  .ai/understanding/<slug>.md + .ai/context.md + .human/summaries/understanding.md
/feature-map →  decompose into features    →  .ai/features.md
/anchor      →  lock the stack + tier      →  .ai/anchor.md
/architect   →  high-level design          →  .ai/architecture[.md|/]
```

Each stage's **frontmatter is the index**: a downstream skill reads the cheap frontmatter to decide whether it needs the body, then loads only the sections it consumes (`consumed_by` lists who reads it). See [ai-schema.md](ai-schema.md) for the exact frontmatter keys.

**Feature status lifecycle** (one row in `.ai/features.md`; each transition has exactly one writer): `planned → building` (/to-issues) `→ qa-approved` (/qa, human-approved) `→ shipped` (/ship, human-approved) `→ deprecated → removed` (/sunset, human-approved at both flips — the only writer of `deprecated` and `removed`). Side states: `blocked` / `cut` (/feature-map). A `deprecated` or `removed` row is retired: census, status, and reporting skills never present it as live.

**Slug** = kebab-case, ≤30 chars, describes the idea (not the user). Set once by `/intake`, reused unchanged by every later stage so artifacts line up by name. Examples: `freelancer-invoicing`, `ci-slack-alerts`, `running-club-rsvp`.

**CI/CD changes are ordinary slices.** `/bootstrap` scaffolds the pipeline once; after that, any pipeline change (a new fitness-function step from `/to-fitness`, a new E2E job from `.ai/test-strategy.md`, a deploy tweak from `.ai/environments.md`) is a normal slice through the normal loop — designed, planned, ticketed, reviewed. The pipeline is not out-of-bounds for agents and not a side channel: if it isn't in a slice, it doesn't change. **What the pipeline must enforce is `/pipeline`'s lock** (`.ai/pipeline.md` — the tier-gated gate matrix, deploy-vs-release stance, supply-chain controls, and gap table): pipeline-touching slices trace to that contract, and its gap table is where missing mandatory controls are routed as slices in the first place.

## Gates are advisory, not blocking

`/discovery` issues `PROCEED | INVESTIGATE | KILL`; `/understand` issues `READY-FOR-FEATURE-MAP | NEEDS-EVENT-STORM | BLOCKED-ON-DISCOVERY`. The gate does the **full analysis and states its verdict with reasons** — that rigor is the value. But the user may choose to continue past a negative verdict. When they do:

- set `verdict_overridden: true` in the artifact frontmatter,
- record the user's stated reason in the `## Decision` / `## Verdict` section,
- still write the artifact and the `.human` summary.

Never silently downgrade or skip the analysis to avoid a hard verdict. The choice is "show the verdict and let the user override on the record" — never "hide the problem."

One narrow exception: a skill may declare a specific gate **non-overridable in-skill** when the override legitimately lives in another skill (e.g. `/quick-spec`'s prototype-tier gate — the tier conversation happens in `/prd`, whose plain-language override is on the record). The skill must name where the override does live; "no override here" never means "no override anywhere."

## The hotfix path (P0 in shipped code)

A P0 production defect does not queue behind the full chain (prd→design→plan→to-issues→publish→build→qa→ship). `anchor.release_policy.hotfix_path` defines the expedited route: branch from the production ref, fix via `/diagnose`, merge + deploy. The discipline never relaxes — the regression test is non-negotiable and `/mtdd-review` + `/mtdd-verify` still run — and the chain artifacts (the `category: bug` issue file + a `qa-report.md` note) are backfilled within a day, never skipped; `/ship` verifies the backfill or records it pending with a date.

## Talking to the human (every skill that asks questions)

The person on the other side may be non-technical. The whole point of the `.human`/`.ai` split is that **the human's experience stays simple while the machine artifacts stay precise.** So however technical the skill's *output* is, the *conversation* follows these rules:

1. **Plain English, always.** No jargon (no "schema", "endpoint", "invariant", "aggregate", "NFR", "idempotent") unless the user used the word first. If you must name a concept, describe it in everyday words.
2. **One question at a time.** Never stack questions or present a wall. Wait for the answer before the next.
3. **Always propose a recommended answer.** The user should react to a draft, not invent from a blank page. ("I'd assume X — right, or something else?")
4. **When they can't answer, offer 2–3 simple options** — not an open void. Pick a sensible default if they're unsure, and record it as tentative.
5. **Adapt to `technical_user`** (from `.ai/intake.md`: non-technical | mixed | technical):
   - **non-technical** → never ask technical/stack/architecture questions; pick sensible defaults, mark them tentative, confirm the *outcome* in plain words.
   - **technical** → invite the real choices.
   - **mixed** → start plain; go deeper only where the user shows fluency.
6. **Translate, don't interrogate.** Capture the user's plain words, then render them as proper terminology **only in the written `.ai/` artifact** — never push the technical phrasing back into the question. The user says "people sign up for runs"; the artifact says `entity: Registration`.
7. **Reach mutual understanding.** Read the result back in plain English and confirm before writing. Ask as many gentle questions as it takes to share the same picture — but stop once you do; don't pad.

Every interactive skill states a one-line pointer to this section in its critical rules rather than re-deriving it.

## The tier dial (how deep to grill)

Depth scales with the predicted tier from `.ai/intake.md`:

- **prototype** — light. `/discovery` runs a condensed pass; `/understand` may be skipped entirely (note it and route straight to `/feature-map`).
- **mvp** — full `/discovery` + full `/understand`.
- **production** — full depth + the extra rigor downstream skills add (security, observability).

Tier-uplift signals (money, PII/sensitive data, SLAs, external dependants, regulatory/legal) bump the predicted tier. They are recorded in `.ai/intake.md`; if one fires mid-conversation, surface it in plain English and update the stub.

## Human summaries — what goes in `.human/summaries/`

Each `.ai` artifact gets a plain-English mirror so the human can see the verdict and the findings:

- Lead with the **verdict / recommendation in one plain sentence**.
- Explain the *why* in 3–6 short bullets — no jargon, no schema.
- Include **one Mermaid diagram** that earns its place (a journey, a state lifecycle, an ER mirror, a problem map). Generate it via the **mermaid skill** so it is validated before it ships.
- Link back to the `.ai` artifact for anyone who wants the structured detail.

Diagrams belong in `.human/` only. `.ai/` artifacts use structured YAML/JSON/tables/state-definitions instead — agents parse those more reliably than they parse a diagram.

### A `.human` mirror is a derived projection, not a twin (no duplication)

The `.ai/` artifact is the **single source of truth**. The `.human/` mirror is **rendered from it** — a lossy ~15–20% summary (the verdict, the why, one diagram), never a reformat of the whole file and **never hand-authored or hand-edited**.

- You author the `.ai/` file once; the `.human/` view is a projection of it (the diagram especially is rendered *from* the `.ai/` structure — e.g. a sequence diagram from the design's call list, a C4 from the architecture's dependency table).
- If the two ever disagree, **`.ai/` wins** — regenerate the mirror. Because it's mechanically derived, drift is impossible.
- The shared content is a handful of facts (the one-liner, the core points, the metric) — an abstract, not a copy. The structured detail (F-IDs, NFR tables, EARS clauses, acceptance criteria) lives only in `.ai/`.
- **Only mirror where a human reviews or where there's a diagram.** Skip the mirror for machine-only artifacts (facts-for-the-next-skill, generated code, mechanical lists).

### Where mirrors live

- **Project-level** (1× artifacts): `.human/summaries/<stage>.md` (e.g. `discovery.md`, `architecture.md`).
- **Per-feature** (N× artifacts): mirror the `.ai/specs/<feature>/` tree → `.human/specs/<feature>/<artifact>.md` (e.g. `.human/specs/checkout/prd.md`). Same structure, two registers.

## Progress tracker

`/intake` seeds `.ai/progress-tracker.md` if absent. Each stage reads the top 5 entries at start (session context) and appends one entry on a success verdict. Entry format:

```markdown
## YYYY-MM-DD — <stage> landed (<slug>)
- Artifact: `.ai/<stage>/<slug>.md` — verdict: <VERDICT>.
- Key decisions: <one or two>.
- Next: <next skill + why>.
```
