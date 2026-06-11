# Brownfield RECOVERY scan checklist

How `/environments` recovers the environment spec from an existing repo. Run the
scan **before** asking the user anything; present the result as a **cited proposal**
they confirm or correct. Discipline mirrors `/explore`: every claim carries a
`file:line` citation; an uncited claim is a question, not a row.

## Ground rules

- **Detected, never invented.** A var, env, or store appears in the proposal only
  if a file names it. "Most projects have staging" is not evidence.
- **Cite per claim.** `file:line` on every proposed row (the roster row's deploy
  mechanism, each inventory var's source). Cross-check `.ai/recon.md` Section A
  (deploy surface, datastores) and Section D (decisions) first — reuse its citations.
- **Never open or print real env files' values.** You may `ls` for the *presence*
  of `.env`, `.env.local`, `.env.production` (gitignore check), and read
  `.env.example` (placeholder names) — but if a real `.env` must be opened to learn
  var *names*, read only the left-hand side of each line; never echo a value into
  chat or the artifact. A value found **committed** in the repo is a finding: flag
  it in Open questions ("possible committed secret at `file:line` — rotate +
  gitignore"), do not copy it.
- **Conflicts surface, don't resolve silently.** CI references `STRIPE_KEY` but
  `.env.example` says `STRIPE_SECRET_KEY` → show both, ask which is real.

## What to scan, and what each source signals

| Source (in priority order) | Look for | Feeds |
| :-- | :-- | :-- |
| `.env.example`, `.env.sample`, `.env.template` | the var-name baseline + obvious secret names (KEY/SECRET/TOKEN/PASSWORD/DSN) | Config inventory (names, secret guess) |
| `.gitignore` | are `.env*` files ignored? un-ignored env file = red flag | Secrets policy (`never_in_repo` status) |
| CI files: `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml` | deploy jobs + their triggers (branch/tag) → deploy mechanism per env; `secrets.X` / `vars.X` references → vars set in the CI store; named environments (`environment: production`) | Environment roster + inventory `set_in` |
| Platform manifests: `fly.toml`, `vercel.json`, `render.yaml`, `netlify.toml`, `Procfile`, `app.yaml`, `serverless.yml` | env names, URLs/regions, `[env]` blocks, build/deploy commands | Roster (url_host, deploy mechanism) |
| `docker-compose*.yml`, `Dockerfile` | `environment:`/`env_file:` blocks → dev-env vars; services (db, cache) → connection vars; compose overrides (`docker-compose.prod.yml`) → extra envs | Roster (dev) + inventory |
| IaC: `infra/`, `terraform/`, `*.tf`, `cdk*/`, `pulumi/`, `cloudformation/`, `k8s/`, `helm/` | declared environments/workspaces, secret-manager resources (e.g. `aws_secretsmanager_secret`), apply mechanism | IaC section + Secrets policy (store) |
| Config modules: `src/config.*`, `config/`, `settings.py`, `app/config/`, anything importing `process.env` / `os.environ` / `ENV[` | the vars the code *actually reads* (the truth the example file drifts from); validation-at-boot (zod/pydantic/joi schema, or none); naming pattern | Inventory + Config conventions |
| Flag system: flag SDK imports (`launchdarkly`, `unleash`, `flagsmith`, `posthog`), a `flags.*` module, `FF_`/`FEATURE_` vars | where flags live, naming, any cleanup convention | Feature flags section |
| `package.json` scripts / `Makefile` / `justfile` / `scripts/` | `deploy*`, `smoke*`, `start*` targets → deploy + smoke commands | Roster (deploy/smoke commands) |
| `README.md`, `docs/`, `CONTRIBUTING.md` | prose claims about envs/secrets — secondary evidence only; verify against the files above before citing | tie-breaker / Open questions |

## Deriving the roster

1. Start from CI deploy jobs + platform manifests: each distinct deploy target =
   one candidate environment.
2. `localhost`/compose = the dev row (always exists if the project runs locally).
3. An env named in docs but absent from CI/manifests → propose it with an Open
   question, not a confirmed row.
4. Diff code-read vars (config module) against `.env.example`: vars read but not
   listed → propose adding (drift finding); listed but never read → propose
   marking stale.

## The proposal read-back shape

Present per section, citations inline, one confirm question at a time:

> **Environments I detected:** dev (compose — `docker-compose.yml:3`), prod
> (merge to `main` deploys to Fly — `.github/workflows/deploy.yml:31`,
> `fly.toml:1`). I found **no staging**. Right?
>
> **Vars:** 14 from `.env.example:1-14`, plus `REDIS_URL` read at
> `src/config.ts:22` but missing from the example file. 5 look secret
> (DATABASE_URL, STRIPE_SECRET_KEY, …). Prod values appear to live in Fly secrets
> (`.github/workflows/deploy.yml:38` uses `flyctl secrets`). Confirm or correct?

What the scan cannot see (who rotates keys, whether the staging URL still works,
where a human-managed secret really lives) → direct questions to the user;
still unknown → `## Open questions`, never a guess.
