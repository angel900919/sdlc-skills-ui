# CLAUDE.md

@AGENTS.md

<!-- CLAUDE.md imports AGENTS.md (the vendor-neutral instructions) so there is one
     source of truth. Add ONLY Claude-Code-specific notes below. Alternatively,
     replace this file with a symlink: `ln -s AGENTS.md CLAUDE.md`. -->

## Claude Code specifics
- Use plan mode for changes touching more than one file or any protected path.
- Skills live in `.claude/skills/`; run `/reload-skills` after editing one.
- Verification hooks are configured in `.claude/settings.json` (sourced from `.ai/hooks/`):
  a Stop hook blocks turn-end until `scripts/check` passes; a PostToolUse hook streams
  test/lint output after edits.
- Keep this file + AGENTS.md together under ~200 lines. Move procedures to skills,
  situational rules to `.claude/rules/`, and must-happen enforcement to hooks.
