# Toolchain grounding (Context7)

For `/bootstrap` Phase 3. How to verify every tool, scaffolder, package, and base
image the checklist names — so a generated command can never install a phantom or
run stale CLI syntax. The trust bar (exists / maintained / adopted / provenance,
the slopsquatting fingerprint, the existing-dep bias) is inherited verbatim from
[`../../design/references/deps-governance.md`](../../design/references/deps-governance.md);
this file is the bootstrap-specific *executable-command* application of it.

## What to ground (and what not to)

Bootstrap names only what anchor's locked stack + `approved_dependencies` imply —
it does **not** pick application libraries (that's `/design` per feature). The
grounding set is the **toolchain**, not the app's dependency graph:

- the framework's own create/scaffold CLI (`create-next-app`, `create vite`, `uv init`, `cargo new`, `go mod init`, `dotnet new`)
- the test runner + the typecheck/lint/format tools the stack uses
- the db migration tool (Drizzle Kit, Prisma, Alembic, golang-migrate, …)
- infra base images for `docker-compose` (the db, cache, queue named in architecture)

A package already in `approved_dependencies` or a lockfile is **provably real** —
ground it only if its *command syntax* is uncertain. Spend the call budget on the
version-sensitive, churn-prone tools (framework create-CLIs especially).

## The grounding loop (per tool)

1. `mcp__context7__resolve-library-id` with the **official** name (`Next.js`, not `nextjs`; `Three.js`, not `threejs`) + a query describing the task ("scaffold a new app with the app router"). Pick the best match by name match → source reputation (High/Medium) → snippet coverage → benchmark score.
2. `mcp__context7__query-docs` on that library ID for the **current** scaffold/install command, current flag syntax, and the latest stable **major** version.
3. Record for the checklist + `bootstrap.md` provenance: real package name · current command · verified major version · `verified via Context7 (<library-id>)`.

**Call budget: ≤3 `resolve` + ≤3 `query` per run** (the MCP caps at 3 each). If you have more tools than budget, ground the riskiest (framework create-CLI + any tool whose version drives breaking flag changes) and mark the rest *"standard package — confirm version at install."* Never burn the budget grounding something already in the lockfile.

## Refuse or flag — never emit a phantom

- **Slopsquatting fingerprint** (REFUSE when *all* hold): new (not in `approved_dependencies`/lockfile) · low adoption (sparse usage, thin docs) · name-adjacent to a popular package (single-char swap, plural/singular, transposed letters, scoped/unscoped) · thin/absent provenance (no homepage, repo ≠ publisher). Any one signal is yellow; all four is red.
- **Can't resolve on Context7** → the name is unverified. Do **not** write its install line. Either substitute the `approved_dependencies` equivalent that does the job, or emit the step flagged `unverified — confirm the package exists before running` with a note of exactly what you couldn't ground.
- **Out-of-stack tool** the project genuinely needs but anchor never locked → add a `dep_adds`-style flag line in `bootstrap.md` ("`<pkg>` not in anchor.approved_dependencies — add via `/anchor` before relying on this step"); bootstrap flags, `/anchor` owns the list.
- **Graceful degradation** (Context7 MCP unavailable) → say so explicitly in `bootstrap.md`, name only packages already in anchor's locked stack/`approved_dependencies`, and flag every other tool `unverified` rather than emitting it.

## Version policy

Name the **major** version you verified — `next@15`, `postgres:16`, `python:3.12` —
never a pinned patch (it's stale the week after). Pair every install with
lockfile discipline so the committed lockfile, not a floating tag, is the source of
truth at install time:

| Ecosystem | Install discipline | Verify command |
|---|---|---|
| Node/TS | `pnpm install --frozen-lockfile` (prefer pnpm — strict, content-addressed) | `pnpm audit --audit-level=high` |
| Python | `uv sync --frozen` or `pip install --require-hashes` | `pip-audit` / `osv-scanner` |
| Go | `go mod download` + committed `go.sum` (GOPROXY + GOSUMDB on) | `govulncheck` |
| Rust | `cargo install --locked` / `cargo build --locked` | `cargo audit` |
| Java/Kotlin | Gradle/Maven strict locking | OWASP Dependency-Check |

## Per-ecosystem ghost tells (what a phantom looks like)

- **Node/TS** — `lodahs`/`axois`/`expresss`; LLM-confused names (`react-hooks-form-validation` for `react-hook-form`). Scan the resolved tree, not just direct deps.
- **Python** — `urllib3-extended`, `requests2`, `reqests`, `pandass`, fake "official" SDKs. Install from wheels, not sdists.
- **Go** — module-path typos resolving to a fork.
- **Rust** — less prevalent but rising; trust `crates.io` ownership.
- **Java/Kotlin** — Maven Central gpg-signing raises attack cost; watch coordinate typos.

A grounded create-CLI also catches **stale syntax**, not just phantoms: `create-react-app` is deprecated (use Vite/Next), `vite`/`next` create flags churn between majors, `uv` replaced much of `pip`/`poetry` workflow. Context7's current docs are what keep the emitted command runnable.
