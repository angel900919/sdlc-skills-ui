# Hooks — Enforcement Layer

Hooks are deterministic — they run whether or not the agent "remembers" a rule, which is why
must-happen behavior lives here and not in prose. The scaffold ships these already wired in
`.claude/settings.json`; `settings.snippet.json` here is the documented source you can re-apply or
adapt. Edit the commands (`scripts/check`, the test/lint invocations) to match your project.

## The three hooks worth having on day one
1. **Stop hook — the gate.** Blocks the turn from ending until `scripts/check` passes. This is what makes
   "verify your work" non-optional. (Claude Code force-ends after 8 consecutive blocks, so it can't cage the agent.)
2. **PostToolUse hook — the feedback loop.** After every edit, streams test/lint output back so the agent
   self-corrects mid-task. Feedback, not a block.
3. **PreToolUse hook — the guardrail.** Denies edits to protected paths (auth, payments, migrations, tests
   during the green phase) with an explanatory message the agent can act on.

## Principle
CLAUDE.md *influences*; hooks *guarantee*. Every rule in `coding-standards.md` marked "enforced by: hook"
should have a corresponding entry here. Also harden against bypass: deny the shell escapes
(`echo`, `sed`, `awk`, `perl` redirects) an agent could use to route around a protected-path deny.
