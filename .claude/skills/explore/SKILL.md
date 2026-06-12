---
name: explore
disable-model-invocation: true
description: |-
  Whole-codebase reconnaissance for brownfield projects. Spawns a sub-agent to scan the entire repo and produces a facts-only .ai/recon.md across five sections (repo shape, component decomposition, domain language + invariants, decisions already made, gaps/warnings). Pre-phase for /comprehend and /architect on brownfield. Brownfield only; greenfield skips. Facts only, no recommendations — every claim carries a file:line citation; the parent stays lean and the sub-agent does the scan. Tier is inherited from anchor. Use when the user says "/explore", "scout the codebase", "recon this repo", "what's already here", "map the codebase", "I just inherited this repo", or before /comprehend or /architect on a brownfield project. Do NOT use for: per-feature reconnaissance (/research), greenfield projects (nothing to scan), stack lock (/anchor), domain modeling (/comprehend), high-level architecture (/architect), a codebase health or bug audit (/health-audit), or writing code.
---

# Explore

Whole-codebase reconnaissance. Spawns an `Explore` sub-agent to scan the existing codebase and produces a citation-heavy `.ai/recon.md` (**facts only**). It pairs with `/comprehend` and `/architect`: **Section C** (domain language + invariants) feeds `/comprehend`; **Sections A + B + D** (shape, components, decisions) feed `/architect`; **Section E** (gaps) becomes questions `/comprehend` asks the human.

It is the **whole-codebase, once-per-project** brownfield pre-phase. The per-feature counterpart is `/research`; both spawn an `Explore` sub-agent — only the scope differs.

<what-to-do>

You produce **whole-repo reconnaissance** at `.ai/recon.md` — a citation-heavy, **facts-only** map of what already exists. You spawn a sub-agent to do the scan so the parent context stays lean. You make **no decisions and no recommendations** (those are `/architect` and `/design`); you surface the facts those skills need.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/recon.md` schema) before writing. Don't restate them — reference them.

## Critical rules (read before starting)

1. **Anchor required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`. Without it the scan has no stack scope and no `project_type`. (On the brownfield chain, `/onboard → /anchor → /explore`, so anchor exists by now.)
2. **Brownfield only.** If `anchor.md` sets `project_type: greenfield` → `SKIPPED-GREENFIELD`. Also refuse if **no manifests** are detected on disk (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, `pom.xml`, `build.gradle`) even when anchor says brownfield — anchor and disk disagree; re-run `/anchor`. Look for real application code, not framework boilerplate.
3. **The sub-agent does the scan.** Spawn an `Explore` sub-agent (fresh context); the parent reads **≤5 files**, only to spot-check citations. This is the skill's whole reason to exist — keep the parent lean so downstream skills don't pay cache misses.
4. **Facts only — no recommendations.** *"We should refactor X"* is `/architect`; *"X is a leaky aggregate"* is a judgment for `/health-audit` (its tech-debt lens covers DDD domain smells). A *"we should…"* becomes a **visible fact** in Section E (e.g. "TODO clusters in `src/billing/`"), never an opinion.
5. **Cite everything `path:line`.** Uncited claims are dropped — without provenance a claim doesn't survive across sessions. Reject vague stack-level claims (*"the codebase uses TypeScript"* — that's `/anchor`); recon is finer-grained (files, conventions, components, decisions).
6. **Tier-scaled line cap:** 150 / 300 / 450 (inherited from `anchor.project_tier`, never recomputed). Over → prune lowest-signal items per section; **never drop a section**.
7. **Use the repo's terms.** Pull glossary candidates from identifiers in code; don't invent synonyms. If `.ai/context.md` or `.ai/understanding/<slug>.md` exists, cross-check terms and surface conflicts.
8. **Update mode.** If `recon.md` exists, restate it (sections, citation count, line count), ask which sections to refresh, preserve the rest.
9. **Advisory gate + tracker.** Issue the real verdict with reasons; an override sets `verdict_overridden: true` + a recorded reason. Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on `READY-FOR-COMPREHEND`/`READY-FOR-ARCHITECT` per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.
10. **No `.human` mirror.** `recon.md` is a facts-for-the-next-skill machine artifact (same rule as `research.md`) — no diagram, no sign-off. The Phase 6 read-back is the checkpoint.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before pasting.

## Procedure

Copy this checklist:

```
explore progress:
- [ ] Phase 0: Load tracker top 5; detect existing recon.md (update mode if present)
- [ ] Phase 1: Load anchor (REQUIRED); refuse on greenfield; tier inherited; announce
- [ ] Phase 2: Scope the scan (top-level dirs + section depth) and confirm
- [ ] Phase 3: Spawn the Explore sub-agent with the filled prompt skeleton
- [ ] Phase 4: Verify citations (reject uncited; spot-check ≤3; strip "we should…")
- [ ] Phase 5: Route findings to downstream skills (which section feeds which)
- [ ] Phase 6: Read back; scan anti-patterns; collect corrections
- [ ] Phase 7: Write .ai/recon.md (tier cap)
- [ ] Phase 8: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker + mode
Read `.ai/progress-tracker.md` top 5 (expect an `anchor landed` entry as the upstream signal). Then look for `.ai/recon.md`; if present, announce **update mode** (rule 8) and re-elicit only the sections the user names.

### Phase 1 — Load anchor; refuse on greenfield; announce
Read frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (INHERIT), `project_type`, language, framework, db, hosting | **BLOCKED-ON-ANCHOR** |
| `.ai/understanding/<slug>.md` or `.ai/context.md` | glossary so Section C cross-checks existing terms | warn |
| `.ai/architecture[.md\|/]` | if present, Section B compares findings against the documented decomposition | warn |

Greenfield or no manifests on disk → `SKIPPED-GREENFIELD` (rule 2). Inherit the tier. **Announce:** *"Anchor: `project_tier=mvp`, `project_type=brownfield`, TypeScript + Next.js + Drizzle. Understanding doc present (12 terms). No architecture doc. Running mvp-tier explore: sub-agent scan, 5 sections (A–E), ≤300 lines. Proceed?"*

### Phase 2 — Scope the scan
Confirm breadth before spawning (a wasted sub-agent run costs cache window). Five sections, all tier-aware: **A repo shape** (dirs, runtimes, deploy surface, datastores, integrations) · **B component decomposition** (3–10 cohesive units, edges, style signals `[M+]`) · **C domain language + invariants** (glossary candidates, enforced invariants `[M+]`, inferred journeys — feeds `/comprehend`) · **D decisions already made** `[M+]` (ORM, auth, rendering, message-passing + docs to respect — feeds `/architect`) · **E gaps + warnings** (stale code, mystery zones). Confirm: *"About to scan `<dirs>`, sections A–E, mvp cap (≤300 lines). Right?"* Huge repo (>10k files) → ask to restrict to `src/`, `apps/`, `services/`.

### Phase 3 — Spawn the Explore sub-agent
Use the `Agent` tool, `subagent_type=Explore`, breadth `very thorough`, with the filled prompt skeleton from [references/sub-agent-prompt.md](references/sub-agent-prompt.md) — paste the anchor stack, tier, whether a glossary/architecture doc exists, the five-section requirements, the `path:line` citation rule, and the tier line cap. The sub-agent runs in a fresh window; the parent sees only the structured 5-section report.

### Phase 4 — Verify citations
Reject any codebase claim without a `path:line`. Reject vague stack-level claims (rule 5). Spot-check 2–3 cited lines with `Read` (parent budget ≤3). Strip any *"we should…"* the sub-agent slipped in — restate the fact underneath in Section E, else drop. Too many uncited claims → ask the sub-agent to refine that section.

### Phase 5 — Route findings (the handoff contract)
Write a `## Handoff` block naming which section feeds which downstream skill (the thing that makes recon useful): **A + B + D → `/architect`** · **C → `/comprehend`** (glossary candidates + invariants + journeys) · **E → `/comprehend`** (mystery zones become questions for the user). If `.ai/understanding/<slug>.md` already exists, the verdict can skip straight to `READY-FOR-ARCHITECT`.

### Phase 6 — Read back
Assemble from [references/template.md](references/template.md), scan against [references/anti-patterns.md](references/anti-patterns.md), then read it back: *"Anything missing or wrong before this hands to `/comprehend` and `/architect`? Any cited fact look stale? (`git log` the key citations — flag stale ones in Section E.) Within the tier cap?"* Edit for fidelity.

### Phase 7 — Write the file
Write `.ai/recon.md` from [references/template.md](references/template.md), enforcing the tier line cap (150/300/450); over → prune (rule 6). **Update mode** — preserve sections the user didn't name. No `.human` mirror.

### Phase 8 — Tracker + verdict
Append a tracker entry on the success verdicts only. Issue exactly one (full prose: [references/hand-off.md](references/hand-off.md)):

- **`READY-FOR-COMPREHEND → /comprehend`** — recon complete, citations verified, glossary candidates ready. *"Paste Section C as starting input when `/comprehend` confirms the domain; Section E lists what the code can't answer — it'll ask you those directly."*
- **`READY-FOR-ARCHITECT → /architect`** — the domain model (`.ai/understanding/<slug>.md`) is already recovered. *"Paste Sections A + B + D; update mode if an architecture doc exists."*
- **`SKIPPED-GREENFIELD`** — anchor says greenfield, or no manifests on disk. Nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — anchor missing.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifact
- **`.ai/recon.md`** — MACHINE-facing, facts-only, whole-repo reconnaissance: frontmatter index + five fixed-order sections (A repo shape · B components · C domain language + invariants · D decisions · E gaps) + a `## Handoff` block, every claim cited `path:line`. Read by `/comprehend` (Section C) + `/architect` (A+B+D). Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). **No diagrams, no `.human` mirror. Brownfield only.**

## References
- The `recon.md` skeleton to assemble from: [references/template.md](references/template.md)
- The Explore sub-agent prompt skeleton (fill the brackets): [references/sub-agent-prompt.md](references/sub-agent-prompt.md)
- Rejection list to scan before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Verdict-specific hand-off prose: [references/hand-off.md](references/hand-off.md)

</supporting-info>
