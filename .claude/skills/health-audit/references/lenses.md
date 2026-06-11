# Health-audit lenses, finding schema, verify wave

## The finding schema (every lens sub-agent returns this — data, not prose)

Each lens sub-agent's final message is a JSON array; every finding:

```json
{ "title": "", "lens": "health:<lens>", "severity": "P0|P1|P2|P3",
  "impact": "", "evidence": "path:line — what's there", "fix": "",
  "category": "bug|enhancement", "needs_confirmation": true }
```

- `category: bug` = something broken; `enhancement` = an improvement. (Drives the triage label in Phase 5.)
- `needs_confirmation: true` = found but not fully understood → routes to `/diagnose` rather than a confident claim.
- No `evidence: path:line` → it is a hypothesis, not a finding. Drop it.

## The seven lenses

Spawn one read-only `Explore` sub-agent per **applicable** lens (tier table below), all in one message. Brief each with the owning discipline — don't re-write the checklist inline.

| Lens (`health:` label) | Owning discipline | What it hunts | Tier |
|---|---|---|---|
| `health:critical` | run the test suite + `/diagnose` discipline | failing/flaky tests, unhandled errors, broken invariants, data-loss paths. Confirmed-but-not-understood → `needs_confirmation: true` (→ `/diagnose`). | all |
| `health:security` | **`/security-review`** (built-in) discipline | authz gaps, secrets in code, injection, unsafe deserialization, missing input validation, vulnerable deps | all |
| `health:architecture` | **`/code-review`**/**`/simplify`** + `/improve-codebase-architecture` + `recon.md` §B/§D | shallow modules, tight coupling, layering violations, poor locality, god objects | mvp+ |
| `health:tech-debt` | **`/code-review`** + an inline DDD domain-smell pass (if domain-shaped) | duplication, dead code, TODO/FIXME density, anemic models, leaky aggregates, primitive obsession, missing ubiquitous language, test gaps | mvp+ |
| `health:performance` | perf lens | N+1 queries, sync work in loops, unbounded queries, missing indexes, hot-path allocations, blocking I/O | production |
| `health:ux` | lightweight UX heuristics | inconsistent flows, missing error/empty/loading states, basic a11y; no UI surface → return "n/a — no UI" | production |
| `health:dependencies` | the ecosystem's audit command + `/design`'s deps-governance discipline ([`../../design/references/deps-governance.md`](../../design/references/deps-governance.md)) | dependency currency: outdated major versions, known CVEs (run the ecosystem audit — `npm/pnpm audit`, `pip-audit`, `cargo audit`, `govulncheck`; absent → degrade gracefully to lockfile/registry-metadata reading, note the gap), licenses incompatible with the project's distribution (anchor license policy; none → flag `compatibility unreviewed`), unmaintained/archived upstream signals | mvp+ |

**Tier → lenses** (from `anchor.project_tier`): **prototype** = `critical` + `security`. **mvp** = + `architecture` + `tech-debt` + `dependencies`. **production** = all seven.

> Overlap note: `health:security` already hunts *exploitable* vulnerable deps; `health:dependencies` covers currency/license/maintenance more broadly. A dep CVE found by both is **one** finding at the higher severity (the Phase-3 dedupe), cross-referenced. Findings flow into the same `H-NNN` register + P0–P3 severity scheme — nothing new.

**Report line cap by tier:** prototype ≤150 · mvp ≤300 · production ≤450 (mirrors `/explore`).

> Built-in note: `/security-review` and `/code-review`/`/simplify` act on a *diff/branch*, so health-audit doesn't invoke them directly on a whole repo — it briefs the lens sub-agent with their *discipline* (the same checks, applied read-only across the codebase). There is no separate DDD-audit skill (retired) — the DDD domain-smell discipline (anemic models, leaky aggregates, primitive obsession, missing ubiquitous language) lives **permanently inline** in the tech-debt lens, briefed to the sub-agent like the others. `/diagnose` and `/improve-codebase-architecture` are built and findings route back to them.

## The verify wave (Phase 2.5 — adversarial, parallel)

Every **P0 and P1** finding is a claim until a second, independent agent confirms it. For each, spawn a fresh read-only skeptic sub-agent (all in one message) whose job is to **refute** it:

```
You are refuting a code-audit finding. Open the cited path:line and check the claim
actually holds there. Default to refuted:true if the evidence does not clearly support it.
Finding: <title> — <evidence path:line> — <impact>
Return: { "finding_id": "H-NNN", "confirmed": <bool>, "corrected_evidence": "path:line?", "note": "" }
```

- `confirmed: false` → **drop** the finding (or, if the skeptic found the *real* location, keep it with `corrected_evidence` + `needs_confirmation: true`).
- `confirmed: true` → advances to Phase 3 as verified.

P2/P3 skip the wave (cheap to leave for triage; verify them only on a production-tier or explicitly thorough run). Skip the wave entirely only when zero P0/P1 findings came back. This is the mechanical form of rule 4 — *a finding you can't locate in the source is a hypothesis, not a finding.*

## Publishing backends (Phase 5)

- **beads** (default): `bd create` (title; body = Impact + Evidence `path:line` + Fix + `H-NNN`), `bd update --priority <0..3>`, labels `health-audit` + `health:<lens>` + `category-<bug|enhancement>` + `needs-triage`. Write the ref back into the report.
- **jira / md**: follow `/publish-issues`' adapter mapping for that backend.
- **none**: skip publication, leave `<tracker-ref>` as `—`, tell the user the report is the source of record and `/triage` can run once a tracker exists.

The `health:<lens>` namespace (which lens found it) is deliberately separate from the triage `category-` role (bug vs enhancement).
