# Discovery anti-patterns

Scan the assembled draft against this list before writing the artifacts. Each row is a symptom to strip or fix.

| Anti-pattern | Why it's rejected | Fix |
| :--- | :--- | :--- |
| **Discovery-as-marketing** | A brief that only lists upsides isn't validation, it's a pitch | Force the kill criteria and the cost-of-being-wrong |
| **Solution-before-problem** | Starting from "I want to build X" hides whether anyone needs it | Re-anchor on the problem and the person who feels it |
| **Vibes metric** | "Engagement / satisfaction / users love it" can't be observed | Force metric + baseline + target + timeframe + source |
| **No kill criteria** | No falsifiable walk-away condition = no learning loop | Keep probing; if truly absent, that's the verdict's rationale |
| **Segment as persona** | "Small businesses / developers / everyone" isn't a person | Force one named person with role, context, constraint |
| **Undated deferral** | "Deferred" with no date is abandonment in disguise | Force a `YYYY-MM-DD` revisit date + a trigger |
| **Tech leakage** | Stack/framework/DB talk belongs downstream | Capture under References; steer back to the idea |
| **PROCEED theatre** | A gate that always says PROCEED is decoration | A weak case earns INVESTIGATE/KILL — state it honestly |
| **Interrogating for researchable facts** | Grilling the user for competitors/market wastes their time | Dispatch a sub-agent to research, then ask them to react |
| **Scope creep into v0.1** | v0.1 items that don't serve the JTBD bloat the build | Move them to Deferred with a date |
| **Diagram in the .ai file** | Machine artifacts parse structure, not pictures | Diagrams go in `.human/summaries/` only |
| **Hiding a problem to avoid KILL** | The gate is advisory, not optional | State the verdict; let the user override on the record |

## The advisory-gate stance

The gate's value is the honest verdict, not the power to block. So:

- Always run the full analysis, even when the answer is going to be uncomfortable.
- Issue the real verdict with its reasons.
- If the user wants to proceed past INVESTIGATE/KILL, that's their call — set `verdict_overridden: true`, write their reason into the Decision section, and route onward.
- What you never do: water down the analysis, skip the kill-criteria probe, or quietly upgrade a KILL to PROCEED to keep the peace.
