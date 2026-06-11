# Understanding anti-patterns

Scan the assembled draft against this list before writing the artifacts.

| Anti-pattern | Why it's rejected | Fix |
| :--- | :--- | :--- |
| **Re-running discovery** | JTBD / metric / kill criteria are already settled upstream | Read them from `.ai/discovery/<slug>.md`; don't re-grill |
| **Tech leakage** | Stack / framework / DB / schema talk belongs downstream | Capture under References; steer back to the domain |
| **Glossary spam** | 40 terms means none are load-bearing | Keep 5–15; cut anything that isn't doing work |
| **Implementation invariant** | "API <200ms", "validate email", "DB consistent" aren't domain rules | Restate as a domain truth or drop it |
| **ADR for everything** | Over-ADRing buries the decisions that matter | Apply the 3-trigger test; write only survivors |
| **UI-label journey** | "User clicks Send" hides the real intent | Rewrite in the user's voice (trigger → steps → outcome → failure) |
| **Undated boundary** | "Out for now" with no date drifts to "never" by accident | Inherit revisit dates from discovery's Deferred |
| **Definitions duplicated** | Glossary copied into both context.md and understanding.md drifts | Define once in `.ai/context.md`; reference it by name |
| **Diagram in the .ai file** | Machine artifacts parse structure, not pictures | ER / state / journey diagrams go in `.human/summaries/` only |
| **Grinding past a NEEDS-EVENT-STORM signal** | Forcing a complex event flow into this format produces a wrong model | Name it, flag the verdict, route to `/event-storm` |
| **Proceeding without a seed** | No discovery/brief = nothing to model against | Refuse; route to `/discovery` |

## The context.md discipline

`.ai/context.md` is the cross-skill reuse hotspot — many downstream skills read it. So:

- Write a term/entity there the moment it resolves, not at the end (batching loses terms).
- Domain language only — no file paths, class names, or DB columns.
- The understanding artifact and the human summary both *reference* context.md; they never re-define its terms. One source of truth, two views.
