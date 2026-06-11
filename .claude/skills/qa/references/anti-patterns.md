# /qa anti-patterns

Scan before requesting approval (Phase 4).

| Anti-pattern | Refuse because |
|---|---|
| Auto-approving | Every tier requires a human y/n — even prototype. The skill produces evidence; the human owns the ship decision. |
| Writing to `features.md` before approval | The flip `building → qa-approved` happens **only** on an explicit yes, in Phase 5. |
| Testing only the feature's own files | That misses regression. mvp+ runs the full suite — "did we break anything else?" |
| Silently skipping a gate when a built-in is absent | Degrade gracefully: emit the manual command + WARN. A skipped gate must be visible, never silent. |
| Trusting one backend when a slice has two refs | A slice with `beads` + `jira` refs must be terminal in **both**; disagreement → `BLOCKED-ON-CONFLICT`. |
| Reading slice closure from the canonical file | Canonical is the *contract*; runtime closure lives on the backend (same done-detection as `/build`). A `published` slice with `- [ ]` boxes is built-by-design, not incomplete. |
| FAIL but still asking for approval | Any FAIL stops at Phase 4 with the non-approval verdict. Don't put a broken feature in front of the gate. |
| Editing PRD/plan/design to make a check pass | Read-only on specs. Drift → route to the owning skill. |
| Skipping the manual script because automation passed | Automated checks prove internal soundness; only a human driving the feature proves it works. Always generate + run the acceptance + exploratory script. |
| Inventing acceptance steps with no PRD grounding | Only write steps grounded in PRD/acceptance. Internal-only behavior → "covered by automated tests," don't fabricate a UI step. |
| `SKIP`-ing fitness at production because `fitness/` is empty | The bar was never mechanized → `BLOCKED-ON-FITNESS → /to-fitness`, not a silent skip. |
| Re-running benchmarks / load tests here | NFR check is existence + staleness; perf/load infra lives in CI. |
| Shipping / deploying | `qa-approved` is terminal here; deploy + the `qa-approved → shipped` flip are `/ship`. |
| Per-slice review | That's the `mtdd-*` execute loop. `/qa` is feature-granularity. |
| Marking PASS from a previous session's run | Evidence expires. A PASS cites a command run **this** `/qa` run with its observed output (critical rule 12). Re-run or degrade to WARN + manual command. |
| Trusting the execute loop's "tests passed" note | The mtdd phases verified their slice at their moment; `/qa` verifies the **feature at this commit**. Run the regression yourself. |
| "Should / probably / seems to" next to a check status | Those words mean the command wasn't run. Run it, read the output, then record the status with the evidence. |
