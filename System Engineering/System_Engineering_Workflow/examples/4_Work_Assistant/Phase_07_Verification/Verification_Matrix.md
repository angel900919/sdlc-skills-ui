---
Document: Verification Matrix — Aria AI-Powered Personal Work Assistant
Document ID: VM-ARIA-v0.1
Standard: IEEE 1012-2016
Status: Draft            # Draft → In Review → Baseline (TRR-approved YYYY-MM-DD) → Superseded by vX.Y
Owner: Verification Lead
---

# Verification Matrix — Aria

> **Verification asks:** "Did we build the system **right**?" — does Aria conform to the `SyRS-ARIA-v1.0` spec ([`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md))?
> **Necessary but not sufficient:** a 100%-covered verification matrix proves the spec is *covered* — **not** that the spec was *right* (that is Phase 08 Validation, [`../Phase_08_Validation/`](../Phase_08_Validation/)) and **not** that every test has *passed*. Coverage ≠ correctness ≠ validity. For an LLM-agent system this caveat bites hard: an eval set that is 100% mapped can still miss the adversarial prompt that hijacks the agent — coverage of REQ-SEC-07 is not proof of injection resistance against an unseen attack.
> **Method legend:** `T` = Test · `I` = Inspection (includes structured Review) · `A` = Analysis · `D` = Demonstration — per Conventions §4. **Phase 07 is authoritative for methods; Phase 02 only seeded.** Method overrides of the SysRS §11 seed are noted in the "Δseed" footnotes under §1.
> This document conforms to Conventions for all IDs (§2), gates (§3), methods (§4), severity (§5), baselines (§3), and standard citations (§9).

---

## 1. Per-Requirement Verification

> One row per `REQ-<class>-<nn>` from `SysRS.md`, walked class-by-class (F · U · P · O · SEC · INT · C · D · SAF). Combinations allowed (`I + T`, `T + A`). Every REQ ends with at least one real `TC-VER-<nn>` — **no `TC-VER-TBD` survives this phase** (the SysRS §11 placeholders are resolved below).
>
> **Verifying-tool note for an LLM-agent system.** Five tool families recur and are defined once here, then referenced by name in the table:
> - **Aria Eval Harness** — the offline LLM-as-judge + golden-set evaluation rig built in Phase 06 (Integration_Plan `INC-04`, the "eval harness in CI"). It scores groundedness, task success, injection-defense, and action-safety against versioned datasets. Used as the verification instrument for the AI-behavioural REQs. Frozen eval-set + judge-prompt versions are CIs under Phase 09.
> - **Injection Red-Team Suite** — a curated + auto-generated adversarial corpus (direct, indirect, and tool-chained prompt-injection payloads embedded in email/doc/CRM content) run through the Eval Harness against `THR-*` threats; measures neutralization %.
> - **Action-Safety Test Harness** — a deterministic harness that drives the Agent Orchestrator with scripted tasks and asserts on the connector mock-layer that **no write tool fires without a recorded confirmation token** (the Action-Confirmation Gate).
> - **Connector Contract/Chaos rig** — Pact-style contract tests + Toxiproxy/`gremlin`-style fault injection against the four connector mocks/sandboxes (ICD-01..04) to verify degradation and circuit-breaker behaviour.
> - **k6 + OpenTelemetry traces** — load generation and p95 latency measurement at the dashboard/chat tier.

| Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
|---|---|---|---|---|
| REQ-F-01 | Single unified dashboard across Outlook+cal, JIRA, HubSpot, Therefore | D | TC-VER-01 — operate dashboard, observe all four panels render for signed-in user | Manual + Aria Dashboard Acceptance Checklist |
| REQ-F-02 | Panel ≤ 60 s stale + last-refresh timestamp shown | T | TC-VER-02 — mutate source, measure panel refresh lag; assert timestamp present | Playwright + connector mock clock |
| REQ-F-03 | Chat returns grounded answer or proposed plan from user data | D | TC-VER-03 — issue NL requests, observe grounded answer / plan with data refs | Manual + Aria Chat Scenario Script |
| REQ-F-04 | Triage+summarize email; every fact cites its source message | T | TC-VER-04 — groundedness eval on email-summary golden set; measure cited-fact rate | Aria Eval Harness (groundedness set) |
| REQ-F-05 | Drafts (email/JIRA/HubSpot) presented as editable **proposals** | D | TC-VER-05 — request drafts, observe proposal+edit affordance, zero execution | Manual + Aria Chat Scenario Script |
| REQ-F-06 | RAG-ground every substantive response + per-fact citation; withhold ungroundable | T | TC-VER-06 — groundedness eval set: measure grounded-answer rate & fabrication rate (MOP-04 / TPM-01) | Aria Eval Harness (groundedness set) |
| REQ-F-07 | Cross-system workflow = ordered set of individually-confirmed actions | T | TC-VER-07 — drive email→JIRA→HubSpot workflow; assert each action independently gated | Action-Safety Test Harness |
| REQ-F-08 | Agent invokes only allow-listed tools; out-of-list refused + logged | T | TC-VER-08 — attempt non-allow-listed tool calls; assert refusal + audit entry (MOP-06) | Action-Safety Test Harness + audit assertions |
| REQ-F-09 | Every write previewed (diff) + executed only after explicit confirm | T | TC-VER-09 — action-safety eval: attempt unconfirmed writes; assert 0 execute (MOP-05) | Action-Safety Test Harness |
| REQ-F-10 | User can cancel/modify any pending action; no side effect pre-confirm | T | TC-VER-10 — cancel/edit pending proposals; assert zero connector mutation | Action-Safety Test Harness |
| REQ-F-11 | Find+file documents in Therefore; return id + storage location | D | TC-VER-11 — file a document via chat; observe returned id + location | Manual + Therefore sandbox checklist |
| REQ-F-12 | Degraded source marked with indicator + last-known-good timestamp | T | TC-VER-12 — fault-inject one upstream; assert degraded badge + timestamp, others live (MOP-08) | Connector Contract/Chaos rig |
| REQ-U-01 | First-timer completes cross-system task ≤ 3 min for ≥ 90% of users | T | TC-VER-13 — moderated usability test, n ≥ TODO; measure first-task success (MOP-09) | Manual + Usability Test Protocol + screen capture |
| REQ-U-02 | Web UI conforms to WCAG 2.2 AA | I + T | TC-VER-14 — automated a11y scan + manual AT inspection vs WCAG 2.2 AA checklist | axe-core + Manual + WCAG 2.2 AA checklist |
| REQ-U-03 | Confirm surface makes target system / exact change / reversibility unambiguous | I | TC-VER-15 — heuristic inspection of every confirmation surface vs spec | Manual + Confirmation-Surface Review checklist |
| REQ-U-04 | Persistent plain-language access/transparency notice (no covert monitoring) | I | TC-VER-16 — inspect persistent notice copy + placement vs STK-09 transparency req | Manual + Transparency-Notice Review checklist |
| REQ-P-01 | Dashboard first complete view ≤ 3 s p95 (nominal) | T | TC-VER-17 — timed dashboard load under nominal connectivity; measure p95 (MOP-01) | k6 + OpenTelemetry traces |
| REQ-P-02 | Chat first token ≤ 3 s p95; grounded answer complete ≤ 10 s p95 | T | TC-VER-18 — instrument chat TTFT + completion; measure p95 (MOP-02) | k6 + OpenTelemetry traces |
| REQ-P-03 | Sustain 5,000 concurrent users at chat p95 ≤ 10 s, dash p95 ≤ 3 s | T | TC-VER-19 — load test ramp to 5,000 VUs; measure p95 envelope (MOP-03) | k6 (distributed) + OpenTelemetry |
| REQ-P-04 | Route ≥ 90% routine tasks off highest-cost model tier | A | TC-VER-20 — analyse router decision logs over task corpus; compute off-top-tier % (MOP-10) | Router-log analysis (DuckDB query) |
| REQ-P-05 | Grounded-answer rate ≥ 95% on eval set (no fabricated entity) | T | TC-VER-06 — same groundedness eval as REQ-F-06; assert ≥ 95% (MOP-04 / **TPM-01**) | Aria Eval Harness (groundedness set) |
| REQ-O-01 | ≥ 99.5% monthly availability of dashboard + chat | A | TC-VER-21 — rolling availability computed from SLO probes over the window (MOP-07 / **TPM-02**) | Prometheus/Grafana SLO query |
| REQ-O-02 | ≥ 99% non-dependent functions available under exactly-one-upstream outage | T | TC-VER-22 — chaos: drop each upstream singly; measure % functions still served (MOP-08) | Connector Contract/Chaos rig |
| REQ-O-03 | Circuit breaker isolates failing upstream ≤ 30 s; auto-recover, no operator | T | TC-VER-23 — fault-inject upstream; time trip + auto-recovery on restore | Connector Contract/Chaos rig |
| REQ-O-04 | Confirmed write reflected in dashboard ≤ 60 s of upstream ack | T | TC-VER-24 — confirm a write; measure dashboard reconciliation lag (MOP-01) | Playwright + connector mock |
| REQ-O-05 | Memory/history retained ≤ configured period; per-user purgeable on demand | I | TC-VER-25 — inspect retention config + exercise purge; review deletion record | Manual + Retention-Config Review + purge log |
| REQ-SEC-01 | SSO via OIDC; no Aria-local password | I + T | TC-VER-26 — inspect IdP/OIDC config; test that no local-password path exists | Manual + OIDC config review + auth probe |
| REQ-SEC-02 | Per-user delegated least-privilege OAuth scopes; never app-only for user content | I | TC-VER-27 — inspect granted scopes per feature; confirm no tenant-wide/app-only credential reads user data | Manual + OAuth Scope Review checklist |
| REQ-SEC-03 | Per-user data isolation; cross-user access denied + logged | T | TC-VER-28 — isolation pen-test: attempt cross-user retrieval/cache/context bleed; assert 0 leakage (MOP-06) | Injection Red-Team Suite + isolation pen-test (Burp Suite) |
| REQ-SEC-04 | Tokens encrypted at rest (AES-256+), short-lived, rotated per RFC 9700, revocable ≤ 5 min | I + T | TC-VER-29 — inspect vault config + rotation policy; test revocation propagation ≤ 5 min | Manual + Vault config review + revocation timing test |
| REQ-SEC-05 | TLS 1.3 in transit; AES-256+ for PII/tokens at rest | I + T | TC-VER-30 — inspect TLS/cipher + at-rest crypto config; test enforced TLS 1.3 | testssl.sh + Manual + Crypto-Config Review |
| REQ-SEC-06 | Immutable, tamper-evident audit record for every read-of-record + write | I | TC-VER-31 — audit-completeness inspection across sampled actions; verify required fields + tamper-evidence (MOP-11) | Manual + Audit-Completeness Review + hash-chain check |
| REQ-SEC-07 | Treat content as untrusted data; refuse un-requested tool calls; injection-defense ≥ 99% on red-team suite | T | TC-VER-32 — prompt-injection red-team suite; measure neutralization % (MOP-12 / **TPM-03**) | Injection Red-Team Suite (via Aria Eval Harness) |
| REQ-SEC-08 | ISO 27001 control objectives; pass independent isolation+injection pen-test; 0 open S1/S2 at PRR | I | TC-VER-33 — ISO 27001 control-objective audit + independent pen-test report review | Manual + ISO 27001 SoA audit + IV&V pen-test report |
| REQ-INT-01 | Outlook via Microsoft Graph over HTTPS, OAuth2 delegated *(ICD-01)* | T | TC-VER-34 — Graph connector contract test: auth, scopes, mail+cal endpoints | Connector Contract/Chaos rig (Pact, Graph sandbox) |
| REQ-INT-02 | HubSpot CRM via HubSpot API over HTTPS, OAuth2 per-user delegated *(ICD-02)* | T | TC-VER-35 — HubSpot connector contract test: contacts/deals/notes, scopes | Connector Contract/Chaos rig (Pact, HubSpot sandbox) |
| REQ-INT-03 | JIRA via JIRA Cloud REST over HTTPS, OAuth2 3LO *(ICD-03)* | T | TC-VER-36 — JIRA connector contract test: issues/projects, 3LO flow | Connector Contract/Chaos rig (Pact, JIRA sandbox) |
| REQ-INT-04 | Therefore via documented API over HTTPS, authenticated scoped *(ICD-04)* | T | TC-VER-37 — Therefore connector contract test: search/retrieve/file, scoped auth | Connector Contract/Chaos rig (Pact, Therefore sandbox) |
| REQ-INT-05 | LLM via provider tool-calling API over HTTPS; send only minimum context *(ICD-05)* | I | TC-VER-38 — inspect outbound model payloads vs minimization policy; confirm TLS + no excess PII | Manual + Payload-Minimization Review + mitmproxy capture |
| REQ-INT-06 | Connectors honor upstream rate limits w/ backoff; surface eventual-consistency lag | T | TC-VER-39 — saturate connector to rate limit; assert backoff + staleness surfaced, not stale-as-live | Connector Contract/Chaos rig (rate-limit injection) |
| REQ-C-01 | No connected-system content stored outside contracted residency region(s) | I | TC-VER-40 — inspect storage/region config + data-flow map vs residency contract | Manual + Data-Residency Review (IaC + DPIA artifact) |
| REQ-C-02 | Use only LLM/cloud providers contractually bound to no-train / no-retain | I | TC-VER-41 — inspect provider contract terms + config flags vs REQ-C-02 | Manual + Provider-Terms Review checklist |
| REQ-C-03 | Operate within each upstream's API terms + rate limits; no scraping | I | TC-VER-42 — inspect connector design + rate-limit config vs each app's published API terms | Manual + API-Terms-of-Use Review checklist |
| REQ-D-01 | GDPR: access (15), erasure (17), records (30), by-design (25), DPIA (35) before GA | I | TC-VER-43 — DPIA review + GDPR-rights inspection (access/erasure SLA exercised, Art. 30 RoPA present) | Manual + GDPR/DPIA Audit checklist |
| REQ-SAF-01 | Per-action human confirm before any irreversible/externally-visible action; never auto-execute *(HAZ-01)* | T | TC-VER-09 — action-safety eval (shared): attempt auto-execution of send/edit/file; assert 0 fire | Action-Safety Test Harness |
| REQ-SAF-02 | Destructive actions behind distinct irreversibility ack; record undo ref where supported *(HAZ-02)* | D | TC-VER-44 — operate delete-document / delete-record; observe distinct ack + undo reference | Manual + Destructive-Action Demo checklist |

**Δseed (method overrides vs SysRS §11/§ class tables — Phase 07 is authoritative):**
- **REQ-U-02** seeded `I` → finalised **`I + T`**: WCAG 2.2 AA is partly machine-checkable (axe-core) and partly human (AT/keyboard) — a pure inspection would miss programmatic contrast/role defects; test+inspect together prove it.
- **REQ-SEC-01** seeded `T` → finalised **`I + T`**: the "no Aria-local password" half is an architectural property proven by **inspecting** the auth design (no local credential store), the OIDC-enforcement half is **tested**.
- **REQ-SEC-04 / REQ-SEC-05** seeded `I` / `T` respectively → both finalised **`I + T`**: crypto/rotation/revocation requirements need the spec/config **inspected** *and* enforcement **tested** (Conventions §4 cheatsheet: "AES-256/TLS 1.3 → I + T"). Inspection alone can't prove TLS 1.3 is actually negotiated; test alone can't prove the at-rest cipher.
- **REQ-O-01** seeded `A` → kept **`A`**: a ≥ 99.5% monthly availability cannot be directly tested in a test window; it is computed/analysed from SLO probe data over the rolling month (cheatsheet: "≥ N% availability → A").
- All other rows retain the SysRS-seeded method. Shared TCs: **TC-VER-06** covers REQ-F-06 + REQ-P-05 (one groundedness eval); **TC-VER-09** covers REQ-F-09 + REQ-SAF-01 (one action-safety eval) — the two safety/grounding requirements are co-verified, not double-counted.

---

## 2. Verification Levels (Unit → Integration → System)

> Each TC placed on the ladder. F/P/SEC/INT span Unit→Integration→System; the AI-behavioural evals (groundedness, injection, action-safety) are **integration/system-level** by nature — they exercise the Agent Orchestrator + RAG + Connector Gateway together, because grounding and injection-resistance are emergent properties of the *assembled* RAG/tool-calling pipeline, not of any single unit. The **Acceptance** cell is the **verification → validation HINGE** — UAT / red-team-with-users / productivity acceptance is a *validation* activity owned by **Phase 08**; named here, not executed.

| Class | Unit | Integration | System | Acceptance |
|---|---|---|---|---|
| F (Functional) | TC-VER-02 (refresh logic), TC-VER-08 (allow-list unit) | TC-VER-04, TC-VER-06 (eval), TC-VER-07, TC-VER-09, TC-VER-10, TC-VER-12 | TC-VER-01, TC-VER-03, TC-VER-05, TC-VER-11 (end-to-end demo) | → Phase 08 (validation hinge) |
| P (Performance) | TC-VER-20 (router unit) | TC-VER-18 (chat path) | TC-VER-17, TC-VER-19 (full-load), TC-VER-24 | → Phase 08 (validation hinge) |
| SEC (Security) | TC-VER-30 (cipher unit), TC-VER-31 (audit-field unit) | TC-VER-28 (isolation), TC-VER-29, TC-VER-32 (injection eval) | TC-VER-26, TC-VER-33 (independent pen-test, system) | → Phase 08 (red-team-with-users hinge) |
| INT (Interface) | TC-VER-34..37 (per-connector contract, mocked) | TC-VER-34..37 (against vendor sandboxes), TC-VER-39 | TC-VER-38 (model payload, system) | → Phase 08 (validation hinge) |
| O / SAF (reliability + AI-action safety) | TC-VER-08 (gate unit) | TC-VER-22, TC-VER-23, TC-VER-09 (action-safety), TC-VER-44 | TC-VER-21 (rolling SLA, system/ops), TC-VER-25 | → Phase 08 (validation hinge) |

> **AI-system note:** there is no "HIL rig" here (no hardware); the analogue is the **eval harness + connector sandboxes** standing in for real upstreams + a deterministic model-stub mode so action-safety/injection tests are reproducible (model nondeterminism is pinned via temperature-0 + seeded judge where the provider supports it; otherwise n-repeat with pass-threshold — recorded per-TC).

---

## 3. Continuous Scans

> **Pointer, not a copy.** The SAST / DAST / dependency / secrets / IaC / model-eval scan-and-tool table is owned by **Phase 06** (`Phase_06_Integration/Integration_Plan.md`, the CI/CD + eval-harness section). This section states only each scan's verification **pass-criteria**; it does not re-author the table.

| Scan (from Phase 06 table) | Verification pass-criteria |
|---|---|
| Static analysis / SAST | Zero critical findings; zero high in security-sensitive modules (Identity/Token Broker, Action-Confirmation Gate, Untrusted-Content Sandbox). |
| SCA / supply-chain (SBOM) | Zero critical CVEs in shipped deps; SBOM emitted per build; model + connector SDK versions pinned. |
| DAST / secrets / IaC | Zero high DAST findings on the web/chat surface; zero secrets in repo/image; IaC residency-region policy passes (feeds REQ-C-01). |
| **Injection-defense eval (CI gate)** | Injection-defense efficacy ≥ 99% (MOP-12 / TPM-03) on the regression slice of the Red-Team Suite — **release-blocking**; no regression vs prior baseline (per SCN-07). |
| **Groundedness eval (CI gate)** | Grounded-answer rate ≥ 95% (MOP-04 / TPM-01) on the golden set — **release-blocking**; fabrication rate not increased vs baseline. |
| **Action-safety eval (CI gate)** | 0 unconfirmed writes (MOP-05) across the action-safety scenario set — **release-blocking**, zero-tolerance. |
| Conformance (connector contracts) | All ICD-01..04 contract tests green; no breaking drift vs frozen ICD baseline (CDR product baseline). |

> The three AI evals are the LLM-agent analogue of conformance scans: they run in CI on every model/prompt change (SCN-07, REQ-P-04 routing included) and **gate the release** the same way a failing SAST gate would. Their datasets and judge prompts are version-controlled CIs (Phase 09).

---

## 4. Reviews & Inspections

> Gate rows this phase touches. Canonical gate names per Conventions §3 — pass-criteria text is **not** restated here (cite §3). Dates pulled from the project schedule; unknowns marked `TODO`.

| Gate | Owning phase | Scheduled date | Status |
|---|---|---|---|
| SRR | 02 | TODO (Phase 02 sign-off pending) | pending (SysRS still Draft) |
| PDR | 04 | TODO | pending |
| CDR | 06 | TODO | pending (ICDs to freeze → product baseline) |
| **TRR** | 07 | TODO | **this phase's exit gate** — see §7 |
| PRR | 08 | TODO | pending (validation + zero-open-S1/S2 — REQ-SEC-08) |

> Structured **Reviews** in §1 (REQ-U-03, -U-04, -SEC-02, -SEC-06, -SEC-08, -C-01..03, -D-01, -INT-05, -O-05) are coded **`I`** per Conventions §4 — review minutes/checklists are their evidence; "Review" is **not** a fifth method.

---

## 5. Coverage Summary

> This rollup is what the TRR checks. The two zero-must-pass rows are stop-the-line conditions. Counts are by REQ (a combination method `I + T` counts the REQ once under **each** method it uses, so the method tallies sum to more than 46 — the "Total REQs" row is the authoritative denominator).

| Metric | Count |
|---|---|
| **Total REQs** (SysRS §16: F12·U4·P5·INT6·O5·SEC8·C3·D1·SAF2) | **46** |
| REQs using **T** | 27 (F-02,-04,-06,-07,-08,-09,-10,-12; U-01,-02; P-01,-02,-03,-05; O-02,-03,-04; SEC-01,-03,-04,-05,-07; INT-01,-02,-03,-04,-06) |
| REQs using **I** | 19 (U-02,-03,-04; O-05; SEC-01,-02,-04,-05,-06,-08; INT-05; C-01,-02,-03; D-01) |
| REQs using **A** | 2 (P-04; O-01) |
| REQs using **D** | 6 (F-01,-03,-05,-11; SAF-02) |
| REQs with **no method** | **0** (must be 0 — else TRR fails) |
| REQs with **no TC-VER** | **0** (must be 0 — every SysRS §11 `TC-VER-TBD` resolved to a real `TC-VER-01..44`) |
| REQs whose tool is `TODO` | 0 tools `TODO`; **1 parameter `TODO`** (REQ-U-01 sample size `n`) — allowed but flagged |

> Combination-method REQs (counted under each method): U-02 (`I+T`), SEC-01 (`I+T`), SEC-04 (`I+T`), SEC-05 (`I+T`). 46 distinct REQs, 5 of which share a TC with another REQ (TC-VER-06, TC-VER-09), giving **44 distinct TC-VER ids (TC-VER-01..44)**. Every REQ has ≥ 1 method and ≥ 1 TC-VER. **0 orphans.**
>
> **Reminder (necessary-but-not-sufficient):** these counts prove the spec is *covered*. They do **not** prove Aria is safe against an unseen injection, that grounding holds on out-of-distribution data, or that any single test has *passed*. Pass/fail lands in each `verification-evidence/TC-VER-<nn>/result.md`; *validity* (did we build the right thing — trust, time-saved, adoption) is Phase 08.

---

## 6. V&V Plan Summary

> The full plan is the companion `VnV_Plan.md` (IEEE 1012-2016). Summary of the load-bearing decisions:

**Integrity level.** Aria carries **no** DO-178C/ISO 26262/IEC 62304 safety-of-life obligation (README; SysRS §1.4). Mapped to **IEEE 1012-2016**, Aria is assessed at **high software integrity level** — **not** for loss-of-life, but because the consequence set includes irreversible action on the employee's behalf (HAZ-01/-02), cross-user PII leakage (RSK-02, GDPR), and agent hijack (RSK-01). The trust-critical tracks (**identity, privacy/security, AI-action-safety** — the Formal-overlay tracks from Concept §4) are treated as high-integrity; the dashboard/UX tracks as moderate. This split scales rigour per track rather than uniformly.

**IV&V decision.** Independent V&V is **required** for the high-integrity tracks: REQ-SEC-08 already mandates an **independent** isolation + injection penetration test before GA (TC-VER-33), and the injection red-team eval gate (TC-VER-32) plus the isolation pen-test (TC-VER-28) are executed by a verifier **organisationally independent of the agent/RAG implementers** (STK-08's team builds it; a separate security function verifies it) with a separate evidence trail under `verification-evidence/`. The dashboard/performance/UX REQs use **in-team verification with peer review** (sufficient at moderate integrity). Rationale recorded per IEEE 1012 independence criteria.

**Scan/test stack (the verification instruments).**
- **AI eval sets (offline, golden):** groundedness set (REQ-F-04/-06/-P-05 → TC-VER-06), task-success set (feeds MOE-02, validated Phase 08), action-safety scenario set (REQ-F-08/-09/-10, REQ-SAF-01 → TC-VER-07/08/09/10), injection red-team corpus (REQ-SEC-07 → TC-VER-32, REQ-SEC-03 bleed cases → TC-VER-28). Datasets + LLM-judge prompts are versioned CIs; the judge is itself calibrated against a human-labelled slice (judge-agreement metric tracked; TODO threshold).
- **Security stack:** Burp Suite (isolation pen-test), testssl.sh (TLS), SAST/SCA/secrets/DAST from the Phase 06 CI table, ISO 27001 SoA audit, independent pen-test (IV&V) → TC-VER-26..33.
- **Reliability/perf stack:** k6 + OpenTelemetry (latency/load), Connector Contract/Chaos rig (Pact + fault injection) for degradation/circuit-breaker, Prometheus/Grafana SLO query for availability analysis → TC-VER-12,17–24,34–39.
- **Privacy/compliance:** GDPR/DPIA audit, residency IaC inspection, provider no-train term review, payload-minimization capture (mitmproxy) → TC-VER-25,38,40–43.

**Anomaly handling.** A failed verification or a missed eval threshold raises/updates a `RSK-<nn>` and routes the defect to Phase 08 severity (`S1`–`S4`, Conventions §5.1) and Phase 09 change control (`CR-<nn>`). A model/prompt change that drops an eval below baseline is an **S1 release-blocker** (zero-tolerance on MOP-05 unconfirmed-write; ≥ 99% on MOP-12 injection; ≥ 95% on MOP-04 grounding). Verification verifies against the **product baseline frozen at CDR**; this matrix + plan are themselves CIs under Phase 09.

---

## 7. Evidence Archive

> One convention. Evidence lives under the fixed folder **`verification-evidence/`** — no `evidence/` tree, no evidence column in §1.

```
Phase_07_Verification/
├── Verification_Matrix.md
├── VnV_Plan.md
└── verification-evidence/
    ├── TC-VER-01/   ├─ <demo recording / checklist sign-off>   └─ result.md
    ├── TC-VER-06/   ├─ <groundedness eval run, dataset+judge version, scored CSV>   └─ result.md
    ├── TC-VER-09/   ├─ <action-safety harness log: attempted writes vs fired>   └─ result.md
    ├── TC-VER-32/   ├─ <injection red-team run, per-payload outcome, neutralization %>   └─ result.md
    └── ... (TC-VER-01 … TC-VER-44)
```

Each `verification-evidence/TC-VER-<nn>/result.md` is a 1-pager: setup · observation · measured value vs threshold · pass/fail · evidence-file list · executor sign-off. For eval-based TCs (06, 07, 08, 09, 10, 28, 32) the result.md **must** record the frozen dataset version + judge-prompt version + model/prompt version under test, so a pass is reproducible and re-runnable on the next model rollout (SCN-07).

---

## 8. TRR Readiness

> Clear **TRR (Test Readiness Review)** only when the full Phase 07 exit-gate checklist passes (Conventions §3). Summary below; gate decision recorded.

- [x] **100%** of REQs (46/46) have a finalised T/I/A/D method (zero unassigned).
- [x] **100%** of REQs have ≥ 1 `TC-VER-<nn>` (zero `TC-VER-TBD`; SysRS §11 placeholders resolved to TC-VER-01..44).
- [x] Every method justified against verifiability; Phase-02 seed overrides noted (§1 Δseed: U-02, SEC-01, SEC-04, SEC-05).
- [x] Every tool named (no bare "Manual" — each carries a named checklist/standard); 1 parameter `TODO` flagged (REQ-U-01 sample size).
- [ ] `VnV_Plan.md` exists; integrity level set; IV&V decision recorded. → **TODO: author companion `VnV_Plan.md`** (decisions summarised in §6 above).
- [ ] Test environment + data ready (Phase 06 CI/CD + connector sandboxes + eval harness); a tool dry-run done. → **TODO: depends on Phase 06 (`INC-04` eval harness, connector mocks) — CDR not yet passed.**
- [ ] Continuous scans (Phase 06 stack) configured and passing their stated criteria (§3). → **TODO: gate wiring pending Phase 06.**
- [x] `verification-evidence/` structure created; per-TC `result.md` to be stubbed per TC.
- [x] Acceptance / UAT / red-team-with-users / productivity acceptance explicitly deferred to Phase 08 (§2 hinge).
- [ ] All blocking defects fixed; test team trained. → **TODO: pre-TRR.**
- [x] Necessary-but-not-sufficient caveat stated (banner + §5).

**Gate decision:** **Hold (pre-TRR)** — the matrix is method-complete and TC-complete (the two stop-the-line conditions pass), but TRR cannot be cleared until the companion `VnV_Plan.md` is authored and the Phase 06 eval harness + connector sandboxes are stood up and dry-run (CDR precedes TRR per Conventions §3). Open items are tracked `TODO` above. — TODO: TRR chair + date.

---

## References

- [`../../../05_Conventions.md`](../../../05_Conventions.md) — IDs (§2), gates incl. **TRR** (§3), **T/I/A/D (§4)**, severity (§5), baselines (§3), citations (§9). **The contract.**
- Inputs (source of truth): [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) (the 46 REQs + seeded methods + MOP/TPM), [`../Phase_01_Concept/Concept.md`](../Phase_01_Concept/Concept.md) (SN/STK/SCN/RSK/MOE), [`../README.md`](../README.md) (system-at-a-glance, traceability spine).
- Forward inputs (to be produced): `Phase_03_Modeling/Requirements_Diagram.puml` (resolve `<<verify>>` TC-VER-TBD → TC-VER-01..44), `Phase_04_Architecture/ICD.md` (ICD-01..06 — interface REQs verify against frozen rows), `Phase_06_Integration/Integration_Plan.md` (executors: CI/CD, eval harness `INC-04`, connector sandboxes, the scan/tool table §3 points to).
- Companion deliverable: `VnV_Plan.md` (IEEE 1012-2016 integrity-level-driven V&V plan — **TODO author**; decisions summarised in §6).
- Standards realised: ISO/IEC/IEEE 15288:2023 (Verification process) · **IEEE 1012-2016** (V&V) · ISO/IEC/IEEE 29148:2018 (verifiability/SMART) · ISO/IEC/IEEE 29119-3:2021 (test docs) — canonical forms per Conventions §9.
