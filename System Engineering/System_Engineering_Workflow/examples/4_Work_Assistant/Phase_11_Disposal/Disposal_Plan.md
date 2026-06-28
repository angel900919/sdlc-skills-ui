---
Document: Disposal & Retirement Plan — Aria AI-Powered Personal Work Assistant
Document ID: DISP-ARIA-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Disposal) + NIST SP 800-88 Rev. 1
Status: Draft
Owner: Lead Systems Engineer (decommissioning authority: STK-02; data authority: STK-05 DPO)
---

# Phase 11 — Disposal & Retirement: Aria

> Terminal lifecycle stage (ISO/IEC/IEEE 15288:2023 Disposal process). This plan retires Aria safely, lawfully, and reversibly-until-the-point-of-no-return, sanitizes data per **NIST SP 800-88 Rev. 1**, winds down licenses/contracts, communicates end-of-life, and archives knowledge + lessons-learned. IDs are stable for the project life (per Conventions §2); shared conventions (gates, severity, status strings, standard citations) are **cited, not redefined** (per Conventions §9). Exit gate: **DRR** (per Conventions §3).
>
> **Source-of-truth note.** This plan is grounded in `Phase_01_Concept/Concept.md` and `Phase_02_Requirements/SysRS.md` (the only baselined upstream artifacts at authoring time). Where it must reference design elements owned by phases not yet written (architecture blocks/`ICD-*` from SysRS §6/§12, integration increments `INC-*`, configuration items `CI-*`, SLOs `SLO-*`, runbooks `RB-*`), it uses the Conventions ID grammar and marks each forward-reference `TODO: <owed by phase NN>`. No conflicting IDs are introduced.

---

## 1. Purpose, Scope & Retirement Trigger

**Purpose.** Define how Aria is decommissioned at end-of-life without (a) leaking the email/CRM PII it processed, (b) leaving any of the four connected systems holding residual delegated access, (c) breaking a dependent system, (d) destroying records still under a retention or legal-hold obligation, or (e) losing the engineering knowledge accrued over the program.

**Disposal mode (per the SKILL triage).** **Software / service EOL.** Aria is a four-tier software + agentic SaaS (per SysRS §2); it owns **no** hardware of its own — it runs on contracted cloud infrastructure and the four connected systems remain the systems of record (per SysRS §1.2). Therefore:
- The hardware-only branches of NIST 800-88 (degauss, shred, physical destruction of media) are **not directly actionable by Aria** — the underlying storage media are the cloud provider's. Aria's controlling sanitization act is therefore **cryptographic erase (key destruction)** plus the cloud provider's contracted media-sanitization attestation (per §4).
- "Environmental / e-waste" (§5) reduces to **cloud-resource teardown + carbon release**; there is no RoHS/WEEE asset stream Aria owns.

**Retirement trigger (`why now` — select one at DRR; default carried below).**

| Candidate trigger | Applies when | Default for this plan |
|---|---|---|
| Replacement by a successor assistant | Org adopts a newer agent platform | **Primary assumed trigger** — *successor handover* (§8a) governs cutover; predecessor teardown gated on successor go-live. |
| Withdrawal of a key dependency | An LLM provider (`ICD-05`) or a connector API (`ICD-01..04`) is retired/sunset by its owner | Secondary — accelerates teardown of the affected connector only. |
| Business decision / contract end | Sponsor (STK-02) ends the program | Secondary. |
| Regulatory mandate | DPO (STK-05) / Works Council (STK-09) require shutdown | Override — compresses comms lead time; legal-hold rules still bind (§4). |

> **Confirm at DRR:** actual trigger and date. `TODO: STK-02 + STK-05 to confirm trigger and sunset date at DRR.`

**Target end-state.** **Fully gone, replaced by a successor** (default). Concretely: zero live Aria tenants; **zero residual OAuth grants** to Outlook/HubSpot/JIRA/Therefore for any user (per SCN-06, REQ-SEC-04); all email/CRM PII and assistant memory sanitized or migrated to the successor under lawful basis; the immutable audit log (REQ-SEC-06) **retained** to its statutory window in the archive (§9); knowledge package archived; all cloud resources and the LLM provider contract (`ICD-05`) closed out.

**The retirement is itself a controlled change.** Opened as **`CR-DISP-01`** ("Retire Aria — full decommission") against the product baseline (per Conventions §3; raised under the Phase-09 change process — `TODO: link CR-DISP-01 in Phase_09 CR_Log once Phase 09 is authored`). No irreversible teardown step (§3, flagged ⛔) executes before `CR-DISP-01` and this plan are **DRR-approved**.

**Scope.** In: teardown of all Aria-owned tiers (Client, Application, Integration, Trust-boundary per SysRS §2); per-user token revocation across all four connectors; sanitization of every Aria-owned data store; license/contract/subscription wind-down; EOL comms; successor handover; knowledge archival + lessons-learned. Out: decommissioning of the four connected systems themselves (owned by STK-06 — Aria only **detaches**); disposal of corporate IdP (STK-03 owns); any physical media destruction inside the cloud provider (provider-owned, covered by contracted attestation).

---

## 2. Authority & Stakeholders

| Concern | Holder | Source |
|---|---|---|
| Decommissioning authority (go/no-go on DRR + ⛔ steps) | **STK-02** (Team Manager / Sponsor) | Concept §2 |
| Data-disposal authority (sanitization, erasure, retention/hold sign-off) | **STK-05** (DPO) | Concept §2; SCN-06 lead |
| Token revocation / IdP de-provisioning | **STK-03** (IT / Identity & Access Admin) | Concept §2; SCN-06 lead |
| Security sign-off (data-at-rest exposure, key destruction) | **STK-04** (Security & Compliance Officer) | Concept §2 |
| Teardown execution / cloud-resource release | **STK-07** (Platform / SRE & On-call) | Concept §2 |
| Model/prompt artifact + eval-set disposition | **STK-08** (AI/ML Engineering Lead) | Concept §2 |
| Connected-app detachment coordination | **STK-06** (System Owners of the 4 apps) | Concept §2 |
| Workforce transparency / no-covert-monitoring assurance at EOL | **STK-09** (Works Council) | Concept §2; SN-14 |

**Contract EOL / handback terms (`TODO: owed by Phase 00 Agreement_Register / SEMP`).** Notice periods, data-return obligations, and the LLM-provider no-retention term (REQ-C-02) are owed by the Phase-00 agreements, which are not yet authored. `TODO: STK-02 to supply (a) customer data-return obligation, (b) contractual termination notice periods per connected-app and per LLM provider, (c) escrow terms — feeds §7 and §8.` Until supplied, comms lead times in §8 are `TODO` (per the SKILL rule: do not guess legal notice windows).

**Notify-list** (derived from the Concept §2 stakeholder register + the Phase-10 user base): all provisioned employees (STK-01), STK-02, STK-03, STK-04, STK-05, STK-06 (each of the four app owners), STK-07, STK-08, STK-09, STK-10 (LLM/cloud provider). Detail in §8.

---

## 3. Decommissioning Sequence (reverse-integration teardown)

The teardown is the **reverse** of the Phase-06 integration order (last integrated → first removed), so every dependent is detached before the thing it depends on, and Aria stays **safe and observable** mid-teardown. Phase 06 is not yet authored, so the increment IDs below are **forward-references** to the integration plan; the *order* is derived from the Architecture dependency direction stated in SysRS §2 (Client → Application → Integration → upstreams) and §12 (block list). `TODO: reconcile INC-* numbering against Phase_06/Integration_Plan.md once authored — order, not numbering, is the binding artifact here.`

**Reversible staging first (read-only → drain → mothball), then irreversible (⛔) only after DRR sign-off.**

| Seq | Precondition | Action | Owner | Reverses (INC-*) | Rollback point? | Verify | Point of no return? |
|---|---|---|---|---|---|---|---|
| **D-01** | DRR approved; EOL comms sent (§8); successor live if replacing (§8a) | Announce maintenance window; put Aria in **Maintenance** mode (SysRS §9) — eval-gate frozen, rollback armed | STK-07 | — (op posture) | ✅ full rollback | Mode banner visible; users notified | No |
| **D-02** | D-01 done | Disable **write** path: Action-Confirmation Gate set to refuse all new write proposals; Agent Orchestrator enters **read-only**. Pending Confirm-Pending writes are cancelled (REQ-F-10 — no side effect) | STK-07 + STK-08 | reverses the write-tooling increment `INC-TBD` | ✅ rollback (re-enable) | Attempt a write → asserted refused; 0 executes (cf. MOP-05) | No |
| **D-03** | D-02 done | Drain user traffic: redirect to successor (§8a) or to a static EOL notice; dashboard read-only; **chat disabled** | STK-07 | reverses dashboard/chat increment `INC-TBD` | ✅ rollback | Synthetic check: new sessions land on EOL/successor; 0 active chat sessions | No |
| **D-04** | D-03 done; quiet period elapsed (`TODO: window`) | **Revoke per-user delegated OAuth tokens** to all four connectors via IdP + secrets vault purge of refresh tokens (SCN-06; REQ-SEC-04 — within 5 min of IdP revocation) | STK-03 | reverses Identity/Token Broker increment `INC-TBD` | ✅ rollback (re-consent + SSO → Ready, per SysRS §9) | Probe each connector with old token → 401/invalid_grant; **0 residual grants** (MOE-04 = 0 leak) | No (re-consent restores) |
| **D-05** | D-04 done; STK-06 notified | Detach each connector at the Connector Gateway: tear down the four OAuth **app registrations** (`ICD-01..04`) and the LLM provider app credential (`ICD-05`) | STK-07 + STK-06 | reverses connector increments `INC-TBD` (×4) + LLM increment | ⚠️ partial (re-register is re-provisioning, not rollback) | Gateway health: all four upstreams unreachable by design; SSO/IdP (`ICD-06`) still up for admin | No (last reversible-ish step) |
| **D-06** | D-05 done; **retention/legal-hold satisfied (§4)**; **archive package staged (§9)**; **customer-return complete (§4)** | ⛔ **Sanitize Aria-owned data stores** per §4 (crypto-erase keys; purge caches/indices/logs/secrets/backups) | STK-05 + STK-04 + STK-07 | reverses RAG index + data-tier increments `INC-TBD` | ❌ none — **POINT OF NO RETURN** | Per-store sanitization verification + Certificate of Sanitization (§4) | ⛔ **YES — first irreversible step** |
| **D-07** | D-06 verified | ⛔ **Destroy** model/prompt artifacts not retained, eval-set copies containing customer data, and CI/CD secrets; tear down all cloud compute/storage/network resources | STK-08 + STK-07 | reverses the deployment/infra increment `INC-TBD` | ❌ none | Cloud account shows 0 running resources; secrets vault empty; billing → 0 | ⛔ YES |
| **D-08** | D-07 done | Archive repositories **read-only** (do **not** destroy — §9); release domains + revoke TLS certs (`ICD-06` edge); cancel subscriptions/contracts (§7) | STK-07 + STK-03 | reverses the foundational provisioning increment `INC-01` (first integrated) | ❌ none (cancellations) | Repos archived & immutable; domains released; final invoices reconciled | ⛔ YES |
| **D-09** | D-08 done | Final CM status accounting: mark every `CI-*` **Retired/Superseded**; close `CR-DISP-01`; record system **Disposed** | STK-07 + CM (Phase 09) | — (status accounting) | n/a | CM register shows all CIs disposed; lessons-learned routed (§9) | n/a |

**Points of no return:** **D-06** is the first irreversible step (key destruction defeats all later recovery). Everything D-01→D-05 is reversible (re-enable / re-consent / re-register). The DRR sign-off (per Conventions §3) is the single gate that authorizes crossing into D-06.

---

## 4. Data Handling & Sanitization (NIST SP 800-88 Rev. 1)

Action chosen by the **data's confidentiality categorization** (not the medium), then **verified + certified** (Certificate of Sanitization). All Aria-owned stores live on **cloud-provider media Aria cannot physically destroy**, so the controlling Purge mechanism is **cryptographic erase (CE) — destruction of the data-encryption keys** held in the secrets vault — backed by the provider's contracted media-sanitization attestation. This satisfies REQ-SEC-05 (AES-256 at rest) → CE is well-founded.

> **Categorization legend:** **High** = email/CRM PII + tokens (REQ-SEC-05, REQ-C-01); **Mod** = derived/operational; **Low** = non-personal config.

| Store / Media | Data categorization | Action (Clear/Purge/Destroy) | Method | Verification | Cert ref | Retention / Hold? |
|---|---|---|---|---|---|---|
| **OAuth token vault** (refresh/access tokens — REQ-SEC-04) | High | **Purge** | Crypto-erase: destroy vault KEK + delete token entries; confirm IdP-side revocation (D-04) | Probe all 4 connectors → invalid_grant; vault key-list empty | CERT-DISP-01 | **No** — revoke ASAP (SCN-06); never retained |
| **Per-user RAG index / embeddings** (mirrors email/doc/CRM content — REQ-F-06) | High | **Purge** | Crypto-erase per-user index keys; delete index shards | Sample queries return empty; key store empty | CERT-DISP-02 | **No** (unless legal-hold flag on a user — see hold list) |
| **Assistant memory / conversation history** (REQ-O-05) | High | **Purge** | Crypto-erase + delete; honor any per-user erasure already requested | Per-user fetch returns empty (REQ-O-05 purgeable) | CERT-DISP-03 | **No** beyond REQ-O-05 retention window (`TODO: window set at DPIA — REQ-O-05`) |
| **Caches** (dashboard aggregation, connector response caches) | High (transient PII) | **Clear** then teardown | Flush + factory-reset cache tier; then resource teardown (D-07) | Cache miss on probe; tier deprovisioned | CERT-DISP-04 | No |
| **Application/connector logs** (may embed PII fragments) | Mod–High | **Purge** | Crypto-erase log store keys after the §9 audit-record extract | Log store key destroyed; archive extract verified first | CERT-DISP-05 | **Partial** — see audit log row |
| **Immutable audit log** (REQ-SEC-06 — actor/tool/target/outcome) | High | **RETAIN → archive, do NOT destroy** | Migrate tamper-evident export to §9 archive **before** any wipe | Hash-chain integrity verified on the archived copy | — | **YES — retention/legal-hold** (`TODO: statutory window — owed by STK-05/DPIA; GDPR Art. 30 records of processing`) |
| **Secrets / CI-CD credentials** (LLM API key `ICD-05`, vault creds) | High | **Destroy (logical)** | Revoke at provider; crypto-erase secret store; rotate-then-void | Provider dashboard shows key revoked; store empty | CERT-DISP-06 | No |
| **Backups / snapshots** (DB, index, config) | High | **Purge** | Crypto-erase backup-set keys; delete snapshots incl. cross-region | Backup catalog empty across all regions (REQ-C-01) | CERT-DISP-07 | No (after audit extract) |
| **Model/prompt artifacts** (no customer data) | Low | **Clear / archive** | Archive the baselined prompt/model-config (no PII) to §9; delete working copies | Archive entry present; working copies gone | — | Archive (knowledge), not hold |
| **Eval sets** containing real customer data | High | **Destroy** | Delete; synthetic eval sets may be archived | Real-data eval copies gone | CERT-DISP-08 | No |

**Retention / legal-hold list (migrate to archive BEFORE any wipe — D-06 precondition).**
1. **Audit log** (REQ-SEC-06) — statutory window `TODO: STK-05/DPIA`; GDPR Art. 30 processing records.
2. Any **per-user data under an active legal-hold flag** — held until release; **excluded from D-06** until STK-05 clears it. `TODO: STK-04/STK-05 to enumerate active holds at DRR.`
3. **DPIA + processing-activity records** (REQ-D-01, GDPR Arts. 30/35) — archived, not destroyed.

**Customer-return list (GDPR Art. 15/20 portability; export BEFORE wipe).** On EOL, each employee (STK-01) may export their assistant data and any Aria-held copies. The **systems of record (the four connected systems) already hold the authoritative data** (SysRS §1.2), so Aria's return obligation is limited to assistant-memory/history export. `TODO: STK-05 to confirm customer-return obligation against the Phase-00 contract; publish export deadline in §8.`

**Key-destruction plan (the controlling act).** Crypto-erase order: (1) per-user index/memory keys → (2) token-vault KEK → (3) backup-set keys → (4) log-store keys (after audit extract) → (5) secrets/CI-CD keys. Each key destruction is logged to the **audit log before the audit log itself is extracted and its store keyed** (i.e., the audit log is the *last* PII store sanitized, after its own export). Provider media-sanitization attestation (NIST 800-88 §4 / SP 800-53 MP-6) is filed as **CERT-DISP-CLOUD**. `TODO: STK-10/STK-07 obtain provider attestation.`

---

## 5. Environmental, Recycling & Resource Disposition

Aria owns **no RoHS/WEEE hardware asset stream** (pure software SaaS — §1). The §5 obligation reduces to:

| Item | Action | Owner | Note |
|---|---|---|---|
| Cloud compute / storage / network | Deprovision all resources (D-07/D-08); confirm 0 running, billing → 0 | STK-07 | No e-waste; provider handles physical media end-of-life under its own RoHS/WEEE program + the CERT-DISP-CLOUD attestation. |
| Cloud carbon / resource release | Record final resource footprint for LCC/sustainability closeout | STK-07 | Feeds Cost/Schedule thread (lifecycle-cost closure). `TODO: capture final footprint.` |
| Local engineering hardware (dev laptops, if any project-owned) | Return to corporate IT asset pool → corporate WEEE/e-waste process (not Aria-specific) | STK-03 | Out of Aria scope; corporate IT process governs. |

No hazardous-material, battery, refrigerant, or site-restoration handling applies (no Aria-owned physical plant). No special-domain disposal regime (no space/nuclear/medical) governs Aria (per README — no DO-178C/26262/62304 obligation).

---

## 6. Obsolescence & Spares Disposition

Aria holds **no physical spares/tooling inventory** (software SaaS). The analogous "assets" are intangible and dispositioned as:

| Asset class | Disposition | Owner | Target |
|---|---|---|---|
| Source repositories (Client, services, connectors, eval harness) | **Archive read-only** (knowledge — §9); do not destroy | STK-07/STK-08 | D-08 |
| Connector adapter code (`ICD-01..04` clients) | Archive; **harvest** reusable connector patterns for the successor (DMSMS-analogue: connector APIs change — banked patterns de-risk a rebuild) | STK-08 | D-08 / §8a |
| Baselined model/prompt config + synthetic eval sets | Archive (no PII — §4) | STK-08 | §9 |
| Decision register `DEC-01..05`, ICDs, V&V evidence | Archive (§9) | LSE | §9 |
| Domain names / TLS certs | Release / revoke (§7) | STK-03 | D-08 |

No DMSMS hardware-obsolescence exposure. `OPP-DISP-01` (salvage/redeploy upside): the connector patterns and eval harness are reusable by the successor — captured as an opportunity (per Conventions §2.4; `TODO: log OPP-DISP-01 in Risk_Opportunity_Register`).

---

## 7. License, Contract & Service Wind-Down

**Sequence: cancel LAST — after data export (§4) and after end-of-support (§8).** Never cut a service the teardown still needs (e.g., the secrets vault is needed through D-06; the LLM API through D-03).

| Agreement | Action | Cancel after | Notice period | Owner |
|---|---|---|---|---|
| LLM/cloud provider — model API (`ICD-05`, STK-10) | Terminate after D-03 (chat disabled) and key revocation (D-07); confirm no-retention term (REQ-C-02) honored on provider side | D-07 | `TODO: owed by Phase 00` | STK-08 + STK-02 |
| Cloud infrastructure subscription | Cancel after D-07 resource teardown + final footprint capture (§5) | D-07/D-08 | `TODO: Phase 00` | STK-07 |
| Connected-app API agreements ×4 (Outlook/Graph, HubSpot, JIRA, Therefore — STK-06) | Detach app registrations (D-05); close any paid API tier after detachment | D-05 | `TODO: per-app, Phase 00` | STK-06 + STK-02 |
| Secrets-vault / security-tooling subscriptions | Cancel after D-06 (vault used through key destruction) | D-06 | `TODO` | STK-04 |
| Domain registration + TLS certs (`ICD-06` edge) | Release domains; revoke certs | D-08 | n/a | STK-03 |
| Observability / eval-tooling SaaS | Cancel after the ops record + lessons-learned extract (§9) | D-08 | `TODO` | STK-07 |
| Source-escrow (if any) | Per contract | `TODO: confirm escrow exists — Phase 00` | `TODO` | STK-02 |

`TODO: STK-02 to supply all termination notice periods from the Phase-00 Agreement_Register so notices in §8 go out on time.`

---

## 8. End-of-Support / End-of-Life Communications

Timeline built **backwards from the sunset date** (= D-03 user-traffic drain). Lead times are `TODO` pending the Phase-00 contractual notice windows (per SKILL rule — do not guess legal notice periods).

| Audience | Message | Channel | Send (relative to sunset S) | Owner |
|---|---|---|---|---|
| All provisioned employees (STK-01) | EOL announcement: sunset date, supported-until date, **what stops working** (chat, writes, dashboard), migration path to successor (§8a), **data-export deadline** | In-app banner + email | **S − `TODO` lead** (initial), reminders at S−14d, S−2d, S−0 | STK-02 + STK-07 |
| Works Council (STK-09) | Workforce notice + reaffirm SN-14 (no covert monitoring); confirm memory/history sanitization plan | Formal consultation | **S − `TODO` (statutory)** | STK-02 + STK-09 |
| DPO record (STK-05) | Erasure plan, retention of audit log, DPIA closure | Internal | Before D-06 | STK-05 |
| IT/Identity (STK-03) | Token-revocation + IdP de-provisioning schedule (D-04) | Internal runbook | S − `TODO` | STK-03 |
| Connected-app owners ×4 (STK-06) | App-registration detachment date (D-05), expected API quiesce | Email | S − `TODO` (per app terms) | STK-06 |
| LLM/cloud provider (STK-10) | Contract termination notice, no-retention confirmation | Contract channel | S − `TODO` (notice period) | STK-02 |
| SRE/On-call (STK-07), AI Lead (STK-08) | Teardown runbook + rollback windows (D-01…D-09) | Runbook `RB-DISP-01` | S − `TODO` | STK-07 |

**Data-export deadline:** published in the employee EOL announcement; export window closes **before D-06** (point of no return). `TODO: set exact deadline once sunset date fixed.`
**Runbook:** `RB-DISP-01` — "Aria decommissioning teardown & rollback" (forward-reference; `TODO: author RB-DISP-01 in Phase_10/runbooks, extending the Phase-10 runbook set RB-*`).

---

## 8a. Successor Handover (default trigger = replacement)

If retiring **in favor of a successor assistant** (the assumed default — §1), the successor's go-live **gates** the predecessor teardown (D-03 redirects to it).

| Handover item | What transfers | Lawful basis / control |
|---|---|---|
| User/account migration | Re-consent each employee to the successor under fresh OAuth (Aria's tokens are **not** transferable — revoked at D-04) | New delegated grants per REQ-SEC-02; no token reuse |
| Data migration | **None of Aria's PII copies migrate automatically** — the four systems of record already hold the data; the successor re-indexes from them under its own scopes | Avoids a second PII copy; GDPR data-minimization (Art. 25) |
| Assistant memory/history | Migrate only on explicit per-user opt-in + export (§4 customer-return) | User consent; else Purged at D-06 |
| Integration configs | Connector patterns + ICD seam definitions (`ICD-01..06`) handed over as knowledge | §9 archive; harvested per §6 |
| Knowledge package | The §9 archive (SysRS, DEC-*, V&V evidence, lessons-learned) inherited by the successor's Phase 01 | §9 |
| Cutover / parallel-run | Parallel-run window then traffic drain (D-03) | `TODO: window owed by STK-07 + successor team` |

If **no successor** (business-decision or regulatory trigger), §8a is void; D-03 redirects to a static EOL notice and all memory is Purged at D-06.

---

## 9. Knowledge Archival & Lessons-Learned

**Archive package (staged before D-06; the archive is sanitization-EXEMPT and tamper-evident).**

| Content | Source | Why preserved |
|---|---|---|
| `Concept.md`, `SysRS.md` (baselined) | Phases 01–02 | Requirements provenance, SN→REQ trace (SysRS §14) |
| Architecture, ICDs (`ICD-01..06`), Tech-Stack rationale | Phase 04 (`TODO: when authored`) | Design rationale for the successor |
| Decision register `DEC-01..05` + decision matrices `DM-01..05` | Phase 05 (`TODO`) | Why each strategic choice (LLM, RAG, build-vs-buy, token store, action-safety) was made |
| V&V evidence — groundedness/injection/isolation/action-safety eval results, `TC-VER-*`/`TC-VAL-*` | Phases 07–08 (`TODO`) | Proof the trust controls worked; reusable eval methodology |
| CM status accounting, build/config recipe, `CI-*` register | Phase 09 (`TODO`) | Reproducibility / audit |
| Operations record — `SLO-*` attainment, incident history, `RB-*` runbooks, drift logs | Phase 10 (`TODO`) | Real-world reliability + the lessons-learned substrate |
| **Final TPM actuals** — TPM-01 (groundedness), TPM-02 (availability), TPM-03 (injection defense) | SysRS §10 | Did the system meet its measures over life? Feeds Measurement thread + lessons-learned |
| **Audit log** (retained copy) | REQ-SEC-06 | Statutory retention (§4) |
| Synthetic eval sets + baselined model/prompt config (no PII) | Phase 08 | Reusable test assets |

**Archive controls:** open/long-lived format (Markdown + JSON + signed manifests); WORM/immutable store; access-controlled (read: STK-02/STK-05/successor team); integrity = hash-manifest so the archive itself is tamper-evident and excluded from sanitization. Retention `TODO: set per longest applicable statutory window — owed by STK-05`. Location `TODO: corporate knowledge repository / Quality thread store`.

**Lessons-learned retrospective (DRR exit criterion — not optional).** Run across the whole lifecycle and **route to the Quality/Knowledge thread** so the next project reuses it. Seed prompts grounded in Aria's four hard problems (README): (1) Did per-user least-privilege isolation (REQ-SEC-02/-03, RSK-02) hold in production — any cross-user near-misses? (2) Injection-defense efficacy over life vs. TPM-03/MOP-12 target — what attacks surprised us (RSK-01)? (3) Did HITL write-confirmation (REQ-SAF-01/-02, MOP-05) preserve trust without killing productivity (the SN-11 vs SN-04 tension, SysRS §15)? (4) Grounding/hallucination control (REQ-F-06, TPM-01) — drift over time (RSK-07)? (5) Graceful degradation (REQ-O-02/-03) under real upstream outages (RSK-06)? (6) DPIA/erasure (REQ-D-01, RSK-05) — friction points? Each finding gets an owner + an actionable recommendation for the successor's Phase 01. `TODO: schedule retrospective; route output to Quality/Knowledge thread.`

---

## 10. Disposal Risk / Safety / Security

Disposal-specific risks scored Likelihood×Impact (per Conventions §5.3). New IDs continue the project risk sequence (per Conventions §2.4 — `TODO: register in Risk_Opportunity_Register without renumbering existing RSK-01..07`).

| ID | Disposal risk | L | I | Band | Mitigation (step) |
|---|---|---|---|---|---|
| **RSK-DISP-01** | Premature destruction of data still under retention/legal-hold (audit log, held users) | 3 | 5 | **High** | §4 hold list migrated to archive **before** D-06; D-06 precondition gates on it; STK-05 sign-off |
| **RSK-DISP-02** | Recoverable PII left behind — a forgotten store (backup, cache, log, secrets) not crypto-erased | 3 | 5 | **High** | §4 enumerates **all** stores incl. backups/caches/logs/secrets; per-store Certificate of Sanitization; `TODO: run data-discovery agent to confirm no orphan store` |
| **RSK-DISP-03** | Residual OAuth grant survives teardown → an upstream still trusts a revoked Aria | 2 | 5 | **High** | D-04 IdP revocation + vault purge + post-revocation probe per connector (MOE-04 = 0); 5-min bound (REQ-SEC-04) |
| **RSK-DISP-04** | A dependent system breaks when Aria is removed | 2 | 3 | **Medium** | Aria is a leaf consumer (systems of record are upstream); EOL comms to STK-06; `TODO: dependency-blast-radius check confirms no downstream consumer of Aria` |
| **RSK-DISP-05** | LLM provider retains customer content past termination (REQ-C-02 breach) | 2 | 4 | **Medium** | Contractual no-retention term (REQ-C-02); termination notice + written confirmation (§7); CERT-DISP-CLOUD |
| **RSK-DISP-06** | Irrecoverable knowledge loss — lessons-learned/archive skipped under shutdown pressure | 3 | 4 | **High** | §9 archive + retrospective are **hard DRR exit criteria**; staged before D-06 |
| **RSK-DISP-07** | Cross a point-of-no-return (D-06) before DRR sign-off | 2 | 5 | **High** | ⛔ steps gated on `CR-DISP-01` + DRR approval; reversible staging (D-01…D-05) precedes all destruction |

**Hazard log** (`TODO: add to Hazard_Log.md`): no physical decommissioning hazards (no stored energy / hazardous materials — software SaaS). **HAZ-DISP-01** (analogue): *destructive action during teardown executed on the wrong tenant/region* — mitigated by D-06 per-store verification + region scoping (REQ-C-01) before crypto-erase.

**Threat model — data-at-rest exposure during teardown** (`TODO: add to Threat_Model.md`): **THR-DISP-01** — PII in backups/index/logs is a live attack surface from D-01 until D-06 Purge completes; the *archive* (§9) remains a standing surface post-disposal. Mitigation: access controls and encryption persist through teardown; archive is access-controlled WORM; key destruction (not just deletion) is the terminal control.

---

## 11. DRR Readiness

**Gate: DRR (Decommissioning Readiness Review)** — *"Passes when: retirement plan, data sanitization, environmental & archival approved"* (per Conventions §3). DRR is the single authorization to cross into the ⛔ irreversible steps (D-06+).

| DRR exit criterion | Status |
|---|---|
| Retirement trigger, end-state, disposal mode documented; opened as `CR-DISP-01` against the product baseline | **Met** (trigger default §1; `TODO: confirm trigger/date; link CR-DISP-01 in Phase 09`) |
| Decommissioning sequence = reverse of Phase-06 integration; owner, rollback, verify per step; points of no return flagged | **Met** (§3; `TODO: reconcile INC-* numbering vs Phase 06`) |
| §4 sanitization table complete — action by data categorization, method, verification, Certificate ref per store | **Met** (§4; provider attestation `TODO: CERT-DISP-CLOUD`) |
| Retention/legal-hold data identified, migrated to archive before wipe; customer-return path defined | **Met (plan)** (§4; statutory window + active holds `TODO: STK-05`) |
| Key/secret/credential destruction planned incl. backups/caches/logs/secrets | **Met** (§4 key-destruction plan) |
| Environmental plan — cloud-resource teardown + carbon; no Aria-owned e-waste | **Met** (§5; final footprint `TODO`) |
| Obsolescence & spares disposition decided per asset class | **Met** (§6; intangible assets) |
| License/contract/service wind-down sequenced after export + EOS, notice periods honored | **Partly** (§7; notice periods `TODO: Phase 00`) |
| EOL comms scheduled backwards from sunset; migration path + export deadline published | **Partly** (§8; lead times `TODO: Phase 00`) |
| Successor handover defined; predecessor teardown gated on successor go-live | **Met (plan)** (§8a; cutover window `TODO`) |
| Knowledge archive staged (contents/location/retention/integrity) + lessons-learned written and routed to Quality/Knowledge thread | **Partly** (§9 contents defined; retrospective `TODO: schedule`; upstream phase artifacts `TODO` as authored) |
| Disposal `RSK-*` scored; hazards in Hazard_Log; data-at-rest exposure in Threat_Model | **Met (this doc)** (§10; `TODO: register in cross-cutting logs`) |
| Frontmatter present; open items are named `TODO`s with owners; no irreversible step before precondition clears | **Met** |

**Outstanding TODOs (owner / by when):**
1. Confirm retirement trigger + sunset date — **STK-02 + STK-05**, by DRR.
2. Supply contractual notice periods + customer-return + escrow terms — **STK-02 (from Phase-00 Agreement_Register)**, before §7/§8 finalize.
3. Set retention windows (audit log, REQ-O-05 memory) + enumerate active legal-holds — **STK-05**, before D-06.
4. Obtain cloud-provider media-sanitization attestation (CERT-DISP-CLOUD) + LLM no-retention confirmation — **STK-10/STK-07**, before D-07.
5. Reconcile `INC-*` numbering vs `Phase_06/Integration_Plan.md`; author `RB-DISP-01` in Phase-10 runbooks — **STK-07**, before teardown.
6. Run data-discovery + dependency-blast-radius checks (RSK-DISP-02/-04) — **STK-04/STK-08**, before DRR.
7. Schedule lessons-learned retrospective; route to Quality/Knowledge thread; set archive location/retention — **LSE + STK-02**, before DRR.

**Recommendation:** **Proceed-to-DRR with actions.** On DRR approval, `Status → Baseline (DRR-approved YYYY-MM-DD)`, `CR-DISP-01` is authorized, the lifecycle closes, and the **lessons-learned package flows forward** to the Quality/Knowledge thread and the successor's Phase 01 (per Conventions §8 / the SKILL terminal note).
