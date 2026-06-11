# /architect anti-patterns

Scan the draft against this before writing. Backstops the numbered critical rules in `SKILL.md`.

| Anti-pattern | Symptom | Fix |
| :-- | :-- | :-- |
| Architecture without anchor | Designing before the stack/tier is locked | Refuse → `BLOCKED-ON-ANCHOR → /anchor`. |
| Diagrams in `.ai/` | A Mermaid or ASCII block inside `.ai/architecture*` | Move it to `.human/summaries/architecture` via the mermaid skill. `.ai` holds the dependency *table*. |
| Prose narrative in `.ai/` | Paragraphs of explanation in the machine artifact | Keep `.ai` structured (tables, YAML, `key: value`); narrative goes in the `.human` walkthrough. |
| Production rigor at prototype | 12 ADRs + risk storming for a weekend spike | Honor the inherited tier. Prototype = single file, 0–1 ADRs, no risk storming. |
| Asking the tier | "What tier is this?" | Never — `project_tier` is LOCKED in `anchor.md`. Read it. A bump request → `/promote`. |
| Entity Trap | `OrderService`, `PaymentHandler`, `UserManager` | Rename verb-noun (`PlaceOrder`, `ChargePaymentMethod`, `AuthenticateUser`). See [naming.md](naming.md). |
| All-XService | Every component ends in `Service`/`Manager` | Stop. Pick the verb that says what each DOES. |
| Microservices for a small team | "We'll start with 8 microservices" | Default modular monolith. Microservices need ≥5–8 engineers + a named scaling/autonomy driver. |
| Async-by-default | "Everything is event-driven" | Default sync. Async only for background work, multiple consumers, or when the user shouldn't wait. |
| ADR for trivia | ADR for "we use camelCase" | Apply the Nygard significance filter — structure / NFR / dependency / interface / construction, else skip. |
| ADR without alternatives | "We will use Postgres." (no Context) | Force a Context section with the rejected alternatives. No alternatives = no decision. |
| Restarting the ADR counter | New ADR numbered 0001 when 0006 exists | Scan `adr/` for the highest NNNN; the counter is shared with `/ddd-strategy`. |
| Pattern soup | "CQRS + event-sourcing + hexagonal + microkernel + saga" | 1–2 patterns per architecture; each earns its keep. |
| Premature decomposition | 15 components for 4 features | Start with the fewest (≈1 per JTBD); split when a real coupling boundary appears. |
| Vague characteristics | "scalable, fast, maintainable" | Three-criteria test + a forced number (p95 latency, deploy frequency, MTBF). |
| Top-8 characteristics | 8 -ilities, all "critical" | Force top-3; record the rest as considered-but-cut (production). |
| Skipping update mode | Overwriting existing architecture | Detect in Phase 0; update only named artifacts; preserve the rest + the `.human` mirror. |
| DDD smuggling | Designing bounded contexts here | This is generalist. DDD-shaped + no `strategic-design.md` → STOP → `NEEDS-STRATEGIC-DESIGN → /ddd-strategy`. |
| Orphan feature | A feature in `features.md` maps to no component | Add a component, or loop back to `/feature-map`. Every feature traces to ≥1 component. |
