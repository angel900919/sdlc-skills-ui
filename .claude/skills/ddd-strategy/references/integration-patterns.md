# Bounded-context integration patterns

Distilled from Chapter 4 "Integrating Bounded Contexts" of *Learning Domain-Driven Design* by Vlad Khononov. Every pair of bounded contexts that shares data needs an explicit integration pattern, chosen from three families based on team communication, power balance, and subdomain types.

## The three families

### Cooperation (teams collaborate well)

- **Partnership** — Both teams coordinate model changes ad-hoc. Cheapest when teams are co-located and communication is high-bandwidth. Brittle at scale.
- **Shared kernel** — A small shared model/library both contexts depend on. Any change requires both teams' approval. Use sparingly — the kernel becomes a coordination tax.

### Customer–supplier (asymmetric power)

- **Conformist** — Downstream adopts upstream's model wholesale, no translation. Cheapest for the downstream; loses local fit.
- **Anticorruption layer (ACL)** — Downstream wraps upstream's model in a translation layer that exposes a local ubiquitous language. Use when upstream's model is messy, legacy, or unstable.
- **Open-host service (OHS)** — Upstream publishes a stable *published language* (interchange model) decoupled from its internal model. Use when many downstreams depend on you and you want freedom to evolve internals.

### Separate ways (no integration)

- **Separate ways** — Each context duplicates the data/logic it needs. Use when integration cost exceeds duplication cost, or when the contexts genuinely shouldn't share a model.

## Quick-pick table

| Situation | Pattern |
|---|---|
| Two teams, same company, daily contact | Partnership |
| Two teams share a small core concept (e.g. Money) | Shared kernel |
| Downstream of a legacy / third-party API you can't change | ACL |
| You're the upstream and N downstreams depend on you | OHS |
| Downstream of an actively evolving partner team, fine with their model | Conformist |
| Two contexts that "kind of" overlap but never together | Separate ways |

## Context map

Plot each context pair with the chosen pattern and the direction of dependency (upstream → downstream). Annotate each edge:
- **U / D** — Upstream / Downstream
- **OHS / ACL / SK / Conformist / Partnership / Separate** — pattern label
- **Team** — owning team (if cross-team)

The context map doubles as an **organizational diagnostic**: if upstream/downstream relationships don't match team power, you'll see friction (e.g. a "partnership" that's really a conformist relationship in disguise). In this chain the map is rendered into `.human/summaries/strategic-design.md` as a Mermaid `flowchart` (via the mermaid skill) FROM the integration matrix in the `.ai/` artifact — never drawn in `.ai/`.

## Anti-patterns

- **Implicit integration** — Two contexts share a database table directly with no pattern declared. Will rot.
- **Distributed monolith** — Every context calls every other context synchronously without ACLs. One model leak propagates everywhere.
- **Misnamed kernel** — A "shared kernel" that grew to 80% of either context. It's now a third bounded context masquerading as a library.
