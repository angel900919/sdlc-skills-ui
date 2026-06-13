---
slug: sdlc-command-center
stage: understanding
status: complete
verdict: READY-FOR-ARCHITECT
verdict_overridden: false
entities: [Project, Session, Hook event, Transcript message, Audit event, Usage sample, Verdict token, Feature, Slice, Worktree, Session PR]
invariant_count: 12
source_recon: .ai/recon.md
context_file: .ai/context.md
human_summary: .human/summaries/understanding.md
consumed_by: [feature-map, architect, prd]
created: 2026-06-13
---

# Understanding — sdlc-command-center

## Glossary
Defined canonically in `.ai/context.md`. In scope here: Project, Session, Permission mode,
Hook event, Transcript message, Audit event, Usage sample, Verdict token, Stage, Feature,
Slice, Worktree, Subagent, Attention, Recap, Session PR, Skill.

## Invariants
Triaged from recon §C10 (24 code-enforced rules → 12 domain rules kept; pragmas, dedupe
mechanics, and input-escaping mechanics dropped as implementation detail).
1. Observation never interferes: a hook call can never block or fail the session it observes (hookSettings.ts:14-15,45).
2. A session belongs to exactly one project and is deleted with it (db.ts:23).
3. A session interrupted by a crash or restart stays resumable — boot flips starting/running → interrupted, never loses it (sessionManager.ts:260-267).
4. A resumed session continues where it left off: same cwd, worktree, and permission mode unless explicitly overridden (sessionManager.ts:117-120).
5. A session's permission mode is always one of the six known modes; unknown input degrades to the safest default (claudeArgs.ts:27-40).
6. Self-hosting must not recurse: a spawned CLI never inherits the app's own Claude session identity (sessionManager.ts:28-38).
7. Writes to the user's global Claude config are marked, backed up, atomic, and reversible — only the app's own marker-tagged entries are ever touched (globalHooks.ts:13-25).
8. The pipeline never shows false progress: verdict matching prefers the longest token, and an unknown token advances nothing (verdicts.ts:176-184,220-223).
9. Work leaves the machine only through a human gate: PR creation needs explicit confirmation, never force-pushes, and requires a genuinely-ahead branch (prFlow.ts:6-11,59-80).
10. The app never observes its own output (dashboard/ is excluded from watching — feedback-loop guard) (watcher.ts:8-11).
11. Doc reading stays inside the project root, renderable types only, size-capped (docsTree.ts:50-56).
12. A live session's worktree cannot be removed, and input to a non-live session is refused (api.ts:317,163-164).

## Behaviors
- journey: Launch a chain step from the browser
  trigger: the owner wants to run the next SDLC skill on a project
  steps: [pick the project, pick the skill or type a prompt, launch]
  outcome: a real Claude terminal runs in the page with hooks, transcript, and usage streaming in
  failure_mode: the CLI exits early — the session shows exited with scrollback preserved; nothing is lost
- journey: Pick up where I left off
  trigger: the server restarted (or the laptop closed) mid-conversation
  steps: [open the dashboard, see the session marked interrupted, hit resume]
  outcome: the same conversation continues — same directory, worktree, and permission mode
  failure_mode: resume fails — the session stays interrupted with its scrollback intact
- journey: Advance the pipeline by verdict
  trigger: a skill finishes with a verdict token in its final message
  steps: [the verdict is detected from the transcript, the board shows the next step, one click launches it]
  outcome: the chain advances one human-approved hop at a time
  failure_mode: an unknown token — nothing advances (invariant 8), the human decides

## Boundaries
- in: [local orchestration of Claude CLI sessions, chain-state visualization, transcript/usage/hook observability, human-gated PR hand-off]
- out:
  - { item: multi-user / remote deployment (Postgres path named in ADR-0003), revisit: 2026-12-31 }
  - { item: autonomous multi-session fleet orchestration, revisit: 2026-12-31 }
- never: [cloud SaaS holding user transcripts (local-first), API-credit (SDK) execution path (PTY-only premise), unattended permission-bypass by default]

## Open assumptions
- assumption: the app remains a read-only observer of managed repos — no mechanical guard enforces it (PR branch-push is the one sanctioned write)
  source: code review (recon §A5, §C10)
  falsification_test: add a route that writes into a managed repo; nothing fails today
- assumption: the two hook systems (chain hooks in .claude/settings.json + app-generated observability hooks via --settings) compose without conflict when the app manages this very repo
  source: recon §E15 mystery zone
  falsification_test: spawn a session on this repo from the app; check both hook sets fire
- assumption: self-hosting (the app managing its own repo) is safe beyond env-stripping — the supported boundary is undeclared
  source: recon §E15; index.ts:50-52 self-registration
  falsification_test: run a full chain stage on this repo from inside the app; watch for recursion artifacts
- assumption: the PTY-over-headless premise (separate Agent SDK billing from 2026-06-15) holds
  source: README.md:13-15; ADR-0001
  falsification_test: re-check Anthropic billing docs after 2026-06-15
- assumption: `auto` and `dontAsk` permission modes are intended for future UI exposure (they exist in the type union, undocumented elsewhere)
  source: recon §E15
  falsification_test: ask the owner; or check whether any UI path can set them

## Decisions
- none new — docs/adr/0001 (PTY over headless), 0002 (reuse project-state.py), 0003 (local-first SQLite) stand; no comprehend-level decision met all three ADR triggers.
- Mystery-zone resolutions recorded: `dashboard/` is the chain's state-snapshot dir (not the web app); `.ai/current-issues.md` is chain-owned and transient (hence gitignored); root `CLAUDE.md` governs sessions while `CLAUDE.md.suggested` awaits the owner's review.

## Verdict
**READY-FOR-ARCHITECT** — glossary confirmed from recon §C (24 candidates → context.md), invariants triaged 24→12 with citations carried, three journeys in the user's voice, all six mystery zones resolved or recorded as falsifiable assumptions. Autonomous-run note: confirmations were made from the project's own records (handoffs, ADRs, README) under the owner's standing instruction, not a live interview.

## References
- source_recon: .ai/recon.md
- context_file: .ai/context.md
- human_summary: .human/summaries/understanding.md
