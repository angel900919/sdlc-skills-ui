# Measurement — MOEs, MOPs & TPMs

> The thread that keeps "are we still on course to succeed?" answerable with numbers, not adjectives — from the first stakeholder need to retirement.

**Why first-class:** every other thread and stage produces claims ("it's fast enough", "it'll scale", "we have margin"); Measurement is the discipline that turns those claims into a small set of named, owned, traceable numbers tracked against a *planned* profile, so a gate review can be a real go/no-go instead of a rubber stamp. It is one of the 8 always-on threads ([Overview §1](../01_Workflow_Overview.md)) and operationalises the 15288 **Measurement** process (Technical Management group).

---

## What it is & why it matters

Three measure types, deliberately separated by *whose* question they answer:

| Type | ID | Answers | Owner space | Derived from | Born in |
|---|---|---|---|---|---|
| **MOE** — Measure of Effectiveness | `MOE-<nn>` | "Does the system let the **stakeholder** succeed in the mission?" | Problem space — solution-independent | Stakeholder need `SN-<nn>` | Phase 01→02 |
| **MOP** — Measure of Performance | `MOP-<nn>` | "Does the **system** exhibit the performance attribute the design must deliver?" | Solution space | Requirement `REQ-<nn>` | Phase 02 |
| **TPM** — Technical Performance Measure | `TPM-<nn>` | "Is a **critical** MOP on track against its planned profile, *right now*, with how much margin?" | Solution space, time-tracked | A promoted critical `MOP-<nn>` | Phase 02, tracked 06→10 |

The chain (from [Conventions §2.2](../05_Conventions.md) and the [traceability spine §8](../05_Conventions.md)): `SN → MOE` (effectiveness of the need) and `SN → derive → REQ → MOP` (performance of the spec); **selected critical MOPs are promoted to TPMs**. An MOE can be satisfied by many MOPs; a single MOP rolls up to one or more MOEs. Keep the sets **small** — an MOE/MOP for everything is a metric for nothing.

Why it must be a living thread, not a one-time task:
- **MOEs are the acceptance bar.** Validation (Phase 08) passes when the system meets *needs*; MOEs are how "meets needs" is measured. They are baselined in the Functional/Requirements baseline at **SRR** (Conventions §3).
- **TPM margins are gate-readiness inputs.** A TPM breaching its threshold turns a gate from *Proceed* into *Proceed-with-actions* or *Hold* ([AI Protocol §6](../02_AI_Systems_Engineer_Protocol.md)).
- **TPM margins are trade-off inputs.** Phase 05 decisions consume current margin: spending mass/latency/cost margin is a quantified cost in the decision matrix, not a hand-wave.

---

## Standards anchor

Use the exact citation forms from [Conventions §9](../05_Conventions.md):

- **ISO/IEC/IEEE 15288:2023** — the **Measurement** process (Technical Management): plan → define measures → collect → analyse → report → evaluate.
- **INCOSE SE Handbook v5 (2023)** — MOE/MOP/TPM definitions and the *technical-measurement* method (planned-value profile, thresholds, margin, achievement-to-date).
- **NASA/SP-2016-6105 Rev 2** — Technical Measurement & the **TPM** tracking discipline (planned profile, tolerance band, margin management, gate use).
- Supporting: **ISO/IEC/IEEE 29148:2018** (MOEs/MOPs are quantified expressions of StRS needs and SyRS requirements); **PMBOK/EVM** is the *cost/schedule* analogue (owned by the Cost/Schedule thread) — keep TPM (technical) and EVM (cost/schedule) distinct.

> No standard mandates a fixed *count* of measures — that is a tailoring decision (see Pitfalls). Cite the process, not a number.

---

## The living artifact

**Artifact:** `TPM_Tracker.md` — the one place MOEs, MOPs, TPMs, their planned profiles, current values, and margins live.

- **Where it lives:** the project's `_cross_cutting/TPM_Tracker.md` ([Conventions §10](../05_Conventions.md)). The MOE/MOP *set* is also referenced from `Phase_02_Requirements/` (it is part of the requirements baseline) and the `Traceability_Matrix.md`.
- **Template:** [`../templates/TPM_Tracker.md`](../templates/TPM_Tracker.md) (blank fill-in).
- **ID grammar (Conventions §2.2):** `MOE-<nn>`, `MOP-<nn>`, `TPM-<nn>` — uppercase, zero-padded two digits, **stable for project life** (never renumber; retire with `(deprecated)`). An unassigned promotion link is `TPM-TBD`, never a blank cell.
- **Frontmatter & status:** carries the standard frontmatter and status ladder (`Draft → In Review → Baseline (<GATE>-approved <date>) → Superseded`) from [Conventions §6](../05_Conventions.md). The MOE/MOP set baselines at **SRR**; TPM planned profiles baseline at **PDR** (allocated baseline) and changes thereafter only via a `CR-<nn>` (Phase 09).

**Minimal row shape** (full version in the template):

| Field | Example |
|---|---|
| ID / Name | `TPM-03` Charge-session p95 latency |
| Traces to | `MOP-07` ← `REQ-P-04` ← `SN-05` ← `MOE-02` |
| Threshold (must-not-cross) | ≤ 200 ms |
| Target (planned final) | ≤ 120 ms |
| Planned profile (per milestone) | PDR 400 · CDR 250 · TRR 160 · PRR 120 |
| Current value (source/date) | 178 ms (load test `TC-VER-12`, 2026-06-20) |
| Margin | +22 ms vs threshold (11%) |
| Status / trend | 🟡 within tolerance, improving |
| Owner | Perf lead |

---

## Lifecycle touchpoints

| Stage | What the Measurement thread does |
|---|---|
| **00 Agreement** | Capture mission-success criteria and any contractually-mandated measures from the agreement; note acceptance metrics in the SEMP. Seed candidate MOEs. |
| **01 Concept** | **Define MOEs from stakeholder needs** (`SN-<nn> → MOE-<nn>`) in the OpsCon — solution-independent effectiveness ("mission completes in ≤ X", not "CPU < Y"). Set rough target ranges; flag unknowns as `TODO: research benchmark`. |
| **02 Requirements** | **Define MOPs from requirements** (`REQ-<nn> → MOP-<nn>`); confirm each MOE is covered by ≥1 MOP. **Select critical MOPs → promote to TPMs.** Set each TPM's threshold, target, and planned profile. MOE/MOP set **baselined at SRR**. |
| **03 Modeling** | Anchor measures to model elements (Requirements diagram / parametric where used); a TPM with no satisfying block is an orphan to flag. |
| **04 Architecture** | Allocate each TPM to architecture blocks/interfaces; record the **PDR planned-profile point**; the allocated baseline freezes TPM allocations and profiles at **PDR**. |
| **05 Trade-off** | TPM **margins are decision inputs** — alternatives are scored partly on their effect on margin; "spends 30 ms of latency margin" is an explicit cost in `DM-<nn>`. |
| **06 Integration** | **Start measuring TPMs** on integrated increments (`INC-<nn>`); plot achieved-to-date vs the planned profile; CDR profile point recorded. |
| **07 Verification** | TPMs are read from verification evidence (`TC-VER-<nn>`); a TPM is a measurable threshold ⇒ method **T** (Conventions §4). Margin reported at **TRR**. |
| **08 Validation** | **MOEs verdict** — validation passes when MOEs meet stakeholder targets via `TC-VAL-<nn>`; a met spec with an unmet MOE is a validation failure. Margins reported at **PRR**. |
| **09 Change/Config** | Any `CR-<nn>` that moves a baselined threshold/profile updates the tracker; re-baseline if the change crosses a frozen baseline. Status accounting includes the tracker. |
| **10 Operations** | MOEs/MOPs become live **SLOs** (`SLO-<nn>`); continuous validation watches for drift; an in-service breach opens a CR. Margins reviewed at **ORR/GA** and continuously. |
| **11 Disposal** | Capture final achieved-vs-target as lessons-learned; archive the tracker; retire measures with the system. |

---

## Method / activities

1. **Derive, don't invent.** Every MOE traces to an `SN-<nn>`; every MOP to a `REQ-<nn>`. No measure without a parent need/requirement — and conversely, a critical need/requirement with no measure is a gap.
2. **Make each measure SMART.** A unit, a value, and a condition ("p95 over 24 h at 500 rps"). Replace adjectives ("fast", "scalable") with numbers — same discipline the AI applies to requirements ([AI Protocol §4](../02_AI_Systems_Engineer_Protocol.md)).
3. **Promote selectively.** A MOP becomes a TPM only if it is (a) **critical** to an MOE/mission, (b) **at risk** (uncertain, contested, or historically hard), and (c) **trackable early** (you can estimate it before final test). Aim for a handful, not dozens.
4. **Set threshold, target, and a planned profile.** *Threshold* = must-not-cross (verification limit). *Target* = planned final value (often better than threshold). *Planned profile* = the value you expect to have achieved **at each milestone** (PDR/CDR/TRR/PRR) — the line you track against. Add a **tolerance band** around it.
5. **Define margin and its policy.** `Margin = (threshold − current) / threshold` (sign so positive = good). Decide who may **spend** margin and how reserve is released as uncertainty retires — margin is a managed budget, not a surprise.
6. **Measure and plot, every increment.** From Phase 06 on, record achieved-to-date vs the planned profile and the trend (improving / flat / regressing). Cite the evidence source (`TC-VER-<nn>`, load test, analysis).
7. **Feed gates and trades.** Report margin status at each gate; feed margin deltas into Phase 05 matrices.
8. **Tailor the count** (Conventions §1 tailoring note / [Tailoring Guide](../04_Tailoring_Guide.md)): Minimum-Viable projects may carry 1–3 TPMs as a checklist; Formal/safety-critical track the full set with tolerance bands and reserve management.

---

## Gate-review questions

Ask these of the Measurement thread at the relevant gate (complements [`../checklists/gate-reviews.md`](../checklists/)):

- **MCR (01):** Does every top mission need have an MOE with a target range? Are MOEs solution-*independent* (no design baked in)?
- **SRR (02):** Is every MOE covered by ≥1 MOP, and every MOP traced to a `REQ-<nn>`? Are the critical MOPs identified and promoted to TPMs? Is the MOE/MOP set baselined?
- **PDR (04):** Does each TPM have a threshold, target, and **planned profile** allocated to a block? Is the PDR profile point met or is there a credible recovery plan?
- **CDR (06):** Are TPMs being measured on real increments? Is achieved-to-date within the tolerance band? Is margin being spent faster than planned?
- **TRR (07):** Is each TPM read from verification evidence (`TC-VER-<nn>`), method **T**? Any TPM below threshold ⇒ this is not *Proceed*.
- **PRR (08):** Do the **MOEs** meet stakeholder targets in validation (`TC-VAL-<nn>`)? Any met-spec-but-unmet-MOE? Final margins acceptable, zero S1?
- **ORR/GA (10):** Are MOEs/MOPs wired to live `SLO-<nn>`? Is drift monitored with an alert + CR path?
- **Every gate:** Which TPMs are 🔴/🟡, what is the recovery plan and owner, and does any breach change the gate outcome (Proceed-with-actions / Hold)?

---

## AI prompt pack

**1 — Derive MOEs from needs (Phase 01→02):**
> "Here is my StRS (`SN-*`) and OpsCon. For each stakeholder need, propose one solution-*independent* MOE with an ID (`MOE-<nn>`), a unit, a target range, and the measurement condition. Flag any need that resists measurement and say why. Do **not** bake in a design choice. Output the `MOE`→`SN` trace."

**2 — MOPs and TPM promotion (Phase 02):**
> "Given these requirements (`REQ-*`) and MOEs, propose MOPs (`MOP-<nn>`) traced to requirements, and map each MOP up to the MOE(s) it supports. Then recommend which MOPs to **promote to TPMs**, using the criteria critical + at-risk + early-trackable. For each TPM give threshold, target, and a planned profile across PDR/CDR/TRR/PRR with a tolerance band."

**3 — Margin as a trade input (Phase 05):**
> "For decision `DM-<nn>`, here are the current TPM margins. For each alternative, estimate its effect on each TPM's margin and express margin spent/gained as a scored criterion in the matrix. Flag any alternative that pushes a TPM below threshold."

**4 — Red-team / critique (any phase):**
> "Critique this `TPM_Tracker` as a hostile gate reviewer. Find: MOEs that secretly encode a solution; MOPs with no requirement parent; TPMs whose 'target' equals their 'threshold' (no margin); planned profiles that are flat then miraculously jump at the last milestone; margins computed with the wrong sign; and any MOE not covered by a measurable TPM. List each finding with the ID and the consequence at the next gate."

---

## Common pitfalls

- **MOEs that secretly specify a solution.** "CPU < 60%" is a MOP masquerading as an MOE. The MOE is the *mission* outcome ("operator completes task in ≤ 3 min"). Fix: write MOEs before any architecture exists.
- **Too many measures.** A metric for everything dilutes attention and no one watches the tracker. Fix: keep MOEs to the few mission-critical outcomes; promote only critical-and-at-risk MOPs to TPMs.
- **Threshold = target (zero margin by design).** Leaves no room to manage; the first bad measurement is already a breach. Fix: set target better than threshold and manage the gap as a budget.
- **Hockey-stick planned profiles.** A flat line that jumps to target at the last milestone hides risk. Fix: a realistic monotonic profile with a tolerance band; investigate any plan that defers all progress.
- **Measuring late.** First reading at TRR leaves no time to recover. Fix: estimate by analysis/model from PDR, measure on increments from Phase 06.
- **No owner / no margin policy.** Margin gets silently spent in trades and nobody notices until it's gone. Fix: name an owner per TPM and a rule for who may spend reserve.
- **Confusing TPM (technical) with EVM (cost/schedule).** They are different threads. Fix: TPMs track technical margin; CPI/SPI track cost/schedule (Cost/Schedule thread).
- **Letting the tracker drift from the baseline.** Editing a baselined threshold without a `CR-<nn>`. Fix: post-SRR/PDR changes go through Phase 09 (Conventions §6).
- **Stopping at verification.** All TPMs green but an MOE unmet = built it right, wrong thing. Fix: MOEs are the **validation** bar (Phase 08), not verification.

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — §2.2 (MOE/MOP/TPM ID grammar), §3 (gates & baselines), §4 (T/I/A/D — TPM ⇒ T), §6 (status/versioning), §8 (traceability spine), §9 (canonical citations), §10 (folder layout — `_cross_cutting/TPM_Tracker.md`).
- [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) — §1 (8 threads), §2 (V-model), §5 (problem vs solution space, MOE↔MOP).
- [`../02_AI_Systems_Engineer_Protocol.md`](../02_AI_Systems_Engineer_Protocol.md) — §4 (challenge missing metrics), §6 (gates as decisions), §7 (keeping threads alive — Measurement).
- [`../00_Skills_Audit_Report.md`](../00_Skills_Audit_Report.md) — Part D ("Measurement: MOEs/MOPs/TPMs", high priority) — the gap this thread closes.
- KB: [`Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md`](../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md) — V&V and trade-off techniques the measures feed.
- Template: [`../templates/TPM_Tracker.md`](../templates/TPM_Tracker.md).
- Standards: **ISO/IEC/IEEE 15288:2023** (Measurement process), **INCOSE SE Handbook v5 (2023)**, **NASA/SP-2016-6105 Rev 2** (Technical Measurement), **ISO/IEC/IEEE 29148:2018**.
