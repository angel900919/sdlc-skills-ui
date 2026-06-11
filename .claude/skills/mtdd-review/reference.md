# mtdd-review — reference (design-review methodology)

The detailed design-level pass, invoked from `SKILL.md` step 5 **only** when the
diff touches ≥3 modules OR introduces a new module/class. Most slices skip it,
so it lives here rather than in the always-loaded procedure.

## Design review — for non-trivial changes

Do a design-level pass:

- **Deep modules** — run the deletion test on each new abstraction. Pass-through wrappers get inlined.
- **SOLID** — SRP, OCP, LSP, ISP, DIP. Flag fat interfaces, ad-hoc inheritance, concrete dependencies that should be abstract.
- **Cohesion & coupling** — no cyclic component dependencies; stable side abstract; volatile side depends on stable.
- **Continuous design (4Cs)** — Clarity, Conciseness, Confirmability, Cohesion.

Design findings do **NOT** auto-promote the verdict to REJECT — they appear as commentary above the `<criteria>` block. **Exception:** a Blocker-tier finding (cyclic dep, runtime-breaking LSP violation, dependency inversion across module boundaries) is a non-criterion blocking concern and warrants REJECT.

Severity tiers:
- **Blocker** — already prevents change or hides bugs.
- **Major** — structural debt that compounds.
- **Minor** — local design friction.
- **Nit** — clarity only.

Finding format (one line each):
- `[<severity>] <principle/smell> — <one-line title>`
- `  File: path/to/file.ts:LN-LN`
- `  Why it bites: <one sentence>`
- `  Fix: <one sentence — smallest behaviour-preserving reshape>`

Skip the design review entirely on single-file edits, trivial helpers, or doc-only changes.
