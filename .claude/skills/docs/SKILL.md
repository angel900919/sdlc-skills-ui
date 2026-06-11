---
name: docs
description: |-
  Pure documentation assembler — writes end-user docs under docs/ and the root README from the chain's existing spec artifacts, never inventing capability claims. Targets: "/docs readme" generates or refreshes the root README (what the app is, getting started, project layout, running tests); "/docs feature-name" writes a user-facing guide page from the feature's PRD stories, ux screens, and .human mirrors; "/docs api" renders docs/api.md faithfully from design.md's API contract tables. On update it refreshes only marker-owned sections and never clobbers hand-written content. Use when the user says "/docs", "write the docs", "user guide", "API reference", "API docs", "update the README", "getting started guide", or "document the feature for users". Do NOT use for: chain spec artifacts (the canonical skills own .ai), code comments, internal architecture docs for developers (/as-built and the .human mirrors), CHANGELOG entries (/ship), or publishing docs to a site (human/CI).
---

<what-to-do>

You are a **pure documentation assembler**. ALL the raw material for user-facing docs already
exists in the chain — `.human` mirrors, PRD user stories, ux screens, design API-contract
tables, bootstrap/environments setup facts. You assemble it into REAL documentation files —
pages under `docs/` and the root `README.md` — written for the project's **end user**, not
for the agents and not for developers. You write **no `.ai/` and no `.human/` artifact**;
`docs/` and `README.md` are your ONLY outputs (plus one tracker append on success).

Read [`../_shared/conventions.md`](../_shared/conventions.md) (tier dial, tracker, advisory
gates, Talking to the human) before writing. Don't restate it — reference it.

## The faithful-assembler rule (the crux — read first)

**Every claim in a doc traces to a spec artifact or to the user's explicit answer.** You are
a transformer, not an author:

- A capability claim with no source in the specs is **never written**. Where the specs are
  silent on something the page needs (a product name, a support contact, an install
  prerequisite the bootstrap checklist assumes), **ASK** — one plain-English question at a
  time — and record the answer in the page's source footer as `user-confirmed`.
- Every page (and every README owned section) ends with an HTML-comment footer citing its
  source artifact paths + any user-confirmed answers. Sources live in the comment ONLY —
  the prose never references PRDs, slices, specs, or any chain internals.
- A **gap in a contract bounces upstream, never gets invented**: an API endpoint missing an
  error shape → `BLOCKED-ON-DESIGN`; a feature with no PRD → `BLOCKED-ON-PRD`. You render
  what exists; you never fill in what doesn't.

## Three targets (mode detection — first move)

- **`/docs readme`** → the root `README.md`. Project-level; greenfield usually right after
  `/bootstrap`. What the app is + getting started + project layout + running tests.
- **`/docs <feature>`** → `docs/<feature>.md`, a user-facing guide for one feature.
  Per-feature; runs post-`/qa`, pre-`/ship`. Voiced for the end user from discovery's
  target user — what the feature does and how to use it. No internal jargon.
- **`/docs api`** (or `/docs api <feature>`) → `docs/api.md` (or the feature's section in
  it) — the API reference rendered from `design.md`'s API contract tables. Only when
  features actually have API surfaces.
- **`/docs`** with no argument → ask which target (one question, recommend from project
  state: no README yet → readme; a qa-approved feature with no guide → that feature).

## Critical rules

1. **Anchor is required → `BLOCKED-ON-ANCHOR → /anchor`.** Read `project_tier`, the stack
   (commands and layout must match it), and `project_type`. Nothing written without it.
2. **Tier gate (offer, don't refuse silently).** prototype → README is the only expected
   target; `/docs <feature>` or `/docs api` at prototype → offer **`SKIPPED-TIER`** (the
   user may override on the record — then proceed). mvp → README + feature guides **when
   external users exist** (discovery's target user is not the builder, or
   `external-dependants` in `uplift_signals`); no external users → offer `SKIPPED-TIER` for
   guides. production → all three targets expected. `/ship`'s checklist references docs
   freshness at mvp+ with external users.
3. **End-user voice (feature + readme targets).** The reader is discovery's target user.
   Plain task-oriented language; entity terms from `.ai/context.md` in their everyday form;
   **no internal jargon** — no "PRD", "slice", "spec", "invariant", "endpoint" (api target
   excepted), no spec references in the prose. The `.human/specs/<feature>/` mirrors are
   your best phrasing source — they already speak plain English.
4. **Feature gate — warn when docs precede reality.** `/docs <feature>` checks the feature's
   row in `.ai/features.md`: status `qa-approved` or `shipped` → proceed. Anything earlier →
   **WARN** ("docs may describe behavior that doesn't exist yet — the feature is still
   `<status>`"), proceed only on the user's say-so, and note it in the footer.
5. **API target is a faithful renderer.** Every entry comes verbatim-in-substance from
   `design.md § API contracts`: method + path, auth, request/response shapes, **every 4xx/5xx
   error shape**, idempotency notes, versioning. A contract gap (missing error shape, no auth
   noted on a state-changing route) → **`BLOCKED-ON-DESIGN → /design <feature>`** naming the
   gap — never invent the missing piece. No feature has an API surface at all →
   **`NOTHING-TO-DOCUMENT`** (no file, no tracker append).
6. **Generation markers own the regenerated regions.** Every generated section sits between
   `docs:begin`/`docs:end` HTML comments (convention in
   [references/templates.md](references/templates.md)). On re-run, regenerate ONLY inside
   the markers, in place — **never clobber hand-written content, never duplicate a page or a
   section**. Hand-written text outside markers always survives.
7. **README merge is proposed, never forced.** If `README.md` exists **without** markers
   (hand-written), do not rewrite it: draft the owned sections, show the user exactly where
   each would be inserted (or which existing heading it would replace), and apply only the
   merge they approve. With markers present → normal in-place refresh of owned sections.
8. **Commands must be real.** Getting-started and test commands come from `.ai/bootstrap.md`
   dev scripts, `.ai/environments.md` (dev env, env-var NAMES — never values), and
   `.ai/test-strategy.md` — copied, not composed from memory. No bootstrap artifact → derive
   from the real files on disk (package manifest scripts, Makefile, compose file) and cite
   them; still nothing → ask the user. Never print a secret value; `.env` guidance names
   variables and points at `.env.example`.
9. **Stay in your lane.** Internal architecture docs for developers are `.human/summaries/`
   + `/as-built`; API contracts are authored by `/design` (you render); CHANGELOG is
   `/ship`; publishing to a docs site is the human/CI. You never write `.ai/` or `.human/`
   files — the canonical skills own them.
10. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the
    human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) —
    one question at a time, propose a recommended answer, wait. Adapt to `technical_user`
    from `.ai/intake.md`.
11. **Advisory gate + tracker.** Issue the real verdict with reasons; an override sets
    `verdict_overridden: true` + a recorded reason (in chat — there is no `.ai` artifact to
    carry it). Read `.ai/progress-tracker.md` top 5 at Phase 0; append ONE entry on
    `DOCS-WRITTEN`/`DOCS-UPDATED` only. Skip on `NOTHING-TO-DOCUMENT`, `SKIPPED-TIER`, and
    `BLOCKED-ON-*`.

## Procedure

Copy this checklist:

```
docs progress:
- [ ] Phase 0: Load tracker top 5 + anchor (REQUIRED); detect target from argument; tier gate
- [ ] Phase 1: Load the target's inputs (warn-if-missing each; degrade gracefully)
- [ ] Phase 2: Target gates (feature status / API-contract presence / existing-README scan)
- [ ] Phase 3: Assemble the draft — map every claim to a source; list the spec-silent gaps
- [ ] Phase 4: Close gaps with the user (one plain question each); record answers
- [ ] Phase 5: Write the file(s) — markers + source footer; update mode = in-place only
- [ ] Phase 6: Append tracker (success only); issue exactly one verdict
```

### Phase 0 — Tracker, anchor, target, tier
Read `.ai/progress-tracker.md` top 5. Load `.ai/anchor.md` (rule 1). Detect the target from
the argument (`readme` / `api` / a feature slug / none → ask, rule under *Three targets*).
Apply the tier gate (rule 2) — below the target's bar, offer `SKIPPED-TIER` and stop unless
the user overrides on the record.

### Phase 1 — Load inputs (frontmatter-first; warn-if-missing, degrade gracefully)

Common: `.ai/intake.md` (`technical_user`, slug), `.ai/discovery/<slug>.md` (target user →
reader persona). Then per target:

| Target | File | For | Missing → |
| :-- | :-- | :-- | :-- |
| readme | `.ai/intake.md` + `.human/intake/idea.md` | what the app is (one-liner, who it's for) | warn |
| readme | `.ai/bootstrap.md` | install/setup/dev-script commands | warn (rule 8 fallback) |
| readme | `.ai/environments.md` | dev env, env-var names, `.env.example` pointer | warn |
| readme | `.ai/architecture[.md\|/]` | components → plain-English project layout | warn |
| readme | `.ai/test-strategy.md` | the test command + how tests are organized | warn |
| feature | `.ai/specs/<feature>/prd.md` | user stories + scope (the guide's skeleton) | **BLOCKED-ON-PRD** |
| feature | `.ai/specs/<feature>/ux.md` | screens, flows, states, verbatim copy (UI features) | warn |
| feature | `.human/specs/<feature>/*.md` | plain-English phrasing to reuse | warn |
| feature | `.ai/features.md` | status gate (rule 4) | warn |
| api | `.ai/specs/<feature>/design.md § API contracts` (each in-scope feature) | the contract tables | **BLOCKED-ON-DESIGN** / none anywhere → **NOTHING-TO-DOCUMENT** |
| api | `.ai/environments.md` | base URLs per environment | warn |

A warn-level miss never blocks: write the sections you have sources for, name the ones you
skipped and why, and offer to fill them from the user's answers (which become
`user-confirmed` footer entries).

### Phase 2 — Target gates
**feature:** roster-status check (rule 4). **api:** scan the in-scope features' `design.md`
files for API-contract sections; apply rule 5. **readme:** scan the existing `README.md` —
no file → fresh write; markers present → in-place refresh; hand-written without markers →
the proposed-merge path (rule 7).

### Phase 3 — Assemble, source-mapped
Build the draft from the matching template in
[references/templates.md](references/templates.md). For every paragraph/command/claim, note
its source artifact. Anything the template needs that no source covers goes on the **gap
list** — do not draft filler for it.

### Phase 4 — Close the gaps
One plain question per gap, recommended answer first (rule 10). The user's answer is a
legitimate source — record it; "skip that section" is also a valid answer. Never proceed
past an unanswered gap by inventing.

### Phase 5 — Write
Write `README.md` and/or `docs/<page>.md` (create `docs/` if needed) with the generation
markers and the source footer per [references/templates.md](references/templates.md).
Update mode: regenerate only inside the markers; preserve everything outside; never write a
second page for the same target. Read the result back to the user in one or two sentences
("README now says the app is X and starts with `npm run dev` — right?").

### Phase 6 — Tracker + verdict
Append a tracker entry on success only. Issue exactly one:

- **`DOCS-WRITTEN`** — a new README / guide page / api reference written. Hand off by
  target: readme → *"Next: the per-feature loop (`/prd`), or `/docs <feature>` after a
  feature clears `/qa`."* · feature → *"Next: `/ship <feature>` — its checklist can tick
  'user docs updated'."* · api → *"Re-run `/docs api` whenever `/design` changes a
  contract."*
- **`DOCS-UPDATED`** — existing marker-owned sections refreshed in place (or an approved
  README merge applied). Same hand-offs.
- **`NOTHING-TO-DOCUMENT`** — api target, and no in-scope feature has an API surface. No
  file, no tracker append.
- **`SKIPPED-TIER`** — the tier gate fired and the user didn't override. No file, no
  tracker append.
- **`BLOCKED-ON-DESIGN → /design <feature>`** — api target: `design.md` missing, or a
  contract gap (name it: which endpoint, which missing piece). Nothing written.
- **`BLOCKED-ON-PRD → /prd <feature>`** — feature target: no `prd.md`. Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no `anchor.md`. Nothing written.

If the user overrides a negative verdict, record the reason in chat and route onward.

</what-to-do>

<supporting-info>

## Output artifacts

Real project files, not chain artifacts — no `.human` mirror; every generated region carries
a source footer. Templates + marker/footer conventions: [references/templates.md](references/templates.md).

- **`README.md`** (readme target) — owned sections (what this is · getting started · project layout · running tests) between markers; hand-written content outside untouched.
- **`docs/<feature>.md`** (feature target) — end-user guide voiced for discovery's target user.
- **`docs/api.md`** (api target) — API reference rendered from design's contract tables; per-feature marker-owned sections.

</supporting-info>
