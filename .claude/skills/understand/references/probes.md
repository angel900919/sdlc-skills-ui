# Understanding probes

Use these to pin down fuzzy language, surface rules, and stress-test journeys. Propose a draft, then probe — the user reacts to your draft rather than generating from scratch.

## Glossary & entity probes
For each load-bearing term, propose a one-line definition, then apply:

- **Conflict probe** — does this term already exist in `.ai/context.md` with a different meaning? Surface it. ("You're using *Account* — but context.md already defines Account as the billing record. Same thing, or different?")
- **Overload probe** — is one word doing two jobs? ("You're saying *account* — do you mean Customer or User? Pick one.")
- **Scenario probe** — stress the boundary with a concrete edge case. ("If a customer cancels half an order, is it still one Order or two?")

Example draft to react to:
> "Your idea uses **Session**. I'd define it as: *a block of billable work a freelancer does for one client, opened when work starts and closed when it ends.* Right, or does Session mean something else?"

When it resolves, write it to `.ai/context.md` immediately — a glossary line, and (if it's a thing with attributes/lifecycle) an entity block.

If after 3 tries a term won't pin down, name it: "We can't nail this down — that's a `NEEDS-EVENT-STORM` signal." Capture it in Open assumptions and move on.

## Invariant probes
Ask: **"What must always be true in this domain, no matter how we build it?"**

- Reject (not domain rules): "API responds in <200ms" (performance), "we validate the email" (implementation), "the DB is consistent" (storage).
- Accept (falsifiable domain rules): "An Order has at most one Cancellation." / "A Cancellation cannot follow a Shipment." / "A Session belongs to exactly one Client at the moment it is closed."

Aim for 3–8. Each becomes a downstream guardrail (tests, review, architecture).

## Behavior / journey probes
Walk the top 1–3 JTBDs end-to-end in the user's voice:

- Bad (UI label): "User clicks 'Send Invoice'."
- Good (their voice): "After Maya closes a session, she opens the app, sees the unbilled session, taps it, confirms the rate and hours, and the invoice is in the client's inbox before she's left her desk."

Capture for each: **trigger** (real-world event), **steps** (their voice), **outcome** (what's true at the end that wasn't before), **failure mode** (what happens if it goes wrong mid-flow — reveals hidden assumptions).

A journey that crosses aggregates/services in a way you can't model cleanly → `NEEDS-EVENT-STORM`.

## Boundary probes
Cross-check discovery's Scope:
- **In** — behaviors inside this phase (usually = v0.1).
- **Out (for now)** — deferred; inherit the `YYYY-MM-DD` dates from discovery's Deferred list.
- **Never** — discovery's hard non-goals.

If what the user says now contradicts the discovery scope, name it and ask which is right; note the resolution.

## Assumption probes
Ask: **"What are you assuming about your users or the domain that you haven't verified?"**

Force 3–7 specific ones. Reject "users will like it." Accept:
- "I'm assuming Maya checks email on her phone after every session — I haven't asked her."
- "I'm assuming a Session always has exactly one Client — I haven't asked the freelancers who run team workshops."

For each: belief + source (user/brief/gut) + cheapest falsification test.

## Diagram prompts (for the .human summary, via the mermaid skill)
- **Journey** → `journey` or `flowchart LR` of the main behavior (trigger → steps → outcome).
- **Entities** → `erDiagram` mirroring the context.md entities + relationships.
- **Lifecycle** → `stateDiagram-v2` for any entity whose invariants describe state transitions (e.g. Order: Draft → Open → Paid/Cancelled).

Always generate via the mermaid skill so each diagram is validated before it lands in `.human/summaries/understanding.md`.
