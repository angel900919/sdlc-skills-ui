# MoSCoW

A categorical **filter** that sorts scope into **Must / Should / Could / Won't (this time)** to agree what a fixed-deadline or fixed-budget release will and won't contain.
**Primary source / attribution:** MoSCoW method — Dai Clegg (Oracle), formalised in the DSDM / Agile Project Framework. Canon: [`../05_Conventions.md`](../05_Conventions.md) §8 lists it as *"MoSCoW"* (no single originator named).

## What it's for / when to use
- **Scoping a release under a fixed deadline or budget** — deciding the MVP/first slice.
- A *filter before a rank*: separates non-negotiables from nice-to-haves; pair with a scoring model ([RICE](rice.md)/[ICE](ice.md)) inside each band.
- Aligning stakeholders on an explicit **"Won't"** list — the most valuable column.

## The steps
1. Agree the release's outcome, deadline, and effort budget.
2. **Must** — without it the release fails / is not viable or legal.
3. **Should** — important but the release survives without it (with a workaround).
4. **Could** — desirable; include only if time/effort allows.
5. **Won't (this time)** — explicitly out of scope now; records the decision so it doesn't creep back.
6. Cap Musts (DSDM rule of thumb: ≤ ~60% of effort) to keep contingency; re-balance if Musts exceed the budget.

## Worked micro-example
6-week checkout v1, effort-boxed:
- **Must:** pay by card, order confirmation email.
- **Should:** save card for next time.
- **Could:** promo codes.
- **Won't (this release):** gift wrapping, Apple Pay.
Musts fit ~55% of the box, leaving room for slippage and one Should.

## When NOT to use it
- When you need a **ranked order or expected value** — MoSCoW gives bands, not a sequence; add [RICE](rice.md)/[WSJF](wsjf-cost-of-delay.md).
- Open-ended discovery work with no deadline or fixed scope.
- As a substitute for strategy — bands without an outcome just relabel a wishlist.

## Common mistakes / anti-patterns
- **Everything is a Must** — the classic failure; if 90% is Must, you haven't prioritized. Enforce the effort cap.
- **"Won't" read as "later"** — it means *not in this release*, not a soft maybe; ambiguity feeds scope creep.
- **No effort budget behind the bands** — bands without a capacity cap are theatre.
- **HiPPO dressed up** — a senior voice declaring Musts isn't prioritization; tie each Must to the release outcome.

## Used in phases
- **Phase 06 — Prioritization** (`../skills/pm-phase-06-prioritization/`) — primary.
- **Phase 08 — PRD** (`../skills/pm-phase-08-prd/`) — fixing MVP scope and explicit no-gos.
- **Phase 09 — Stories** (`../skills/pm-phase-09-stories/`) — slicing the agreed scope into stories.

## Source
- https://www.productlift.dev/blog/product-prioritization-framework/
- https://productschool.com/blog/product-fundamentals/ultimate-guide-product-prioritization
- https://www.atlassian.com/agile/product-management/prioritization-framework
