# Risk & Opportunity Management — cross-cutting thread

> A **living** register of uncertainties — both downside (`RSK-*`) and upside (`OPP-*`) — identified, scored `Likelihood × Impact`, owned, tracked, and **reviewed at every gate** from ATP to DRR. It is never "done."

**Why first-class.** The audit ([`00_Skills_Audit_Report.md`](../00_Skills_Audit_Report.md) Part D, *high*) found risk treated as "a one-shot Phase-1 register." Real systems engineering runs a **continuous** risk loop: a risk that didn't exist at SRR can sink you at TRR, and an opportunity ignored at PDR is gone by CDR. ISO/IEC/IEEE 15288:2023 lists Risk Management as a Technical-Management process active across the whole life cycle — so it is promoted here to a horizontal thread that every one of the 12 stages feeds and every gate reviews.

---

## What it is & why it matters

Risk & Opportunity Management is the disciplined handling of **uncertainty about future events that, if they occur, change the project's ability to meet its objectives** — negatively (a *risk*) or positively (an *opportunity*). It exists because every other thread produces uncertainty: a requirement may be infeasible, an interface may slip, a supplier may fail, a market window may open. Left implicit, those uncertainties surface as surprises at the worst possible gate.

Treating it as a thread rather than a Stage-01 task buys three things:

- **Early retirement of the worst risks.** The Spiral lifecycle ([Overview §7](../01_Workflow_Overview.md)) exists precisely to retire top risks first; this thread is what feeds that loop.
- **Decisions that price uncertainty.** Stage 05 trade-offs ([`DM-*`](../skills/se-phase-05-tradeoff/)) score options partly on the `RSK-*`/`OPP-*` they create or close — risk is a column in the matrix, not an afterthought.
- **Change that knows its blast radius.** Stage 09 impact analysis ([`CR-*`](../skills/se-phase-09-change-config/)) reads from and writes to the register, so every change re-scores the risks it touches.

**Opportunity is not optional.** A thread that tracks only downside is half a thread. `OPP-*` items (a reusable component, a cheaper supplier, an emerging standard, a partnership) get the same identify→analyze→plan→track→control→communicate loop, scored on **likelihood × benefit**, with *exploit / enhance / share / accept* responses mirroring the risk strategies.

---

## Standards anchor

Citations are the canonical forms from [Conventions §9](../05_Conventions.md#9-canonical-standard-citations) — do not restate or re-version them here.

| Anchor | Role in this thread |
|---|---|
| **ISO 31000:2018** | Risk-management principles, framework, and process (the identify→…→communicate loop, register, treatment). The spine of this thread. |
| **INCOSE SE Handbook v5 (2023)** · **NASA/SP-2016-6105 Rev 2** | Continuous Risk Management (CRM): identify, analyze, plan, track, control — applied every cycle, reviewed at every life-cycle review. |
| **ISO/IEC/IEEE 15288:2023** | Risk Management as a Technical-Management process; the lifecycle home for this thread. |
| FMEA / FTA | Analytical techniques feeding identification & likelihood: FMEA bottom-up (component → effect), FTA top-down (top event → causes). Shared with the [Safety/RAMS thread](Safety_RAMS_Engineering.md) — a `HAZ-*` may spawn a `RSK-*` and vice versa. |
| **ISO/IEC/IEEE 31010** (techniques) | The toolbox (brainstorming, checklists, bow-tie, Monte-Carlo) behind identification & analysis. |

Severity/scoring conventions (the 5×5 bands, High/Medium/Low priority) are owned by [Conventions §5.3 and §5.2](../05_Conventions.md#5-severity--priority) — defined once, *below*, and nowhere else.

---

## The living artifact

**ID grammar** (from [Conventions §2.4](../05_Conventions.md#24-vv-change-risk--ops-ids)): risks are `RSK-<nn>`, opportunities are `OPP-<nn>` — uppercase, zero-padded two-digit, **stable for the life of the project** (never renumber; retire with a `(deprecated)` or `(closed)` note). A not-yet-assigned response action is `RSK-TBD`/`OPP-TBD`, never a blank cell.

**Where it lives.** In the project instance ([Conventions §10](../05_Conventions.md#10-project-folder-layout-per-instance)) the register is the single file `_cross_cutting/Risk_Opportunity_Register.md` — one register for the whole project, **not** a copy per phase. It carries standard frontmatter ([Conventions §6](../05_Conventions.md#6-document-status--versioning)) with `Standard: ISO 31000:2018`; because it is *living*, its `Status` stays `Draft`/`In Review` and is **not** frozen at a gate — only its *gate snapshot* is baselined (see Lifecycle, Stage 04/06).

**Template.** The blank, fill-in version lives at [`../templates/Risk_Opportunity_Register.md`](../templates/Risk_Opportunity_Register.md). Minimum columns:

| ID | Title / event | Cause → effect | Type | L (1–5) | I (1–5) | Score | Band | Strategy | Response (`RSK-*`/`OPP-*` actions) | Owner | Trigger / indicator | Status | Last review (gate) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Write each item as a falsifiable statement: **"If `<cause>`, then `<event>`, leading to `<effect on objective>`."** "The thing might break" is not a risk entry; "If the OCPP library lags the v2.1 spec, then chargers reject sessions, leading to missed availability `TPM`" is.

---

## Lifecycle touchpoints

The thread does something at **every** stage — that is what makes it cross-cutting. (`Gate` column = the review at that stage's exit; threads are reviewed at all of them per [Overview §6](../01_Workflow_Overview.md).)

| Stage | Gate | What this thread does |
|---|---|---|
| **00 Agreement** | ATP | Stand up the register from the template; seed acquisition/contract/funding/schedule risks and partnership/reuse opportunities from the agreement; name a risk owner in the SEMP; set review cadence. |
| **01 Concept** | MCR | First full identification pass off `StRS`/`OpsCon`/feasibility — technical, market, regulatory `RSK-*`; `OPP-*` from adjacent markets/reuse. **The lifecycle model is partly a risk decision** (Spiral if risk is high). |
| **02 Requirements** | SRR | Each `REQ` interrogated for feasibility/verifiability risk; infeasible or unverifiable requirements become `RSK-*`. Link risks that threaten a `MOE`/`MOP`/`TPM`. |
| **03 Modeling** | Model coverage | Model exposes orphan/undefined behaviour and interface gaps → new `RSK-*`; state-machine dead-ends and unhandled events are risk sources. |
| **04 Architecture** | **PDR** | **Architecture risk is the PDR gate's teeth** — "no critical open risks" ([Conventions §3](../05_Conventions.md#3-review-gates-the-milestone-ladder)). Single points of failure, new tech, `ICD` uncertainty. **Baseline the gate snapshot** into the allocated baseline. |
| **05 Trade-off** | Decisions traced | Risk/opportunity is a **scored input** to every `DM-*`; chosen options open/close `RSK-*`/`OPP-*` which are written back. Decisions explicitly retire or accept risk. |
| **06 Integration** | **CDR** | Integration-order and dependency risk (stubs/drivers, late ICDs, HIL availability); order increments to retire highest-risk interfaces first. Snapshot into the product baseline. |
| **07 Verification** | **TRR** | Coverage-gap and test-environment/data risk; any `REQ` without a credible method is a `RSK-*`. Residual technical risk gates test readiness. |
| **08 Validation** | **PRR** | Operational/acceptance risk; open `S1`/`S2` defects ([Conventions §5.1](../05_Conventions.md#51-defect--incident-severity--s1s4)) feed risk. PRR demands **zero critical open risk**. |
| **09 Change & Config** | Baselines current | **Bidirectional**: impact analysis on each `CR-*` re-scores affected `RSK-*`; new risks born from approved changes; CCB reads the register. |
| **10 Operations** | ORR → GA | Operational risk against `SLO-*`/error budgets; incidents and near-misses feed identification (FRACAS-style); `OPP-*` for optimization. Risk burndown becomes risk *steady-state*. |
| **11 Disposal** | DRR | Decommissioning, data-sanitization, environmental, and obsolescence risk; **close-out** of the register with lessons-learned captured for the next project. |

---

## Method / activities

The **Continuous Risk Management loop** (INCOSE/NASA), run every cycle and at every gate — the same loop serves `RSK-*` and `OPP-*`:

1. **Identify.** Structured passes (checklists, brainstorming, FMEA bottom-up, FTA top-down, assumption-busting, pre-mortem) at each stage. Every other thread is an identification source: a `HAZ-*`, `THR-*`, slipping `TPM`, or failed `MOP` should each prompt "is there a `RSK-*` for this?" State each as *if-cause-then-event-leading-to-effect*.
2. **Analyze.** Score **Likelihood (1–5) × Impact (1–5)** → `Score` (1–25) → **Band** via the 5×5 matrix below. Use FMEA/FTA to ground likelihood. For opportunities, Impact = **benefit** if realized.
3. **Plan.** Pick a **response strategy** and concrete `RSK-*`/`OPP-*` actions with an owner, a due date, and a **trigger/indicator** that says when to act.
4. **Track.** Monitor triggers and indicators; re-score on change; maintain **risk burndown** (see below). The register's `Last review` column shows freshness.
5. **Control.** Execute responses; verify they moved the score; escalate when a trigger fires or a residual exceeds appetite. Close items explicitly (`Status: closed (realized | retired | accepted)`).
6. **Communicate.** Surface the top-N and the burndown at every gate, in the SEMP cadence, and to the CCB — risk that lives only in one engineer's head is unmanaged.

### The 5×5 matrix and bands ([Conventions §5.3](../05_Conventions.md#53-risk--opportunity-scoring))

`Score = L × I`. Bands: **Low 1–4 · Medium 5–9 · High 10–14 · Critical 15–25.**

```
 I=5 │  5   10   15   20   25      Likelihood (1–5):  1 rare · 2 unlikely · 3 possible · 4 likely · 5 near-certain
 I=4 │  4    8   12   16   20      Impact (1–5):      1 negligible · 2 minor · 3 moderate · 4 major · 5 severe
 I=3 │  3    6    9   12   15                         (cost/schedule/performance/safety, worst applicable)
 I=2 │  2    4    6    8   10      Bands:  Low 1–4  Medium 5–9  High 10–14  Critical 15–25
 I=1 │  1    2    3    4    5      Opportunity: same grid; Impact = benefit; bands = priority to pursue.
     └────────────────────────
        L=1  L=2  L=3  L=4  L=5
```

### Response strategies (priority per [Conventions §5.2](../05_Conventions.md#52-priority--importance--high--medium--low--na))

| | Risk (`RSK-*`) | Opportunity (`OPP-*`) |
|---|---|---|
| Change the likelihood/impact | **Mitigate** (reduce) | **Enhance** (increase) |
| Remove / pursue the source | **Avoid** (eliminate) | **Exploit** (make it certain) |
| Move it to a better-placed party | **Transfer** (insure, contract, supplier) | **Share** (partner) |
| Carry it with eyes open | **Accept** (with reserve + trigger) | **Accept** (decline to pursue) |

Critical/High items demand an active strategy and a named owner; Low items may be **accepted** with a contingency reserve and a watch-trigger — accepting is a *decision*, recorded, not silence.

### Risk burndown

Track **count and total score by band over time** (per gate). A healthy project's Critical/High exposure falls as it moves left-to-right down the V; exposure that **rises** approaching a gate is itself the signal to *Hold* or *Re-baseline*. Plot it; show it at the gate. Opportunities track an *up*-and-to-the-right "realized benefit" line.

---

## Gate-review questions

Asked at **every** gate (ATP→DRR) as part of the cross-cutting review — answers feed the *Proceed / Proceed-with-actions / Hold / Re-baseline / Stop* decision ([Overview §6](../01_Workflow_Overview.md)):

- **Freshness:** Has the register been reviewed *this* cycle? Any item with a stale `Last review` older than this gate? (A stale register is a *Hold*.)
- **Top-N:** What are the top 5 `RSK-*` by score right now, and what is each owner's next action and trigger?
- **Burndown:** Is Critical/High exposure trending **down** vs. the last gate? If up, why — and is that a *Hold*/*Re-baseline*?
- **Gate-specific thresholds:** PDR — any *critical* open risk? (Gate fails if yes.) PRR — zero critical open and zero open `S1`? TRR — any `REQ` with no credible verification method?
- **Coverage:** Did *this* stage's outputs generate the `RSK-*`/`OPP-*` they should? (New interfaces → new risks; new `CR-*` → re-scored risks.)
- **Opportunities:** What `OPP-*` are open, and is any closing window being missed by inaction?
- **Reserves:** Do schedule/cost contingency reserves still cover accepted residual risk?
- **Linkage:** Are risks that threaten a `TPM`/`MOE`/`MOP`/`SLO` linked to it, so the measurement thread and risk thread agree?

---

## AI prompt pack

Copy-paste prompts; the AI follows the [Protocol](../02_AI_Systems_Engineer_Protocol.md) (never invent numbers — unknowns become `TODO:`).

**1 — Identify (per-stage pass).**
```
You are the risk lead on this project. Read the Stage <NN> artifacts I paste below.
Run a structured identification pass: produce candidate RSK-* and OPP-* items, each as
"If <cause>, then <event>, leading to <effect on which REQ/TPM/MOE/SLO>." Use FMEA
(component→effect) and a pre-mortem ("it's launch day and we failed — why?"). Output the
register table (Conventions §2.4 grammar). Flag any item you can't ground as TODO. No invented numbers.
```

**2 — Analyze & plan.**
```
For each RSK-/OPP- below, assign Likelihood (1-5) and Impact (1-5) with one line of
justification each, compute Score and Band per the 5x5 (Low 1-4 / Med 5-9 / High 10-14 /
Critical 15-25). Recommend a strategy (mitigate/avoid/transfer/accept | exploit/enhance/
share/accept), a concrete response action with an owner placeholder, and a trigger/indicator.
Where likelihood is a guess, say so and propose how to firm it up.
```

**3 — Gate review (burndown).**
```
Act as the gate chair for <GATE>. Given this register and the previous gate's snapshot,
report: top-5 by score, the burndown (Critical/High count and total score vs last gate, up
or down), any stale items, and gate-specific checks (PDR: critical open? PRR: S1 open?).
Recommend Proceed / Proceed-with-actions / Hold / Re-baseline / Stop, with the risks that drive it.
```

**4 — Critique / red-team (run before any gate).**
```
Be a hostile reviewer of this risk register. Find: (a) optimism bias — scores set low to
look green; (b) "solutions masquerading as risks" and vague entries with no cause→effect;
(c) MISSING risks — what category (supply chain, integration, human-factors, security,
regulatory, opportunity) has zero entries and shouldn't? (d) accepted risks with no reserve
or trigger; (e) stale items. List the 3 risks most likely to actually sink this project that
are under-scored or absent. Be specific; do not be reassuring.
```

---

## Common pitfalls

- **One-shot register.** Filled at Stage 01, never touched again — the exact audit finding this thread fixes. *Fix:* a `Last review` column and a mandatory gate review make staleness visible.
- **Downside-only.** Tracking `RSK-*` but never `OPP-*`. *Fix:* every identification pass asks "what could go *right* that we're not pursuing?"
- **Watermelon risks.** Green outside, red inside — scores manipulated down to pass a gate. *Fix:* the red-team prompt; require cause→effect; an independent reviewer scores Critical/High.
- **Risk theatre.** A long register no decision ever consults. *Fix:* wire it into Stage 05 `DM-*` columns and Stage 09 `CR-*` impact analysis so it has consumers.
- **Solutions logged as risks.** "We need a backup sensor" is a response, not a risk. *Fix:* the risk is the *event*; the backup sensor is its *mitigate* action.
- **No trigger, no owner.** "Accepted" risks with nobody watching and nothing that says *act now*. *Fix:* every accepted item needs a contingency reserve and a falsifiable trigger.
- **Mitigation assumed sufficient.** Adding mitigations but never re-scoring. The KB's own lesson: if residual risk stays high after mitigations, **switch to a lower-risk alternative**. *Fix:* control step re-scores; residual above appetite escalates.
- **Severity vs. likelihood confusion.** Mixing the `S1–S4` defect taxonomy with the 1–5 likelihood scale. *Fix:* `S1–S4` ([Conventions §5.1](../05_Conventions.md#51-defect--incident-severity--s1s4)) describes *realized* defects/incidents; `L×I` describes *future* uncertainty. A live `S1` may *cause* a high-impact `RSK-*`, but they are different ledgers.

---

## References

- [`05_Conventions.md`](../05_Conventions.md) — §2.4 (RSK/OPP grammar), §3 (gates & baselines), §5.2–5.3 (priority & 5×5 scoring), §6 (frontmatter), §9 (citations), §10 (register location). **The contract.**
- [`01_Workflow_Overview.md`](../01_Workflow_Overview.md) — §1 the 8 threads, §6 the gate flow, §7 lifecycle-model-as-risk-decision.
- [`02_AI_Systems_Engineer_Protocol.md`](../02_AI_Systems_Engineer_Protocol.md) — §7 update cross-cutting threads at every gate.
- [`00_Skills_Audit_Report.md`](../00_Skills_Audit_Report.md) — Part D (risk as a living thread; high priority), Part B1 (one-home conventions).
- KB: [`04-se-tools-techniques/fundamentals.md`](../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md) — risk management, FMEA/FTA, "switch to a lower-risk alternative."
- Sibling threads (shared identification sources): [`Safety_RAMS_Engineering.md`](Safety_RAMS_Engineering.md) (`HAZ-*`), [`Security_Engineering.md`](Security_Engineering.md) (`THR-*`), [`Measurement_MOE_MOP_TPM.md`](Measurement_MOE_MOP_TPM.md) (`TPM`/`MOE`/`MOP`), [`Configuration_Management.md`](Configuration_Management.md) (`CR-*`).
- Template: [`../templates/Risk_Opportunity_Register.md`](../templates/Risk_Opportunity_Register.md).
- Standards (canonical forms in §9): **ISO 31000:2018**, **ISO/IEC/IEEE 15288:2023**, **INCOSE SE Handbook v5 (2023)**, **NASA/SP-2016-6105 Rev 2**, FMEA/FTA, ISO/IEC/IEEE 31010.
