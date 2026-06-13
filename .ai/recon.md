---
slug: sdlc-command-center
stage: recon
status: complete
tier: mvp
project_type: brownfield
verdict: READY-FOR-COMPREHEND
verdict_overridden: false
citation_count: 161
component_count: 7
glossary_candidate_count: 24
scanned_by: explore-subagent
source_anchor: .ai/anchor.md
consumed_by: [comprehend, architect]
created: 2026-06-13
---

# Recon: project-wide

## Status

`Ready-for-Comprehend`

## Meta

- **Project root:** `/Users/andresrambal/Projects/LAB53/agentic-skills/SDLC-skills-UI-approach2`
- **Tier:** `mvp` *(inherited from `.ai/anchor.md`)*
- **Anchor stack:** TypeScript · react-vite (web) + fastify (server) · sqlite (better-sqlite3) · local-only · auth none
- **Scanned by:** sub-agent (general-purpose, read-only discipline, draft-file contract), 2026-06-13
- **Scan scope:** `apps/`, `packages/`, `dashboard/`, root manifests; `.claude/skills/` shape-only

---
## Section A — Repo shape

### A1. Top-level layout
- `apps/server/` — Fastify backend: PTY-driven Claude CLI sessions, hook ingest, state engine, WS hub (README.md:70).
- `apps/web/` — React 19 + Vite + MUI 9 SPA dashboard ("Flight Deck") (README.md:71).
- `packages/shared/` — workspace package `@sdlc/shared`: domain types, SDLC stage model, verdict vocabulary, pure transforms (packages/shared/src/index.ts:1-11).
- `dashboard/` — single generated file `state.json`, output of the chain's `project-state.py` (dashboard/state.json:1-6).
- `.claude/skills/` — sibling product: 55-skill SDLC chain the app orchestrates; one line per scan scope, not deep-scanned (README.md:73 calls it "54-skill"; 55 skill dirs exist on disk).
- `.ai/` — chain artifacts: anchor.md, intake.md, progress-tracker.md (.ai/anchor.md:1).
- `.human/` — human-readable chain summaries: intake/idea.md, summaries/anchor.md.
- `docs/` — architecture.md + adr/0001-0003 (docs/architecture.md:1).
- `data/` — runtime dir (sqlite, logs, generated hook settings); gitignored (.gitignore:7-11).
- Root files: CLAUDE.md (generic engineering instructions), CLAUDE.md.suggested (anchor-seeded project template), DOGFOOD-LOG.md (autonomous chain run log), package.json, vitest.config.ts, tsconfig.base.json.

### A2. Runtimes
- Node >= 20, npm workspaces `packages/*` + `apps/*` (package.json:7-10, 27-29).
- TypeScript ^6.0.3 everywhere; server runs via `tsx` with no build step (apps/server/package.json:7-9, 27).
- Browser SPA built by Vite 8, dev port 5180 proxying to 4317 (apps/web/vite.config.ts:6-11).
- Python 3 (stdlib only) shells out to the chain's `project-state.py` (apps/server/src/config.ts:21-22; README.md:39).

### A3. Deployment surface
- None. No Dockerfile, vercel/wrangler/fly/netlify config, k8s, or terraform anywhere in the repo (file inventory of apps/, packages/, dashboard/, root).
- Hosting is local-only, single env; server binds 127.0.0.1:4317 by default (apps/server/src/config.ts:11-12; .ai/anchor.md:46-49).
- Production mode = Fastify serving the built SPA from `apps/web/dist` with index.html fallback (apps/server/src/index.ts:32-41).

### A4. Datastores + migrations
- SQLite via `better-sqlite3` at `data/command-center.sqlite`, WAL mode, foreign_keys ON (apps/server/src/db.ts:8-10).
- No ORM; inline DDL with `CREATE TABLE IF NOT EXISTS`: projects, sessions, hook_events, audit_events, transcript_messages, usage_samples, session_prs (apps/server/src/db.ts:12-92).
- FTS5 virtual table `transcript_fts` for transcript full-text search (apps/server/src/db.ts:95-101).
- No migration folder; additive column migrations via `ensureColumn()` ALTER TABLE (apps/server/src/db.ts:104-113).

### A5. External integrations (all local CLIs/files; no auth/payment/messaging/LLM API providers)
- `claude` CLI spawned interactively in a PTY via node-pty — the only LLM access path; no Anthropic SDK dependency (apps/server/src/claude/sessionManager.ts:128; apps/server/package.json:11-28).
- `git` via execFileSync: worktrees (apps/server/src/claude/worktrees.ts:15), session diffs (apps/server/src/state/gitDiff.ts:14), PR prep (apps/server/src/state/prFlow.ts:14).
- `gh` CLI for PR creation — the only network-egress action, human-gated (apps/server/src/state/prFlow.ts:17-19, 6-11).
- `python3` runs `.claude/skills/_build_share/project-state.py` (apps/server/src/state/projectState.ts:39).
- `curl` inside generated Claude hook commands POSTing to `http://host:port/api/hooks/<event>` (apps/server/src/claude/hookSettings.ts:44-46).
- `~/.claude/projects/<munged-cwd>/<sessionId>.jsonl` transcripts tailed (apps/server/src/config.ts:17-18, 26-29).
- `~/.claude/settings.json` (or $CLAUDE_CONFIG_DIR) mutated only by opt-in global-hooks install (apps/server/src/claude/globalHooks.ts:7-25).
- OpenTelemetry OTLP trace export, opt-in via `OTEL_EXPORTER_OTLP_ENDPOINT` (apps/server/src/otel.ts:8-14).

## Section B — Component decomposition

### B6. Cohesive units
- **Claude session layer** — `apps/server/src/claude/`: spawns/observes interactive Claude CLI. Files: sessionManager.ts (PTY lifecycle), transcriptTailer.ts (jsonl tailing), hookSettings.ts + globalHooks.ts (hook injection), claudeArgs.ts (pure flag mapping), worktrees.ts, subagents.ts. Entity-Trap suffixes present: `sessionManager`, `TranscriptTailer` class (apps/server/src/claude/transcriptTailer.ts:29).
- **HTTP/WS surface** — `apps/server/src/routes/api.ts` (~30 REST endpoints), `routes/hooks.ts` (hook ingest), `ws.ts` (single multiplexed WebSocket with topics all/project:<id>/session:<id>, ws.ts:8-12), `index.ts` (boot, recovery, shutdown).
- **State engine** — `apps/server/src/state/`: projectState.ts (shells to project-state.py), watcher.ts (chokidar on .ai/.human/docs/fitness/tickets, watcher.ts:18), verdictWatcher.ts, attention.ts, recap.ts, usageTracker.ts (suffix: Tracker), search.ts, skillsCatalog.ts, docsTree.ts, prFlow.ts, gitDiff.ts, devServers.ts, projects.ts.
- **Persistence + bus** — db.ts (schema), bus.ts (EventEmitter: every observable event → SQLite audit + WS fan-out, bus.ts:6-9), logger.ts (pino), otel.ts, config.ts.
- **Shared domain package** — `packages/shared/src/`: types.ts (all domain interfaces), stageModel.ts (SDLC stage graph), verdicts.ts (verdict vocabulary + extraction), plus pure transforms trace.ts, recap.ts, usage.ts, prDraft.ts, diffStat.ts, markdownExport.ts, artifactPath.ts, previewUrl.ts. Every module has a sibling .test.ts.
- **Web SPA** — `apps/web/src/`: pages/ (Dashboard, Pipeline, Board, Workspace, Sessions, Docs, Skills — App.tsx:66-75), components/ (Terminal, ChatView, TraceView, DiffView, PrDialog, CommandPalette…), api/ (fetch wrapper + React Query hooks), ws/socket.ts (reconnecting singleton), store/appStore.ts (zustand).
- **Skill chain (sibling product)** — `.claude/skills/`: 55 skills; consumed by the app via skillsCatalog.ts frontmatter parsing and project-state.py. Not deep-scanned per scope.

### B7. Inter-component edges (representative import per edge)
- server → shared: `import type { HookEvent, MetricsSummary } from '@sdlc/shared'` (apps/server/src/routes/api.ts:2).
- web → shared: `import type { AuditEvent, HookEvent, ServerEvent, … } from '@sdlc/shared'` (apps/web/src/store/appStore.ts:3).
- routes → claude layer: `import { …, spawnSession, … } from '../claude/sessionManager.js'` (apps/server/src/routes/api.ts:16-22).
- claude layer → state layer: transcriptTailer imports ingestUsage, watchForVerdicts, indexTranscriptMessage (apps/server/src/claude/transcriptTailer.ts:8-10).
- everything → bus/db singletons: `import { bus } from '../bus.js'` (apps/server/src/state/watcher.ts:3); `import { db } from './db.js'` (apps/server/src/bus.ts:3).
- web → server: fetch via `/api` + WS `/ws`, both proxied in dev (apps/web/src/api/client.ts:3-7; apps/web/src/ws/socket.ts:26).
- server → skill chain: generatorFor() resolves `_build_share/project-state.py` (apps/server/src/state/projectState.ts:21-27).

### B8. Architectural style signals (evidence, no label picked)
- Two-app monorepo, single deployable backend process — modular monolith shape (package.json:7-10).
- Event-driven internals: in-process bus persists to SQLite audit trail and fans out to WS clients (apps/server/src/bus.ts:6-9; apps/server/src/ws.ts:40-47).
- Layering on the server: routes/ → claude/ + state/ → db/bus; pure logic split out for testability ("Kept pure and separate from the PTY machinery so the permission-mode → flag mapping is testable", apps/server/src/claude/claudeArgs.ts:4-6).
- Shared-kernel package: all cross-process types + pure domain transforms live in @sdlc/shared (packages/shared/src/index.ts:1-11).
- Module-level singletons, no DI container (apps/server/src/bus.ts:55; apps/server/src/db.ts:8).
- CQRS-ish read model: dashboard state is a regenerated JSON snapshot read after a write-side debounce (apps/server/src/state/watcher.ts:8-11, 49-51).

## Section C — Domain language + invariants

### C9. Glossary candidates
- **Project** — a managed repo root registered with the dashboard (packages/shared/src/types.ts:7-15).
- **Session / ClaudeSession** — one interactive Claude CLI process in a PTY; internal id == the `--session-id` passed to claude (packages/shared/src/types.ts:26-47).
- **Permission mode** — claude CLI permission flag mirrored per session (`default|acceptEdits|plan|auto|dontAsk|bypassPermissions`) (packages/shared/src/types.ts:23-24).
- **Hook event** — Claude Code lifecycle event POSTed to the backend (SessionStart…Notification) (apps/server/src/claude/hookSettings.ts:17-26).
- **Transcript message** — parsed jsonl entry from `~/.claude/projects` (packages/shared/src/types.ts:75-83).
- **Audit event** — unified observability record (sources: hook|transcript|server|user|fs) (packages/shared/src/types.ts:148-159).
- **Usage sample** — per-message token usage parsed from transcripts (apps/server/src/db.ts:70-80).
- **Verdict (token)** — uppercase chain outcome (READY-FOR-QA, BLOCKED-ON-ANCHOR…) detected in assistant text (packages/shared/src/verdicts.ts:1-19).
- **Stage / StageDef / StagePhase** — node in the SDLC stage graph (foundation, per-feature, execution, qa-release, post-delivery, cross-cutting, utility) (packages/shared/src/stageModel.ts:9-30).
- **Chain** — the 55-skill SDLC workflow being orchestrated (README.md:3-5).
- **Skill** — slash-command unit; directory name == command (packages/shared/src/types.ts:165-174).
- **Foundation** — the once-per-project stage block in project state (packages/shared/src/types.ts:221-232).
- **Feature / FeatureState** — feature roster entry with status Planned…Shipped (packages/shared/src/types.ts:199-208).
- **Slice / FeatureSliceState** — issue-level unit of a feature (SLICE-N) (packages/shared/src/types.ts:185-197).
- **Attention** — "blocked on you" state set by Notification hooks, cleared by activity (apps/server/src/state/attention.ts:4-9).
- **Recap** — structural "what happened while unfocused" summary; deliberately not model-generated (packages/shared/src/recap.ts:4-9).
- **Worktree** — per-session git checkout `<root>/.worktrees/<id8>` on branch `session/<id8>` (apps/server/src/claude/worktrees.ts:5-10).
- **Scrollback** — 400KB PTY ring buffer replayed to late WS joiners (apps/server/src/claude/sessionManager.ts:25; apps/server/src/ws.ts:63-72).
- **Subagent** — child agent transcript under `<transcriptDir>/<sessionId>/subagents/` (packages/shared/src/types.ts:301-316).
- **Session PR** — pull request created from a session's branch, human-gated (packages/shared/src/types.ts:334-343).
- **Project state** — output of project-state.py; "the dashboard sees exactly what /status and /next see" (apps/server/src/state/projectState.ts:12-16).
- **Anchor / Tier** — locked project profile (tier mvp, stack, dep allowlist) (.ai/anchor.md:30-50).
- **Trace** — hook events paired into a per-session tool-call tree (apps/server/src/routes/api.ts:345-364).
- **Global hooks** — opt-in observation of sessions started outside the dashboard (packages/shared/src/types.ts:111-132).

### C10. Invariants enforced in code ("X must Y")
- projects.root_path must be unique; sessions must reference an existing project and cascade-delete with it (apps/server/src/db.ts:16, 23).
- DB must run WAL with foreign_keys ON (apps/server/src/db.ts:9-10).
- Sessions still marked starting/running at boot must be flipped to `interrupted` (resumable) (apps/server/src/claude/sessionManager.ts:260-267).
- A resumed session must inherit the original cwd, worktree, and permission mode unless overridden (apps/server/src/claude/sessionManager.ts:117-120).
- Untrusted permissionMode input must normalize to a member of the 6-value whitelist, else `default` (apps/server/src/claude/claudeArgs.ts:27-40).
- Spawned CLIs must not inherit nested CLAUDE_*/CLAUDECODE env vars (except CLAUDE_CONFIG_DIR) (apps/server/src/claude/sessionManager.ts:28-38).
- Hook commands must never block Claude: `curl --max-time 3 … || true` (apps/server/src/claude/hookSettings.ts:14-15, 45).
- Global-hooks install must only ever add/remove entries carrying the `# sdlc-command-center` marker, back up before first write, and write atomically; never touched on boot (apps/server/src/claude/globalHooks.ts:13-25).
- Doc file reads must resolve inside the project root, match renderable extensions, and be ≤ 2MB (apps/server/src/state/docsTree.ts:50-56).
- PR creation must be blocked on: detached HEAD, branch == base, zero commits ahead, missing origin remote; POST requires base + non-empty title (apps/server/src/state/prFlow.ts:59-80; apps/server/src/routes/api.ts:274).
- Branch pushes for PRs must never be force pushes (apps/server/src/state/prFlow.ts:6-11).
- Diff base ref must pass `git rev-parse --verify` before use (injection guard); diff text capped at 400k chars (apps/server/src/state/gitDiff.ts:11, 23-30).
- Verdict matching must prefer the longest token so BLOCKED-ON never shadows BLOCKED-ON-ANCHOR; unknown tokens must report advances=false ("the UI must not render stage complete") (packages/shared/src/verdicts.ts:176-184, 220-223).
- Verdict broadcasts must be deduped per (session, token) (apps/server/src/state/verdictWatcher.ts:10-12, 23-25).
- Worktree creation requires a git repo; `.worktrees/` must never be tracked (git/info/exclude) (apps/server/src/claude/worktrees.ts:36-38, 52-56).
- Worktree removal must be refused while the session is live (apps/server/src/routes/api.ts:317).
- Input to a non-live session must 409 (apps/server/src/routes/api.ts:163-164).
- Usage samples must dedupe by transcript uuid (`INSERT OR IGNORE`) (apps/server/src/state/usageTracker.ts:15-21).
- FTS user input must be treated as plain terms, never FTS5 syntax; search queries need ≥ 2 chars (apps/server/src/state/search.ts:19-28; apps/server/src/routes/api.ts:341).
- OTel must initialize only when an OTLP endpoint env var is set; open-span bookkeeping is capped/swept so leaks can't occur (apps/server/src/otel.ts:12-14, 28-38).
- dashboard/ itself must not be watched (regen feedback loop) (apps/server/src/state/watcher.ts:8-11).

### C11. Top user journeys (entry points)
1. **Launch a skill session from the browser**: POST /api/projects/:id/sessions (apps/server/src/routes/api.ts:124) → spawnSession PTY with generated --settings + --session-id (apps/server/src/claude/sessionManager.ts:112-134) → launch prompt typed into the TUI after 900ms output settle (sessionManager.ts:179-204) → terminal frames streamed on WS topic `session:<id>` (apps/server/src/ws.ts:14-18).
2. **Observe a running session**: claude hooks POST /api/hooks/:event (apps/server/src/routes/hooks.ts:47) → persisted, broadcast, attention updated; transcript tailed from disk into ChatView/usage/verdicts/search (apps/server/src/claude/transcriptTailer.ts:32-57).
3. **Recover an interrupted session**: boot marks orphans interrupted (apps/server/src/claude/sessionManager.ts:260-267) → POST /api/sessions/:id/resume (apps/server/src/routes/api.ts:182) → `claude --resume <id>` (apps/server/src/claude/claudeArgs.ts:22).
4. **Advance the pipeline by verdict**: tailer → watchForVerdicts emits `verdict` WS event with nextSkill routing (apps/server/src/state/verdictWatcher.ts:14-45) → Pipeline/Board pages offer one-click next launch (apps/web/src/App.tsx:68-69).
5. **Ship session work as a PR**: GET /api/sessions/:id/pr assembles draft + blockers (apps/server/src/routes/api.ts:257) → POST pushes branch and runs `gh pr create` on explicit confirm (apps/server/src/routes/api.ts:269-295; apps/server/src/state/prFlow.ts:6-11).

## Section D — Decisions already made

### D12. Visible architectural decisions
- **Interactive PTY over headless `claude -p`** — billing-driven; "no permission-bypass flags are ever passed" by default (docs/adr/0001-pty-over-headless.md:1-20; apps/server/src/claude/sessionManager.ts:14-23). Note: bypassPermissions mode nevertheless exists as an explicit option (apps/server/src/claude/claudeArgs.ts:17-18).
- **Reuse the chain's project-state.py as the state engine** rather than reimplementing state parsing (docs/adr/0002-reuse-project-state-generator.md:1-18; apps/server/src/state/projectState.ts:12-16).
- **SQLite (WAL) local-first, no ORM, raw SQL** — PostgreSQL named as the future multi-user path (docs/adr/0003-local-first-storage.md:1-20; apps/server/src/db.ts:8-12).
- **Auth: none** — loopback bind is the security boundary; hook ingest endpoint accepts any local POST (apps/server/src/config.ts:12; apps/server/src/routes/hooks.ts:47-54; .ai/anchor.md:48).
- **CSR SPA** — Vite + BrowserRouter, no SSR; Fastify serves dist with index.html fallback in prod (apps/web/src/App.tsx:63-78; apps/server/src/index.ts:32-41).
- **Monorepo, npm workspaces**; shared types consumed as raw TS source (`"main": "src/index.ts"`) (package.json:7-10; packages/shared/package.json:6-10).
- **Message-passing: single in-process EventEmitter bus → SQLite audit + one multiplexed WS** with topic subscriptions; no external queue (apps/server/src/bus.ts:6-9; apps/server/src/ws.ts:8-12).
- **Server state via TanStack Query + WS invalidation; UI state via zustand (persisted partialize)** (apps/web/src/App.tsx:25-48; apps/web/src/store/appStore.ts:38-71).
- **Testing: vitest workspace projects, node env only, tests co-located** — explicitly "no jsdom/component tests yet" (vitest.config.ts:4-27).
- **Observability: pino structured logs + opt-in OTLP traces** (apps/server/src/index.ts:19-20; apps/server/src/otel.ts:8-14).
- **Branching: git-flow (develop → main); default diff/PR base hardcoded to `develop`** (.ai/anchor.md:69; apps/server/src/routes/api.ts:240, 263).
- **Dependency allowlist locked in anchor** (auto-seeded, marked tentative) (.ai/anchor.md:10-16, 52-64).

### D13. Existing docs to respect
- README.md (system rationale + quickstart + page map) (README.md:1-75).
- docs/architecture.md — mermaid system overview, observability-spine table, OTel section (docs/architecture.md:1-80).
- docs/adr/0001-pty-over-headless.md, 0002-reuse-project-state-generator.md, 0003-local-first-storage.md — all "Status: accepted".
- .ai/anchor.md (tier lock, stack, release policy, TODOs), .ai/intake.md, .ai/progress-tracker.md (append-only log; next step recorded as "/explore … then /comprehend", .ai/progress-tracker.md:6).
- .human/intake/idea.md, .human/summaries/anchor.md (human-readable chain mirrors).
- CLAUDE.md (root, generic engineering rules) and CLAUDE.md.suggested (anchor-seeded project-specific template, not yet adopted) (CLAUDE.md.suggested:1-3).
- DOGFOOD-LOG.md — records that chain artifacts were produced autonomously with auto-passed human gates (DOGFOOD-LOG.md:1-19).

## Section E — Gaps and warnings

### E14. Stale / inconsistent
- Zero TODO/FIXME/XXX/HACK markers in apps/ and packages/ (repo-wide grep over *.ts/*.tsx returned none).
- README's page table omits the `/board` route that exists in the router (README.md:48-56 vs apps/web/src/App.tsx:69; BoardPage.tsx exists).
- "54-skill" count in README.md:4,73 and docs/architecture.md:17 vs 55 skill directories on disk in .claude/skills/.
- .ai/anchor.md carries three explicitly tentative fields awaiting human confirmation: nfr ceiling, versioning, dep allowlist (.ai/anchor.md:75-78).
- dashboard/state.json is a committed snapshot of generated output (generatedAt 2026-06-13, dashboard/state.json:4) that the running server regenerates on every artifact change (apps/server/src/state/projectState.ts:29-52) — a churn-prone tracked file.
- verdictWatcher's dedupe `Set` is module-level and never pruned; it grows for the process lifetime and resets on restart (apps/server/src/state/verdictWatcher.ts:12).
- watcher.ts watches `fitness/` and `tickets/` directories that do not exist in this repo (apps/server/src/state/watcher.ts:18; root listing has neither).
- No web/component tests exist; all 9 test files cover shared + 4 server modules (vitest.config.ts:5-7; file inventory: packages/shared/src/*.test.ts ×9, apps/server/src/{claude,state}/*.test.ts ×5).
- README claims a date-sensitive premise ("From June 15, 2026, headless `claude -p` … bills to a separate Agent SDK credit pool", README.md:13-15) — two days after the repo's anchor date; the entire PTY architecture hangs on it (docs/adr/0001-pty-over-headless.md:7-13).

### E15. Mystery zones (for /comprehend to grill the user on)
- **CLAUDE.md vs CLAUDE.md.suggested** — root CLAUDE.md contains generic engineering instructions with no project specifics; the anchor-generated replacement sits unadopted beside it (CLAUDE.md.suggested:3). Which one governs is undeclared.
- **dashboard/ naming** — the directory named "dashboard" holds only the chain's state snapshot, not the dashboard app (which lives in apps/web/) (dashboard/state.json:1).
- **`.ai/current-issues.md`** is gitignored (.gitignore:14) but no such file or producer exists in the app code — its lifecycle is owned by the chain, outside scan scope.
- **Dual hook systems** — `.claude/settings.json` wires chain hooks (inject-state.sh, guard-paths.sh) for sessions in this repo (.claude/settings.json:2-10), while the app generates its own observability hook settings (apps/server/src/claude/hookSettings.ts:64-69); how the two interact when the app manages its own repo is undocumented.
- **Self-hosting recursion** — the server self-registers its own repo as the first managed project ("SDLC Command Center", apps/server/src/index.ts:50-52) and strips nested CLAUDE_* env defensively (apps/server/src/claude/sessionManager.ts:28-32); the supported boundaries of managing-itself are only hinted at (README.md:42-44).
- **`auto` and `dontAsk` permission modes** appear in the PermissionMode union (packages/shared/src/types.ts:24) but ADR-0001 and docs/architecture.md only discuss prompt-respecting interactive flows; the intended UI exposure of these modes is unstated.

## Handoff
- **Section C (glossary candidates, invariants, journeys) → /comprehend** — glossary not yet captured; C9/C10 are the seed list, C11 the journey skeleton.
- **Section E → /comprehend** — grilling input: E15 mystery zones are user questions; E14 facts need confirm-or-fix decisions.
- **Section D → /architect** — D12 is the ADR backlog seed (3 ADRs exist; raw-SQL/no-ORM, no-auth-loopback, bus+WS pattern, CSR, git-flow base=develop are undocumented decisions visible in code); D13 lists docs to respect.
- **Sections A + B → both** — repo shape and component map are shared context; B8 style signals left unlabeled for /architect to name.

---

## Notes

- **Glossary cross-check vs `.ai/context.md` / understanding doc:** n/a — neither exists yet; C9 is the seed list.
- **Stale citations flagged:** none — 3 spot-checks (bus.ts:6-9, verdicts.ts:176-184, watcher.ts:18) all verified at HEAD.
- **Repo restrictions applied:** excluded node_modules/, .git/, data/, dist/; `.claude/skills/` recorded shape-only (sibling product).
- **Supersedes:** none (first recon).

---

## Verdict

**`READY-FOR-COMPREHEND`**

Section C (24 glossary candidates, 24 invariants, 5 journeys) and Section E (6 mystery zones, 9 confirm-or-fix facts) feed `/comprehend`; Sections A + B + D feed `/architect` (D12 carries 9 code-visible decisions beyond the 3 written ADRs). Before `/comprehend`, the E15 mystery zones — CLAUDE.md vs CLAUDE.md.suggested governance, dual hook systems, self-hosting boundaries, undocumented `auto`/`dontAsk` permission modes — are the questions the code cannot answer.
