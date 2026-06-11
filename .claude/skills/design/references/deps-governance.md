# Dependency governance

For `/design` Phase 5 (External dependencies). Covers the threat model, the plan-time trust bar, and the downstream build/CI controls that mechanically enforce what design records.

The split is load-bearing: **design records the decision, CI guarantees a ghost can't install.** Both layers are required; neither alone is sufficient.

`anchor.md` owns the `approved_dependencies` list. Design **flags** new vetted deps in frontmatter `dep_adds[]` so the next `/anchor` run can adopt them — it never grows the list silently.

---

## 1. Threat model — slopsquatting and ghost imports

**Slopsquatting** is supply-chain attack via hallucinated package names. LLM coding agents invent package names that don't exist; the fake names recur predictably across prompts; attackers pre-register those names on npm / PyPI / etc. with malware. When the next agent (or human) blindly runs `npm install`, the malware lands.

Research findings (as of 2025): roughly **19–20% of AI-suggested package names can be non-existent**. The most concerning subset is name-adjacent to popular packages (`reqests` vs `requests`, `axois` vs `axios`, `lodahs` vs `lodash`), where a typo + a hallucination land on the same fake name.

A ghost import is therefore **not a build error** — it's a live supply-chain attack surface. "The agent will fix the import later" mistakes the threat.

**Two complementary defense layers:**

- **Grounding** (lowers the error rate, doesn't eliminate it) — feed the build agent real, current docs so it stops hallucinating. Context7 MCP (`@upstash/context7-mcp`) or Context Hub (`@aisuite/chub`) occupy this slot. Both are build/runtime concerns, not planning concerns — they reduce hallucination volume; they do not verify existence or block installs.
- **Enforcement** (guarantees a ghost can't install) — mechanical checks in CI/CD. §3 below.

---

## 2. Plan-time trust bar — what `/design` does

Design's job is to **record the decision** for every new dependency *before* a builder agent imports it. The trust bar is judgment-based, deliberately:

- **Exists?** — the name resolves on its registry (npm, PyPI, crates.io, RubyGems, Maven Central, Go proxy). If you can't verify, refuse it. A name no one can find is not a package — it's a hallucination.
- **Maintained?** — releases in the last ~12 months, issues triaged, advisories handled. A 5-year-stale "still works" package is a future zero-day.
- **Adoption?** — visible usage in real OSS projects, real docs, real Stack Overflow questions. Synthetic SEO alone is a red flag.
- **Provenance?** — homepage matches repo; repo matches author; publisher aligns with the named owner; no name-adjacency to a more popular package.
- **Approved alternative?** — does `anchor.md`'s `approved_dependencies` already cover this job? Prefer it. The existing-dep bias is the single highest-leverage hallucination reducer — an already-installed package is provably real.
- **Licensed?** — identify the license (SPDX id) from registry metadata and check it against the project's intended distribution. Read `anchor.md` for a license policy field; if none exists, flag the `dep_adds[]` entry `license: <SPDX id> — compatibility unreviewed` and tell the user that copyleft licenses (GPL/AGPL) need a human decision for commercial/closed distribution. The skill **never gives legal advice** — it surfaces and records so the decision is on the record.

### Why no hard numeric gates

Single-metric thresholds (">50k downloads, >500 stars, ≥2 maintainers") are tempting and wrong. Stars are gameable; downloads are noisy (mirrors, CI, malware fetches); maintainer count says nothing about quality. A niche 1k-download package can be impeccable; a 100k-download package can be a hijacked typosquat. Judgment forces the reviewer to actually look — which is what catches the attack.

### The slopsquatting fingerprint

A new dep is **REFUSE until proven otherwise** when *all* of: **new** (not in `approved_dependencies`/lockfile) · **low adoption** (sparse usage, thin docs) · **name-adjacent** to a popular package (single-char swap, plural/singular, transposed letters, scoped/unscoped) · **thin/absent provenance** (no homepage, missing repo link, repo ≠ publisher). Any one signal is yellow; all four is red. Substitute an allowlist entry or escalate to the user with a verbatim quote of what raised the suspicion.

### What design does NOT do

Design does not run scanners, fetch metadata, or block on numeric metrics. It records a *judgment* — the cheapest place to make "add a library" a reviewable decision rather than a silent `npm install`. The mechanical checks live downstream.

### Recording the decision

Fill the **External dependencies** table — one row per candidate, `reuse` / `new` / `refused`, with the trust-judgment summary, the license column (SPDX id; `— compatibility unreviewed` when anchor carries no license policy), and the security-boundary column (any new dep crossing an auth / PII / payment / secrets boundary is HITL-eligible downstream — a signal `/to-issues` reads). Add every `new` package to frontmatter `dep_adds[]`, carrying the license flag when unreviewed. Skip the table only when every candidate is `reuse` — note *"no new external deps — all in anchor allowlist"*.

---

## 3. Downstream build/CI controls — mechanical enforcement

The hand-off from `/design` (and `/plan`) carries an obligation: **no new dependency lands without these gates green.**

- **Registry resolve (the floor)** — non-`--dry-run` install against the project's registry mirror; if the name doesn't resolve, fail loud. npm: `pnpm install --frozen-lockfile`. Python: `uv sync --frozen` or `pip install --require-hashes`. A registry proxy (Artifactory, Verdaccio, devpi) is cleanest — agents physically cannot install an unapproved name.
- **Lockfile discipline** — every dep change ships an updated lockfile; CI rejects PRs whose lockfile drift doesn't match the manifest. AST-diff the import graph against the lockfile — any imported name not present is a phantom and a build failure.
- **Vulnerability scan** — `npm/pnpm audit --audit-level=high`, `pip-audit`, `osv-scanner`, `govulncheck`, `cargo audit`. Fail PRs on known-vulnerable versions.
- **Trust scoring (production)** — OpenSSF Scorecard, deps.dev, Socket/Snyk on every new dep before merge.
- **SBOM** — emit CycloneDX/SPDX on every build (`syft`, `cdxgen`); post-incident response needs it.
- **Provenance attestation (production)** — Sigstore / GitHub OIDC; verify `npm provenance` / PyPI Trusted Publishing where supported.

---

## 4. Per-ecosystem ghost tells

- **Node/TS** — prefer `pnpm` (strict, content-addressed) + `--frozen-lockfile`. Ghosts: `lodahs`, `axois`, `expresss`; LLM-confused names (`react-hooks-form-validation` for `react-hook-form`). Scan the resolved tree, not just direct deps.
- **Python** — `uv sync --frozen` or `pip install --require-hashes`; `pip-audit` / `osv-scanner`. Ghosts: `urllib3-extended`, `requests2`, `reqests`, `pandass`, fake "official" SDKs. Install from wheels, not sdists.
- **Go** — `GOPROXY` + `GOSUMDB` make typosquatting harder; `govulncheck`. Ghosts: module-path typos resolving to a fork.
- **Rust** — `cargo install --locked`; `cargo audit`. Less prevalent but rising.
- **Java/Kotlin** — Gradle/Maven strict locking; OWASP Dependency-Check. Maven Central gpg-signing raises attack cost.

---

## 5. Why this lives in `/design`

- **Library names first surface here** — Phase 4 modules, Phase 7 call flow / failure modes. By the time `/plan` runs, the libraries are chosen.
- **The judgment needs design context** — failure-mode reasoning around the dep, placement, the security-boundary column. `/plan` and `/to-issues` don't carry that.
- **`/plan` records + adds an acceptance gate** ("new deps from design resolve + audit clean in CI"). It does not re-judge. **`/to-issues`** passes the dep list into ticket frontmatter so the builder uses the exact packages design approved.
- **`anchor.approved_dependencies`** is the project-wide source of truth for the existing-dep bias. Growing it is a deliberate act (design flags `dep_adds[]`; anchor adopts) — never a silent side effect.

---

## 6. Anti-patterns

- **Hard numeric trust gates** — gameable, miss niche-but-legitimate libraries. Use judgment.
- **Mandating MCP/Context7 as a `/design` rule** — layer violation. A markdown artifact can't fetch docs; that belongs in the build agent's config.
- **Letting the build agent pick the package** — by the time the import is written, it's too late. The decision lands in design.
- **Skipping the section because "we trust the team"** — the threat is a name no team member proposed. Team trust is no defense.
- **Growing `approved_dependencies` from inside `/design`** — design flags `dep_adds[]`; `/anchor` owns the list.
