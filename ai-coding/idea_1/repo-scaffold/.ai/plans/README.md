# Implementation Plans

One plan per unit of work (`NNN-feature-name.md`, from `TEMPLATE.md`). A plan is the **reviewable contract before code** — the cheapest artifact to correct, so review happens here, not in a working PR.

- Write the plan in plan mode; a human edits it before implementation. That edit is the gate.
- Structure work as **vertical slices** (a thin end-to-end path per phase, each testable), not horizontal layers — agents default to horizontal and can't be prompted out of it.
- Keep an explicit **out-of-scope** list; persisting negative decisions stops scope creep.
- Plans are disposable destination docs — archive or delete after the work ships so they don't rot. The decision log keeps what's durable.
