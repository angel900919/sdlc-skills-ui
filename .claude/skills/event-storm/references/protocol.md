# Event-storming protocol (in-chat adaptation)

Distilled from Chapter 12 "EventStorming" of *Learning Domain-Driven Design* by Vlad Khononov. The legacy workshop is a wall-of-stickies session with a room of people; here you run the **same discovery in chat**, one phase at a time, with the user standing in for the domain experts. The sticky colors below are the mental model for what each phase elicits — you don't draw stickies, you ask for each color's content in turn.

## The sticky-color mental model

| Color | Concept | Tense / shape | Example |
|---|---|---|---|
| **Orange** | Domain event | past tense | "OrderPlaced", "PaymentReceived" |
| **Blue** | Command | imperative | "PlaceOrder", "RefundPayment" |
| **Yellow** | Actor / role | noun | "Customer", "Fulfillment Operator" |
| **Pink** | External system | noun | "Stripe", "ShipStation" |
| **Lilac** | Policy / rule | "when X, then Y" | "when payment fails 3×, freeze account" |
| **Green** | Read model / view | noun phrase | "Order History Page" |
| **Red** | Hot spot / question | a question | "What if the customer cancels mid-shipment?" |
| **Tan** | Aggregate | noun (consistency boundary) | "Order", "Cart" |

## The 8 phases (mapped to the SKILL Procedure)

1. **Events first (chaotic exploration).** Ask the user to name the past-tense facts that occur in this domain — one per line, roughly time-ordered. Don't critique, don't filter, accept duplicates. Translate any present-tense/imperative answer back to past tense ("you said 'process the order' — the *fact* is 'OrderProcessed', right?").
2. **Aggregates.** Cluster events that must stay transactionally consistent; name each cluster's owning aggregate. Ask: "which of these facts always have to agree with each other at the same instant?" That cluster is one aggregate.
3. **Commands.** For each event, the imperative action that caused it. Commands are blue, events orange; "PlaceOrder" causes "OrderPlaced".
4. **Actors.** Who or what issues each command — a user role (yellow), a scheduler/agent, or an external system (pink).
5. **Policies.** "When this event happens, that command must follow." These are lilac and they hide the cross-service interactions — surface every one. A policy whose command lands in a *different* aggregate/context is a coupling decision (carry to Phase 7).
6. **Read models.** The views/projections the UI or a downstream agent reads — green. Name the events each projection is built from.
7. **Bounded-context relationships.** For any policy crossing a context line, classify the relationship using the integration-pattern picker in [`../../ddd-strategy/references/integration-patterns.md`](../../ddd-strategy/references/integration-patterns.md): Partnership, Customer-Supplier, Conformist, Anti-Corruption Layer, Open-Host Service. Decide whether the downstream needs an ACL.
8. **Hot spots.** Red stickies — anywhere the model is unclear, two aggregates fight for the same data, or a consistency requirement looks unrealistic. Flag them in the artifact; don't resolve them by fiat. ≥3 unresolved hot spots is a `NEEDS-MORE-MODELING` signal.

## Pivotal events (a useful lens during Phase 1–2)

Events that change the *phase* of the business (e.g. "OrderPlaced" splits browsing from fulfillment) are seams for bounded contexts. Noticing them early makes Phase 7 easier and feeds a clean `NEEDS-STRATEGIC-DESIGN` decision when there are several.

## Pitfalls (the facilitator's job is to prevent these)

- **Implementation language** — "we write a row to the orders table" is the *how*. Redirect to the business fact: "OrderPlaced".
- **Commands/actors instead of events in Phase 1** — enforce "events only, past tense" first; commands and actors come in Phases 3–4.
- **Stopping at chaotic exploration** — the insight is in the timeline + aggregate-clustering phases, not the raw event dump.
- **One mega-aggregate** — if a single aggregate owns every event, the consistency boundaries weren't found. Push to split.
- **Skipping policies** — cross-service coupling hides in Phase 5; never skip it.
- **Premature consolidation** — better 20 specific events than 5 vague ones. Merge only true duplicates.

## When to route to `/ddd-strategy`

If Phase 7 surfaces **multiple bounded contexts** whose integration patterns weren't pre-decided, or the ubiquitous language drifts hard between sub-areas, stop and emit `NEEDS-STRATEGIC-DESIGN → /ddd-strategy`. `/ddd-strategy` draws the context map; then re-run this skill once per context, each as its own `##` section in `domain-model.md`.
