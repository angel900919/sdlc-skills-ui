---
Document: System Requirements Specification — Aria AI-Powered Personal Work Assistant
Document ID: SyRS-ARIA-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (SyRS)
Status: Draft
Owner: Lead Systems Engineer
---

# System Requirements Specification — Aria

> **Source of truth for all later phases.** Every REQ has a stable, zero-padded ID (Conventions §2.1), a Source traced to an `SN-*` (Phase 01 `Concept.md` §5), a seeded T/I/A/D method (Conventions §4; **seed only — Phase 07 is authoritative**), and an MOP/TPM where measurable. Verification activities are `TC-VER-TBD` (resolved Phase 07). Exit gate: **SRR** (Conventions §3).

## 1. Introduction

### 1.1 Purpose
Specify the system-level requirements for **Aria**, an AI-powered personal work assistant that unifies each employee's Microsoft Outlook (email + calendar), HubSpot CRM, Atlassian JIRA, and Therefore document management into one dashboard plus an AI chat/agent, with human-in-the-loop control of all write actions.

### 1.2 Scope
Covers the unified dashboard, the AI chat/agent (RAG grounding, tool-calling, action-confirmation), the four system connectors, identity/token management, audit, and privacy/security controls. The four connected systems remain the systems of record; Aria does not replace them. Out-of-scope items per Concept §3.

### 1.3 Definitions
- **Agent** — the LLM-driven orchestrator that plans and calls allow-listed tools.
- **RAG** — Retrieval-Augmented Generation: grounding responses in the user's own retrieved data.
- **HITL** — Human-in-the-loop; here, explicit per-action write confirmation.
- **Tool** — an allow-listed function the agent may call (read/write against a connector).
- **Write action** — any operation that creates, modifies, sends, files, or deletes data in a connected system.
- **Delegated scope** — an OAuth scope granted by the employee, bounding what Aria may do as that employee.
- **Untrusted content** — any text Aria ingests from email/document/CRM that is data, not instructions.

### 1.4 References
ISO/IEC/IEEE 29148:2018; 42010:2022; ISO/IEC 27001:2022; NIST SP 800-53 Rev. 5; OAuth 2.0 (RFC 6749) / OIDC 1.0 / RFC 9700; GDPR Arts. 5, 15, 17, 25, 30, 32, 35. Upstream APIs: Microsoft Graph, HubSpot CRM API, Atlassian/JIRA Cloud REST, Therefore API. Canonical forms per Conventions §9.

---

## 2. System Overview

Aria is a four-tier software + agentic system:

1. **Client** — web dashboard + AI chat UI (the only human-facing surface).
2. **Application** — Dashboard Aggregation Service; **Agent Orchestrator** (planning, tool-calling, Action-Confirmation Gate); **RAG Retrieval Service** (index + grounding + citations); Audit Log Service.
3. **Integration** — Connector Gateway with four connectors (Outlook/Graph, HubSpot, JIRA, Therefore); Identity/Token Broker.
4. **Trust boundary** — every byte of email/document/CRM content is treated as untrusted input; all writes pass the Action-Confirmation Gate; all access is bounded by per-user delegated scopes.

Aria operates **read-first**: reads are grounded and cited; **no write executes without human confirmation**; a single upstream outage degrades only that source.

---

## 3. Functional Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-F-01** | Aria shall render a single unified dashboard presenting the signed-in employee's Outlook mail + calendar, assigned JIRA issues, owned HubSpot contacts/deals, and recent Therefore documents in one view. | STK-01 | SN-01 | High | D | — |
| **REQ-F-02** | Aria shall refresh each dashboard panel to reflect the source system's state no more than 60 s stale under nominal connectivity, and shall display each panel's last-refresh timestamp. | STK-01 | SN-01 | High | T | MOP-01 |
| **REQ-F-03** | The AI chat assistant shall accept a natural-language request and return either a grounded answer or a proposed action plan referencing the employee's connected data. | STK-01 | SN-06 | High | D | — |
| **REQ-F-04** | Aria shall triage and summarize the employee's email, producing a prioritized summary in which every stated fact cites the source message it came from. | STK-01 | SN-05, SN-06 | High | T | MOP-04 |
| **REQ-F-05** | Aria shall draft email replies, JIRA issues, and HubSpot contact/deal/note records as **proposals** that the employee can edit before any execution. | STK-01 | SN-04, SN-06 | High | D | — |
| **REQ-F-06** | The AI assistant shall ground every substantive response in content retrieved from the employee's connected data (RAG) and shall return a citation for each asserted fact; ungroundable claims shall be withheld or flagged as unverified. | STK-08 | SN-05 | High | T | MOP-04 |
| **REQ-F-07** | Aria shall execute cross-system workflows (e.g., create a JIRA issue from an email and log the contact in HubSpot) as an ordered set of individually-confirmed actions. | STK-01 | SN-01, SN-06 | High | D | — |
| **REQ-F-08** | The agent shall invoke only tools on the per-tenant allow-list; any out-of-allow-list tool request shall be refused and logged. | STK-04 | SN-03 | High | T | MOP-06 |
| **REQ-F-09** | Aria shall present every proposed write action to the employee with a human-readable preview (and, where applicable, a before/after diff) and shall execute it only after the employee's explicit confirmation. | STK-01, STK-04 | SN-04 | High | T | MOP-05 |
| **REQ-F-10** | Aria shall let the employee cancel or modify any pending proposed action before confirmation, with no side effect on the connected systems until confirmation. | STK-01 | SN-04 | High | D | — |
| **REQ-F-11** | Aria shall find and file documents in Therefore, returning the document's identifier and storage location on success. | STK-01 | SN-06 | Medium | D | — |
| **REQ-F-12** | When a connected system is unavailable, Aria shall continue serving the available systems and shall mark the unavailable source with a clear degraded-state indicator and last-known-good timestamp. | STK-07 | SN-07 | High | T | MOP-08 |

---

## 4. Usability Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-U-01** | A first-time employee shall complete a representative cross-system task (e.g., email→JIRA issue) without external help in ≤ 3 minutes for ≥ 90% of users in usability testing. | STK-01 | SN-10, SN-06 | High | T | MOP-09 |
| **REQ-U-02** | The web UI shall conform to WCAG 2.2 Level AA. | STK-01 | SN-10 | Medium | I | — |
| **REQ-U-03** | For any proposed write, the confirmation surface shall make the target system, the exact change, and its reversibility unambiguous before the employee can confirm. | STK-01, STK-04 | SN-04, SN-10 | High | I | — |
| **REQ-U-04** | Aria shall display a persistent, plain-language notice of which systems it can access and that it acts only on the employee's behalf (transparency, no covert monitoring). | STK-09 | SN-14 | Medium | I | — |

---

## 5. Performance Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-P-01** | The dashboard shall render its first complete cross-system view within 3 s (p95) after authenticated load under nominal connectivity. | STK-01 | SN-01 | High | T | MOP-01 |
| **REQ-P-02** | The AI assistant shall return the first token of a chat response within 3 s (p95) and complete a typical grounded answer within 10 s (p95). | STK-01 | SN-06 | Medium | T | MOP-02 |
| **REQ-P-03** | The platform shall sustain 5,000 concurrent active users with chat p95 end-to-end latency ≤ 10 s and dashboard p95 ≤ 3 s. | STK-07 | SN-01, SN-06 | Medium | T | MOP-03 |
| **REQ-P-04** | The agent shall route each task to a model tier (hardest-reasoning / balanced / fast) by task class, keeping ≥ 90% of routine tasks off the highest-cost tier. | STK-02 | SN-13 | Medium | A | MOP-10 |
| **REQ-P-05** | The grounded-answer rate (substantive responses whose asserted facts are all supported by a returned citation, with no fabricated entity) shall be ≥ 95% on the evaluation set. | STK-08 | SN-05 | High | T | MOP-04, **TPM-01** |

---

## 6. System Interfaces

> High-level seams; full ICD in `Phase_04_Architecture/ICD.md` (ICD-01…ICD-04 = the four connectors; ICD-05 = LLM/model API; ICD-06 = SSO/IdP).

| ID | Statement | Source | SN | Priority | Method |
|---|---|---|---|---|---|
| **REQ-INT-01** | Aria shall integrate with Microsoft Outlook (mail + calendar) via the Microsoft Graph API over HTTPS using OAuth 2.0 delegated permissions. *(ICD-01)* | STK-06 | SN-01, SN-02 | High | T |
| **REQ-INT-02** | Aria shall integrate with HubSpot CRM (contacts, deals, notes) via the HubSpot CRM API over HTTPS using OAuth 2.0 with per-user delegated scopes. *(ICD-02)* | STK-06 | SN-01, SN-02 | High | T |
| **REQ-INT-03** | Aria shall integrate with Atlassian JIRA (issues, projects) via the JIRA Cloud REST API over HTTPS using OAuth 2.0 (3LO). *(ICD-03)* | STK-06 | SN-01, SN-02 | High | T |
| **REQ-INT-04** | Aria shall integrate with the Therefore document management system (search, retrieve, file) via its documented API over HTTPS with authenticated, scoped access. *(ICD-04)* | STK-06 | SN-01, SN-02 | High | T |
| **REQ-INT-05** | Aria shall invoke the language model(s) via the provider tool-calling API over HTTPS, sending only the minimum context required for the task. *(ICD-05)* | STK-08, STK-05 | SN-05, SN-09 | High | I |
| **REQ-INT-06** | Each connector shall honor its upstream rate limits using backoff and shall surface eventual-consistency lag to the user rather than presenting stale data as live. *(ICD-01..04)* | STK-07 | SN-07 | Medium | T |

---

## 7. System Operations

### 7.1 Operational / Reliability Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-O-01** | Aria shall maintain ≥ 99.5% monthly availability of the dashboard and chat services (excluding upstream-system outages). | STK-07 | SN-07 | High | A | MOP-07, **TPM-02** |
| **REQ-O-02** | When exactly one upstream system is unavailable, Aria shall keep ≥ 99% of its non-dependent functions available (graceful degradation). | STK-07 | SN-07 | High | T | MOP-08 |
| **REQ-O-03** | Each connector shall implement a circuit breaker that isolates a failing upstream within 30 s and auto-recovers on upstream restoration without operator action. | STK-07 | SN-07 | High | T | — |
| **REQ-O-04** | Aria shall reconcile eventual consistency across sources so that a write confirmed in Aria is reflected in the dashboard within 60 s of upstream acknowledgement. | STK-07 | SN-01 | Medium | T | MOP-01 |
| **REQ-O-05** | Assistant memory/conversation history shall be retained no longer than the configured retention period (default TODO, set during DPIA) and shall be purgeable per user on demand. | STK-05 | SN-09 | High | I | — |

### 7.2 Security Requirements

| ID | Statement | Source | SN | Priority | Method | MOP |
|---|---|---|---|---|---|---|
| **REQ-SEC-01** | Aria shall authenticate every employee via corporate SSO using OpenID Connect, with no Aria-local password. | STK-03 | SN-12 | High | T | — |
| **REQ-SEC-02** | Aria shall access each connected system using **per-user delegated OAuth 2.0 scopes** that are the least privilege required for enabled features; it shall never use a tenant-wide or app-only credential to read or write a user's content. | STK-03, STK-04 | SN-02 | High | I | — |
| **REQ-SEC-03** | Aria shall enforce per-user data isolation such that no request, retrieval, cache, or model context for one employee can contain another employee's data; cross-user access attempts shall be denied and logged. | STK-04 | SN-02 | High | T | MOP-06 |
| **REQ-SEC-04** | OAuth tokens shall be stored encrypted at rest (AES-256 or stronger) in a secrets vault, shall be short-lived, and shall be rotated/refreshed per RFC 9700; tokens shall be revocable per user within 5 minutes of an IdP revocation. | STK-03 | SN-02, SN-12 | High | I | — |
| **REQ-SEC-05** | All data in transit shall use TLS 1.3; all PII and tokens at rest shall be encrypted (AES-256 or stronger). | STK-04 | SN-09 | High | T | — |
| **REQ-SEC-06** | Aria shall write an immutable, tamper-evident audit record for every read-of-record and every write action — capturing actor, timestamp, tool, target system, parameters, confirmation status, and outcome. | STK-04, STK-05 | SN-08 | High | I | MOP-11 |
| **REQ-SEC-07** | Aria shall defend against prompt injection by treating all email/document/CRM content as untrusted data (never as instructions), confining it to a sandboxed context, and refusing any tool call not explicitly requested or confirmed by the employee; injection-defense efficacy shall be ≥ 99% on the red-team evaluation suite. | STK-04 | SN-03 | High | T | MOP-12, **TPM-03** |
| **REQ-SEC-08** | Aria shall comply with ISO/IEC 27001:2022 control objectives and shall pass an independent isolation + injection penetration test before GA, with zero S1/S2 findings open at PRR. | STK-04 | SN-02, SN-03 | High | I | — |

---

## 8. Constraints, Domain & Safety Requirements

| ID | Statement | Source | SN | Priority | Method |
|---|---|---|---|---|---|
| **REQ-C-01** | Aria shall not store any of the connected systems' content outside the contracted data-residency region(s). | STK-05 | SN-09 | High | I |
| **REQ-C-02** | Aria shall use only LLM/cloud providers contractually bound not to train on or retain customer content beyond the request. | STK-05, STK-10 | SN-09 | High | I |
| **REQ-C-03** | Aria shall operate within each connected system's published API terms of use and rate limits; it shall not circumvent or scrape outside sanctioned APIs. | STK-06 | SN-07 | Medium | I |
| **REQ-D-01** | Aria shall comply with GDPR for all personal data it processes, supporting access (Art. 15) and erasure (Art. 17) requests within the agreed SLA, processing-activity records (Art. 30), data-protection-by-design (Art. 25), and a completed DPIA (Art. 35) before GA. | STK-05 | SN-09 | High | I |
| **REQ-SAF-01** | Aria shall require explicit, per-action human confirmation before any irreversible or externally-visible action (send email, edit/transition JIRA, edit HubSpot record, file/delete a document); it shall never auto-execute such an action. *(mitigates HAZ-01 — wrong/irreversible action on the employee's behalf)* | STK-01, STK-04 | SN-04 | High | T |
| **REQ-SAF-02** | Aria shall block destructive actions (delete document, delete record) behind a distinct confirmation requiring the employee to acknowledge irreversibility, and shall record an undo reference where the upstream supports it. *(mitigates HAZ-02)* | STK-04 | SN-04 | High | D |

---

## 9. Modes & States

| Mode | Description |
|---|---|
| **Locked** | No valid user session/token; Aria holds no access. SSO required to enter. |
| **Ready** | Authenticated; all four connectors healthy; dashboard + chat fully available. |
| **Degraded** | ≥ 1 upstream unavailable; non-dependent functions continue; affected panels show degraded state. |
| **Confirm-Pending** | A proposed write awaits human confirmation; no side effect until Confirm or Cancel. |
| **Executing** | A confirmed action is being applied to an upstream; audited. |
| **Maintenance** | Model/prompt rollout or admin reconfiguration; eval-gated; rollback armed. |
| **Revoked** | Token revoked / consent withdrawn; access removed; memory purged per policy. |

### Transition table (seeds Phase 03 State Machine)

| From | Event | To |
|---|---|---|
| Locked | Successful SSO/OIDC sign-in | Ready |
| Ready | Upstream health-check fails | Degraded |
| Degraded | Upstream restored | Ready |
| Ready/Degraded | Employee approves a proposed action | Executing |
| Ready/Degraded | Agent proposes a write | Confirm-Pending |
| Confirm-Pending | Employee confirms | Executing |
| Confirm-Pending | Employee cancels/edits | Ready/Degraded |
| Executing | Upstream ack (success/failure) + audit written | Ready/Degraded |
| Any | Model/prompt update window | Maintenance |
| Any | Token revoked / consent withdrawn | Revoked |
| Revoked | Re-consent + SSO | Ready |

---

## 10. Measures of Effectiveness & Performance

### MOE (from SN — mission-level; defined in Concept §7, carried here)
MOE-01 time saved/user/day · MOE-02 task success rate · MOE-03 grounded-answer rate · MOE-04 trust-critical incidents (target 0) · MOE-05 injection neutralized · MOE-06 adoption + control · MOE-07 availability under single-upstream outage.

### MOP (from REQ — system-level)

| MOP | From REQ | Metric | Target | Threshold | Unit |
|---|---|---|---|---|---|
| **MOP-01** | REQ-P-01, REQ-F-02 | Dashboard first-view render | ≤ 3 (p95) | ≤ 5 | s |
| **MOP-02** | REQ-P-02 | Chat answer completion | ≤ 10 (p95) | ≤ 15 | s |
| **MOP-03** | REQ-P-03 | Concurrent users at SLA | ≥ 5,000 | ≥ 3,000 | users |
| **MOP-04** | REQ-F-06, REQ-P-05 | Grounded-answer rate | ≥ 95 | ≥ 90 | % |
| **MOP-05** | REQ-F-09 | Writes executed without confirmation | 0 | 0 | count |
| **MOP-06** | REQ-F-08, REQ-SEC-03 | Out-of-policy / cross-user attempts blocked | 100 | 100 | % |
| **MOP-07** | REQ-O-01 | Aria service availability (monthly) | ≥ 99.5 | ≥ 99.0 | % |
| **MOP-08** | REQ-O-02, REQ-F-12 | Functions available under 1-upstream outage | ≥ 99 | ≥ 95 | % |
| **MOP-09** | REQ-U-01 | First-task success without help | ≥ 90 | ≥ 80 | % users |
| **MOP-10** | REQ-P-04 | Routine tasks off highest-cost tier | ≥ 90 | ≥ 75 | % |
| **MOP-11** | REQ-SEC-06 | Actions with complete audit record | 100 | 100 | % |
| **MOP-12** | REQ-SEC-07 | Injection-defense efficacy (red-team suite) | ≥ 99 | ≥ 95 | % |

### TPM (promoted MOPs carrying technical/schedule risk — tracked Phases 06–10)

| TPM | From MOP | Why tracked | Current | Target | Threshold | Margin |
|---|---|---|---|---|---|---|
| **TPM-01** | MOP-04 | Grounding is the core anti-hallucination control; quality risk. | TODO | ≥ 95% | ≥ 90% | TODO |
| **TPM-02** | MOP-07 | Availability under multi-source dependency; reliability risk. | TODO | ≥ 99.5% | ≥ 99.0% | TODO |
| **TPM-03** | MOP-12 | Injection defense is the top security risk (RSK-01). | TODO | ≥ 99% | ≥ 95% | TODO |

---

## 11. Verification (seed — Phase 07 authoritative)

| Req | Method (seed) | Verifying activity |
|---|---|---|
| REQ-F-04, REQ-F-06, REQ-P-05 | T | Run groundedness eval set; measure cited-fact rate & fabrication rate. → TC-VER-TBD |
| REQ-F-08, REQ-F-09, REQ-SAF-01 | T | Action-safety eval: attempt unconfirmed writes; assert 0 execute. → TC-VER-TBD |
| REQ-SEC-03 | T | Per-user isolation pen-test; assert 0 cross-user leakage. → TC-VER-TBD |
| REQ-SEC-07 | T | Prompt-injection red-team suite; measure neutralization %. → TC-VER-TBD |
| REQ-O-02, REQ-O-03, REQ-F-12 | T | Chaos/fault-injection: drop each upstream; measure available functions. → TC-VER-TBD |
| REQ-P-01..03 | T | Load test at 5,000 users; measure p95. → TC-VER-TBD |
| REQ-SEC-02, REQ-SEC-04, REQ-C-01, REQ-D-01 | I | Inspect scope grants, token store, residency config; DPIA review. → TC-VER-TBD |
| REQ-SEC-06 | I | Audit-completeness inspection across sampled actions. → TC-VER-TBD |
| REQ-U-01 | T | Usability test, n ≥ TODO; measure first-task success. → TC-VER-TBD |

(Method codes: T = Test, I = Inspection, A = Analysis, D = Demonstration — Conventions §4. Full matrix in `Phase_07_Verification/Verification_Matrix.md`.)

---

## 12. Design preview (alignment for downstream phases)

### Intended top-level system blocks (Phase 04 BDD)
1. **Web Client** (dashboard + AI chat UI)
2. **Dashboard Aggregation Service** (cross-source fan-out, eventual-consistency reconciliation)
3. **Agent Orchestrator** (LLM planning, tool-calling, model-tier router, **Action-Confirmation Gate**)
4. **RAG Retrieval Service** (per-user index, grounding, citation layer)
5. **Connector Gateway** + 4 connectors (Outlook/Graph, HubSpot, JIRA, Therefore) with circuit breakers
6. **Identity / Token Broker** (SSO/OIDC, delegated-scope OAuth, encrypted token vault)
7. **Untrusted-Content Sandbox** + Tool Guardrails (allow-list, injection defense)
8. **Audit Log Service** (immutable, tamper-evident)

### Strategic decisions to be made (Phase 05 — names only)
- **DEC-01 / DM-01** — LLM choice & task-tier routing (recommend Claude Opus 4.8 for hardest reasoning, Sonnet 4.6 for the everyday balance, Haiku 4.5 for cheap/fast, routed by task class; realistic alternatives — GPT/Gemini-class hosted, or open-weight models for on-prem residency).
- **DEC-02 / DM-02** — RAG architecture (retrieval/index/grounding & citation strategy per-user).
- **DEC-03 / DM-03** — Build-vs-buy for the agent/tool-calling framework and the four connectors.
- **DEC-04 / DM-04** — Token storage / secrets-management approach (vault, rotation, residency).
- **DEC-05 / DM-05** — AI-action-safety pattern (confirmation-gate + guardrails + eval-gate design).

---

## 13. Assumptions & Dependencies

- Each connected system exposes a stable OAuth 2.0/OIDC API with delegated, per-user scopes (Microsoft Graph, HubSpot, JIRA Cloud, Therefore).
- Corporate IdP supports OIDC SSO and per-user token revocation.
- An LLM provider is contracted with a no-training-on-data term and an available data-residency region (DEC-01, REQ-C-02).
- A DPIA (Art. 35) and works-council consultation complete before GA (RSK-05, STK-09).
- An evaluation harness (groundedness, task success, injection, action-safety) is built in Phase 06 and gates releases (SCN-07).
- Upstream API rate limits and terms permit the intended read/write volumes (REQ-C-03).

---

## 14. Traceability (SN → REQ → TC-VER-TBD)

| SN | Need (abbrev.) | Covering REQ(s) | MOP/TPM | Verifying activity |
|---|---|---|---|---|
| SN-01 | One place across 4 systems | REQ-F-01, -02, -07; REQ-P-01, -03; REQ-INT-01..04; REQ-O-04 | MOP-01,-03 | TC-VER-TBD |
| SN-02 | Only what the user may see/do | REQ-INT-01..04; REQ-SEC-02, -03, -04, -08 | MOP-06 | TC-VER-TBD |
| SN-03 | Content can't hijack the agent | REQ-F-08; REQ-SEC-07, -08 | MOP-12 / TPM-03 | TC-VER-TBD |
| SN-04 | No write without my OK | REQ-F-05, -09, -10; REQ-SAF-01, -02; REQ-U-03 | MOP-05 | TC-VER-TBD |
| SN-05 | Grounded, not invented | REQ-F-04, -06; REQ-P-05; REQ-INT-05 | MOP-04 / TPM-01 | TC-VER-TBD |
| SN-06 | Completes tasks correctly | REQ-F-03, -04, -05, -07, -11; REQ-U-01; REQ-P-02 | MOP-02,-09 | TC-VER-TBD |
| SN-07 | One upstream down ≠ Aria down | REQ-F-12; REQ-O-02, -03; REQ-INT-06; REQ-C-03 | MOP-08 | TC-VER-TBD |
| SN-08 | Every action auditable | REQ-SEC-06 | MOP-11 | TC-VER-TBD |
| SN-09 | PII protected/residency/erasure | REQ-O-05; REQ-SEC-05; REQ-C-01, -02; REQ-D-01; REQ-INT-05 | — | TC-VER-TBD |
| SN-10 | Trust & control | REQ-U-01, -02, -03 | MOP-09 | TC-VER-TBD |
| SN-11 | Saves measurable time | (validated via MOE-01 in Phase 08) | — | TC-VAL-TBD |
| SN-12 | Single corporate sign-in | REQ-SEC-01, -04 | — | TC-VER-TBD |
| SN-13 | Steer cost/quality per task | REQ-P-04 | MOP-10 | TC-VER-TBD |
| SN-14 | Not covert monitoring | REQ-U-04 | — | TC-VER-TBD |

Every REQ traces to ≥1 SN; every SN is covered by ≥1 REQ (SN-11 validated at mission level via MOE-01, Phase 08). Bidirectional trace maintained; full matrix in `Traceability_Matrix.md` (Phase 02) and `Phase_03_Modeling/Requirements_Diagram.puml`.

---

## 15. Requirements Engineering Record

- **Elicitation methods:** stakeholder interviews (STK-01, STK-02, STK-08); security/privacy workshop (STK-04, STK-05); document review of GDPR + ISO 27001 + OAuth BCP + the four connected-app API terms (implicit & domain requirements); observation of current four-tool workflow for time-saved baseline.
- **Conflicts surfaced & resolved:** (1) *latency vs. grounding* (REQ-P-02 vs. REQ-F-06) — resolved: stream first token early, complete grounded answer within budget; priority tie-break to grounding. (2) *autonomy/productivity vs. action-safety* (SN-11 vs. SN-04) — resolved: HITL on writes is non-negotiable (REQ-SAF-01); productivity comes from drafting + cross-system prep, not unattended execution. (3) *cost vs. quality* — resolved via task-tier routing (REQ-P-04, DEC-01).
- **Peer review / walkthrough:** TODO — schedule SRR-entry walkthrough with AI Lead (STK-08), Security (STK-04), DPO (STK-05), SRE (STK-07); record reviewers + date here.
- **SMART pass:** all REQ written one-behavior, measurable, traced; double-barrelled items split.

---

## 16. Coverage summary

- **Counts by class:** F = 12 (REQ-F-01…F-12) · U = 4 (U-01…U-04) · P = 5 (P-01…P-05) · INT = 6 (INT-01…INT-06) · O = 5 (O-01…O-05) · SEC = 8 (SEC-01…SEC-08) · C = 3 (C-01…C-03) · D = 1 (D-01) · SAF = 2 (SAF-01…SAF-02). **Total = 46 REQ.**
- **Priority split:** High = 35 · Medium = 11 · Low = 0 · N-A = 0.
- **Orphan check:** 0 orphan REQs; 0 uncovered SNs.
- **SRR status:** Draft — pending peer-review walkthrough (§15) and MCR conditions (Concept §9). On sign-off → `Baseline (SRR-approved <date>)`, establishing the Functional/Requirements baseline (Conventions §3).
