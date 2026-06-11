# ADR — Architecture Decision Record

Source: *Fundamentals of Software Architecture 2e* ch21 — Ford & Richards extend Michael Nygard's format with Compliance + Notes. ADRs live in `.ai/architecture/adr/NNNN-<kebab-title>.md`. Counts by tier: prototype 0–1 (inline in `architecture.md`) · mvp 3–5 · production 3–7.

## Significance filter — when to write one

ADR-worthy only if the decision affects ≥1 of:
- **structure** (topology, layering, component boundaries)
- **non-functional characteristics** (any architectural -ility)
- **dependencies** (new lib, service, platform)
- **interfaces** (contracts between components/services)
- **construction techniques** (build tooling, deployment model, persistence approach)

Touches none → don't ADR it. ADR-ing trivia ("we use camelCase") is a named antipattern.

**No alternatives = no decision = no ADR.** The Context section must list the rejected alternatives and why. Voice is commanding **"We will…"** — never "we should" or "we considered".

Antipatterns [ch21]: *Covering Your Assets* (ADRs as blame shields), *Groundhog Day* (re-litigating the same decision — rewrite the ADR to address the recurring objection), *Email-Driven Architecture* (decisions never written up). Apply the **last responsible moment** rule: don't write the ADR until the decision genuinely must be made.

## Shared NNNN counter

ADR numbering is **shared across `/architect` and `/ddd-strategy`** within one project. Before allocating, scan `.ai/architecture/adr/` for the highest existing `NNNN` and continue from there. Never restart at 0001 when ADRs already exist. Superseded ADRs keep their file and number — mark `Status: Superseded by ADR-NNNN`; do not delete.

## Nygard 7-section format

```markdown
# NNNN. <Decision title>            # short, declarative: "Use X for Y" / "Adopt Z"

## Status
Accepted | Proposed | Superseded by ADR-NNNN | RFC — decision required by YYYY-MM-DD

## Context
<2–4 paragraphs: the problem, the forces in tension, the constraints, the alternatives
considered. The ONLY section that explains WHY.>

## Decision
We will <do X>, because <one-clause rationale tied to the context>.
<Optional: scope — what is explicitly NOT decided here.>

## Consequences
**Positive:** <what becomes easier/possible>
**Negative:** <what becomes harder/impossible>
**Risks accepted:** <what could go wrong and we choose to live with>

## Compliance
<How conformance is enforced: ArchUnit/ts-arch test, CI lint, code-review checklist,
manual quarterly review. If manual only, say so. A fitness function if applicable.>

## Notes
- Related characteristics: <names from characteristics.yaml>
- Related components: <names from 02-components.md>
- Related ADRs: <ADR-NNNN>
- References: [Fundamentals chNN]    # cite at production tier
```

Status lifecycle: **Proposed** (drafted, not ratified) → **Accepted** (current) → **Superseded by ADR-NNNN** (keep the file) · **RFC — decision required by DATE** (forces closure).

## Worked example

```markdown
# 0007. Use event-driven architecture for order processing

## Status
Accepted — 2026-03-12

## Context
Order processing runs in a synchronous monolith. Peak load drives 12× traffic, timing out
the confirmation API and retrying the warehouse-pick step inconsistently. Three alternatives:
vertical scaling (cost-prohibitive at peak), service decomposition with sync calls (still
couples deploy + runtime), and event-driven with a broker. Top-3 characteristics: elasticity,
fault tolerance, performance [Fundamentals ch04].

## Decision
We will adopt an event-driven architecture for order processing, with one broker topic per
bounded context. Order placement publishes `OrderPlaced`; warehouse, billing, and notification
consumers subscribe independently.

## Consequences
**Positive:** each consumer scales independently; adding a consumer needs no producer change;
the producer is no longer blocked on consumer SLOs.
**Negative:** end-to-end consistency becomes eventual; the UI shows "accepted, processing".
**Risks accepted:** broker is at-least-once — consumers must be idempotent.

## Compliance
- ArchUnit test forbids HTTP calls from order-placement to warehouse/billing/notifications.
- CI requires every saga step to declare a compensation method.

## Notes
- Related components: PlaceOrder, ReserveInventory, NotifyOrderPlaced
- Related ADRs: ADR-0003 (broker choice), ADR-0008 (idempotency keys)
- References: [Fundamentals ch15, ch19, ch21]
```
