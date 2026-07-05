# Skills (authoring source)

Reusable procedural knowledge, authored here as the portable source of truth. **Execution:** Claude Code
discovers skills under `.claude/skills/`, so either keep the real `SKILL.md` there and reference it from
here, or symlink `.claude/skills/<name>` → `.ai/skills/<name>`. The format (`SKILL.md` + `scripts/` +
`references/`) is the cross-tool [agentskills.io](https://agentskills.io) standard.

## When something becomes a skill
Facts → the entry point (`AGENTS.md`). **Procedures you repeat → a skill.** Guarantees → a hook.
Rule of thumb: if you've pasted the same instructions twice, or do it more than once a day, make it a skill.

## Authoring discipline
- Description is a **router**: third person, what it does + when to use it, real trigger phrases.
- Body under 500 lines; put deterministic steps in an optional `scripts/` dir; safety-critical rules **inline**, never in a reference file (agents rarely open references).
- Set `disable-model-invocation: true` on anything with side effects (deploy, commit).
- Eval **with vs. without** the skill before trusting it; keep only what raises the pass rate.

See `update-project-state/SKILL.md` — a minimal example (frontmatter + body only; `scripts/` and `references/` are optional and omitted here). The folder name matches its `name:` field, as required.
