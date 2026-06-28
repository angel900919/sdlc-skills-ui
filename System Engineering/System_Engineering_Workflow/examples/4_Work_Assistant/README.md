---
Document: Aria — AI-Powered Personal Work Assistant — System-at-a-Glance
Document ID: README-ARIA-v1.0
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---

# Aria — AI-Powered Personal Work Assistant

> **Mission.** Give every employee one trustworthy place to see and act across their Microsoft Outlook (email + calendar), HubSpot CRM, Atlassian JIRA, and Therefore document management — and an AI chat assistant that does the busywork (triage and summarize email, draft replies, create/update JIRA issues, look up and update HubSpot contacts/deals, find and file documents, and run cross-system workflows) **while the human stays in control of every write**.

Aria is a **software + LLM/agentic** system. The AI chat/agent is a **first-class component** with its own requirements, decisions, risks, threats, and V&V. The engineering spine is built around four hard problems: **per-user least-privilege identity** to four systems, **AI action-safety** (grounding + human-in-the-loop write confirmation + prompt-injection defense + audit), **privacy/security** of email and CRM PII, and **graceful degradation** when an upstream is down.

## Standards it must meet (canonical forms per Conventions §9)

| Domain | Citation |
|---|---|
| SE lifecycle | ISO/IEC/IEEE 15288:2023 |
| Requirements | ISO/IEC/IEEE 29148:2018 (BRS · StRS · SyRS · OpsCon) |
| Architecture | ISO/IEC/IEEE 42010:2022 |
| V&V | IEEE 1012-2016 |
| Test docs | ISO/IEC/IEEE 29119-3:2021 |
| Risk | ISO 31000:2018 |
| Config mgmt | ISO 10007:2017 (+ IEEE 828) |
| Security controls | ISO/IEC 27001:2022 · NIST SP 800-53 Rev. 5 · NIST SP 800-160 |
| Privacy / data protection | GDPR (Reg. (EU) 2016/679) — Arts. 5, 15, 17, 25, 30, 32, 35 |
| Identity | OAuth 2.0 (RFC 6749) · OIDC 1.0 · RFC 9700 (OAuth security BCP) |
| Practitioner | INCOSE SE Handbook v5 (2023) · NASA/SP-2016-6105 Rev 2 |

Aria carries no DO-178C/ISO 26262/IEC 62304 obligation (not safety-of-life); "Safety" here is **AI-action safety** — irreversible-action prevention — tracked as a hazard thread (HAZ-*) with SAF requirements.

## Lifecycle model — Agile (tailored Standard+)

Agile (2-week sprints, continuous delivery) governs the whole system; **Formal control is overlaid on the identity, privacy/security, and AI-action-safety tracks** (frozen ICDs, threat model, eval-gated releases, change control on model/prompt). Rationale: scope evolves rapidly with model capability and connector APIs, but the trust boundaries and write-action gates cannot regress. See Phase 01 `Concept.md` and Conventions §3 for the gate ladder.

## Phase index (Phase 00–11)

| Phase | Deliverable(s) | Gate | Status |
|---|---|---|---|
| 00 Agreement | Agreement_Register · SEMP · Enablement_Plan | ATP | TODO |
| **01 Concept** | [`Phase_01_Concept/Concept.md`](Phase_01_Concept/Concept.md) (mission · STK · SN · SCN · MOE · RSK · feasibility) | MCR | **Drafted** |
| **02 Requirements** | [`Phase_02_Requirements/SysRS.md`](Phase_02_Requirements/SysRS.md) (REQ-* · MOP/TPM · modes · trace) | SRR | **Drafted** |
| 03 Modeling | 7-of-9 SysML PlantUML + Requirements_Diagram | Model coverage | TODO |
| 04 Architecture | Architecture_Description · ICD (4 connectors + RAG/agent layer + trust boundaries) · Tech_Stack_Rationale | PDR | TODO |
| 05 Trade-off | Decision_Matrices · Decision_Register (LLM choice · RAG · build-vs-buy) | Decisions traced | TODO |
| 06 Integration | Integration_Plan (increments, connector mocks, eval harness in CI) | CDR | TODO |
| 07 Verification | Verification_Matrix · V&V Plan (eval sets, injection tests, action-safety) | TRR | TODO |
| 08 Validation | Test_Plan · Test_Cases (red-team, human-acceptance, productivity) | PRR | TODO |
| 09 Change & Config | Change/Config Mgmt Plans · CR log (model/prompt change control) | Baselines current | TODO |
| 10 Operations | Operations_Continuous_Validation · SLOs · runbooks (AI-action observability, eval regression, drift) | ORR → GA | TODO |
| 11 Disposal | Disposal_Plan (token revocation, memory/history sanitization, GDPR erasure) | DRR | TODO |

## Traceability spine — representative threads

The golden thread (Conventions §8) is `SN ──derive──▶ REQ ──satisfy──▶ design block ──verify──▶ TC`. Sample threads carried by this example:

| # | Need (SN) | Requirement (REQ) | Design block | Verification (seed) |
|---|---|---|---|---|
| 1 | SN-04 *no write happens without my OK* | REQ-SAF-01 (HITL write confirm) + REQ-F-09 | Agent Orchestrator · Action-Confirmation Gate | TC-VER-TBD (action-safety eval) |
| 2 | SN-05 *answers grounded in my real data* | REQ-F-06 (RAG grounding) + REQ-P-05 (groundedness) | RAG Retrieval Service · Citation layer | TC-VER-TBD (groundedness eval set) |
| 3 | SN-03 *content can't hijack the assistant* | REQ-SEC-07 (injection defense) | Untrusted-Content Sandbox · Tool Guardrails | TC-VER-TBD (injection red-team suite) |
| 4 | SN-02 *only ever see what I may see* | REQ-SEC-02/-03 (delegated least-privilege, per-user isolation) | Identity/Token Broker · Per-user scope filter | TC-VER-TBD (isolation pen-test) |
| 5 | SN-07 *one upstream down ≠ Aria down* | REQ-O-03 (graceful degradation) | Connector Gateway · Circuit breakers | TC-VER-TBD (chaos/fault-injection) |
| 6 | SN-08 *every AI action is auditable* | REQ-SEC-06 (action audit log) | Audit Log Service | TC-VER-TBD (audit completeness inspection) |

Full SN→REQ→TC matrix lives in `Phase_02_Requirements/SysRS.md` §14 and (once modeled) `Phase_03_Modeling/Requirements_Diagram.puml`.
