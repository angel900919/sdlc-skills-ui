# Workflow Overview — the spine

> A reusable, **domain‑agnostic** systems‑engineering workflow that takes any system — hardware, software, or hybrid — from a first stakeholder need to safe retirement. It is grounded in **ISO/IEC/IEEE 15288:2023**, the **INCOSE SE Handbook v5**, **NASA/SP‑2016‑6105**, and the requirements/architecture/V&V standards listed in [`05_Conventions.md` §9](05_Conventions.md). It is built to be **AI‑powered**: each stage carries interview questions, generation prompts, and explicit triggers for web research and specialised agents — see the [AI Systems Engineer Protocol](02_AI_Systems_Engineer_Protocol.md).

---

## 1. The shape of the work

Two things run at once for the whole life of a system:

- **12 sequential stages** (Phase 00 → 11) — the *vertical* progression from agreement to disposal, each with inputs, activities, deliverables, and an **exit gate**.
- **8 cross‑cutting threads** — *horizontal* disciplines (risk, configuration, safety, security, HSI, measurement, cost, quality) that are **alive in every stage**, reviewed at every gate, and never "done."

```
                                THE 12 STAGES
00 Agreement ─▶ 01 Concept ─▶ 02 Requirements ─▶ 03 Modeling ─▶ 04 Architecture ─▶ 05 Trade-off
   ─▶ 06 Integration ─▶ 07 Verification ─▶ 08 Validation ─▶ 09 Change/Config ─▶ 10 Operations ─▶ 11 Disposal

                          8 CROSS-CUTTING THREADS (always on)
   Risk & Opportunity · Configuration Mgmt · Safety/RAMS · Security · HSI · Measurement (MOE/MOP/TPM) · Cost/Schedule/EVM · Quality
```

---

## 2. The V‑model view (decomposition pairs with verification)

The stages are sequential, but their real power is the **V‑model pairing**: every decomposition step on the left has a matching test step on the right, planned *together*. This is why verification methods are seeded in Stage 02, not invented at the end.

```
 Problem space ┐                                                  ┌ Operations
   (define)    │                                                  │  (use)
               ▼                                                  ▲
  01 Concept / StRS / OpsCon ───────────────────────────▶ 08 Validation (acceptance ↔ needs)
        │                                                          ▲
        ▼                                                          │
  02 System Requirements (SysRS) ────────────────────────▶ 07 Verification (system ↔ spec)
        │                                                          ▲
        ▼                                                          │
  03–04 Architecture & Design / ICDs ────────────────────▶ 06 Integration (parts ↔ interfaces)
        │                                                          ▲
        └──────────────▶ 05 Trade-off ▶ build / implement ────────┘
```

Read it as: *the left side answers "what and how"; the right side answers "did we build it right (07) and the right thing (08)."* Stages 09–11 wrap the V in change control, operation, and retirement.

---

## 3. Mapping to ISO/IEC/IEEE 15288:2023 process groups

15288 organises SE into **four process groups**. This workflow fully operationalises the **Technical** processes and most of **Technical Management**; it *frames* the **Agreement** and **Organizational Project‑Enabling** groups in Stage 00 and points you to where they live, rather than pretending to fully cover org‑level concerns.

| 15288 process group | Coverage here |
|---|---|
| **Agreement** (Acquisition, Supply) | **Framed in Stage 00** — agreement register, RFP/SOW/contract, acceptance terms. Org‑procurement depth is out of scope (sourced from the acquiring org). |
| **Organizational Project‑Enabling** (Life‑cycle model mgmt, Infrastructure, Portfolio, Human resource, Quality mgmt, Knowledge mgmt) | **Framed in Stage 00 + the Quality and Knowledge threads.** Portfolio/HR are org‑level and flagged out‑of‑scope. |
| **Technical Management** (Project planning, assessment & control, Decision mgmt, Risk mgmt, Configuration mgmt, Information mgmt, Measurement, Quality assurance) | **Covered by the cross‑cutting threads** — Decision (Stage 05), Risk, Configuration (Stage 09), Measurement, Cost/Schedule, Quality — reviewed at every gate. |
| **Technical** (Business/Mission analysis, Stakeholder needs, System requirements, Architecture definition, Design definition, System analysis, Implementation, Integration, Verification, Transition, Validation, Operation, Maintenance, Disposal) | **The 12 stages, 1:1.** See the stage‑to‑process map below. |

### Stage → 15288 technical process

| Stage | 15288 technical process(es) |
|---|---|
| 00 Agreement | Acquisition / Supply (Agreement group) |
| 01 Concept | Business/Mission Analysis · Stakeholder Needs & Requirements Definition |
| 02 Requirements | System Requirements Definition |
| 03 Modeling | System Analysis (model‑based) |
| 04 Architecture | Architecture Definition · Design Definition |
| 05 Trade‑off | Decision Management (Technical Mgmt) · System Analysis |
| 06 Integration | Implementation · Integration |
| 07 Verification | Verification |
| 08 Validation | Validation · Transition (acceptance) |
| 09 Change/Config | Configuration Management · Information Management (Technical Mgmt) |
| 10 Operations | Transition · Operation · Maintenance |
| 11 Disposal | Disposal |

---

## 4. Lifecycle stages vs. workflow stages

The classic SE lifecycle has **five stages** (Concept → Development → Production → Operations & Maintenance → Disposal). The 12 workflow stages are a finer‑grained instantiation:

| Lifecycle stage | Workflow stages |
|---|---|
| Concept | 00–01 |
| Development | 02–08 |
| Production | (Stage 08 PRR + production‑readiness; explicit for hardware/hybrid) |
| Operations & Maintenance | 10 |
| Disposal | 11 |

> **Hardware/hybrid note.** Pure‑software projects often collapse "Production" into release. For physical systems, treat production‑readiness (first‑article inspection, manufacturing ramp) as an explicit checklist at PRR — see the [Tailoring Guide](04_Tailoring_Guide.md).

---

## 5. Problem space vs. solution space

A discipline the workflow enforces (and the audit found missing): **separate the problem from the solution**, and trace between them.

```
PROBLEM SPACE (Stage 01)              SOLUTION SPACE (Stage 02+)
  Stakeholder needs  (StRS, SN-*)  ──derive──▶  System requirements (SysRS, REQ-*)
  Operational concept (OpsCon, SCN-*)            Architecture / design
  Effectiveness      (MOE-*)        ───────▶     Performance      (MOP-*, TPM-*)
```

Sign off the **problem space** (StRS + OpsCon) before committing to the **solution space**. This is the single biggest guard against "built it right, but it was the wrong thing."

---

## 6. The gate flow

Each stage ends at a gate; the cross‑cutting threads are reviewed at every gate (open risks, baseline status, hazard log, TPM margins, cost/schedule). Full criteria: [`checklists/gate-reviews.md`](checklists/).

```
ATP ─ MCR ─ SRR ─ PDR ─ CDR ─ TRR ─ PRR ─ ORR ─ GA ┄┄(ops loop: change ⇄ validate)┄┄ DRR
00    01    02    04    06    07    08    10   10                                       11
```

A gate is a **decision point**, not a formality: *Proceed · Proceed‑with‑actions · Hold · Re‑baseline · Stop.* The [AI Systems Engineer Protocol](02_AI_Systems_Engineer_Protocol.md) makes the AI challenge readiness at each one rather than rubber‑stamp it.

---

## 7. Choosing the lifecycle model that wraps the stages

The 12 stages describe **what** to produce; the **lifecycle model** decides **how** you sequence and iterate them. Chosen in Stage 01 and recorded in the Project Development Plan:

| Model | Sequences the stages as… | Best for |
|---|---|---|
| **Waterfall** | once, strictly in order | stable, well‑understood requirements (civil works, fixed‑scope) |
| **V‑Model** | once, with left/right verification pairing | safety‑critical (avionics, medical, automotive ECUs) |
| **Spiral** | repeated risk‑driven loops, retiring top risks first | high‑uncertainty, high‑risk, evolving systems |
| **Agile** | thin end‑to‑end slices each sprint | fast‑feedback software, evolving scope |
| **Hybrid (V + Agile / SAFe)** | V‑rigour on safety‑critical tracks, Agile on the rest | most modern mixed hardware/software systems *(common default)* |

> SAFe is a **scaling framework** applied *inside* Hybrid for large orgs — not a base model. Don't list it as a peer of Waterfall/Agile.

---

## 8. How to read the rest of this workflow

| If you want… | Go to |
|---|---|
| The operating manual (how the AI runs each stage, interviews you, challenges assumptions, recommends research) | [`02_AI_Systems_Engineer_Protocol.md`](02_AI_Systems_Engineer_Protocol.md) |
| Where each standard/framework lives in the flow | [`03_Standards_Map.md`](03_Standards_Map.md) |
| How to scale this up or down for your project | [`04_Tailoring_Guide.md`](04_Tailoring_Guide.md) |
| The contract (IDs, gates, methods, severities, naming) | [`05_Conventions.md`](05_Conventions.md) |
| A specific stage (activities, questions, prompts, deliverables, checklist, exit gate) | `skills/se-phase-NN-*/SKILL.md` |
| A cross‑cutting discipline | [`cross-cutting/`](cross-cutting/) |
| Blank templates · AI prompts · checklists | [`templates/`](templates/) · [`prompts/`](prompts/) · [`checklists/`](checklists/) |
| A fully worked end‑to‑end example | `worked_example/` (EV Charging Station Network) |
| What was wrong before and why this exists | `00_Skills_Audit_Report.md` |
