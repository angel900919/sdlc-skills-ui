# Research question bank

Pull 5–10 when stuck — never all. **One question at a time. Propose a recommended answer**
(defaults from the PRD `placement` + anchor stack + the `.ai/context.md` glossary), then wait.
Adapt depth to `technical_user` from `.ai/intake.md`. Keep the jargon (prior art, integration
surface, idempotency) out of the question.

Tags: `[P]` prototype · `[M]` mvp · `[Pr]` production. Ask only those whose tier set covers the
PRD's inherited `tier:`.

## Phase 0 — mode + brownfield gate
- Is this project brownfield? (Greenfield → nothing to scan; skip to `/design`.)
- Does `.ai/specs/<feature>/research.md` already exist? (Yes → which sections to refresh? Preserve the rest.)

## Phase 1 — inputs (don't ask what you can read)
- Read `tier:` and `placement:` from `prd.md` frontmatter — don't ask.
- Read the stack from `anchor.md` — don't ask.
- Confirm the feature and the placed component back in plain words.

## Phase 2 — scope the scan
- Which code areas matter? (Default from `placement` + anchor's layout convention.)
- Which deps does the feature touch? (From package.json / pyproject.toml / go.mod, with versions.)
- Which conventions to capture? (Naming, error handling, logging shape, testing patterns.)
- Any prior art? (Search the JTBD's verbs in the codebase.)
- Which constraints? (Lint rules, CI gates, conventional-commit policy, code-style.)
- Confirm: *"About to scan `<areas>` for `<categories>`. Right?"*

## Phase 3 — spawn the sub-agent
- Built the prompt from `sub-agent-prompt.md` with PRD Scope verbatim + stack + placement + 5 categories + citation requirement + tier cap?
- Search breadth: `quick` (one folder) · `medium` (default) · `very thorough` (multi-subsystem)?

## Phase 4 — verify citations
- Every claim has a `path:line`? (No → reject or ask the sub-agent to recheck.)
- Any vague stack-level claim ("uses TypeScript")? (Too high-level — that's anchor; push finer.)
- Spot-check 2–3 cited lines with `Read` (≤3 lookups).
- Any "we should…" slipped in? (Strip → move to Open questions if there's a real unknown, else drop.)

## Phase 5 — open questions for /design
- Which ≤3 unknowns, answered, would most reduce design's uncertainty?
- Where is the sub-agent guessing — and would the guess change the design?
- Is any "question" actually a PRD scope change? (Then it's `RESCOPE-NEEDED → /prd`, not an open question.)

## Phase 6 — read back
- *"Here's the assembled research — anything missing or wrong before it hands to `/design`?"*
- *"Any cited fact look stale?"* (`git log` the key citations; flag stale ones in Notes.)
- *"Within the tier cap (90 / 185 / 250)?"*

## Probing follow-ups (when an answer is vague)
- *"What's the citation? `path:line`, not 'somewhere in src'."*
- *"Is that a fact about the codebase, or a recommendation? A recommendation goes to `/design`."*
- *"Could `/design` need this answer? If no, drop it — it's noise."*
- *"What's the smallest scan that answers this? Don't read the whole repo."*

## Questions to refuse (these belong elsewhere)
- *"Should we build this?"* → `/discovery`
- *"What's the JTBD / target user / scope?"* → `/prd`
- *"What stack?"* → `/anchor`  ·  *"What architecture style / components?"* → `/architect`
- *"What's the schema / API contract?"* → `/design`
- *"Which library should we pick?"* → `/design` (research lists options + citations only)
- *"Should we refactor X?"* → out of scope; refactors get ADRs
- *"How long will this take?"* → `/plan` (and not in time units)

All valid — just not in `/research`.
