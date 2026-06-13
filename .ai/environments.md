---
slug: sdlc-command-center
stage: environments
status: complete
tier: mvp
project_type: brownfield
verdict: ENVIRONMENTS-LOCKED
verdict_overridden: false
environments: [local]
env_count: 1
config_var_count: 11
secret_count: 0
secrets_store: "none needed yet — see Secrets policy"
flag_system: none
iac_path: none
source_anchor: .ai/anchor.md
source_bootstrap: none
source_recon: .ai/recon.md
human_summary: .human/summaries/environments.md
consumed_by: [design, to-issues, pipeline, ship]
created: 2026-06-13
---

# Environments — sdlc-command-center

> Tier: `mvp` · Updated 2026-06-13 · Names and storage locations only — NEVER values.
> RECOVERY mode: every row detected from disk with a citation; nothing invented.

## Environment roster
| env | purpose | url_host | deploy_mechanism | smoke_command |
| :-- | :-- | :-- | :-- | :-- |
| local | the only environment — the owner's machine | http://127.0.0.1:4317 (server) · http://127.0.0.1:5180 (dev web) | none — manual npm scripts | `curl -s http://127.0.0.1:4317/api/health` |

Two **run modes** of the same environment (not separate envs):
- dev: `npm run dev` — Vite web on 5180 proxying `/api`+`/ws` to 4317 (apps/web/vite.config.ts:6-11)
- serve-built: `npm run build && npm start` — Fastify serves `apps/web/dist` on 4317 (apps/server/src/index.ts:32-41)

No CI, no deploy pipeline, no IaC, no `.env.example` anywhere in the repo (recon §A3).

## Config inventory
| name | purpose | type | secret | required_in | set_in |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SDLC_PORT | server port (default 4317) | int | no | — (optional) | shell env · apps/server/src/config.ts:11 |
| SDLC_HOST | bind host (default 127.0.0.1 — the security boundary) | string | no | — | shell env · config.ts:12 |
| SDLC_DATA_DIR | sqlite/logs/hook-settings dir (default `<repo>/data`) | string | no | — | shell env · config.ts:14 |
| SDLC_CLAUDE_BIN | claude CLI binary (default `claude`) | string | no | — | shell env · config.ts:16 |
| SDLC_PYTHON_BIN | python for project-state.py (default `python3`) | string | no | — | shell env · config.ts:22 |
| LOG_LEVEL | pino log level (default `info`) | enum | no | — | shell env · apps/server/src/logger.ts:16 |
| OTEL_EXPORTER_OTLP_ENDPOINT | opt-in OTLP trace export; unset = OTel off | url | no | — | shell env · apps/server/src/otel.ts:71 |
| OTEL_EXPORTER_OTLP_TRACES_ENDPOINT | traces-specific override of the above | url | no | — | shell env · otel.ts:71 |
| OTEL_SERVICE_NAME | service name (default `sdlc-command-center`) | string | no | — | shell env · otel.ts:89 |
| SDLC_OTEL_DIAG | `1` enables OTel diag logging | bool | no | — | shell env · otel.ts:83 |
| CLAUDE_CONFIG_DIR | Claude Code's own config dir; read for global-hooks install | string | no | — | inherited from the user's shell (external — owned by Claude Code) · apps/server/src/claude/globalHooks.ts:30 |

Every variable is optional with a coded default — there are **no required vars** and
no boot validation mechanism (defaults-over-validation is the deliberate local-tool
design; config.ts:10-24).

## Secrets policy
- Current state: **zero secrets** — no API keys, tokens, or connection strings exist
  in this app (the Claude CLI brings its own auth; recon §A5).
- If one ever appears: set it in the shell env or an untracked `.env` (`.gitignore:12-13`
  already covers `.env`/`.env.local`); never the repo, never this file, never `.ai/`/`.human/`.
- `data/` (sqlite, logs, generated hook settings) is gitignored (.gitignore:7-11).

## Config conventions
- Naming: `SDLC_*` SCREAMING_SNAKE prefix for app-owned vars; OTel vars use the
  OpenTelemetry standard names verbatim.
- The one read location: `apps/server/src/config.ts` (exceptions, both deliberate:
  `otel.ts` reads `OTEL_*` at init before config loads; `logger.ts` reads `LOG_LEVEL`).
  New config goes through `config.ts`.
- Validation at boot: none — every var defaults (see inventory note).

## Feature flags
- flag_system: none — no flag mechanism exists; `/ship`'s "shipped ≠ exposed" note
  does not apply to this project.

## Open questions
- none — the scan covered every `process.env`/`import.meta.env` read in apps/ and
  packages/ (11 vars total; web has zero).

## Verdict

**`ENVIRONMENTS-LOCKED`**

1 environment, 11 vars, 0 secret. Next per the canonical brownfield order:
`/data-management` (RECOVERY — sqlite exists), then `/comprehend`.
