# Event-storm anti-patterns

Scan the assembled model against this list before writing the artifacts.

| Anti-pattern | Why it's rejected | Fix |
| :--- | :--- | :--- |
| **Modeling implementation** | "writes a row to `orders`", "calls the API" is the *how*, not the domain | Capture the business fact ("OrderPlaced"); the model exists in the business, you're discovering it |
| **Present/imperative events** | "ProcessOrder" is a command, not a fact | Restate past-tense: "OrderProcessed". Events are facts that already happened |
| **One mega-aggregate** | An aggregate owning every event means the consistency boundaries weren't found | Split until each aggregate is a real transactional-consistency boundary |
| **Skipping policies** | Cross-service coupling hides in the event→command reactions | Always run Phase 5; name every "when X, then Y" |
| **Implicit cross-context integration** | A policy crossing a context line with no relationship named will rot | Classify it (Partnership / Customer-Supplier / Conformist / ACL / OHS); decide on an ACL |
| **Premature consolidation** | 5 vague events lose the model; merging non-duplicates hides seams | Keep 20 specific events over 5 fuzzy ones; merge only true duplicates |
| **Papering over hot spots** | Forcing a fake answer onto a contested boundary produces a wrong model | Flag it as a hot spot; ≥3 unresolved → `NEEDS-MORE-MODELING` |
| **Diagram in the .ai file** | Machine artifacts parse structure, not pictures | The event-flow / aggregate diagram goes in `.human/summaries/` only |
| **Re-defining glossary terms** | The domain-model duplicating `context.md` definitions drifts | Reference `.ai/context.md` by name; write only *new* terms there, inline |
| **Running the session solo** | The value is the human's domain knowledge — this is amber-zone | Facilitate one step at a time; never invent events the user didn't confirm |
| **Grinding past a multi-context signal** | Several bounded contexts with undecided integration belong in the strategic layer | Name it, emit `NEEDS-STRATEGIC-DESIGN → /ddd-strategy`, re-run per context |
| **Proceeding with no context.md** | No shared glossary = the events have no anchored terms | Refuse; route to `/understand` (`BLOCKED-ON-CONTEXT`) |

## The context.md discipline

`.ai/context.md` is owned by `/understand` (or `/comprehend`) and read by nearly every downstream skill. This skill only **appends** ubiquitous-language terms it surfaces:

- Write a new term the moment it resolves, not at the end (batching loses terms).
- Domain language only — no aggregate class names, file paths, or DB columns.
- Never re-define a term already in `context.md`; if the session contradicts an existing definition, that's a hot spot to surface, not a silent overwrite.
