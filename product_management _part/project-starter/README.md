# PM Workflow — Project Starter (drop-in)

A self-contained, **manual-invocation** product-management operating system you copy into any product repo. Skills are project-scoped and **never auto-fire** (`disable-model-invocation: true`) — you stay in control, with [`WORKFLOW.md`](WORKFLOW.md) as your map.

## What's inside

```
project-starter/
├── CLAUDE.md            ← auto-loaded each session: how the AI behaves in this repo (manual-invocation, the standing rules, pointers)
├── WORKFLOW.md          ← your front-of-me map (6 macro-stages, 17 phases, gates G0-G10, /commands, thread tracker, gate log)
├── .claude/skills/      ← 17 manual PM skills (pm-phase-00 … 16) + research-report (the research executor)
└── pm-workflow/         ← the reference: Conventions, AI-PM Protocol, Frameworks Map, Tailoring,
                            6 cross-cutting threads, templates, framework cards, prompts, checklists
```

**Research executor.** The bundle includes the **`research-report`** skill: when a phase's *Research & specialised-agent triggers* call for web research (market sizing, competitive intel, benchmarks, regulation, build-vs-buy), run **`/research-report`** to get a cross-checked, cited report (or decision brief) saved to `reports/` that grounds the phase artifact. See the research-execution ladder in [`pm-workflow/prompts/research-and-agents.md`](pm-workflow/prompts/research-and-agents.md). Plain `WebSearch` remains the always-valid fallback if you remove it.

## Install (per product)

1. **Copy the *contents* of this folder into the root of your product repo:**
   ```bash
   cp -r project-starter/. /path/to/your-product-repo/
   ```
   You'll get `CLAUDE.md`, `.claude/skills/`, `pm-workflow/`, and `WORKFLOW.md` at the repo root. (If the repo already has a `.claude/`, this merges into it.)
   - **⚠️ If your repo already has a `CLAUDE.md`, do NOT let the copy overwrite it.** Either copy everything *except* `CLAUDE.md` and merge its contents into yours, or just append one line to your existing `CLAUDE.md`:
     ```
     @pm-workflow/02_AI_Product_Manager_Protocol.md
     ```
     plus a pointer to `WORKFLOW.md`. That gives the AI the operating rules without clobbering your own project instructions.
2. **No restart needed** — Claude Code live-loads `.claude/skills/`. Open a session in the repo and type `/` to see the `pm-phase-*` skills, or ask "what skills are available?".
3. **Rename `WORKFLOW.md`'s `<PRODUCT NAME>`** and fill the "You are here" block (segment, stage, cadence, tailoring profile, North Star).

## Use

- Open **`WORKFLOW.md`** and work top to bottom.
- For each phase, **type its `/command`** (e.g. `/pm-phase-03-discovery`). It won't fire on its own.
- The skill interviews you one topic at a time, writes deliverables into `NN_<Phase>/`, checks the gate, and tells you the next command. **You** decide each gate (Persevere / with-actions / **Pivot** / Hold / **Kill**) and tick the box.
- Keep the six cross-cutting threads alive every phase; review them at every gate.
- Reference the method anytime under [`pm-workflow/`](pm-workflow/).

## The operating principles (the short version)

- **Outcomes over outputs** — measured by customer & business value, not features shipped.
- **Problem before solution** — validate the problem (G2/G3) before committing the build.
- **Continuous discovery** — weekly customer contact; the opportunity tree never closes.
- **Evidence over opinion** — every bet has an assumption, a test, and a metric.
- **Gates are decisions** — Pivot and Kill are wins when the evidence supports them.
- **Responsible by default** — privacy, accessibility, ethics, and safety are a non-negotiable floor.
- **AI-accelerated, human-led** — AI drafts and challenges; you decide and are accountable.

## Notes

- **Manual by design.** Every skill carries `disable-model-invocation: true` (Claude won't auto-invoke) and `user-invocable: true` (you call it from `/`). Remove the first line in a skill's frontmatter if you ever *do* want auto-triggering.
- **References are wired for this layout.** Skills point at `../../../pm-workflow/…`, which resolves from `<repo>/.claude/skills/pm-phase-NN/`. Keep `pm-workflow/` at the repo root.
- **Lean bundle.** The worked example, the deep-theory guide, and the 2026 research pack are *not* included (to keep each repo small). They live in the master `Product_Management_Workflow/` — copy `worked_example/` and `reference/` in too if you want them offline.
- **Version-control it.** Commit `.claude/skills/`, `pm-workflow/`, and `WORKFLOW.md` with your product so the process travels with the work and is auditable.
