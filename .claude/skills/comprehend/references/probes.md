# Comprehend probes

`/comprehend` works from a **code-derived draft** (`recon.md` Section C), not a blank page. Every probe starts from what the code already shows and asks the human to confirm, correct, or explain. Propose the cited draft, then probe — the user reacts rather than generating from scratch.

## Glossary & entity probes
For each glossary candidate recon extracted from identifiers, propose its code-derived definition, then apply:

- **Code-vs-intent probe** — does the term in the code mean what the user means? ("The code calls this `Account` — `src/billing/account.ts:12` — and uses it for the billing record. Is that what you call an account, or is your 'account' the login?")
- **Conflict probe** — does this clash with an existing `.ai/context.md` term? Surface it; don't silently overwrite.
- **Overload probe** — is one identifier doing two domain jobs? ("The code uses `Order` for both the cart and the placed order — `cart.ts:8`, `order.ts:40`. One concept or two?")
- **Scenario probe** — stress the boundary with a concrete edge case grounded in the code path.

Example draft to react to:
> "The code has a **Session** entity — `src/sessions/model.ts:14` — opened on `start()` and closed on `end()`, tied to one `clientId`. Reads to me like *a block of billable work for one client*. Right, or does Session mean something else to you?"

When it resolves, write it to `.ai/context.md` immediately (glossary line + entity block), tagging code-derived entries with their `source_recon` provenance.

## Invariant triage probes (the signature step)
Recon lists "invariants enforced in code" — raw constraints. Sort each:

- **Keep (domain invariant)** — a rule that must hold regardless of implementation. ("An Order has at most one Cancellation — enforced by the unique constraint at `migrations/003.sql:7`.") Keep it, note it's code-backed, carry the cite.
- **Drop (implementation detail)** — storage/transport/perf mechanics, not a domain rule. ("`email` column is `NOT NULL`", "endpoint returns within 200ms"). Drop from Invariants — it's evidence, not the rule.
- **Gap (unenforced rule)** — the user says it must always hold, but no code defends it. ("You say a refund can never exceed the original charge — I don't see that checked anywhere.") Record in **Open assumptions** as a gap; it's a future fitness-function candidate.

Ask: **"The code enforces X here — is that a rule your domain requires, or just how it's built? And is there a rule you rely on that the code *doesn't* check?"**

## Behavior / journey probes
Recon inferred the top journeys from entry points (routes/controllers/CLI). Confirm each, rewritten in the user's voice:

- Bad (recon's raw form): "POST /invoices handler calls InvoiceService.create."
- Good (their voice): "After Maya closes a session she opens the app, taps the unbilled session, confirms the rate, and the invoice lands in the client's inbox."

Capture: **trigger** (real-world event), **steps** (their voice), **outcome** (what's newly true), **failure mode** (what breaks mid-flow). A journey that crosses aggregates in a way you can't model cleanly → `NEEDS-EVENT-STORM`.

## Mystery-zone probes
Walk every `recon.md` Section E item — folders/flows the code couldn't classify:

- "There's a `src/legacy/sync/` folder the scan couldn't place — last touched 14 months ago. Still in use, or dead?"
- "Naming in `src/jobs/` doesn't match its contents — what does this actually do?"

Resolve each to a fact (write it where it belongs) or, if the user doesn't know either, log it as an Open assumption with a falsification test. Don't guess.

## Boundary & assumption probes
- **Boundaries** — cross-check the intake scope against what the code actually does. If the code does something the user didn't mention (a hidden feature) or omits something they assumed, surface it.
- **Assumptions** — force 3–7 specific, falsifiable ones, including every unenforced rule from the invariant triage. Belief + source + cheapest falsification test.

## Diagram prompts (for the .human summary, via the mermaid skill)
- **Journey** → `journey` or `flowchart LR` of the main behavior.
- **Entities** → `erDiagram` mirroring context.md entities + relationships.
- **Lifecycle** → `stateDiagram-v2` for any entity whose invariants describe state transitions.

Always generate via the mermaid skill so each diagram is validated before it lands in `.human/summaries/understanding.md`.
