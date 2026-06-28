# Human Systems Integration (HSI) — cross-cutting thread

> The discipline that designs the **human into the system** — operators, maintainers, and trainees — as deliberately as any block of hardware or software, so the fielded system is usable, safe, staffable, and trainable rather than merely functional.

**Why first-class.** A system that meets every functional `REQ` can still fail in the field because an operator can't reach a control, a maintainer mis-seats a part in the dark, training takes six months no one budgeted, or fatigue induces an error that no test caught. HSI is the thread that keeps the human in the trade space from the first stakeholder interview to disposal. The audit (Part D) flagged HSI as present only as a `U`(sability) requirement class — this thread promotes it to a living discipline that touches Phase 01 (operator/maintainer stakeholders), Phase 02 (human-factors + training requirements), Phase 04 (operator-station/UI design), and Phase 08 (human-in-the-loop UAT), and is reviewed at every gate.

---

## What it is & why it matters

Human Systems Integration is the systems-engineering discipline that ensures human-related considerations are designed *in*, traded against cost/schedule/performance, and verified — not discovered after fielding. It spans **seven domains** (NASA SP-2016-6105 HSI; INCOSE):

| HSI domain | Concern | Designs against… |
|---|---|---|
| **Human factors / ergonomics** | Anthropometry, reach/clearance, displays, controls, workload, situational awareness. | Operator can perceive, decide, and act within the task envelope. |
| **Training** | Skills, courseware, sims, on-the-job aids, time-to-proficiency. | The workforce can operate/maintain it without unaffordable training. |
| **Staffing / manpower** | Number of operators/maintainers per shift, crew size, workload balance. | The system is affordable to crew over its life. |
| **Personnel** | Required aptitudes, certifications, qualifications of the people. | The right skill levels exist (or can be recruited). |
| **Habitability** | Living/working conditions — lighting, noise, temperature, space, sustenance. | Sustained performance over long duty cycles. |
| **Environment / occupational health & safety (ESOH)** | Hazards to the human — toxics, noise, radiation, ergonomic injury. | Operators/maintainers are not harmed (feeds the Safety/RAMS thread). |
| **Human error** | Error-likely situations, error tolerance, recovery, mistake-proofing. | Predictable human error cannot propagate to a `S1` outcome. |

HSI matters because the human is usually the **least flexible and most safety-critical** element: you can re-spin firmware, but you cannot re-spin reach length or attention span. Treating the operator/maintainer as a designed subsystem — with requirements, a budget, allocations, and verification — is what separates a system that *works on the bench* from one that *works in the hands of the people who must use it*.

---

## Standards anchor

Cited per [`../05_Conventions.md` §9](../05_Conventions.md) — canonical forms only; this thread never redefines them.

- **NASA/SP-2016-6105 Rev 2** — the HSI practice (seven domains; HSI Plan; integrating HSI across the lifecycle and reviews) — Conventions §9 *Practitioner handbooks*.
- **INCOSE SE Handbook v5 (2023)** — HSI as a specialty engineering activity within the technical processes — Conventions §9 *Practitioner handbooks*.
- **ISO/IEC/IEEE 15288:2023** — the lifecycle processes HSI rides on (Stakeholder Needs, System Requirements, Architecture/Design Definition, Verification, Validation) — Conventions §9 *SE lifecycle*.
- **ISO/IEC/IEEE 29148:2018** — the document set (StRS/SyRS) where human-factors, training, staffing and personnel requirements are written — Conventions §9 *Requirements engineering*.
- **Adjacent (use the named thread, don't re-anchor here):** ESOH hazards to the human flow to the **Safety/RAMS** thread (`HAZ-<nn>`); domain ergonomics/regulatory standards (e.g. ISO 9241 displays, MIL-STD-1472, ISO 26800) are recorded as `REQ-D-<nn>` / `REQ-C-<nn>` per the **Domain/Constraint** classes, not invented here.

---

## The living artifact

**`HSI_Plan.md`** (one per project, in `_cross_cutting/`) — the living home of the thread. It carries the seven-domain status, the HSI issue/finding log, the human-task inventory, and the staffing/training/error registers. It is reviewed and re-stamped at **every** gate, never "done" until DRR.

**ID grammar** (extends Conventions §2 — uppercase, hyphenated, zero-padded two-digit `-01`, stable for life, retire-not-renumber):

| Artifact | ID form | First appears | Notes |
|---|---|---|---|
| HSI issue / finding | `HSI-<nn>` | 01 | An open human-integration concern tracked to closure across stages. |
| Human task (operate/maintain) | `HTASK-<nn>` | 01→02 | A discrete operator/maintainer task; the unit of task analysis. |
| Human-error mode | `HERR-<nn>` | 02 | An error-likely situation; links to a `HAZ-<nn>` when it can cause harm. |

HSI requirements are **not** a new class — they are written under existing Conventions §2.1 classes and tagged `[HSI:<domain>]`: human-factors/ergonomics & UI targets → `REQ-U-<nn>`; workload/response-time human-performance → `REQ-P-<nn>`; training/staffing/manpower & maintainer availability → `REQ-O-<nn>`; ESOH & error-mitigating behaviour → `REQ-SAF-<nn>` (links to `HAZ-<nn>`); mandated human-factors standards → `REQ-D-<nn>` / `REQ-C-<nn>`. Human effectiveness measures are `MOE-<nn>`; human-performance measures (task time, error rate, workload) are `MOP-<nn>`, with risk-bearing ones promoted to `TPM-<nn>` (e.g. *time-to-proficiency*, *crew workload*).

**Template:** [`../templates/HSI_Plan.md`](../templates/HSI_Plan.md) — blank, fill-in, with the seven-domain table, the `HSI-`/`HTASK-`/`HERR-` registers, and the gate-stamp block pre-wired.

---

## Lifecycle touchpoints

The thread does *something* at every stage; **bold** rows are the four primary touchpoints in the brief.

| Stage | What the HSI thread does |
|---|---|
| 00 Agreement | Confirm HSI is in scope/contract; size the HSI effort in the SEMP; name the HSI owner; record any mandated human-factors/ESOH standards as constraints. Seed `HSI_Plan.md`. |
| **01 Concept** | **Identify operator & maintainer stakeholders (`STK-<nn>`) and their needs (`SN-<nn>`); capture human roles, crew concept, and use environment in the OpsCon; open initial `HSI-<nn>` issues; draft the human-task inventory (`HTASK-<nn>`); set human-centred `MOE-<nn>`.** |
| **02 Requirements** | **Write human-factors, training, staffing/manpower, personnel, habitability, ESOH and human-error requirements under `U/P/O/SAF/D/C` tagged `[HSI:<domain>]`; define human `MOP-<nn>`/`TPM-<nn>`; run task analysis on each `HTASK-<nn>`; enumerate `HERR-<nn>`; seed T/I/A/D per HSI REQ.** |
| 03 Modeling | Add operator/maintainer **actors** to the Use Case diagram; model human steps in Activity/Sequence diagrams (swimlanes for the human); ensure every HSI REQ appears in the Requirements diagram with a `satisfy`/`verify` edge. |
| **04 Architecture & Design** | **Design the operator station / crew workspace / UI (allocate HSI REQs to a Human-Machine Interface block); define human-facing seams in the `ICD-<nn>` (displays, controls, alerts, comms); apply ergonomics/anthropometry; mistake-proof error modes; record HSI design decisions as `DEC-<nn>`.** |
| 05 Trade-off | Bring HSI into the matrices — score options on usability, training burden, crew size, error tolerance, ESOH; a "cheaper" option that needs +1 operator/shift or +3 months training must lose those points. Capture as `DEC-<nn>` with HSI criteria weighted. |
| 06 Integration | Plan human-in-the-loop (HIL) and operator-station integration increments (`INC-<nn>`); ensure training devices/sims and operator procedures are integrated, not bolted on; verify human-facing ICD seams as they close. |
| 07 Verification | Finalise T/I/A/D for each HSI REQ; verify ergonomics by **Analysis** (anthropometric model) or **Inspection** (checklist vs standard); workload/task-time by **Test**; record `TC-VER-<nn>`. (Verification ≠ acceptance — that's 08.) |
| **08 Validation** | **Run human-in-the-loop UAT with *representative* operators/maintainers in the real environment; measure task time, error rate, workload, time-to-proficiency against MOE/MOP/TPM; capture `TC-VAL-<nn>` with Actual Result + Pass/Fail; human-induced failures are defects (`S1`–`S4`).** |
| 09 Change & Config | Any change touching a human task/UI/procedure triggers an HSI impact assessment in the `CR-<nn>`; keep training material, manpower model and operator docs under configuration control as `CI-<nn>`. |
| 10 Operations | Monitor human-performance SLOs (`SLO-<nn>`) — error rates, mis-operations, near-misses; feed operator feedback and human-factor incidents back as `CR-<nn>`; keep operator/maintainer runbooks (`RB-<nn>`) current; re-baseline training as the system evolves. |
| 11 Disposal | Plan safe human decommissioning tasks (`HTASK-<nn>` for teardown), maintainer ESOH during disposal, retraining/redeployment of staff, and archival of HSI lessons learned for the next system. |

---

## Method / activities

1. **Operator/maintainer stakeholder analysis (01).** Beyond the buyer and end-user, name *who operates it*, *who maintains it*, *who trains on it*, and *under what conditions*. Each becomes a `STK-<nn>` with `SN-<nn>` needs and a slot in the OpsCon's use environment.
2. **Human-task analysis (01→02).** Decompose each operational scenario into discrete operator/maintainer tasks (`HTASK-<nn>`): inputs, steps, decisions, time available, information needed, consequence of error. This is the backbone the other six domains hang on.
3. **Allocate function to human vs machine (02→04).** For every function, decide deliberately whether the human, the machine, or both perform it — and record the rationale. Over-automating breeds complacency; under-automating breeds overload.
4. **Workload & situational-awareness assessment (02→07).** Estimate operator workload per scenario (e.g. NASA-TLX-style) and ensure required information is available when the decision is made. Promote a workload `MOP` to `TPM-<nn>` if margin is tight.
5. **Human-error analysis (02→04).** For each `HTASK-<nn>`, enumerate error modes (`HERR-<nn>`): slips, lapses, mistakes, mode confusion. Design tolerance/recovery/mistake-proofing; where an error can cause harm, link `HERR-<nn> → HAZ-<nn>` in the Safety thread and write a `REQ-SAF-<nn>`.
6. **Staffing & training estimation (02→05).** Derive crew size per shift and time-to-proficiency; these are first-class trade-study criteria and life-cycle-cost drivers, not afterthoughts.
7. **Operator-station / UI design (04).** Apply anthropometry, reach/clearance, display legibility, control reachability, alert salience, and accessibility; allocate HSI REQs to an HMI block; specify the human-facing `ICD-<nn>` seams.
8. **Human-in-the-loop validation (08).** Test with *representative users in the representative environment* — not engineers who built it — and measure, not eyeball.

---

## Gate-review questions

Ask these of the HSI thread at each gate (per Conventions §3); a gate is a *decision point*, not a rubber stamp.

- **ATP (00):** Is HSI in scope and resourced? Is an HSI owner named? Are mandated human-factors/ESOH standards captured as constraints?
- **MCR (01):** Are operator *and* maintainer stakeholders identified with needs? Does the OpsCon describe the human roles, crew concept, and use environment? Are the top `HSI-<nn>` issues open and owned?
- **SRR (02):** Does every HSI domain have at least one requirement (or a justified "N-A: tailored out")? Are human `MOE`/`MOP`/`TPM` defined? Is each `HTASK-<nn>` task-analysed and each `HERR-<nn>` logged? Is a T/I/A/D method seeded per HSI REQ?
- **PDR (04):** Is the operator station / UI designed and HSI REQs allocated to an HMI block? Are human-facing ICD seams defined? Are error modes mistake-proofed? Any open HSI issue at critical severity?
- **CDR (06):** Are human-facing ICDs frozen? Are training devices/sims and operator procedures in the integration plan? Are HIL increments planned?
- **TRR (07):** Does every HSI REQ have a verification method and `TC-VER-<nn>`? Are representative-user UAT plans and the operator population ready?
- **PRR (08):** Did human-in-the-loop UAT pass against MOE/MOP/TPM with *representative* operators? Zero `S1` human-induced failures? Time-to-proficiency and crew workload within threshold? Training materials accepted?
- **ORR (10):** Are operators/maintainers trained and certified? Are runbooks and human-performance SLOs in place? Is an HSI feedback loop wired into Stage 09?
- **DRR (11):** Are human decommissioning tasks safe and staffed? Are HSI lessons learned archived?

---

## AI prompt pack

Copy-paste; fill the `<…>` slots. The AI must conform to Conventions (IDs, classes, T/I/A/D, §9 citations) and never invent needs.

**1 — Identify operator/maintainer stakeholders (Phase 01).**
```
You are an HSI engineer. From this concept: <paste OpsCon / concept>.
List the human stakeholders BEYOND the buyer/end-user: who OPERATES, MAINTAINS,
TRAINS-ON, and SUPERVISES the system, and under what use environment (lighting,
noise, PPE, shift length). Output a table: STK-id | role | HSI domains touched |
SN-id candidate need | use-environment note. Flag any role with no need captured.
```

**2 — Derive HSI requirements across all seven domains (Phase 02).**
```
For each HSI domain (human factors/ergonomics, training, staffing/manpower,
personnel, habitability, ESOH, human error), write SMART requirements for this
system: <paste system + HTASK list>. Use Conventions classes (U/P/O/SAF/D/C),
tag each [HSI:<domain>], assign REQ-<class>-<nn>, cite the parent SN, and seed a
T/I/A/D method. If a domain doesn't apply, output "N-A: tailored out: <reason>"
— do NOT fabricate a need.
```

**3 — Human-task & error analysis (Phase 02→04).**
```
Task-analyse each operator/maintainer task: <paste HTASK list>. For each, output
HTASK-id | steps | time available | info needed | consequence of error, then
enumerate HERR-<nn> error modes (slip/lapse/mistake/mode-confusion) with a
mitigation (tolerate / recover / mistake-proof). Where an error can cause harm,
mark "→ HAZ" for the Safety thread and propose a REQ-SAF-<nn>.
```

**4 — Red-team / critique (run before any HSI gate).**
```
Critique this HSI artifact as a skeptical reviewer: <paste HSI_Plan + HSI REQs>.
Find: (a) domains with zero coverage and no tailoring rationale; (b) requirements
that are not human-VERIFIABLE (no measurable task time/error rate/workload);
(c) operator-station/UI claims with no anthropometry or accessibility basis;
(d) UAT planned with engineers instead of REPRESENTATIVE users; (e) staffing/
training costs absent from the trade study; (f) HERR modes that should link to a
HAZ but don't. Output a prioritised findings list with the gate each blocks.
```

---

## Common pitfalls

- **Treating HSI as "the UI."** Human factors is one of seven domains; staffing, training, personnel, habitability, ESOH and human error are routinely the larger cost/safety drivers and get skipped.
- **Discovering the human late.** Adding operators/maintainers as stakeholders at PDR instead of MCR means the architecture is already hostile to them. Identify them in **Phase 01**.
- **Unverifiable human requirements.** "Shall be intuitive / user-friendly" has no pass/fail. Pin a measurable task time, error rate, workload, or time-to-proficiency so it can be `T`/`A`/`D`-verified.
- **Validating with the wrong humans.** UAT run by the engineers who built it hides the very errors a representative operator would make. Phase 08 must use *representative* users in the *representative* environment.
- **Ignoring training/staffing in the trade study.** An option that needs +1 operator/shift or +3 months of training is not cheaper — score those costs in Phase 05 (`DEC-<nn>`) or the trade is wrong.
- **Letting human error float free of safety.** An error-likely situation that can cause harm must link `HERR-<nn> → HAZ-<nn>` and drive a `REQ-SAF-<nn>` — otherwise the Safety thread never sees it.
- **Inventing new ID classes.** HSI requirements live under existing `U/P/O/SAF/D/C` classes tagged `[HSI:<domain>]`; only `HSI-`/`HTASK-`/`HERR-` are new registers. Don't fork the convention.
- **Marking a domain silently absent.** A non-applicable domain is recorded as `N-A: tailored out: <reason>`, never a blank — same rule as every other Conventions artifact.

---

## References

- **NASA/SP-2016-6105 Rev 2**, *NASA Systems Engineering Handbook* — HSI process, the seven domains, HSI Plan, and HSI across lifecycle reviews (Conventions §9).
- **INCOSE SE Handbook v5 (2023)** — Human Systems Integration as a specialty-engineering activity within the technical processes (Conventions §9).
- **ISO/IEC/IEEE 15288:2023** — lifecycle processes HSI integrates with (Conventions §9).
- **ISO/IEC/IEEE 29148:2018** — StRS/SyRS document set carrying HSI requirements (Conventions §9).
- Workflow contract: [`../05_Conventions.md`](../05_Conventions.md) (IDs §2 · gates §3 · T/I/A/D §4 · severity §5 · status §6 · spine §8 · citations §9).
- Spine & threads: [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) (HSI listed among the 8 cross-cutting threads).
- Adjacent threads: Safety/RAMS (`HAZ-<nn>`, ESOH) · Measurement/TPM (human `MOE`/`MOP`/`TPM`) · Risk & Opportunity (`RSK-<nn>` for human-integration risk).
- Touchpoint stages: `../skills/se-phase-01-concept/` · `se-phase-02-requirements/` · `se-phase-04-architecture/` · `se-phase-08-validation/`.
