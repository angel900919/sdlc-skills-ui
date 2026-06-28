# Standards & Frameworks Map

> Where every recognised SE standard and framework lives in this workflow. The spine is **ISO/IEC/IEEE 15288:2023** (lifecycle processes), interpreted through the **INCOSE SE Handbook v5 (2023)** and **NASA/SP‑2016‑6105 Rev 2** (practitioner guidance). Everything else hangs off specific stages and threads. Canonical citation forms are fixed in [Conventions §9](05_Conventions.md).

---

## 1. The three spine references

| Reference | What it gives this workflow |
|---|---|
| **ISO/IEC/IEEE 15288:2023** | The process architecture: four process groups (Agreement, Organizational Project‑Enabling, Technical Management, Technical). The 12 stages instantiate the **Technical** processes; the 8 threads instantiate **Technical Management**; Stage 00 frames **Agreement** + **Org‑Enabling**. |
| **INCOSE SE Handbook v5** | Method depth and good practice for each process — how to actually *do* stakeholder needs, architecture, V&V, trade studies, measurement. The "how" behind the 15288 "what". |
| **NASA/SP‑2016‑6105 Rev 2** | The 17 common technical processes, the life‑cycle **review** ladder (MCR/SRR/PDR/CDR/TRR/…), technical measurement (TPM/MOE/MOP), and risk‑informed decision making — the basis of this workflow's gate model. |

---

## 2. 15288 process group → where it lives

| 15288 group | Processes | Home in this workflow |
|---|---|---|
| **Agreement** | Acquisition, Supply | **Stage 00** (framed; org‑procurement depth sourced from the acquirer) |
| **Organizational Project‑Enabling** | Life‑cycle model mgmt, Infrastructure, Portfolio, Human resource, Quality mgmt, Knowledge mgmt | **Stage 00** + **Quality** thread (+ Knowledge capture in Stage 11); portfolio/HR flagged org‑level |
| **Technical Management** | Project planning, Assessment & control, Decision mgmt, **Risk mgmt**, **Configuration mgmt**, Information mgmt, **Measurement**, **Quality assurance** | The **8 cross‑cutting threads** + Stage 05 (Decision) + Stage 09 (Config/Information) |
| **Technical** | Mission analysis → Disposal (14 processes) | The **12 stages**, 1:1 (see [Overview §3](01_Workflow_Overview.md)) |

---

## 3. Standard → stage/thread map

| Standard / framework | Governs | Applied in | Citation |
|---|---|---|---|
| **ISO/IEC/IEEE 15288:2023** | Lifecycle processes | whole workflow | spine |
| **INCOSE SE Handbook v5** | SE method/good practice | whole workflow | spine |
| **NASA/SP‑2016‑6105 Rev 2** | Technical processes, reviews, measurement | whole workflow + gates | spine |
| **ISO/IEC/IEEE 29148:2018** | Requirements engineering — BRS/StRS/**SyRS**/SRS/OpsCon | Stage 01 (StRS, OpsCon), Stage 02 (SyRS) | §9 |
| **INCOSE Guide to Writing Requirements (GtWR)** | Requirement quality rules | Stage 02 | — |
| **ISO/IEC/IEEE 42010:2022** | Architecture description (stakeholders→concerns→viewpoints→views) | Stage 04 | §9 |
| **TOGAF ADM / Zachman / NIST EA / C4 / arc42** | Architecture frameworks (complementary, not exclusive) | Stage 04 | — |
| **OMG SysML (v1.x; v2 forward‑note)** | System modeling language | Stage 03 | — |
| **IEEE 1012‑2016** | V&V planning, integrity levels, Independent V&V | Stages 07–08, V&V thread | §9 |
| **ISO/IEC/IEEE 29119‑3:2021** | Test documentation (supersedes IEEE 829) | Stage 08 | §9 |
| **ISO 31000:2018** | Risk management | Risk thread (all stages) | §9 |
| **ISO 10007:2017 / IEEE 828 / EIA‑649** | Configuration management | Stage 09, CM thread | §9 |
| **ISO 9001:2015** | Quality management | Quality thread | §9 |
| **ANSI/EIA‑748 (EVM)** | Earned value / project controls | Cost/Schedule thread | — |
| **ISO/IEC 27001:2022 · NIST 800‑53r5 · 800‑160** | Security controls & engineering | Security thread, Stage 04 | §9 |
| **STRIDE / SBOM (e.g. SPDX, CycloneDX)** | Threat modeling, supply‑chain security | Security thread, Stages 03/04/06 | — |
| **NIST SP 800‑88 Rev 1** | Secure media sanitization | Stage 11 | §9 |
| **COCOMO / COCOMO II** | Software effort estimation | Stage 05, Cost thread | — |
| **FMEA / FTA** | Failure & fault analysis | Safety/RAMS thread | — |

---

## 4. Domain / safety‑critical overlays

Engage the matching standard when the domain demands it (see the [Tailoring Guide §4](04_Tailoring_Guide.md)). These raise V&V rigour, mandate bidirectional traceability, and add a safety case:

| Domain | Standard | Triggers |
|---|---|---|
| Airborne software | **DO‑178C** (+ DO‑254 hardware) | avionics, anything flight‑certified |
| Automotive functional safety | **ISO 26262** | road‑vehicle E/E systems |
| Medical device software | **IEC 62304** (+ ISO 14971 risk, IEC 60601) | clinical/medical devices |
| General functional safety | **IEC 61508** | industrial, process, machinery safety |
| Payments | **PCI‑DSS 4.0** | card data handling |
| Privacy | **GDPR / CCPA** | personal data; right‑to‑erasure in Stage 11 |
| Product‑specific marks | **UL / CE / FCC / IEC** product standards | the specific device class (look up per project) |

---

## 5. How to add a standard for your project

1. Identify the governing standard in **Stage 00/01** (the AI recommends [web research](02_AI_Systems_Engineer_Protocol.md#5) to confirm the *current* edition and applicability).
2. Add it to the project's `SEMP.md` (Stage 00) and the SysRS **References** section, and raise the matching **Domain (`D`)** or **Constraint (`C`)** requirements.
3. Map its clauses to the stages/threads they touch (use this table as the model).
4. If it's safety/security, escalate the corresponding thread per the [Tailoring Guide](04_Tailoring_Guide.md) and add it to the gate‑review criteria.

> **Don't cite from memory.** Standards revise. The AI confirms the current designation/edition before a project relies on it, and records the version in the SEMP.
