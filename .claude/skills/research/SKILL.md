---
name: research
disable-model-invocation: true
description: |-
  Optional brownfield-only per-feature codebase reconnaissance. Spawns a scan sub-agent over the existing code touching a feature and writes a citation-heavy, facts-only research.md under .ai/specs — prior art, conventions, constraints, and the open questions /design must close. Facts, never recommendations (those belong to /design); every claim carries a file:line citation. Tier is inherited from the feature's PRD. Pairs 1:1 with /design and is the destination for design's NEEDS-RESEARCH verdict. Use when the user says "/research", "scout the area", "prior art for X", "what's already in the codebase for X", "scout the integration surface", or before /design on a brownfield feature. Do NOT use for: greenfield projects (nothing to scan), whole-codebase audits, high-level architecture (/architect), feature scope or NFRs (/prd), implementation design or schemas (/design), picking libraries definitively (/design), or writing code (the build phase).
---

<what-to-do>

You produce **per-feature codebase reconnaissance** — a citation-heavy, **facts-only** map of
what already exists for a feature — at `.ai/specs/<feature>/research.md`. You pair 1:1 with
`/design`: the *Open questions for design* section is the contract `/design` must close. You
are **optional and brownfield-only**, and you are the destination for design's
`NEEDS-RESEARCH` verdict.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates,
tier dial, tracker, Talking to the human) before writing. Don't restate it — reference it.

## Critical rules

1. **Brownfield only.** Read `project_type` from `.ai/anchor.md` (fallback `.ai/intake.md`). If `greenfield` → skip: *"Greenfield — nothing to scan. `/design` reads anchor's stack directly. Go to `/design <feature>`."* Write no artifact, append no tracker entry.
2. **PRD required → it carries the tier + the placement hint.** No `.ai/specs/<feature>/prd.md` → `BLOCKED-ON-PRD → /prd <feature>`. Read the effective `tier:` and the `placement:` component from its frontmatter.
3. **Anchor required → it scopes the scan.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`. The stack (language, framework, db) tells the sub-agent where to look.
4. **The sub-agent does the scan; the report travels via a draft file.** `Agent` tool, `subagent_type=general-purpose` (NOT `Explore` — it cannot write files and compresses its final message to a conclusion; observed live 2026-06-13), the filled prompt skeleton from [references/sub-agent-prompt.md](references/sub-agent-prompt.md); the sub-agent works read-only and writes its full report to `/tmp/research-draft-<feature>.md`, replying with just the path. The parent reads the draft + ≤5 `Read` lookups for citation spot-checks only.
5. **Facts only — no recommendations.** A "we should…" moves to *Open questions for design* or gets dropped. Library options are listed as options with citations; the *decision* is `/design`.
6. **Cite every claim `path:line`.** Uncited claims are dropped — without provenance a claim doesn't survive across sessions. Reject vague stack-level claims (*"the codebase uses TypeScript"* — that's anchor's job); research is finer-grained (files, conventions, prior art).
7. **Tier inherited from `prd.md`, never recomputed.** Match scan depth + line cap to the inherited tier. Caps (hard): **90 / 185 / 250**. Over → the scan was too broad; re-scope to the feature, not the project.
8. **Open questions for `/design` are answerable *how* unknowns** (≤5), not scope changes. *"Stripe supports sync and async webhooks — which does design pick?"* is an open question; *"should the feature also do X?"* is a PRD scope change → `RESCOPE-NEEDED → /prd`.
9. **Use the project's terms.** Pull the glossary from `.ai/context.md` (canonical) or `.ai/understanding/<slug>.md`; don't invent synonyms for existing concepts.
10. **No `.human` mirror** — `research.md` is a facts-for-the-next-skill machine artifact (no sign-off, no diagram); the Phase-6 read-back is the checkpoint. **Update mode**: if `research.md` exists, restate it (areas, citation count, open-question count), ask which sections to refresh, preserve the rest.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer (defaults from PRD placement + anchor stack), wait. Adapt to `technical_user` from `.ai/intake.md`. Keep the jargon (prior art, integration surface, idempotency) out of the question.
12. **Advisory gate + tracker.** Issue the real verdict with reasons; an override sets `verdict_overridden: true` + a recorded reason. Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on `READY-FOR-DESIGN` per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
research progress:
- [ ] Phase 0: Load tracker top 5; detect existing research.md (update mode); BROWNFIELD gate
- [ ] Phase 1: Load prd (REQUIRED → tier + placement) + anchor (REQUIRED → stack); architecture/context warn; announce
- [ ] Phase 2: Scope the scan (areas + 5 question categories) and confirm
- [ ] Phase 3: Spawn the scan sub-agent (draft-file contract) with the filled prompt skeleton
- [ ] Phase 4: Verify citations (reject uncited; spot-check ≤3; strip "we should…")
- [ ] Phase 5: Identify open questions for /design (≤5; answerable-how, not scope)
- [ ] Phase 6: Read back; scan anti-patterns; collect corrections
- [ ] Phase 7: Write .ai/specs/<feature>/research.md (tier cap)
- [ ] Phase 8: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker, mode, brownfield gate
Read `.ai/progress-tracker.md` top 5 (expect a `prd landed (<feature>)` entry). Check `project_type` (rule 1) — greenfield → skip to `/design`. Then look for `.ai/specs/<feature>/research.md`; if present, announce **update mode** (rule 10).

### Phase 1 — Inputs + tier + announce
Load frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/specs/<feature>/prd.md` | effective `tier:` (INHERIT), `placement:` (scopes the scan), scope (paste into the sub-agent prompt) | **BLOCKED-ON-PRD** |
| `.ai/anchor.md` | stack (language, framework, db, hosting, auth) + `project_type` | **BLOCKED-ON-ANCHOR** |
| `.ai/architecture[.md\|/]` | `02-components.md` for placement context | warn |
| `.ai/context.md` (or `.ai/understanding/<slug>.md`) | glossary so the sub-agent uses repo-native terms | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Inherit the PRD's `tier:`. **Announce:** *"PRD tier: mvp. Feature: `invoice-send`. Placement (from PRD): `PlaceOrder`. Anchor stack: Next.js 14 + Drizzle + Supabase. Running mvp-tier research: sub-agent scan of `src/orders/` + `src/payments/`, full citation density, ≤185 lines. Proceed?"*

### Phase 2 — Scope the scan
Define and confirm before spawning (a wasted sub-agent run costs cache window). Five categories: **code areas** (default from `placement` + anchor layout), **library questions** (deps the feature touches + versions), **convention questions** (naming, error handling, logging, testing), **prior-art questions** (similar shipped features), **constraint questions** (lint, CI gates, code-style). Confirm: *"About to scan `<areas>` for `<categories>`. Right?"*

### Phase 3 — Spawn the Explore sub-agent
Use the `Agent` tool with `subagent_type=general-purpose` and the prompt skeleton from [references/sub-agent-prompt.md](references/sub-agent-prompt.md) — fill the brackets with concrete values (paste the PRD **Scope** verbatim, the anchor stack, the `placement` hint, the five categories, the `path:line` citation requirement, the tier line cap, the draft path `/tmp/research-draft-<feature>.md`). The sub-agent scans read-only, writes ONLY that draft file, and replies with the path; the parent reads the draft (rule 4). Set search breadth: `medium` (default), `quick` for a one-folder feature, `very thorough` only if scope genuinely spans subsystems.

### Phase 4 — Verify citations
Reject any codebase claim without a `path:line`. Reject vague stack-level claims (rule 6). Spot-check 2–3 cited lines with `Read` (parent budget ≤3). Strip any *"we should…"* the sub-agent slipped in — move the real question to Open questions, else drop. Too many uncited claims → ask the sub-agent to refine.

### Phase 5 — Open questions for /design
List ≤5 numbered answerable-*how* unknowns `/design` must close (rule 8). Distinguish from scope changes: a wrong PRD assumption (e.g. the feature already exists at `src/path:L42`) is `RESCOPE-NEEDED → /prd`, not an open question.

### Phase 6 — Read back
Assemble from [references/template.md](references/template.md), scan against [references/anti-patterns.md](references/anti-patterns.md), strip symptoms, then read it back: *"anything missing or wrong before this hands to `/design`? Any cited fact look stale? (git log the key citations — flag stale ones.) Within the tier cap?"* Edit for fidelity.

### Phase 7 — Write the file
Write `.ai/specs/<feature>/research.md` from [references/template.md](references/template.md), enforcing the tier line cap (90/185/250); over → re-scope (rule 7). **Update mode** — preserve sections the user didn't name. No `.human` mirror.

### Phase 8 — Tracker + verdict
Append a tracker entry on `READY-FOR-DESIGN` only. Issue exactly one (full prose: [references/hand-off.md](references/hand-off.md)):

- **`READY-FOR-DESIGN → /design`** — scan complete, citations verified, open questions captured. *"The 'Open questions for design' section is the contract — design must close each one. Library options stay options until `/design` picks."*
- **`RESCOPE-NEEDED → /prd`** — research revealed a PRD assumption is wrong (the feature already exists, scope conflicts with codebase reality, the placement hint doesn't match what's shipped). Name what to rescope.
- **`BLOCKED-ON-PRD → /prd`** — PRD missing or blocked. Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — anchor missing. Nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/research.md`** — MACHINE-facing, facts-only reconnaissance: frontmatter index + fixed-order sections (existing tooling, comparable patterns, conventions, constraints, library options, prior art, open questions for design), every claim cited `path:line`. Read by `/design` (closes the open questions) + `/plan` (prior-art-aware slice ordering). Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams, no `.human` mirror. Optional + brownfield-only.**

## References
- The `research.md` skeleton to assemble from: [references/template.md](references/template.md)
- The scan sub-agent prompt skeleton (fill the brackets): [references/sub-agent-prompt.md](references/sub-agent-prompt.md)
- Question bank — pull 5–10 when stuck, never all: [references/questions.md](references/questions.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Verdict-specific hand-off prose: [references/hand-off.md](references/hand-off.md)

</supporting-info>
