# /feature-census anti-patterns

Patterns to reject. Referenced from `SKILL.md` Phase 6 (read back) — scan the draft before writing.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Cataloging components as features | `auth-service`, `db-layer`, `event-bus` listed as shipped features | Those are concerns inside features. A feature is a user-visible capability. Infra components stay in the trace, not as rows. |
| Inventing shipped features | A "shipped" row with no `recon.md` component behind it | Catalog reality. Every `shipped` feature traces to a real component (cite). If the code doesn't have it, it's `planned` (new work) or nothing. |
| Prioritizing the inventory | Ranking shipped features P0/P1/P2 against each other | Priority + tier cap apply to **planned** work (the build queue). Shipped features are done — they don't compete for priority. |
| Mega-feature inventory | One row `the-app` covering the whole system | Apply the atomic test per capability. If a component delivers several independent user capabilities, that's several features. |
| Treating new work as shipped | A feature the user *wants* marked `status: shipped` | New/desired work is `planned`. Only catalog what the code already delivers as `shipped`. |
| Re-deciding scope greenfield-style | Pushing back on a new feature because "it's not in discovery" | Brownfield has no discovery envelope — the app is the envelope. Record new work as a `planned` row; don't gatekeep scope. |
| Skipping the behavior trace | Shipped features with no `satisfies` and no note | Trace each to a behavior from `understanding.md`. A behavior with no feature is an unmodeled capability — note it for `/comprehend`. (Prototype with no understanding → `trace_status: tentative`, component-only.) |
| Capping the inventory | Dropping real shipped features to fit the tier cap | The cap is for planned work. The inventory is whatever exists — list it all (prune only genuine non-features). |
| Overwriting on re-run | A re-run wipes `status`/`prd` links | Update mode: touch only named rows; preserve every other row, its status, and its prd link. |
| Running on greenfield | No `recon.md`, no code — decomposing an idea | Refuse: `GREENFIELD → /feature-map` or `BLOCKED-ON-RECON → /explore`. |
