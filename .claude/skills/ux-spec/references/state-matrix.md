# The four-state matrix + copy rules

Every screen in a ux.md carries **all four interaction states** — loading, empty, error,
disabled. The project-wide defaults live in `.ai/design-system.md § Interaction-state
conventions`; a feature screen states each one explicitly, either "per design system" or an
override. An `n/a` must be argued in the artifact ("this screen takes no input → no disabled
state for the form; the nav buttons still carry one") — never silently omitted.

## What each state must answer

| State | The question the implementing agent would otherwise guess |
| :-- | :-- |
| **loading** | What renders while data is in flight? (skeleton / spinner / stale data + indicator) Is the screen interactive meanwhile? What if it takes more than ~5s? |
| **empty** | First-run / zero-results: what copy shows (verbatim) and what is the ONE next action offered? Never a blank region. |
| **error** | Fetch or submit failed: what copy (verbatim, per the error formula), what recovery affordance (retry / back / support), what data is preserved? |
| **disabled** | Which elements disable, under what condition, and how does the user learn WHY (tooltip / helper text / inline note)? |

## Per element kind (apply to each key element of a screen)

| Element kind | loading | empty | error | disabled |
| :-- | :-- | :-- | :-- | :-- |
| List / table | skeleton rows (count them) | empty-state copy + primary action | inline retry block | row actions disabled while a mutation is in flight |
| Form | fields render, submit disabled | n/a (a form is never "empty" — argue if it is) | field-level validation copy + form-level submit-error copy | submit disabled until valid; state the rule |
| Detail view | skeleton blocks per region | "not found" copy + route back | retry + back | edit actions per permission/state, reason surfaced |
| Action button | in-flight label/spinner, double-submit prevented | — | failure toast/inline copy + retried or not | condition + surfaced reason |
| Search / filter | results-area loading only (controls stay live) | "no results for X" + clear-filters action | retry, keep the query | — |
| Chat / AI output (ai-llm surface) | streaming indicator + cancel | first-run prompt suggestions | generation-failed copy + retry, input preserved | input disabled while generating, visibly |

## Validation & error-copy rules

1. **Verbatim, quoted.** Every validation and error message is written as the exact string
   (`copy: "Add an email address so we can send the invoice."`). "Show a helpful error" is
   not a spec.
2. **Entity terms from `.ai/context.md`** — if the domain says *Registration*, the copy never
   says "booking". One term per concept, everywhere.
3. **The error formula** (production, from the design system): what happened + what to do
   next, in the project voice. No codes, no blame ("Invalid input"), no dead ends — every
   error names a way forward.
4. **Validation copy sits with its field** in the per-screen block (`field · rule · copy`);
   form-level failures (server reject, conflict) get their own line.
5. **Unhappy-path copy is part of the flow** — each unhappy branch in `## User flows` names
   the screen + state + copy that catches it. An unhappy path that lands on an unspecified
   state is a gap, not an implementation detail.

## Quick audit (run before the read-back)

- [ ] Every screen block has all four `states:` lines (or an argued `n/a`).
- [ ] Every state either says "per design system" or spells out the override.
- [ ] Every input field has `rule` + verbatim `copy`.
- [ ] Every unhappy flow branch lands on a specified screen + state.
- [ ] No copy invents a synonym for a context.md entity term.
