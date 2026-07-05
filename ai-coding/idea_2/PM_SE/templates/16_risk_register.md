# Risk Register — <Product Name>

> **All phases · max ~10 live rows · home of the Risk & Kill Criteria thread.** Reviewed at every gate — stale at a gate **blocks the gate**: the passing verdict is unavailable until the register is refreshed. Grammar is mandatory: **"If <cause>, then <event>, leading to <effect on the outcome>."** "The thing might break" is not a risk, and "we need a backup sensor" is a response, not a risk. Time budget: 30 min at kickoff, 10 min per gate. Anti-pattern this file prevents: watermelon risks — green outside, red inside, scored to pass a gate. Delete sections that don't apply.
>
> **Two numbers per risk, scored separately.** **L×I** (3×3, H/M/L each) orders your attention. **Severity S1–S4** drives gate decisions — set by worst case × reversibility, never discounted by likelihood: a rare-but-catastrophic risk is still S1.
>
> **Gate rules:** no open S1 past G3 (Ship-Ready). *An S1 with no affordable mitigation is a KILL conversation, not a "Medium" hiding in the table.* Accepting a risk is a decision — recorded, with a trigger — never silence. Gate question, every gate: reviewed this cycle? Top-3 shrinking since last gate? Any Kill-level row open?

Severity S1–S4: one taxonomy for defects, incidents, security findings — see [`../CONVENTIONS.md`](../CONVENTIONS.md) §4.

## Live register

| ID | Risk (if / then / leading to) | Category | L×I | Sev | Trigger — what says "act now" | Mitigation | "Done" looks like (measurable) | Review |
|---|---|---|---|---|---|---|---|---|
| RSK-01 | *(example — delete)* If the single-source sensor goes EOL, then the next build run breaks, leading to a fleet we can't repair | hw-supply | M×H | S2 | Distributor stock < 2 build runs | Qualify a second source | Drop-in alternate tested on 1 unit | <date> |
| RSK-02 | | <market / tech / data-privacy / ai-quality / ai-cost / ai-security / hw-supply / hw-safety / hw-environment / legal / ops> | | | | | | |

**Pre-mortem (kickoff — seed the rows above):** *"It's launch day and we failed — why?"* Write every answer as an if/then/leading-to row *before* arguing about likelihood.

## Kill criteria — by phase

Seeded from the pre-mortem; this is the referent for the gate question "any Kill-level row open?"

| Phase | This bet is dead if… |
|---|---|
| P1 | <e.g. the G1 kill-filter hard-fails — no real demand signal> |
| P2–P3 | <e.g. eval ceiling provably below the frozen bar / cost ceiling breached with no path down> |
| P5 | <sunset condition from `13_ops_review.md` met> |

**Kill-level** = a live row whose trigger has fired, or that meets a phase criterion above, with no affordable mitigation. That row forces the KILL conversation at the next gate — it doesn't wait in the table.

**Escalation out of the lean lane:** a row landing on safety-critical hardware, a regulated domain, or PII at scale is not mitigated inside PM_SE — tier up per the right-sizing table in [`../README.md`](../README.md).

## Standing candidates — check at every phase

**[AI]** quality drift after model/prompt changes · prompt injection via user or retrieved content · PII in logs or at a vendor that trains on it · cost-per-outcome creep · single vendor/model lock-in · autonomy expanding without eval evidence.

**[HW]** single-source part EOL or price spike · battery/thermal event · no OTA/USB update path = unpatchable fleet · certification non-compliance · enclosure ingress failure (water/dust) in the real deployment environment.

## Closed / retired

| ID | Risk | Outcome (mitigated / accepted-with-trigger / didn't materialize) | Date |
|---|---|---|---|
| | | | |

## Hazard block — conditional

> **Activates on the charter's safety question: "can a failure of this system hurt someone or breach a safety regulation?"** (mains power, battery, motors, heat, moving parts — or any failure-can-hurt-someone path). If NO, replace this whole section with one recorded line — `N-A: tailored out — no physical risk` — never a silent delete.
>
> The 15-minute drill: walk each device function with the guidewords **lost / erroneous / inadvertent / degraded / late** and name the unsafe *state* that results (the state, not the cause). Then the informal failure walk: what if each component fails — and what combination burns the house down? A mitigation is not real until it is a `REQ-SAF-nn` in [`06_spec.md`](06_spec.md) and **PROVEN** (Test or Inspection — a claim is not proof). No open hazard without a proven mitigation passes a gate.

| ID | Guideword | Unsafe state | Worst credible harm | Mitigation → REQ-SAF-nn | How PROVEN (T/I + evidence) | Residual accepted by (name + date) |
|---|---|---|---|---|---|---|
| HAZ-01 | *(example — delete)* erroneous | Heater stays on past setpoint | Fire / burns | REQ-SAF-01: hardware thermal cutoff, independent of firmware | T: <test path> — cutoff trips at <N> °C | <name, date> |
| HAZ-02 | <lost / erroneous / inadvertent / degraded / late> | | | REQ-SAF-TBD | | |

Field failures feed back here (P5): every field failure gets a row review — what broke, why, what changed.
