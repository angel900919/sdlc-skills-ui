---
name: se-phase-02-requirements
description: Runs Phase 02 (Requirements) of the domain-agnostic systems-engineering workflow — the front-and-back of requirements engineering. It elicits raw needs (interviews, workshops, surveys, observation, document review), surfaces implicit requirements, analyses and classifies them into the convention's REQ classes (F/U/P/O/SEC/INT/C/D and SAF), writes them SMART (EARS as a fallback), prioritises High/Medium/Low/N-A, resolves conflicts, peer-reviews, derives the system spec from the StRS, seeds a T/I/A/D method per REQ, defines the MOE/MOP/TPM measurement set, and produces a baselined SyRS (ISO/IEC/IEEE 29148:2018) plus a StRS→SyRS traceability matrix. Use when the user wants to elicit or write requirements, draft a SyRS/SysRS, classify functional vs non-functional, run SMART or EARS checks, prioritise requirements, define MOEs/MOPs/TPMs, build a traceability matrix, or prepare for an SRR. Triggers on "elicit requirements", "write the SyRS", "draft requirements", "SMART check", "prioritise requirements", "define MOEs and MOPs", "build the traceability matrix", "prep for SRR", "phase 2 requirements".
---

# Phase 02 — Requirements

<what-to-do>
This phase turns the problem-space needs (StRS/OpsCon from Phase 01) into a baselined, testable solution-space spec — the **System Requirements Specification (SyRS)** — plus the **MOE/MOP/TPM** measurement set and a **StRS→SyRS** traceability matrix. Its exit gate is **SRR (System Requirements Review)**. It conforms in full to [../../05_Conventions.md](../../05_Conventions.md) — all IDs, gates, T/I/A/D codes, severity/priority, baselines, status strings, and standard citations come from there; this skill never redefines them.

## Inputs (from prior phases)
- **`Phase_01_Concept/StRS.md`** — stakeholder needs `SN-<nn>`. The spine `SN ──derive──▶ REQ` starts here; every REQ must trace to an SN (or be marked as a derived/decomposed child with rationale).
- **`Phase_01_Concept/OpsCon.md`** — operational scenarios `SCN-<nn>`; modes/states and the operational context each REQ must hold under.
- **`Phase_01_Concept/Stakeholder_Mission.md`** — `STK-<nn>` list (reuse as REQ **Source**; never re-ask who the stakeholders are).
- **`Phase_01_Concept/Feasibility_Study.md`** — feasibility verdicts and known constraints (seed `C`/`D` requirements).
- **`Phase_00_Agreement/SEMP.md`** — tailoring level (Minimum-Viable vs Formal artifact set) and any contractual constraints.
- **`_cross_cutting/Risk_Opportunity_Register.md`** — open `RSK-<nn>` that requirements must mitigate.
- **Graceful fallback:** if a StRS/OpsCon is absent, do **not** invent needs. Offer to run `se-phase-01-concept` first, or proceed against a thin concept supplied inline — and record `TODO: StRS/OpsCon owed; SN traceability provisional` in the SyRS frontmatter.

## Step-by-step
Interview-driven. Ask **one topic at a time** (one assistant message per topic), convert answers into deliverables, then check the exit gate. Use `AskUserQuestion` for finite choices. Reuse Phase-01 facts; never re-ask them.

1. **Locate the project root & confirm output paths.** Read the Phase-01 artifacts above. Defaults: `<output-dir>/<slug>/Phase_02_Requirements/SysRS.md` and `Traceability_Matrix.md`. (Conventions §10 names the file `SysRS.md`; "SysRS"/"SysRS.md" is an accepted alias for the same artifact — pick one and stay consistent.)
2. **Plan elicitation (topic 1).** For each StRS need cluster, pick the elicitation **method** by goal — don't default to interviews for everything:
   - **Interviews** — deep insight into one stakeholder's needs; functional + buy-in.
   - **Workshops / focus groups** — multi-stakeholder brainstorming, conflict resolution, completeness.
   - **Surveys / questionnaires** — scalable, quantifiable input for prioritisation across many stakeholders.
   - **Observation** — actual behaviour vs stated needs; surfaces capability gaps.
   - **Document review** — regulations, incident reports, prior specs; surfaces **implicit requirements**.
   Ask the user which methods were/will be used per cluster; record method + source per raw need.
3. **Elicit raw needs & hunt implicit requirements (topic 2).** Gather raw needs in the stakeholders' own words. Then probe the three classes that interviews routinely miss: **non-functional** (performance/reliability/security — users rarely volunteer numbers), **implicit** (offline operation, interoperability, things assumed unstated), and **domain/regulatory** (industry-vertical standards). Confirm each assumption out loud.
4. **Analyse & classify (topic 3, per class).** Organise raw needs for **clarity** (no ambiguity), **consistency** (no contradictions), **feasibility** (achievable). Classify each into a Conventions §2.1 class, asking class-by-class in this order:

   | Order | Class | Code | Covers |
   |---|---|---|---|
   | 1 | Functional | `F` | What the system *does* — actions, decisions, outputs. |
   | 2 | Usability | `U` | UX targets — task time, accessibility, language, learnability. |
   | 3 | Performance | `P` | Latency, throughput, capacity, accuracy, energy (+ scalability/maintainability "-ilities" tagged here). |
   | 4 | Operational / Reliability | `O` | Uptime, MTBF/MTTR, availability, OTA, offline, retention. |
   | 5 | Security | `SEC` | AuthN/AuthZ, crypto, audit, supply-chain, compliance. |
   | 6 | Interface | `INT` | External I/O — protocols, ports, ICD seams (high-level here; full ICD in Phase 04). |
   | 7 | Constraint | `C` | Imposed limits — budget ceiling, mandated tech, schedule. *(problem+solution space)* |
   | 8 | Domain | `D` | Industry-specific compliance/standards (UL, IEC, DO, ISO). *(problem+solution space)* |
   | 9 | Safety | `SAF` | Hazard-mitigating behaviour — **only if a Safety/RAMS thread exists** (link to `HAZ-<nn>`). |

   For each: write a SMART one-liner using the 29148 template *"The `<subject>` shall `<action>` `<measurable condition/threshold>` `<under defined conditions/context>`."*; assign the next ID `REQ-<class>-<nn>` (zero-padded, stable for life — never renumber); capture **Source** (an `STK-<nn>` / `SN-<nn>` / regulation) and the parent **SN** it derives from.
5. **SMART-check every REQ (topic 4).** Verify each letter — **S**pecific (one behaviour), **M**easurable (number/threshold/observable event), **A**chievable (feasible vs tech limits), **R**elevant (traces to an SN/mission), **T**estable (a way to pass/fail it). If any letter fails, rewrite with the user. No non-SMART REQ enters the SyRS. Split double-barrelled REQs ("…AND…") into two.
6. **Prioritise (topic 5).** Assign every REQ **High / Medium / Low / N-A** (Conventions §5.2; MoSCoW alias Must→High, Should/Could→Medium, Won't→N-A). High = must-have for the system to function; N-A = not evaluated / pulled from document review. Use a survey-derived score if one exists.
7. **Resolve conflicts (topic 6).** Run a consistency pass; surface contradictory pairs (e.g. performance vs cost, security vs usability). For each conflict, negotiate a balance with the user using priority as the tie-breaker — **flag, don't auto-resolve**. Record the resolution + rationale.
8. **Define the measurement set — MOE/MOP/TPM (topic 7).** This is the authoritative home for the measurement definitions (Conventions §2.2):
   - **MOE-<nn>** — derive from **stakeholder needs (SN)**: mission-level "how well does it meet the need?", solution-independent (e.g. "sessions completed per day", "% coverage").
   - **MOP-<nn>** — derive from the **SyRS REQ**: system-level, solution-dependent, the measurable quantity a REQ pins (e.g. "p95 latency", "throughput Mbps"). Link each MOP to its REQ.
   - **TPM-<nn>** — **promote** selected MOPs that carry schedule/technical risk to TPMs with a **planned profile + threshold + margin**; these are tracked Phases 06–10 and challenged at every gate. Seed current/target/threshold; mark unknowns `TODO`.
9. **Seed verification method per REQ (topic 8).** Assign a **default** T/I/A/D per REQ (Conventions §4): **T**est for measurable thresholds, **I**nspection for compliance/document/review items, **A**nalysis for modelling/similarity, **D**emonstration for observe-the-behaviour. State clearly this is a *seed* — **Phase 07 is authoritative** and may change it. Leave `TC-VER-TBD` placeholders (resolved in Phase 07).
10. **Modes & states (topic 9).** Enumerate top-level modes (e.g. `Off / Boot / Idle / Active / Fault / Maintenance`) + transitions, reusing OpsCon scenarios. Becomes SyRS §8 and seeds the Phase-03 State Machine.
11. **Peer review / walkthrough (topic 10).** Run a structured **peer review** (Inspection) or author-led **walkthrough** of the requirement set with engineers/architects/testers *before* design. Capture flagged items + revisions. Record reviewers and date (this is the Inspection evidence for SRR).
12. **Assumptions & dependencies (topic 11).** Collect 4–8 (external standards, vendor SDKs, infra, certifications). Becomes SyRS §10.
13. **Write the SyRS & Traceability Matrix.** Emit `SysRS.md` (skeleton below) with Conventions §6 frontmatter (`Document ID: SyRS-<SLUG>-v1.0`, `Standard: ISO/IEC/IEEE 29148:2018`, `Status: Draft`). Emit `Traceability_Matrix.md` with the spine `SN → REQ → MOP → method → TC-VER-TBD`.
14. **Coverage & SMART pass check.** Print per-class REQ counts, the High/Med/Low/N-A split, any REQ flagged for revision, and confirm every REQ derives from an SN (orphan REQs and orphan SNs both fail). **Block "done" if any REQ is non-SMART or any SN is uncovered.**
15. **SRR exit gate.** Run the exit-gate checklist below. On pass, set status to `Baseline (SRR-approved <date>)` and establish the **Functional/Requirements baseline** (Conventions §3). If not yet reviewed, leave `Draft` and record `TODO: SRR scheduled <date>`.
16. **Handoff.** Print the SyRS + matrix paths, the coverage summary, and recommend `se-phase-03-modeling` to draw the SysML diagrams that *satisfy*/*verify* each REQ.

## Decision points
- **Which elicitation method?** Goal-driven: many stakeholders + need numbers → **survey**; depth/buy-in → **interview**; conflict/completeness → **workshop**; real behaviour → **observation**; implicit/regulatory → **document review**.
- **Constraint `C` vs Domain `D`?** A general imposed limit (budget, mandated tech, schedule) → `C`. A requirement that pins the system to an **industry-vertical standard** (UL 1023, IEC 62304, DO-178C, ISO 26262) → `D`.
- **Functional vs non-functional class?** Names a capability the system performs → `F`. Qualifies *how well* a capability runs → `P`/`O`/`U`/`SEC`. Don't file a quality attribute as functional.
- **Is it an MOE or an MOP?** Derives from a **need**, solution-independent, mission-level → **MOE**. Derives from a **REQ**, solution-dependent, system-level → **MOP**. Promote an MOP to **TPM** only if it carries technical/schedule risk worth tracking to a gate.
- **Which T/I/A/D seed?** Measurable threshold → **T**; examine artifact/code/doc without running it (incl. review) → **I**; calculation/model/similarity → **A**; operate-and-observe without instrumentation → **D**. Seed only — Phase 07 decides.
- **High vs Medium priority?** System cannot function without it → **High**. Important but has a workaround / nice-to-have → **Medium/Low**.

## Rules
- **Conform to [../../05_Conventions.md](../../05_Conventions.md)** for every ID, class letter, gate, T/I/A/D code, severity/priority, baseline, status string, and standard citation. Cross-reference the other phases rather than re-defining shared conventions.
- **One topic at a time.** Never dump all classes' or all topics' questions in one volley.
- **The worked example is a shape, not a fact source.** Do **not** copy its numbers, REQ counts, or thresholds — they are illustrative and the audit found errors in sibling phases.
- **Separate problem space from solution space.** Needs (StRS/SN, MOE) belong to Phase 01; the SyRS/REQ/MOP is solution space. Every REQ derives from an SN; never write a REQ with no parent need.
- **EARS is a real fallback** when a stakeholder can't phrase a REQ — use the matching EARS pattern, then SMART-check the result (it is not a substitute for SMART).
- **Method per REQ is a seed only.** State it; Phase 07 is authoritative.
- **No double-barrelled REQs; no vague verbs.** Replace "support/handle/fast/robust" with a measurable verb + number + condition.
- **Mark unknowns `TODO: <owed>`; never invent numbers.** Reuse Phase-01 stakeholders/needs as Sources; never re-ask.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [../../templates/](../../templates/) (`SysRS.md`, `Traceability_Matrix.md`, `TPM_Tracker.md` under `_cross_cutting/`).

### 1. `SysRS.md` — System Requirements Specification (ISO/IEC/IEEE 29148:2018)
```markdown
---
Document: System Requirements Specification — <Project Name>
Document ID: SyRS-<SLUG>-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (SyRS)
Status: Draft
Owner: Lead Systems Engineer
---

## 1. Introduction        (Purpose · Scope · Definitions · References)
## 2. System Overview     (tiers, top-level behaviour, context)
## 3. Functional Requirements        | ID | Statement | Source | SN | Priority | Method | MOP |
## 4. Usability Requirements          (REQ-U-*)
## 5. Performance Requirements        (REQ-P-*)
## 6. System Interfaces               (REQ-INT-* — high-level; full ICD in Phase 04)
## 7. System Operations               7.1 Operational/Reliability (REQ-O-*)  7.2 Security (REQ-SEC-*)
## 8. Constraints & Domain Requirements   (REQ-C-* , REQ-D-* ; + REQ-SAF-* if a safety thread exists)
## 9. Modes & States                  (enumeration + transition table — seeds Phase 03)
## 10. Measures of Effectiveness & Performance  (MOE-* derived from SN; MOP-* derived from REQ; promoted TPM-*)
## 11. Verification (seed)            | Req ID | Method (T/I/A/D, seeded) | Verifying Activity (TC-VER-TBD) |
## 12. Assumptions & Dependencies
## 13. Requirements Engineering Record  (elicitation methods used; conflicts + resolutions; peer-review minutes/date)
```
> **Section skeleton reconciliation:** §3–§8 carry the REQ classes; §10 is the measurement set; §13 captures the front-half (elicitation/conflict/review) the audit said was missing. Adjust depth per the SEMP tailoring level — Minimum-Viable may fold §4–§7 into one "Quality Requirements" table; record any fold as "tailored: <reason>".

### 2. `Traceability_Matrix.md` — StRS→SyRS thread (standalone if >30 REQs)
```markdown
| SN (StRS) | REQ ID | Statement (abbrev.) | Class | Priority | MOP | Method (seed) | Verifying Activity |
|-----------|--------|---------------------|-------|----------|-----|---------------|--------------------|
| SN-01 | REQ-F-01 | … | F | High | MOP-01 | T | TC-VER-TBD |
```
Forward (SN→REQ→…→test) and backward (test→…→SN) both maintained. Bidirectional is **mandatory** for safety-critical/regulated work (DO-178C, ISO 26262, IEC 62304).

### 3. Measurement set (lands in SyRS §10 and `_cross_cutting/TPM_Tracker.md`)
```markdown
| MOE-<nn> | derived from SN-<nn> | mission-level metric | target | unit |
| MOP-<nn> | derived from REQ-<id> | system-level metric  | target | threshold | unit |
| TPM-<nn> | promoted from MOP-<nn> | planned-vs-current profile | current | target | threshold | margin |
```

## AI prompt pack
**Elicitation (probe one StRS cluster).**
> "Acting as a requirements analyst, here is stakeholder need <SN-nn> and its OpsCon scenario <SCN-nn>. Generate 6 open-ended interview questions and 3 observation/document-review prompts that would surface the *non-functional and implicit* requirements behind this need (performance, reliability, security, offline/interoperability assumptions, regulatory). Do not propose solutions."

**Generation (draft SMART REQs for one class).**
> "Convert these raw needs into SMART system requirements of class <F/P/SEC/…>. Use the 29148 template 'The <subject> shall <action> <measurable condition> <under defined conditions>.' Assign IDs REQ-<class>-NN. For each: cite the parent SN, propose a priority (High/Med/Low), seed a T/I/A/D method, and name the MOP it pins. Flag any need too vague to make SMART and ask me for the missing number — never invent one."

**Measurement derivation.**
> "From this StRS need set, derive candidate MOEs (mission-level, solution-independent). Then from this SyRS REQ set, derive MOPs (system-level) and recommend which 3–5 should be promoted to TPMs because they carry technical/schedule risk. Output the three tables in the §10 shape."

**Critique / red-team (challenge the spec before SRR).**
> "Red-team this SyRS. Find: (1) any REQ that fails a SMART letter, (2) double-barrelled or vague-verb REQs, (3) contradictory pairs (perf↔cost, security↔usability), (4) SNs with no covering REQ and REQs with no parent SN, (5) missing non-functional/implicit/domain requirements a reviewer would expect for this domain, (6) MOPs with no REQ. Return a table: finding | severity | which REQ/SN | fix."

## Research & specialised-agent triggers
- **Recommend WEB RESEARCH when:** a `D` (domain) requirement cites a standard (UL/IEC/DO/ISO) — look up the **current edition, clause, and acceptance criteria**; a regulatory/compliance need is in scope (GDPR, HIPAA, PCI-DSS, RoHS/WEEE, accessibility WCAG) — confirm the binding obligation; you need **comparable-system benchmarks** to sanity-check a threshold (what p95 latency / MTBF / throughput is realistic); or you're choosing a **requirements-management tool** (DOORS, Jama, Helix RM, ReqView) — compare lifecycle/compliance fit.
- **Spawn a SPECIALISED AGENT when:** elicitation spans **many stakeholders** (parallel interview-synthesis agents, one per stakeholder group, merged into one need set); the system is **safety-critical/regulated** (a standards-compliance agent to map every `D`/`SAF` REQ to its clause and acceptance criteria); or the REQ set is **large** (a SMART-and-traceability audit agent to run the red-team prompt at scale and return a coverage report).

## Cross-cutting hooks
Links to [../../cross-cutting/](../../cross-cutting/).
- **Measurement (MOE/MOP/TPM)** — *this phase is the source.* Defines MOEs from SN, MOPs from REQ, promotes TPMs into [`TPM_Tracker.md`](../../cross-cutting/Measurement_MOE_MOP_TPM.md); Phases 06–10 track margins to gates.
- **Risk & Opportunity** — *consumes* open `RSK-<nn>`; requirements mitigating a risk are tagged so closure is traceable. Conflicts that can't be balanced become new risks. → [`Risk_and_Opportunity_Management.md`](../../cross-cutting/Risk_and_Opportunity_Management.md).
- **Safety / RAMS** — if a hazard log exists, write `REQ-SAF-*` linked to `HAZ-<nn>` and allocate reliability/availability targets as `O` REQs. → [`Safety_RAMS_Engineering.md`](../../cross-cutting/Safety_RAMS_Engineering.md).
- **Security** — `REQ-SEC-*` consume `THR-<nn>` from the threat model; control-selection REQs cite ISO 27001 / NIST 800-53. → [`Security_Engineering.md`](../../cross-cutting/Security_Engineering.md).
- **HSI** — `REQ-U-*` carry human-factors/training/accessibility targets. → [`Human_Systems_Integration.md`](../../cross-cutting/Human_Systems_Integration.md).
- **Configuration Mgmt** — the SyRS + matrix become the **Functional/Requirements baseline** at SRR; changes only via `CR-<nn>` (Phase 09). → [`Configuration_Management.md`](../../cross-cutting/Configuration_Management.md).
- **Cost/Schedule** — `REQ-C-*` budget/schedule ceilings feed Phase-05 trade-offs and estimation. → [`Cost_Schedule_EVM.md`](../../cross-cutting/Cost_Schedule_EVM.md).
- **Quality** — SMART pass + peer-review record are the QA gate evidence for SRR. → [`Quality_Assurance.md`](../../cross-cutting/Quality_Assurance.md).

## Standards anchor
This phase realises the **ISO/IEC/IEEE 15288:2023 System Requirements Definition** technical process. It produces the **SyRS** of the **ISO/IEC/IEEE 29148:2018** document set (BRS · StRS · **SyRS** · SRS · OpsCon) — the SyRS is the system-level requirements specification (the StRS, owned by Phase 01, is the stakeholder-level one; **IEEE 830-1998** was rolled into 29148 — cite 29148, mention 830 only as history). SMART/verifiability criteria and the requirement template follow 29148 §5; measurement (MOE/MOP/TPM) follows **INCOSE SE Handbook v5 (2023)** and **NASA/SP-2016-6105 Rev 2**. Canonical citation forms: [../../05_Conventions.md §9](../../05_Conventions.md).

## Exit-gate checklist (SRR)
- [ ] Every REQ passes all five **SMART** letters (no non-SMART REQ remains).
- [ ] Every REQ uses a Conventions §2.1 class code and a stable, zero-padded `REQ-<class>-<nn>` ID.
- [ ] Every REQ derives from an `SN-<nn>` (no orphan REQs); every `SN-<nn>` is covered by ≥1 REQ (no uncovered needs).
- [ ] Every REQ has a **priority** (High/Med/Low/N-A) and a **seeded** T/I/A/D method with a `TC-VER-TBD` placeholder.
- [ ] **MOE/MOP/TPM** set defined: MOEs from SN, MOPs from REQ, TPMs promoted with threshold + margin.
- [ ] All identified **conflicts resolved or recorded** (with rationale + priority tie-break).
- [ ] **Peer review / walkthrough** completed; reviewers + date recorded in SyRS §13.
- [ ] **Constraint (`C`) and Domain (`D`)** requirements captured; each `D` cites a verified standard edition/clause.
- [ ] Forward **and** backward traceability present (bidirectional if safety-critical/regulated).
- [ ] SyRS frontmatter set; on sign-off status → `Baseline (SRR-approved <date>)`; **Functional/Requirements baseline** established.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Jumped straight to writing REQs. | Skipped elicitation/analysis front-half. | Run topics 2–3 (methods, raw needs, implicit-requirement probe) before classifying. |
| Two requirements jammed into one. | "and/also" in the statement. | Split — one observable behaviour per REQ. |
| Untestable adjective ("fast/robust/intuitive"). | No measurable threshold/condition. | Replace with number + condition; SMART-check. |
| REQ with no parent need. | Solution invented ahead of the problem. | Trace to an `SN`; if none exists, mark `TODO: stakeholder validation` or drop it. |
| `SN` with no covering REQ. | Coverage gap. | Add a REQ or record the need as out-of-scope with rationale. |
| MOE and MOP conflated. | Mixed problem/solution space. | MOE = from need (solution-independent); MOP = from REQ (solution-dependent). |
| Regulatory item filed as `C`. | Confused general limit with vertical standard. | If it pins an industry standard (UL/IEC/DO/ISO) → `D`; else `C`. |
| Conflicts auto-resolved silently. | Skipped negotiation. | Flag the pair, negotiate by priority, record resolution — don't decide for the stakeholder. |
| Method treated as final. | Forgot Phase 07 owns it. | Label the T/I/A/D as a seed; leave `TC-VER-TBD`. |
| Copied the worked example's numbers. | Used it as a fact source. | It's a shape only; derive your own thresholds from this project's needs. |

## References
- [../../05_Conventions.md](../../05_Conventions.md) — IDs (§2), gates/baselines (§3), T/I/A/D (§4), priority (§5.2), status (§6), traceability spine (§8), citations (§9), folder layout (§10).
- [../../01_Workflow_Overview.md](../../01_Workflow_Overview.md) — V-model pairing, problem-vs-solution space (§5), 15288 System Requirements Definition mapping.
- KB: [Eliciting & Analyzing Requirements](../../../Systems-Engineering-KB/topics/05-requirements-elicitation-analysis/fundamentals.md), [Verifying Requirements](../../../Systems-Engineering-KB/topics/06-verifying-requirements/fundamentals.md), [Requirements Management](../../../Systems-Engineering-KB/topics/07-requirements-management/fundamentals.md).
- [../../worked_example/Phase_02_Requirements/](../../worked_example/Phase_02_Requirements/) — worked SyRS for **structural** reference only (do not copy its numbers).
- Related phases: [se-phase-01-concept](../se-phase-01-concept/) (StRS/OpsCon/SN inputs) · [se-phase-03-modeling](../se-phase-03-modeling/) (satisfy/verify the REQs) · [se-phase-07-verification](../se-phase-07-verification/) (authoritative T/I/A/D + TC-VER) · [se-phase-09-change-config](../se-phase-09-change-config/) (re-baseline via CR).

</supporting-info>
