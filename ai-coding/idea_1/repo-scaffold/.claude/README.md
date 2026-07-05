# .claude/ — Execution Layer

This is where Claude Code discovers what it actually runs: settings/hooks, skills, and subagents. The
**source of truth** for skills/agents lives in `.ai/` (portable, harness-agnostic); `.claude/` is the
mount point the harness reads. Keep the two in sync with symlinks.

## What ships here
- `settings.json` — the wired hooks and permission denies (already assembled from `.ai/hooks/settings.snippet.json`). Edit the commands to match your project.

## Wire up skills and subagents (symlink from the .ai source of truth)
```bash
# from the repo root:
mkdir -p .claude/skills .claude/agents
ln -s ../../.ai/skills/update-project-state .claude/skills/update-project-state
ln -s ../../.ai/agents/verifier.md          .claude/agents/verifier.md
```
Claude Code follows symlinks, so the file is authored/versioned once (in `.ai/`) and executed here. If your
setup can't use symlinks, keep the real file in `.claude/` and leave a pointer in `.ai/` — but then `.claude/`
becomes the source of truth for that item, so prefer symlinks.

## Other things that belong here (as you add them)
- `.claude/rules/*.md` — path-scoped rules (load only when matching files are touched)
- `.claude/commands/*.md` — legacy slash commands (skills are preferred)
