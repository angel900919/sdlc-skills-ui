# SE Workflow — Project Starter (drop‑in)

A self‑contained, **manual‑invocation** systems‑engineering kit you copy into any new project repo. Skills are project‑scoped and **never auto‑fire** (`disable-model-invocation: true`) — you stay in control, with [`WORKFLOW.md`](WORKFLOW.md) as your map.

## What's inside

```
project-starter/
├── WORKFLOW.md          ← your front-of-me map (12 stages, gates, /commands, thread tracker, gate log)
├── .claude/skills/      ← 12 manual SE skills (se-phase-00 … 11), invoked with /se-phase-NN-name
└── se-workflow/         ← the reference: Conventions, AI-SE Protocol, Tailoring, Standards Map,
                            8 cross-cutting threads, templates, prompts, checklists
```

## Install (per project — the way you like it)

1. **Copy the *contents* of this folder into the root of your new repo:**
   ```bash
   cp -r project-starter/. /path/to/your-new-repo/
   ```
   You'll get `.claude/skills/`, `se-workflow/`, and `WORKFLOW.md` at the repo root. (If the repo already has a `.claude/`, this merges into it.)
2. **No restart needed** — Claude Code live‑loads `.claude/skills/`. Open a session in the repo and type `/` to see the `se-phase-*` skills, or ask "what skills are available?".
3. **Rename `WORKFLOW.md`'s `<PROJECT NAME>`** and fill the "You are here" block.

## Use

- Open **`WORKFLOW.md`** and work top to bottom.
- For each stage, **type its `/command`** (e.g. `/se-phase-01-concept`). It won't fire on its own.
- The skill interviews you, writes deliverables into `Phase_NN_*/`, checks the gate, and tells you the next command. **You** decide each gate and tick the box.
- Reference the method anytime under [`se-workflow/`](se-workflow/).

## Notes

- **Manual by design.** Every skill carries `disable-model-invocation: true` (Claude won't auto‑invoke) and `user-invocable: true` (you can call it from `/`). Remove the first line in a skill's frontmatter if you ever *do* want auto‑triggering.
- **References are wired for this layout.** Skills point at `../../../se-workflow/…`, which resolves from `<repo>/.claude/skills/se-phase-NN/`. Keep `se-workflow/` at the repo root.
- **Lean bundle.** The worked examples and the 19‑topic theory KB are *not* included (to keep each repo small). They live in the master `System_Engineering_Workflow/` — copy `examples/` in too if you want them offline.
- **Version‑control it.** Commit `.claude/skills/`, `se-workflow/`, and `WORKFLOW.md` with your project so the process travels with the code and is auditable.
