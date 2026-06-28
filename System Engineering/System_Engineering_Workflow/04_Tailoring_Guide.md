# Tailoring Guide — right‑size the rigour

> Full INCOSE‑grade systems engineering on a two‑person prototype is malpractice in the other direction — you drown a small effort in ceremony. ISO/IEC/IEEE 15288 **requires** tailoring: apply the processes "to the extent appropriate." This guide tells you how much of the workflow to run, and records the decision so an auditor (or future you) can see *why*.

---

## 1. The tailoring dimensions

Score your project on these five axes — they drive the profile in §2.

| Dimension | Low ↔ High |
|---|---|
| **Size / complexity** | one component, one team ↔ many subsystems, many teams, long horizon |
| **Criticality** | inconvenience if it fails ↔ safety‑of‑life, irreversible loss, large financial/legal exposure |
| **Regulatory regime** | none ↔ certified/regulated (medical, avionics, automotive, finance, defence) |
| **Novelty / uncertainty** | well‑understood, proven tech ↔ first‑of‑kind, research, unproven tech |
| **Contract / governance** | internal, informal ↔ external acquirer, formal acceptance, audited |

> **Heuristic:** **Criticality and regulatory regime dominate.** A small but safety‑critical device (infusion pump) is *Formal* despite its size. A large but low‑criticality internal tool can stay *Standard*.

---

## 2. Three reference profiles

| | **Minimum‑Viable (MV)** | **Standard** | **Formal** |
|---|---|---|---|
| Fits | prototypes, internal tools, small low‑risk software | most commercial products, mixed HW/SW | safety‑critical, regulated, large/contracted |
| Stages run | 01, 02, 04, 06–08, 10 (00/03/05/09/11 folded in) | 00–11, lightly | **all 00–11, fully** |
| Requirements | SysRS only (StRS folded into Concept) | StRS + SysRS | StRS + OpsCon + SysRS, baselined |
| Modeling | sketch 2–3 diagrams | 7‑diagram set | 7(+Package/Parametric), live MBSE model |
| Traceability | forward only, in one doc | forward + backward | **bidirectional, tool‑enforced** |
| Gates | informal self‑review | lightweight reviews | **formal review boards (SRR…DRR)** |
| V&V | test + demo | T/I/A/D matrix | T/I/A/D + **Independent V&V** (IEEE 1012) |
| Cross‑cutting threads | as checklists | living registers, reviewed at major gates | full registers, reviewed at **every** gate |
| Change control | git history + PR review | CR log + lightweight CCB | formal CCB + CM audits (FCA/PCA) |
| Documentation | README + the few artifacts | the artifact set | full set + audit/evidence packs |

A project may be **mixed**: e.g. *Formal* on the safety‑critical firmware track and *Standard* on the companion mobile app — this is exactly the Hybrid lifecycle model. Record the per‑track profile.

---

## 3. Per‑thread "when is it mandatory?"

The eight cross‑cutting threads are never *removed*, only *scaled*. Use this to decide depth:

| Thread | Always (even MV) | Escalates to full when… |
|---|---|---|
| **Risk & Opportunity** | a top‑5 risk list | high novelty/uncertainty → full living register + burndown |
| **Configuration Mgmt** | version control + tagged releases | multiple baselines/teams → full CM plan + FCA/PCA |
| **Safety / RAMS** | a one‑line "is anyone harmed if this fails?" check | **any** safety impact → hazard log + safety case (DO‑178C/ISO 26262/IEC 62304) |
| **Security** | dependency scan + secrets hygiene | sensitive data / external attack surface → threat model + control set (27001/800‑53) |
| **HSI** | usability sanity check | human‑in‑the‑loop operation, training, staffing → full HSI |
| **Measurement (TPM)** | track the 2–3 numbers that matter | contracted performance / tight margins → full MOE/MOP/TPM tracking |
| **Cost / Schedule** | a rough estimate | external contract / large budget → WBS + EVM (CPI/SPI) |
| **Quality** | PR review discipline | regulated / certified → QA plan + process audits (ISO 9001) |

> **The safety/security floor is non‑negotiable.** Even a prototype gets the one‑line safety check and basic security hygiene. If the answer to "can this harm someone or leak sensitive data?" is yes, you are at least *Standard* on that thread regardless of size.

---

## 4. Domain overlays

Stack these on top of a base profile:

- **Safety‑critical (medical / avionics / automotive / industrial):** Formal V&V, bidirectional traceability, hazard analysis + safety case, the relevant standard (IEC 62304 / DO‑178C / ISO 26262 / IEC 61508), independent review. Disposal includes decommissioning safety.
- **Regulated data (health / finance / consumer privacy):** security thread to full (ISO 27001 / NIST 800‑53), privacy‑by‑design, data‑residency requirements, GDPR/CCPA right‑to‑erasure in Disposal, audit evidence packs.
- **Physical / hardware:** add explicit Production/manufacturing readiness at PRR (first‑article inspection, supply chain), HIL in integration, RoHS/WEEE + spares/obsolescence in Disposal.
- **Consumer / SaaS software:** Agile lifecycle, Operations thread to full (SLOs, observability, continuous validation), feature‑flag/rollback in change control; MV/Standard elsewhere.
- **Research / prototype / PoC:** MV everything; the goal is to *retire uncertainty*, so the Risk thread and a Spiral lifecycle dominate; explicitly defer formalisation to "if it graduates to a product."

---

## 5. Quick profile picker

Answer these; take the **highest** profile any answer triggers:

1. Can a failure injure someone, cause irreversible loss, or large legal/financial harm? → **Formal**
2. Is it certified/regulated, or delivered under an external contract with formal acceptance? → **Formal**
3. Multiple subsystems/teams, or a horizon > ~6 months? → at least **Standard**
4. Handles sensitive/personal data or has an external attack surface? → security thread **Standard+**, base at least **Standard**
5. None of the above, small and internal? → **Minimum‑Viable**

---

## 6. Record the decision (tailoring log)

Tailoring is itself an auditable engineering decision. Capture it once, in `Phase_00_Agreement/SEMP.md` (or the project README for MV), as a short table:

| Stage / artifact / thread | Profile applied | Tailored out? | Rationale |
|---|---|---|---|
| Stage 03 Modeling | MV — 3 diagrams | Package & Parametric diagrams | small, well‑understood structure |
| Safety/RAMS thread | Full | — | Class C medical device (IEC 62304) |
| Stage 11 Disposal | Standard | environmental section | pure‑software, no hardware to recycle |

> **Never silently skip.** A tailored‑out artifact is *recorded* with a reason, not omitted. That single discipline is the difference between "right‑sized" and "cut corners."

---

*The [AI Systems Engineer Protocol §8](02_AI_Systems_Engineer_Protocol.md) makes the AI ask the §1 questions at kickoff and apply the matching profile automatically — and re‑propose it if criticality changes mid‑project.*
