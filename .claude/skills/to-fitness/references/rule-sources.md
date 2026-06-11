# Rule sources — where each fitness function comes from

The field-by-field map `/to-fitness` enumerates from (Phase 3), how to classify each rule
(Phase 4), and how to name the file. **Production tier only.**

## Input-source map

| Kind | Source (read this exactly) | What to extract |
| :-- | :-- | :-- |
| **invariant** | `.ai/architecture/02-components.md` → `## Invariants` (the numbered list "Invariants every component must respect") | each invariant → one structural fitness function |
| **characteristic** | `.ai/architecture/characteristics.yaml` → `top_3[]` | each entry's `fitness_fn:` (the check to write) + `measurement:` (the number to assert). Filename names the *fitness function*, not the characteristic (`cyclomatic-cap.ts`, not `maintainability.ts`) |
| **legibility** | `.ai/anchor.md` → § Security gate `codebase_legibility_rules` | each rule set to `yes` (`no_bare_catchalls`, `no_dynamic_imports`, `single_data_interface`, `unique_greppable_names`) → one grep/structural rule |
| **functional (feature mode)** | `.ai/specs/<feature>/prd.md` → § Functional requirements, production EARS table `\| id \| requirement (EARS) \| verify \|` | rows whose `verify` tag is **T** (test) or **A** (analysis) → mechanizable; **I** (inspection) / **D** (demonstration) → `Cannot mechanise`. T/I/A/D defined in [`../../prd/references/ears.md`](../../prd/references/ears.md) |
| **unwanted (feature mode)** | the **If/Then rows** of that same EARS table (each defends an in-scope invariant) | one `…-defense` fitness function per clause (e.g. "If a request would send `users.email` to a third-party API, then reject + emit `policy.pii_egress_blocked`" → assert no PII columns in that call graph) |
| **nfr (feature mode)** | `.ai/specs/<feature>/prd.md` → § Non-functional requirements `\| id \| category \| target \| measurement \|` | a row with a concrete numeric target + measurement → numeric-assertion fitness function; an adjective-only row → `Cannot mechanise`. The metric/source path often comes from `design.md` § Failure modes & observability |

> The new contract carries **no T/I/A/D tag on NFR rows** (unlike the legacy) — NFRs are
> `number + measurement`. Mechanize an NFR when it has a real number + a named measurement
> source; otherwise list it under `Cannot mechanise`. The T/I/A/D tags live on the **functional
> (EARS)** requirements only.

## Reuse the existing fitness-function library

Do not re-derive mechanisms. [`../../architect/references/characteristics.md` § Fitness
function library](../../architect/references/characteristics.md) already maps common
characteristics → fitness function → mechanism (ts-arch/ArchUnit for modularity/layering,
radon/complexity-report for cyclomatic, gitleaks for secrets, a data-flow test for privacy,
APM SLO for performance…). Transcribe from there; only invent a mechanism when the rule isn't
covered.

## Classification (Phase 4)

- **structural** — package/module dependency rule, naming convention, layered-architecture
  rule, or a legibility grep. Expressed in the ArchUnit-family idiom (see
  [library-mapping.md](library-mapping.md)).
- **numeric** — the file reads a measurement artifact (CI metric JSON, perf report,
  bundle-size output) and asserts against a threshold. The artifact comes from CI/runtime; the
  fitness file is the test that reads it.
- **Cannot mechanise** — needs human judgment ("API is consistent", "naming is clear", "UI
  feels responsive"). List it; never fake a test. Bounce to `/prd`/`/architect` to rephrase, or
  accept as a manual review item.

**Red-first sanity:** for every mechanizable rule, write the one-sentence `FAILS WHEN:` naming
a concrete code change that should break it. Can't name one → the rule is vacuous → demote to
`Cannot mechanise` and flag the source line.

## Filename derivation

Kebab-case of the rule's **verb + subject**, derived from the rule text (not its line number),
so source re-orderings don't churn paths. Stable across runs.

- invariant / characteristic / legibility (project scope) → `fitness/<kebab>.<ext>`
- nfr (feature scope) → `fitness/<feature>/<kebab>.<ext>`
- unwanted defense (feature scope) → `fitness/<feature>/<kebab>-defense.<ext>`

Examples: `"AI calls must run in workflows/, never in src/api/"` → `no-llm-in-api-handlers`;
`"p95 ≤ 200 ms"` (feature `invoice-send`) → `fitness/invoice-send/p95-latency`.
