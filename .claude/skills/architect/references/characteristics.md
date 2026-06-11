# Architectural characteristics + risk storming

The "-ilities" that shape architecture, plus the production risk-storming worksheet. Source: Ford & Richards, *Fundamentals of Software Architecture 2e*, ch04–07 (characteristics) + ch22 (risk storming).

**Tier dial:** prototype skips this · **mvp = light** (top-3 + one fitness fn each, written to `characteristics.yaml`) · production = the full treatment below + risk storming.

## The three-criteria test [ch04]

A real architectural characteristic satisfies **all three**:
1. **Non-domain** — about *how* the system behaves, not *what* it does ("payment processing" is domain; "transaction integrity" is architectural).
2. **Structure-shaping** — prioritizing it would change the architecture ("p95 latency <50ms" reshapes things; "uses Postgres" doesn't).
3. **Critical to success** — the project fails if you get it wrong ("nice if fast" doesn't qualify; "checkout >2s drops conversions 40%" does).

Fails any one → not an architectural characteristic. Demote to domain, design, or implementation.

## Force a top-3

The architecture serves **at most 3 characteristics well**. A top-8 list is a no-priorities list. If the user names more than 3: *"If you could only protect 3, which?"* Record the rest as **considered but cut** with a one-line reason each (production only). Common MVP cuts (deferred, not abandoned — add to discovery's Deferred with a revisit trigger): scalability (until first scale incident), multi-tenancy isolation (until first enterprise customer), auditability (until first compliance ask), i18n (until first non-English market).

## Common characteristics with sample measurements

**Force a number** — adjectives don't qualify.

| Name | Measures | Sample measurement |
| :-- | :-- | :-- |
| Availability | % operational | 99.5% rolling 30d via external probe every 60s |
| Performance | speed under load | p95 API ≤200ms at 100 RPS sustained (APM) |
| Scalability | capacity growth | linear to 10× RPS without architecture change |
| Reliability | MTBF | ≥30 days per component (incident rate) |
| Recoverability | restore speed | MTTR ≤15min full restore |
| Resilience | graceful degradation | single dependency outage doesn't down core flows (monthly chaos test) |
| Maintainability | ease of change | new eng ships first PR within 1 week |
| Modularity | swappable components | component swap touches only its own folder (ts-arch/ArchUnit fitness fn) |
| Deployability | ship speed/safety | ≥3 deploys/week, <5min lead, <1% rollback (CI metrics) |
| Testability | ease of verification | every entry component has an in-memory fake; integration tests <2min |
| Observability | runtime insight | every user-facing error → structured log with trace_id |
| Security | attack resistance | OWASP Top 10 covered; quarterly pen-test; no secrets in logs |
| Privacy | regulated data handling | PII never crosses tenant boundary (data-flow test in CI) |
| Auditability | who-did-what-when | every state change logged with user_id + timestamp + diff, 90d retention |

## Table 5-1 — business term → characteristic

| They say | They mean |
| :-- | :-- |
| "Fast" | Performance (need percentile + threshold) |
| "Reliable" / "always works" | Availability + Reliability |
| "Secure" | Security (specific controls + measurements) |
| "Compliant" | Privacy + Auditability + named regulation |
| "Easy to change" | Maintainability + Modularity |
| "Ship fast" | Deployability + Testability |
| "Handle more users" | Scalability |
| "Won't break under load" | Resilience + Reliability |
| "Customize per customer" | Configurability + Extensibility |
| "I can see what's happening" | Observability |

## Fitness function library

A **fitness function** is an automated test that fails when the architecture stops satisfying a characteristic (*Building Evolutionary Architectures*).

| Characteristic | Fitness function | Mechanism |
| :-- | :-- | :-- |
| Deployability | "≥3 deploys/week tracked" | CI metric → dashboard with weekly alert |
| Modularity | "no cross-module imports except via entry points" | ts-arch / archlint / ArchUnit in CI |
| Layering | "UI never imports DB directly" | ArchUnit `layeredArchitecture()` |
| Maintainability | "cyclomatic complexity ≤10 per function" | complexity-report / radon / SonarQube |
| Performance | "p95 <200ms over rolling 30min" | APM SLO + alert |
| Availability | "99.5% over 30d" | external probe (Pingdom/Better Uptime) |
| Security | "no secret patterns in source" | gitleaks / trufflehog in pre-commit + CI |
| Privacy | "PII never crosses tenant boundary" | data-flow tagging test in CI |
| Testability | "every entry component has a `*.fake.ts` sibling" | regex grep test in CI |
| Auditability | "every state-changing handler emits an audit event" | static-analysis grep in CI |

Flavors: **atomic** (one concern in isolation — prefer in CI), **holistic** (multiple concerns interacting), **continual** (runs in production, e.g. p95 probe at 1Hz). Prefer atomic in CI; reserve continual for prod observability.

## `characteristics.yaml` shape

```yaml
# mvp: light — top-3 + one fitness fn each. production: + considered_but_cut.
top_3:
  - name: Deployability
    why: <link to discovery JTBD or constraint>
    measurement: "≥3 deploys/week, <5min lead time, via CI timestamps"
    fitness_fn: "CI records deploy-frequency.json weekly"
  - name: <Characteristic>
    why: <…>
    measurement: <concrete, with a number>
    fitness_fn: <…>
  - name: <Characteristic>
    why: <…>
    measurement: <…>
    fitness_fn: <…>
considered_but_cut:        # production only
  - { name: Scalability, reason: "no scale driver until first incident; revisit YYYY-MM-DD" }
```

## Risk storming worksheet [ch22] — production only

For each top-3 characteristic, run three phases:

1. **Identification (silent, independent)** — list risks threatening this characteristic. Score **1–9 = impact × likelihood**.
   - **Unknown-tech rule:** any tech the architect doesn't know auto-rates **9**, regardless of other reasoning.
   - Solo mode: still write risks on paper before "discussing" with yourself — avoids self-groupthink.
2. **Collaboration** — surface disagreements, reconcile, lock unknowns.
3. **Mitigation** — every ≥6 risk gets a mitigation OR an explicit acceptance with a named owner + reason.

`03-risk-storming.md` shape:

```markdown
# Risk storming — <slug>
> [Fundamentals ch22] 1–9 scoring (impact × likelihood). Unknown-tech auto-9.

| Risk ID | Threatens | Description | Score | Mitigation / acceptance |
| :-- | :-- | :-- | :-- | :-- |
| R-01 | Deployability | Inngest is unknown tech | auto-9 | Spike 2 days wk1; fall back to BullMQ if rough |
| R-02 | Availability | Single-region outage downs the app | 27→cap 9 | Accept for mvp; read-replica at production |

## Re-scoring schedule
Next pass: YYYY-MM-DD, before <milestone>.
```

## References
- *Fundamentals of Software Architecture 2e* ch04 (defining), ch05 (Table 5-1), ch06 (composite), ch07 (quanta), ch22 (risk storming).
- *Building Evolutionary Architectures* — fitness functions.
