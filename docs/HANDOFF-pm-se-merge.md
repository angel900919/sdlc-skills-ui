> **CRITICAL: This is a handoff document for context initialization. Do NOT execute any tasks, write code, or start projects yet. Acknowledge that you have read this context, summarize the current state in one sentence, and wait for the user's explicit instructions.**

# Handoff — Merge PM + SE into one lean Product→Engineering lifecycle

**Branch:** `workflow` · **Date:** 2026-06-29 · **Repo:** `/Users/andresrambal/Projects/LAB53/agentic-skills/SDLC-skills-UI-approach2`

## What we're building (the goal)

Merge the three bodies of work in this repo into **one lean two-stage lifecycle** for a solo / 2-person builder of personal, utility-grade products — supporting **both software and systems-engineering** projects. Reuse the existing SDLC chain spine; add only a few opt-in skills; fold seams; record omits; let the dashboard route "the path you should take." **Full agreed scope is in `project-brief.md` (read it first — it's the anchor doc).**

Three bodies:
- **SDLC chain** (`.claude/skills/`, ~56 skills + the `apps/` dashboard) — the engineering spine. **Keep as the spine.**
- **PM library** (`product_management _part/`, P00–P16) — the "what & why" front. **Curate down.**
- **SE library** (`System Engineering/`, 12 phases) — a rigor overlay. **Keep only high-value seams.** (`Systems-Engineering-KB` = learning resource, stays out of the lifecycle.)

## The locked design (decided with the user, in `project-brief.md`)

**Two stages:** Stage 1 — Product (what & why), *optional body, skippable when the product is already approved*. Stage 2 — Engineering (how), always runs. Stage 1 writes the SAME `.ai/` foundation files the chain consumes + `.human/` stakeholder mirrors (one source of truth = seamless handoff).

**5 new skills, all opt-in. Default lean path touches none** (`intake → discovery → anchor → … → ship`):
| Skill | Stage | Role | Status |
|---|---|---|---|
| `/strategy` | 1 (PM) | vision + Rumelt kernel + value-exchange North Star + 1–3 OKRs | **BUILT (this session)** |
| `/market-research` | 1 (PM) | TAM/SAM/SOM, competitors, positioning | not started |
| `/opportunity` | 1 (PM) | deep go/no-go: synthesize all evidence → Persevere/Pivot/Kill (Stage-1 exit gate) | not started |
| `/requirements` | 2 (SE) | system-level requirements + traceability + measures | not started |
| `/tradeoff` | 2 (SE) | weighted trade study → emits an ADR | not started |

**Reuse, not duplicate:** `/intake` is the Stage-1 door; `/discovery` is the problem-validation gate (light go/no-go). "Worth building?" is ONE gate that scales with evidence (`/discovery`'s verdict on the lean path; `/opportunity`'s synthesis when real evaluation was done). We explicitly decided NOT to add a `/product-brief` skill (would duplicate intake+discovery).

**Merges** (fold into existing skills, no new command): PM roadmap/prioritization→`/feature-map`; PM PRD/stories→`/prd`; PM launch→`/ship`; PM analytics→`/measure`; PM+SE sunset/disposal→`/sunset`; SE concept/OpsCon→`/understand`; SE ICD/interfaces→`/architect`; SE V&V→`/qa`+`/measure`; SE ops→`/runbook`.

**Tailoring:** reuse the existing 3 tiers (`prototype|mvp|production`); personal-utility ≈ `prototype`; a project-type flag picks which overlay (PM/SE) runs. **Safety/responsible floor always-on even at prototype** (one-line harm/exclude/leak check + secrets hygiene); deeper `/threat-model` stays gated to production/PII/money.

**Dashboard (open, deferred):** the one new engineering seam = `GET /api/projects/:id/next` reusing the existing `/next` boundary table + `anchor.project_tier` + `state.json` + `verdictWatcher`. Scope (single-project vs portfolio vs full v2) = decide when we plan the dashboard.

## What was done THIS session

1. **`project-brief.md`** written (was empty) — the locked scope. **Read it.**
2. **`/strategy` skill BUILT** (the Stage-1 tracer bullet, to prove a PM skill writes the same `.ai`/`.human` registers + routes):
   - `.claude/skills/strategy/SKILL.md` (+ `references/question-bank.md`, `references/anti-patterns.md`)
   - `.ai/strategy/<slug>.md` schema added to `.claude/skills/_shared/ai-schema.md`
   - Handoff wired into `.claude/skills/_shared/conventions.md` (optional pre-`/discovery` step: actor table + chain contract)
   - **Verified:** strict chain linter `PASS`; write-a-skill frontmatter validator `PASS`; full-suite lint **56/56 PASS**; schema↔skill fields consistent; description 746/1024 chars.
   - **NOT yet done:** not dogfood-tested (interactive interview never run → do NOT claim "tested"/"verified"); downstream consumption documented-not-wired.

## Beads issues
- `scc-bsx` (epic) — the overall merge.
- `scc-0bf` (in_progress) — Build `/strategy`. Authored + lint-passing; **pending dogfood verification**. Don't close until run end-to-end.
- `scc-29v` (open, P3) — Wire `/strategy` consumption into `/discovery`, `/opportunity`, `/measure` + teach `project-state.py`/dashboard about the `.ai/strategy` artifact.

## Recommended next step (user to choose)
1. **Dogfood `/strategy` on a real idea** — best: turns "Reviewed" → "Verified," proves the seam live, yields real strategy artifacts. (Needs a one-line product idea or an existing `.ai/intake.md`.)
2. Build **`/opportunity`** (the user's favorite, Stage-1 exit gate) — same authoring pattern as `/strategy`.
3. Wire downstream consumption (`scc-29v`).

## Key context for continuing
- **House style** for chain skills: XML `<what-to-do>`/`<supporting-info>`, dual `.ai`/`.human` register, tier dial, advisory verdict (user overrides on record), plain-English one-question-at-a-time interview. Clone `/discovery` and `/strategy` as templates; read `.claude/skills/_shared/conventions.md` + `ai-schema.md` (the contract).
- **Author new skills via the `write-a-skill` skill**; new opt-in skills get `disable-model-invocation: true`.
- **Lint after authoring:** `python3 .claude/skills/_build_share/lint-skills.py [path|<none for all>]` (strict YAML frontmatter gate) + `python3 .claude/skills/write-a-skill/scripts/validate_frontmatter.py <path>`.
- **Tracker:** use `bd` (beads), NOT TodoWrite/markdown. Create issue before code; `bd update <id> --status=in_progress`/`--claim`; `bd remember` for project knowledge. (`.beads/issues.jsonl` is gitignored — the auto-export warnings are harmless.)
- **Source material to mine** for the remaining skills: `product_management _part/skills/pm-phase-0X-*/SKILL.md` (PM) and `System Engineering/System_Engineering_Workflow/skills/se-phase-0X-*/SKILL.md` (SE). Convert to chain house style; keep the chain's lightweight scheme (no PM `OPP-`/`OBJ-` ID spines, no `_threads/`).
- **Nothing committed yet** this session. Working tree has: new `project-brief.md`, `HANDOFF-pm-se-merge.md`, `.claude/skills/strategy/*`, edits to `_shared/ai-schema.md` + `_shared/conventions.md`. (Branch `workflow` is ephemeral / no upstream — commit locally; merge to main locally per repo protocol.)

## Working style (the user confirmed this — follow it)
Align on understanding **in prose** before option-picking; reserve `AskUserQuestion` for genuine forks *after* the shape is shared. **Strong lean / anti-ceremony bias** — minimum set of high-value skills, expandable later; they lose momentum if planning outweighs building. Favor reuse/combine over adding new skills; flag duplicate owners. Push back when warranted (they invited it). Tracer-bullet first.

---
## Next Session Quickstart (macOS)
Resume in a fresh session with:

```
claude /Users/andresrambal/Projects/LAB53/agentic-skills/SDLC-skills-UI-approach2/HANDOFF-pm-se-merge.md
```
