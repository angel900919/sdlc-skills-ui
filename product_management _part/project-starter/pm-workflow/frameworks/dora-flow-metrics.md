# DORA + Flow Metrics

Two complementary delivery-health measurement sets — **DORA** (software-delivery performance) and **Flow metrics** (how work moves through the system) — used to *learn and improve* delivery, never to judge people.

**Primary source / attribution:** DORA = DevOps Research & Assessment (Google / *Accelerate* research). Flow metrics from Lean/Kanban (David Anderson; Little's Law; the Flow Framework, Mik Kersten). Canon: [`05_Conventions.md` §8](../05_Conventions.md), pinned in [`03_Frameworks_Map.md`](../03_Frameworks_Map.md).

## What it's for / when to use
- Measuring delivery health: are we shipping fast *and* safely, and is work actually flowing?
- Diagnosing delivery bottlenecks — where work waits, how long, how much is in flight.
- Product Ops / engineering-health conversations; pairs with (never replaces) outcome metrics.

## The steps (the metrics)
**DORA (2025 — six dimensions):**
1. Deployment frequency (throughput).
2. Lead time for changes (commit → prod).
3. Change failure rate.
4. Failed deployment recovery time (replaced MTTR in 2024).
5. Rework rate (added 2024).
6. Reliability.

**Flow:** WIP, Cycle time, Throughput, Work-item age — governed by **Little's Law** (`cycle time = WIP / throughput` → start less, finish more).

## Worked micro-example
A team deploys weekly, lead time 9 days, change-fail 30%, recovery 2 days. The flow board shows WIP = 14 across 5 devs with several stale items (high work-item age). Applying Little's Law they cap WIP at 6: items finish faster, lead time drops to ~3 days, and change-fail falls because smaller batches ship.

## When NOT to use it
- As individual or team *productivity scores* / stack-ranking — measure to learn, not to judge.
- Velocity / story points as a delivery-health or comparison metric (flow metrics displace velocity).
- As a proxy for product *value* delivered — these measure delivery, not outcomes.

## Common mistakes / anti-patterns
- Ranking individuals/teams by velocity, LOC, commits, or AI-code volume.
- Story points used as a commitment or contract.
- Chasing throughput while ignoring stability — AI raises throughput but *hurts* stability without safety nets (DORA AI Capabilities Model).
- Optimizing utilization instead of flow (planning to ~100% capacity).

## Used in phases
- [pm-phase-10-delivery](../../.claude/skills/pm-phase-10-delivery/) (primary)
- Product Ops thread (delivery-health monitoring)

## Source
- https://dora.dev/dora-report-2025/
- https://dora.dev/research/2024/dora-report/
- https://www.prokanban.org/blog/https-prokanban-org-blog-the-kanban-pocket-guide-chapter-6-the-basic-metrics-of-flow
