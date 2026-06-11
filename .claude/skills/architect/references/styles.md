# Architecture styles picker

Six styles, when to use, scoring, defaults. Source: Ford & Richards, *Fundamentals of Software Architecture 2e*, Part II. `/architect` defaults to the **modular monolith**; reach for others only when you can name the specific constraint that forces it.

## The 3 style-defining determinations [ch19]

Walk these first — they bound the style choice.

| Determination | Choices | Default for solo / small team |
| :-- | :-- | :-- |
| **Monolith vs distributed** | monolith / distributed | **monolith** — distributed only if ≥2 teams, ≥2 deploy cadences, or scale asymmetry a monolith can't absorb |
| **Where data lives** | single shared DB / DB-per-context / cache+DB / event store / polyglot | **single shared DB** — DB-per-context only when ≥2 contexts have language drift (→ route to `/ddd-strategy`) |
| **Sync vs async** | sync default / async at named seams / async-by-design | **sync** — async only when the workflow completes in background, has multiple consumers, or the user shouldn't wait |

Choosing distributed + DB-per-service + async-by-design means you're picking microservices or event-driven — name the forcing constraint explicitly in the style ADR's Context.

## The 6 styles

| Style | When to use | When NOT | Determinations |
| :-- | :-- | :-- | :-- |
| **Modular monolith** (default) | Solo / ≤5 team, single deploy cadence, most modern SaaS. Internal module boundaries enforced by folders + lint. | ≥2 teams contend on one deploy; a module needs independent scale or a different runtime. | Monolith · single DB · sync |
| **Layered monolith** | Simple CRUD, few event flows, new team needing scaffolding. | Event-driven workflows; need clean impl swaps (use hexagonal). | Monolith · single DB · sync |
| **Event-driven** | Multiple consumers per event (`OrderPlaced` → notify + analytics + accounting); user needn't wait; per-consumer scale. | All request-response; single consumer; solo dev who'd struggle with async debugging. | Often distributed (or in-process bus) · often eventual consistency · async |
| **Microservices** | ≥5–8 engineers, multiple teams with independent deploy cadence, a **named** scaling driver, Conway-aligned boundaries. | Solo / small team; no named driver; "microservices because microservices". | Distributed · DB-per-service · often async |
| **Microkernel / plugin** | The product's value IS extensibility (IDE, CMS, low-code builder); third parties write plugins. | No third-party-extension value prop. | Monolith + plugin loading · single core DB · sync into plugins |
| **Pipeline / pipes-and-filters** | Data ingest, document processing, ETL/transform (batch or streaming). | User-facing transactional apps. | Often distributed (workers/stage) · stage-local state · async between stages |

**Microservices is never the default.** Refuse it for ≤4-engineer teams unless the user names a specific scaling/autonomy driver; if they push, push back once and record the named driver in the style ADR's Context.

## Scoring (production tier — against the top-3 characteristics)

Use ✓✓ (excellent), ✓ (good), — (weak), ✗ (terrible). Score each candidate against the top-3 from `characteristics.yaml`.

| Style candidate | Char-1 (e.g. Deployability) | Char-2 (e.g. Performance) | Char-3 (e.g. Modularity) | Honest notes |
| :-- | :-- | :-- | :-- | :-- |
| Modular monolith | ✓✓ | ✓✓ | ✓ | Best deploy + perf; needs discipline to stay modular |
| Event-driven | ✓ | ✓ | ✓✓ | Best modularity; async-complexity tax |
| Microservices | — | ✓ | ✓✓ | Modular yes, but deploy/ops cost for a small team |
| Layered monolith | ✓✓ | ✓✓ | — | Like modular monolith, less modular discipline |
| Pipeline | — | ✓ | ✓✓ | Niche — only if domain is ingest/transform |
| Microkernel | ✗ | ✓ | ✓✓ | Niche — only if plugins are core value |

**Recommendation rule:** pick the most ✓✓ across the top-3; break ties by deployability (solo dev → deployability nearly always wins).

## Per-tier defaults

| Tier | Default style |
| :-- | :-- |
| **prototype** | Modular monolith, flat module structure. Single DB. Sync. No event bus until proven. |
| **mvp** | Modular monolith + 1–2 async seams for proven needs (email send, webhook handling). Single DB. Mostly sync. |
| **production** | Modular monolith OR event-driven monolith per the top-3 characteristics. Single DB unless DDD bounded contexts force a split. Async at named seams. |

## How to use this in Phase 3

1. Apply the 3 determinations with the user (3 questions, one at a time, recommend an answer).
2. Score candidates against the top-3 characteristics (production) or just the JTBD (prototype/mvp).
3. Pick the highest-scoring → write `01-style.md` + the style ADR (the first ADR usually).
4. If the user pushes back, don't capitulate immediately — ask what they're optimizing for that you missed; if they name a valid driver, surface it in the ADR Context.
