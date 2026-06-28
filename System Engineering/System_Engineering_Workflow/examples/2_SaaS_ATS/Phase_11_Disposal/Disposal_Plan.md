---
Document: Disposal & Retirement Plan — TalentFlow
Document ID: DISP-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Disposal) + NIST SP 800-88 Rev. 1
Status: Draft
Owner: SRE / Platform Lead (STK-07) — with Security & Privacy Lead as co-owner of the sanitization plan
---

# Disposal & Retirement Plan — TalentFlow

The terminal lifecycle deliverable (Conventions §1, Stage 11). It retires TalentFlow — or, in the routine case, **offboards a single tenant** — safely, lawfully, and without losing the institutional knowledge built across Phases 00–10. It sequences the decommissioning as the **reverse of the Phase-06 integration order**, sanitizes every data store per **NIST SP 800-88 Rev. 1** (Clear / Purge / Destroy chosen by data categorization), winds down licenses and contracts, communicates end-of-support, and archives the baseline package plus lessons-learned. Exit gate: **DRR (Decommissioning Readiness Review)** (Conventions §3).

This document conforms in full to [`../../05_Conventions.md`](../../../05_Conventions.md) for all IDs, gates, T/I/A/D methods (Conventions §4), S1–S4 severity (Conventions §5), baselines, status strings (Conventions §6), and standard citations (Conventions §9). It **cites** those, never redefines them.

> **Two disposal scopes in one plan.** TalentFlow is multi-tenant SaaS, so "disposal" has two flavours:
> - **Per-tenant offboarding (routine, recurring)** — a single customer leaves; their data is exported, retained for a contractual grace window, then crypto-erased. This is the path already designed in [`SCN-05`](../Phase_01_Concept/Concept.md#scn-05--tenant-offboarding--data-destruction-maintenance--eol) and required by [`REQ-SEC-08`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-) / [`REQ-O-04`](../Phase_02_Requirements/SysRS.md#71-operational--reliability-requirements-req-o-). It runs under the **Offboarding/EOL** mode of [`SysRS §9`](../Phase_02_Requirements/SysRS.md#9-modes--states). It is operational and does **not** require a fresh DRR each time — it runs under the standing DRR-approved runbook `RB-OFFBOARD` (this plan, §3.1).
> - **Whole-product retirement (one-time, terminal)** — the entire TalentFlow service is sunset (business decision, successor product, or unrecoverable obsolescence). This is the full reverse-integration teardown (§3.2) and the event the **DRR** gates.
>
> Both scopes use the same NIST 800-88 sanitization table (§4) and the same archival discipline (§9).

---

## 1. Purpose, Scope & Retirement Trigger

### 1.1 Why this plan exists
Per the SEMP, TalentFlow's "Disposal" collapses to **software end-of-life** — tenant offboarding + crypto-erase per NIST SP 800-88 Rev. 1, with no hardware to dismantle ([`SEMP §1.2`](../Phase_00_Agreement/SEMP.md), §6.2 "Manufacturing/HIL tailored out"). There is therefore **no physical e-waste, RoHS/WEEE, hazardous-material, or spares-disposition burden** for TalentFlow's own assets — those obligations sit with the cloud provider, not the tenant or TalentFlow Inc. (§5 records this explicitly rather than skipping it silently, per Conventions §1 tailoring).

### 1.2 Disposal mode (per the stage-skill triage)
**Software / service EOL** (not hardware, not hybrid, not special-domain). All assets are cloud-managed: managed Postgres (primary store), a search index, object storage (attachments), backups/snapshots, a secrets/KMS store, and logs. Teardown is traffic-drain → read-only → export → crypto-erase → resource teardown, never disassembly.

### 1.3 Target end-state
| Scope | Trigger | Target end-state |
|---|---|---|
| **Per-tenant offboarding** | Subscription ends, or customer requests export + deletion ([`SCN-05`](../Phase_01_Concept/Concept.md#scn-05--tenant-offboarding--data-destruction-maintenance--eol)). | Tenant fully offboarded: data exported to the customer, retained for the contractual grace window, then crypto-erased across all stores with a Certificate of Sanitization issued; **no residual cross-tenant artifacts** (upholds [`MOP-11`](../Phase_02_Requirements/SysRS.md#101-measures-of-performance-from-req) = 0). |
| **Whole-product retirement** | Business decision / successor product / EOL of a foundational dependency. | Service **fully gone** (default) or **replaced by a successor** (§8a). All tenant data exported or destroyed per obligation; all cloud resources torn down; all keys destroyed; baseline package + lessons-learned archived. |

The specific trigger and date for a *whole-product* retirement is **TODO: owed by Product/Business Owner (STK-06) when a sunset decision is taken** — this plan is the standing readiness artifact; no whole-product retirement is in flight at authoring time.

### 1.4 The retirement is a controlled change
The whole-product retirement is opened as **CR-RETIRE-01** against the **Product baseline** (set at CDR — [`SEMP §7`](../Phase_00_Agreement/SEMP.md)), routed through the Phase-09 CCB. *(Per-tenant offboarding is routine operations under `RB-OFFBOARD`, not a CR.)* CR-RETIRE-01 carries impact analysis on every dependent system (§3.2 blast radius), the points-of-no-return (§3), and the sanitization/archival evidence as its closure criteria. Final status accounting records the product baseline as **`Superseded`** (Conventions §6) on DRR sign-off. *(CR-RETIRE-01 is the placeholder ID for the retirement change; Phase 09 assigns the live `CR-<nn>` when the sunset decision is taken.)*

### 1.5 Assumptions carried forward
- Each tenant owns its data and is the GDPR **controller**; TalentFlow Inc. is the **processor** ([`SysRS §1.3`](../Phase_02_Requirements/SysRS.md#13-definitions), [`REQ-D-01`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements)). Data-return and post-termination deletion terms live in the per-tenant **DPA** (companion to `Agreement_Register.md`, **TODO** from Phase 00).
- At-rest data uses **per-tenant key separation** (managed cloud KMS) — already required by [`REQ-SEC-03`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-). This makes **cryptographic erase (key destruction) the efficient, backup-covering Purge** and is the backbone of §4.
- The contractual export/grace window per tenant is **TODO: owed by the DPA** (typical SaaS: 30–90 days). No window is invented here.
- Statutory record-retention windows (which non-PII audit metadata must outlive erasure) are **TODO: owed by Legal/Privacy** — see §4.3.

---

## 2. Authority & Stakeholders

### 2.1 Disposal authority
| Decision | Authority (RACI per [`SEMP §3`](../Phase_00_Agreement/SEMP.md)) |
|---|---|
| **DRR verdict** (whole-product retirement) | **A:** Product/Business Owner (**STK-06**) — owns the value/deal gates. **R:** SRE/Platform Lead (**STK-07**), Security & Privacy Lead. |
| Sanitization plan sign-off (NIST 800-88) | **A:** Security & Privacy Lead (owns REQ-SEC-*, the Formal overlay — [`SEMP §6.1`](../Phase_00_Agreement/SEMP.md)). |
| Per-tenant offboarding execution | **A:** SRE/Platform Lead (STK-07) per `RB-OFFBOARD`; **C:** Customer Admin (STK-04) authorises; Privacy Officer (STK-05) for erasure proof. |
| Retirement CR (CR-RETIRE-01) | **A:** CM/Release Manager routes; CCB decides (Phase 09). |

### 2.2 Contract EOL / handback terms (from Phase 00)
The per-tenant **DPA** and the master subscription agreement govern: data-return format and deadline, post-termination deletion window, and breach/audit-support obligations surviving termination ([`REQ-D-01`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements) — GDPR Arts. 17, 28, 30, 32). Exact notice periods and windows are **TODO: owed by `Agreement_Register.md` / DPA (Phase 00)** — never guessed here (Conventions: invent no false numbers).

### 2.3 Notify-list (derived from the Phase-01 stakeholder register, [`Concept §2`](../Phase_01_Concept/Concept.md#2-stakeholders))
| Audience | Why notified | Detail in |
|---|---|---|
| Customer Admin (**STK-04**) | Sunset date, export deadline, migration path, billing close. | §8 |
| Customer Security & Privacy Officer (**STK-05**) | Crypto-erase plan, Certificate of Sanitization, DPA close-out. | §4, §8 |
| Candidate / data subject (**STK-03**) | Status of their data on offboarding/erasure; portability rights (GDPR Art. 15/17). | §4.3, §8 |
| Recruiter / Hiring Manager (**STK-01/02**) | Service end-of-support; what stops working. | §8 |
| SRE / Platform (**STK-07**) | Executes teardown + sanitization. | §3, §4 |
| Integration Partners (**STK-08**) | Disconnect of calendar/email/job-board/HRIS webhooks/OAuth grants. | §3.2, §7 |
| Regulator / Auditor (**STK-09**) | Records-of-processing close, retention satisfaction, erasure proof. | §4.3, §9 |
| Product / Business Owner (**STK-06**) | Owns the retirement decision and the DRR verdict. | §11 |

---

## 3. Decommissioning Sequence (reverse of Phase-06 integration)

The teardown reverses the Phase-06 integration increments: **last integrated, first removed**, so a dependent is always detached before the thing it depends on. Phase 06 is **TODO** in this example, so the increment IDs below (`INC-*`) are the *forward-derived* teardown order built from the dependency graph of the [`SysRS §12.1`](../Phase_02_Requirements/SysRS.md#121-intended-top-level-system-blocks) block set and the Concept ConOps; Phase 06 will assign the authoritative `INC-<nn>` and this §3 is reconciled against them at CDR. The order is grounded in the modes of [`SysRS §9`](../Phase_02_Requirements/SysRS.md#9-modes--states): Nominal → Maintenance → Read-Only/Safe → Offboarding/EOL.

> **Verification method note (Conventions §4):** each step's "Verify" column is the evidence that the system stays safe and observable mid-teardown — predominantly **D** (Demonstration: operate and observe) and **I** (Inspection: confirm a resource/grant is gone), with **A** (Analysis) for the blast-radius check.

### 3.1 Per-tenant offboarding runbook (`RB-OFFBOARD`) — routine, reversible until step O5

Runs under the **Offboarding/EOL** mode ([`SysRS §9`](../Phase_02_Requirements/SysRS.md#9-modes--states)); satisfies [`REQ-SEC-08`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-) (erase ≤ 30 days + proof) and [`REQ-O-04`](../Phase_02_Requirements/SysRS.md#71-operational--reliability-requirements-req-o-) (retention policy). `RB-OFFBOARD` is the Phase-10 runbook ID (placeholder until Phase 10 assigns `RB-<nn>`).

| Seq | Precondition | Action | Owner | Rollback point? | Verify | Point of no return? |
|---|---|---|---|---|---|---|
| **O1** | Authorised termination/erasure request; identity of requester verified (STK-04 or STK-05). | Place the tenant in **read-only** (suspend writes; pipeline reads still serve). | SRE (STK-07) | Yes — revert to Nominal. | D: writes rejected, reads served. | No |
| **O2** | Read-only confirmed. | Generate the tenant data **export** (candidates, scorecards, attachments, audit metadata) in the contracted portable format; deliver to STK-04; confirm receipt. | SRE + Privacy (STK-05) | Yes. | I: export manifest checksums; D: receipt confirmation. | No |
| **O3** | Export receipt confirmed. | Start the contractual **grace/retention window** (TODO from DPA). Tenant inaccessible to users but data still recoverable. | SRE | Yes — restore tenant. | I: window start logged; access disabled. | No |
| **O4** | Grace window elapsed; **no legal hold** outstanding (§4.3 check). | Disconnect tenant integrations (revoke OAuth grants/webhooks for calendar/email/job-board/HRIS; cancel SCIM); revoke tenant SSO trust. | SRE + Integration Lead | Yes (re-grant). | I: grants revoked; D: SCIM/SSO no longer provision. | No |
| **O5** | All above verified; retention check passed. | **Crypto-erase** the tenant: schedule destruction of the tenant's KMS key(s) (§4) → renders primary store, index, object storage, **and backups/snapshots** encrypted under that key unrecoverable. Purge plaintext caches/search shards. | SRE + Security | **NO — point of no return.** | A+I: §4 verification + Certificate of Sanitization. | **YES** |
| **O6** | Key destruction completed past the KMS waiting window. | Issue **Certificate of Sanitization** (per tenant); record erasure proof to the tamper-evident audit log ([`REQ-SEC-04`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)); update CM status accounting. | Security + CM | n/a | I: certificate + audit entry. | n/a (post-PONR) |

**The point of no return is O5** (key destruction). Everything before it is reversible (read-only, restore, re-grant). [`REQ-SEC-08`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)'s 30-day erasure SLA is met because O5 completes within the tenant's window and the KMS waiting period (§4.2) fits inside 30 days.

### 3.2 Whole-product teardown — reverse-integration, gated by DRR

Removes outermost/user-facing and dependent components first, foundational data/identity last. Each `INC-*` is the integration increment this step reverses (forward-derived; reconciled at CDR).

| Seq | Precondition | Action | Owner | Reverses INC-* | Rollback point? | Verify | Point of no return? |
|---|---|---|---|---|---|---|---|
| **T1** | DRR approved; sunset date passed; EOL comms sent (§8); successor live if any (§8a). | Stop accepting **new applications**: take the **Careers Portal** offline (satisfies-block for [`REQ-F-04`](../Phase_02_Requirements/SysRS.md#3-functional-requirements)). | SRE | INC-portal | Yes — re-enable. | D: portal returns sunset page. | No |
| **T2** | Portal down. | Drain recruiter traffic: put **Recruiter Web App** + API into global **read-only** (all tenants), export window open. | SRE | INC-webapp/api | Yes. | D: writes 503/queued, reads served. | No |
| **T3** | Read-only confirmed; all tenants notified. | Detach **integration services** (Scheduling & Email, Job-board & HRIS): revoke all partner OAuth/webhooks; stop SCIM; tear down **Identity & SSO Gateway** trusts. (Detaches STK-08 dependents — [`REQ-INT-01..04`](../Phase_02_Requirements/SysRS.md#6-system-interfaces).) | Integration + Security | INC-integrations, INC-identity | Yes (re-establish). | A: blast-radius check no live consumer left; I: grants gone. | No |
| **T4** | Integrations detached; **all tenants exported & receipts confirmed** (run §3.1 O1–O3 fleet-wide). | Quiesce application services: **Candidate Pipeline, Search/Indexing, Scheduling, Billing, Audit** stop processing; flush queues. | SRE | INC-appservices | Yes (until T6). | D: queues drained, no in-flight work. | No |
| **T5** | All exports delivered; **retention/legal-hold list (§4.3) migrated to archive**; billing settled (§7). | Cancel external **service subscriptions that are now drained** — but NOT the datastore/KMS yet (§7 sequencing). | CM/Release Mgr | INC-billing/integrations | Yes. | I: subscriptions cancelled post-export. | No |
| **T6** | T1–T5 verified; archive (§9) staged & integrity-checked; no outstanding legal hold. | **Crypto-erase all tenants** (destroy KMS keys) + **Destroy** secrets/credentials store; then purge plaintext caches, search shards, logs containing PII (§4). | Security + SRE | INC-datatier, INC-isolation | **NO — point of no return.** | A+I: §4 verification; Certificates of Sanitization (all tenants). | **YES** |
| **T7** | Key + secret destruction complete past waiting windows. | Tear down remaining cloud resources (compute, networking, object storage, backups, DNS); **release domains/TLS certs** (§7); final cost actuals to LCC closure. | SRE | INC-platform | n/a | I: resource inventory empty; cloud bill → 0. | n/a (post-PONR) |
| **T8** | Teardown complete. | Close CR-RETIRE-01; set Product baseline → **`Superseded`**; route lessons-learned (§9). | CM + Lead SE | — | n/a | I: status accounting + archive sealed. | n/a |

**Points of no return:** O5 (per-tenant) and **T6** (whole-product). Everything earlier is staged reversibly (read-only, traffic drain, mothball) so a failed cutover or a discovered legal hold can still abort (Conventions: retire reversibly until the PONR; thereafter only with DRR sign-off).

---

## 4. Data Handling & Sanitization (NIST SP 800-88 Rev. 1)

Action chosen by **data confidentiality categorization**, not by medium (per the stage skill and NIST 800-88). All candidate/tenant data is **Moderate–High confidentiality** PII under a regulated (GDPR/CCPA) regime that leaves TalentFlow's custody on disposal → minimum action **Purge**; cryptographic erase (key destruction) is the controlling Purge act and, because at-rest data uses per-tenant KMS keys ([`REQ-SEC-03`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)), one key destruction renders **primary + index + objects + backups** unrecoverable in a single act.

### 4.1 Sanitization table

| Store/Media | Data categorization | Action (Clear/Purge/Destroy) | Method | Verification | Cert ref | Retention/Hold? |
|---|---|---|---|---|---|---|
| **Primary store** (managed Postgres, tenant-partitioned) | High — candidate PII, scorecards | **Purge** | Crypto-erase: destroy tenant KMS data key; then logical delete of rows | Confirm key `PendingDeletion`→destroyed; sample read returns ciphertext-undecryptable | CoS-PRIMARY-<tenant> | No (PII) — but see §4.3 audit metadata |
| **Search index** (tenant-partitioned shards) | High — denormalized PII | **Purge** | Drop tenant shards; crypto-erase index-at-rest key | Inspect: shard absent; index key destroyed | CoS-INDEX-<tenant> | No |
| **Object storage** (attachments: résumés, etc.) | High — PII documents | **Purge** | Crypto-erase object-store per-tenant key; delete objects + versions | Inspect: objects + all versions gone; key destroyed | CoS-OBJ-<tenant> | No |
| **Backups / snapshots** (primary + object) | High — historical PII | **Purge** | Crypto-erase: covered by the **same** tenant key destruction (backups encrypted under it become unrecoverable) | Confirm no backup restorable post key destruction | CoS-BACKUP-<tenant> | No |
| **Caches / search query cache / app cache** | Moderate — transient PII fragments | **Clear** (in-org transient) → flushed pre-PONR | Flush + TTL-expire; re-keyed on key rotation | Inspect: cache empty; no PII keys | CoS-CACHE-<tenant> | No |
| **Logs** (app/access logs) | Moderate — may contain PII fields | **Purge** (PII-bearing) | Crypto-erase log-at-rest key for PII log streams; retain scrubbed non-PII operational logs only per §4.3 | Inspect: PII log streams unrecoverable | CoS-LOGS-<tenant> | **Possibly** — non-PII ops/audit metadata, §4.3 |
| **Secrets / credentials store** (tenant integration tokens, OAuth grants, SCIM creds) | High — live credentials | **Destroy** (no reuse, highest assurance) | Revoke at source (partner) **and** destroy the secret; rotate any shared platform secret | Inspect: secret absent; partner grant revoked (cross-check §3 O4/T3) | CoS-SECRETS-<tenant> | No |
| **KMS key store** (the controlling keys) | High — the erase mechanism itself | **Destroy** (key material) | Schedule key deletion → permanent destruction after the cloud waiting period (§4.2) | Confirm key state `PendingDeletion` then destroyed; key unusable for crypto ops | CoS-KMS-<tenant> | No |

> Certificate refs `CoS-*` are issued per store per tenant at sanitization time (NIST 800-88 Certificate of Sanitization). For whole-product retirement, an aggregate CoS per store-class plus the per-tenant set is filed in the §9 archive.

### 4.2 Key-destruction plan (the controlling act for every Purge)
Cryptographic erase is the efficient, backup-covering Purge: **destroying a tenant's customer-managed KMS key renders all data encrypted under it — primary store, search index, object storage, and every backup/snapshot — permanently unrecoverable**, with no need to overwrite each medium. Managed cloud KMS enforces a **mandatory waiting period before permanent key destruction (typically 7–30 days; commonly 30 by default)**, during which the key is in a `PendingDeletion` state and cannot perform cryptographic operations — so the *effective* erasure (key disabled, data already undecryptable) is immediate at scheduling, while *permanent* destruction completes after the window. Two consequences this plan honours:
- The KMS waiting window must fit **inside** [`REQ-SEC-08`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)'s **30-day** erasure SLA — schedule deletion with the **minimum** waiting period (7 days) for SLA-bound per-tenant erasure so destruction completes well within 30 days; **TODO: SRE to confirm the exact waiting-period setting against the chosen cloud KMS**.
- Verification (NIST 800-88 sanitization validation) = (a) confirm the key transitioned `PendingDeletion`→destroyed, and (b) demonstrate a sample ciphertext is no longer decryptable. Both are recorded on the per-tenant Certificate of Sanitization.

The exact KMS key-destruction API/CLI call and waiting-period parameter are cloud-provider-specific and confirmed in Phase 04/06 against the chosen provider; do not hard-code a vendor here.

### 4.3 Retain / return / destroy decisions (retention & legal-hold beats deletion)
| Data | Decision | Basis |
|---|---|---|
| **Tenant's candidate/business data** | **Return then destroy** | Customer-owned (controller); export per DPA, confirm receipt (§3 O2/T4), *then* Purge. Never destroy-then-check. |
| **Candidate PII** (no hold) | **Destroy (Purge)** | GDPR Art. 17 erasure; [`REQ-SEC-08`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-), [`REQ-O-04`](../Phase_02_Requirements/SysRS.md#71-operational--reliability-requirements-req-o-) retention limit. |
| **Tamper-evident audit metadata** (actor/tenant/action/timestamp, PII *removed*) | **Retain in archive** | [`REQ-SEC-04`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-) audit log + [`REQ-D-02`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements) SOC 2 / ISO 27001 control evidence; the Concept already resolved *erase PII while retaining non-PII audit metadata lawfully* ([`SysRS §13`](../Phase_02_Requirements/SysRS.md#13-requirements-engineering-record)). Retention window **TODO: owed by Legal/Privacy** (typical SOC 2 evidence: ~7 yrs). |
| **Records-of-processing (GDPR Art. 30)** | **Retain in archive** | [`REQ-D-01`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements); survives processor termination. |
| **Data under active legal hold** | **Retain — do NOT sanitize** | A hold overrides erasure; §3 O4/T6 preconditions block the PONR until the hold list is clear. Hold register **TODO: owed by Legal**. |

**Rule honoured:** no data under a retention or legal-hold obligation is sanitized; it is migrated to the §9 archive **before** any wipe. Retention-bearing metadata is non-PII, so retaining it does not breach the candidate's erasure right.

---

## 5. Environmental & Recycling

**Not applicable — pure software, cloud-only (no customer-managed hardware), per [`REQ-C-01`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements) and [`SEMP §6.2`](../Phase_00_Agreement/SEMP.md) (Manufacturing/HIL tailored out).** Recorded explicitly rather than skipped silently (Conventions §1):

| Concern | Disposition |
|---|---|
| RoHS / WEEE / e-waste / hazardous materials / batteries | **N/A — tailored out.** TalentFlow owns no physical media or hardware; the underlying servers, disks, and their certified destruction are the **cloud provider's** responsibility under their shared-responsibility model and their own e-waste/recycler accreditation. |
| Physical media chain-of-custody to a recycler | **N/A.** No media ever leaves a TalentFlow-controlled boundary; the classic "recoverable data on a disk sent to recycling" risk is mitigated by **crypto-erase** (§4) — the cloud provider physically recycles the disk, but the data on it was never decryptable without the destroyed key. |
| Cloud-resource teardown & carbon | **In scope (the software analogue).** §3 T7 releases all compute/storage/networking; releasing the footprint ends the running carbon/cost. Final cloud cost actuals feed LCC closure (cross-cut Cost/Schedule). |
| Site restoration | **N/A** (no physical site). |

---

## 6. Obsolescence & Spares Disposition

**Not applicable — no physical inventory, spares, or tooling** (pure SaaS; no DMSMS exposure). Recorded for completeness (Conventions §1):

| Asset class | Disposition |
|---|---|
| Physical spares / hardware / tooling | **N/A — none exist.** |
| Software dependencies & licenses | Handled as contract wind-down, not spares — see §7. |
| Reusable IP (connectors, isolation pattern, erasure design) | **Redeploy / harvest** to a successor or sibling product — this is the **OPP-01** salvage value (provable isolation + privacy posture, [`Concept §9`](../Phase_01_Concept/Concept.md#9-top-risks-seed-the-living-register)); routed via the §9 archive to the next project's Phase 01. |

---

## 7. License, Contract & Service Wind-Down

Sequenced **after** the corresponding data export and **after** end-of-support — never cut a service the teardown still needs (Conventions; mirrors §3 step ordering). Notice periods come from Phase 00 agreements.

| Item | Action | When (relative to teardown) | Notice period |
|---|---|---|---|
| **Cloud subscription** (compute/DB/object/KMS/backups) | Cancel **after** all exports delivered (§3 T4) and **after** crypto-erase + resource teardown (§3 T6–T7). Cancelling earlier would orphan data or stop the running bill before erase completes. | After T7 | TODO: cloud contract |
| **Stripe billing** ([`REQ-INT-03`](../Phase_02_Requirements/SysRS.md#6-system-interfaces) / [`REQ-C-02`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements)) | Settle final invoices, stop subscriptions, close the Stripe account. No PAN held (SAQ-A) so no cardholder-data sanitization needed — only tokens, destroyed with the secrets store (§4.1). | After billing settled (T5), before T7 | TODO: per agreement |
| **Partner API agreements** (calendar/email/job-board/HRIS, STK-08) | Revoke OAuth grants/webhooks (§3 O4/T3), then terminate the data-sharing agreements. | After integrations detached (T3) | TODO: per partner contract |
| **Per-tenant DPA** | Close out: confirm processor deletion obligation met (Certificate of Sanitization satisfies GDPR Art. 28(3)(g) return/delete duty). | After tenant crypto-erase (O5/T6) | Survives to deletion-confirmation |
| **Domain names + TLS certificates** | Release/let lapse the careers/app domains; revoke TLS certs. | After T7 (resources down) | TODO |
| **SSO/SCIM IdP trust** (tenant-side) | Already revoked in teardown (§3 O4/T3); confirm no dangling federation trust remains. | At T3 | n/a |
| **Code/secret escrow (if any)** | TODO: confirm whether an escrow exists; if so, release/destroy per its terms. | After archival (§9) | TODO |

---

## 8. End-of-Support / EOL Communications

Timeline built **backwards from the sunset date** (whole-product retirement). Per-tenant offboarding comms are the `RB-OFFBOARD` confirmations to STK-04/05 and are not a broadcast. Required lead times are **TODO** where set by contract — legal notice windows are never guessed.

| Audience | Message | Channel | Send-date (backwards from sunset D) |
|---|---|---|---|
| Customer Admins (STK-04) | **EOL announcement:** sunset date, supported-until date, what stops working, export-by deadline, migration path. | In-app banner + email + account manager | **D − [TODO: contractual notice, e.g. 90 d]** |
| Privacy Officers (STK-05) | Crypto-erase plan, Certificate-of-Sanitization commitment, DPA close-out steps. | Direct / DPA channel | D − [TODO notice] |
| Candidates (STK-03) | Their data's fate; portability/erasure rights (GDPR Art. 15/17); how to request export. | Careers-portal notice + email | D − [TODO] |
| Recruiters / Hiring Mgrs (STK-01/02) | Service end-of-support; read-only date; final action date. | In-app | D − [TODO] |
| Integration Partners (STK-08) | Disconnect date for webhooks/OAuth/SCIM. | Partner channel | D − [TODO partner notice] |
| Regulator / Auditor (STK-09) | Records-of-processing close, retention satisfaction, erasure evidence availability. | Formal notice | Per regulatory window — **TODO: owed by Legal** |

**Published artifacts:** (a) the **data-export/portability instructions + deadline**, and (b) the **migration path** to the successor if one exists (§8a). Support-channel close dates are part of the announcement.

### 8a. Successor Handover (if replaced)
If TalentFlow is replaced rather than simply shut down (target end-state "replaced by successor"), the successor's go-live **gates** the predecessor teardown (§3 T1 precondition). It inherits:
- **Tenant data** via the same export path (§3 O2/T4) — migrated, not re-keyed across (each tenant re-encrypts under the successor's own KMS keys).
- **Configurations / integrations** — SSO/SCIM trust, partner connectors re-established on the successor.
- **The §9 archived knowledge package** — architecture, ICDs, `DEC-*` decisions, isolation/erasure design (the OPP-01 reusable IP).
- **Cutover / parallel-run window:** **TODO** (set when a successor is decided). No successor exists at authoring time.

---

## 9. Knowledge Archival & Lessons-Learned

This is the step most often skipped — it is a **hard DRR exit criterion** (stage skill; the "concept-to-disposal" gap Phase 11 exists to close). The lessons-learned is the one output that flows **forward** (to the Quality/Knowledge thread and the next project's Phase 01).

### 9.1 Archive package contents
| Artifact | Source phase |
|---|---|
| `Concept.md` (StRS, SN-*, MOE-*, RSK-*) | 01 |
| `SysRS.md` (REQ-*, MOP/TPM, trace spine) | 02 |
| SysML model (7-of-9 `.puml`) | 03 |
| `Architecture_Description.md`, `ICD-*` | 04 |
| `Decision_Register.md` / `DEC-01..05`, `DM-01..05` (isolation model, erasure-across-backups, multi-region, identity build-vs-buy, search platform — [`SysRS §12.2`](../Phase_02_Requirements/SysRS.md#122-strategic-decisions-to-be-made-names-only-owned-by-phase-05)) | 05 |
| `Verification_Matrix` (`TC-VER-*`), `Test_Cases` (`TC-VAL-*`) + V&V evidence | 07–08 |
| CM status accounting, `CR-*` log incl. **CR-RETIRE-01**, `CI-*` register, baselines | 09 |
| Ops record: `SLO-*`, `RB-*` (incl. `RB-OFFBOARD`), incident history, final **TPM-01..04** actuals | 10 |
| **All Certificates of Sanitization** (`CoS-*`) + erasure audit proofs | 11 (this plan) |
| **Lessons-learned retrospective** (§9.3) | 11 |

### 9.2 Archive controls
- **Location:** long-term, access-controlled CM repository (the Phase-00/09 information-management store). **TODO: confirm org archive location.**
- **Retention period:** the longest of the §4.3 retention obligations (audit/SOC 2 evidence, GDPR Art. 30 records) — **TODO: owed by Legal/Privacy**.
- **Integrity / access:** tamper-evident, read-only, least-privilege access; the archive is **sanitization-exempt** (it is the legally-required retained record). It holds **non-PII** records-of-processing + audit metadata only — candidate PII is erased, not archived, so the archive does not re-create an erasure liability.
- **Format:** open, long-lived (Markdown + PDF/A for signed records) so it remains readable after the system is gone.

### 9.3 Lessons-learned retrospective (routed to the Quality/Knowledge thread)
Run across the **whole lifecycle**; route actionable items with owners to the Quality thread ([`SEMP §8`](../Phase_00_Agreement/SEMP.md), thread 8) so the next system reuses them. Seed prompts (answers **TODO** until the retrospective runs):
- Did **tenant isolation** (RSK-01 / [`REQ-SEC-01`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)) hold over life? Final **MOP-11** = ? cross-tenant successes (target 0).
- Did **crypto-erase** prove out as a clean, backup-covering Purge (RSK-02 / [`REQ-SEC-08`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-))? Any case where PII survived a key destruction? Final **TPM-04** erasure completeness = ?
- Did the **availability/latency** SLOs hold (RSK-03)? Final **TPM-01 / TPM-02** actuals vs. target.
- Did **per-tenant KMS-key separation** make offboarding as cheap as designed, or was teardown costlier than expected?
- What should a **successor** do differently (the OPP-01 reusable IP)?

---

## 10. Disposal Risk / Safety / Security

### 10.1 Disposal-specific risks (`RSK-*`, L×I per Conventions §5.3; continues the [`Concept §9`](../Phase_01_Concept/Concept.md#9-top-risks-seed-the-living-register) register)
| ID | Description | L | I | Band | Mitigation |
|---|---|---|---|---|---|
| **RSK-07** | Premature deletion of data still under a **legal hold / retention** obligation. | 2 | 5 | High | §3 O4/T6 preconditions gate the PONR on a clear hold list; retain-before-wipe (§4.3); legal-hold register check is a DRR exit item. |
| **RSK-08** | **PII recoverable** after a "wipe" — key not actually destroyed, or a backup/shard encrypted under a *different* key was missed. | 2 | 5 | High | Crypto-erase verification (§4.2): confirm key destroyed **and** sample ciphertext undecryptable; data-discovery sweep of all stores incl. backups/caches/logs before T6; per-store Certificate of Sanitization. |
| **RSK-09** | A **dependent system breaks** when its dependency is removed too early (partner integration, successor mid-migration). | 3 | 3 | Medium | Reverse-integration order (§3) detaches dependents first; blast-radius analysis (T3); successor go-live gates teardown (§8a). |
| **RSK-10** | **Subscription cancelled before export** → data loss or orphaned/running cloud bill. | 2 | 4 | Medium | §7 sequences all cancellations **after** export and crypto-erase; export-receipt is a precondition to T4/T5. |
| **RSK-11** | **Knowledge lost** — lessons-learned/archive skipped, isolation+erasure IP (OPP-01) not preserved. | 3 | 3 | Medium | Archive + lessons-learned are **DRR exit criteria** (§9, §11); routed to Quality/Knowledge thread with owners. |
| **RSK-12** | Crossing a **point of no return** (O5/T6) before DRR sign-off or before a precondition cleared. | 2 | 5 | High | PONR explicitly flagged (§3); irreversible steps gated on DRR approval + verified precondition; CR-RETIRE-01 CCB control. |

**Opportunity carried forward:** **OPP-01** — the provable isolation + privacy posture is reusable IP harvested to the successor / next project (§6, §9.3).

### 10.2 Safety / RAMS
**N/A — Safety/RAMS thread tailored out** ([`SEMP §6.2`](../Phase_00_Agreement/SEMP.md), [`SysRS §8`](../Phase_02_Requirements/SysRS.md#8-constraints--domain-requirements)): pure information system, no stored energy, no hazardous materials, no lone-working physical teardown → **no new `Hazard_Log.md` (`HAZ-*`) entries**. Recorded explicitly so the omission is visible, not silent.

### 10.3 Security — data-at-rest exposure during teardown (Threat Model, `THR-*`)
The teardown window is a live attack surface and is added to the cross-cutting `Threat_Model.md`:
- **THR-DISP-01:** export bundles in transit/at-rest before customer receipt — exposure of an entire tenant's PII in one file. *Control:* encrypted export, short-lived signed delivery, receipt confirmation, then export deleted (§3 O2/T4).
- **THR-DISP-02:** a tenant in read-only/grace state is still readable — extended dwell time for an attacker. *Control:* minimise grace window to the contractual minimum; isolation ([`REQ-SEC-01`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)) and audit ([`REQ-SEC-04`](../Phase_02_Requirements/SysRS.md#72-security-requirements-req-sec-)) remain enforced through O1–O5.
- **THR-DISP-03:** orphaned secrets/OAuth grants after teardown (revoked at source vs. destroyed locally diverge). *Control:* §4.1 secrets **Destroy** cross-checked against §3 O4/T3 partner-side revocation. *(`THR-DISP-*` are placeholders; the Security thread assigns live `THR-<nn>`.)*

The classic physical-media "recoverable disk to recycler" threat does **not** apply (no media leaves TalentFlow's boundary; crypto-erase covers the cloud-recycled disk — §5).

---

## 11. DRR Readiness

Gate: **DRR (Decommissioning Readiness Review)** — *"Passes when: retirement plan, data sanitization, environmental & archival approved"* (Conventions §3). DRR gates the **whole-product** retirement (§3.2); per-tenant offboarding runs under the DRR-approved `RB-OFFBOARD` (§3.1).

- [x] Retirement trigger, target end-state, and disposal mode (**software EOL**) documented; whole-product retirement opened as **CR-RETIRE-01** against the Product baseline (§1.4).
- [x] Decommissioning sequence is the **reverse** of Phase-06 integration; each step has owner, rollback point, verification; **points of no return** (O5, T6) flagged (§3). *(Reconcile `INC-*` IDs against Phase 06 at CDR.)*
- [x] §4 sanitization table complete — every store/medium has a Clear/Purge/Destroy action chosen by **data categorization**, a method, a verification step, and a `CoS-*` Certificate reference.
- [x] Retention / legal-hold data identified and **migrated to archive before any wipe**; customer-owned data **return** path defined (§4.3). Legal-hold register check is a precondition to the PONR.
- [x] **Key/secret/credential destruction** planned, incl. **backups, caches, logs, secrets store** (§4.1–4.2); crypto-erase is the controlling Purge.
- [x] Environmental plan: **N/A — pure software**, recorded explicitly with cloud-resource teardown + carbon in scope (§5). No physical chain-of-custody needed.
- [x] Obsolescence & spares: **N/A — no physical inventory**; reusable IP routed to successor (§6).
- [x] License/contract/service wind-down sequenced **after** export and end-of-support, with notice periods (§7).
- [x] EOL communications scheduled **backwards from the sunset date**; migration path + data-export deadline published (§8).
- [x] Successor handover defined (§8a); predecessor teardown gated on successor go-live (T1 precondition).
- [x] **Knowledge archive package staged** (contents, location, retention, integrity controls) **and lessons-learned retrospective** framed and routed to the Quality/Knowledge thread (§9).
- [x] Disposal `RSK-07…12` scored; Safety/RAMS **N/A** recorded (no `HAZ-*`); data-at-rest exposure in `Threat_Model.md` (`THR-DISP-01..03`).
- [ ] **Open `TODO`s closed** — see table below; **no irreversible step (O5 / T6) proceeds before its precondition clears and DRR signs off.**

### Outstanding TODOs (owner · blocks)
| TODO | Owner | Blocks |
|---|---|---|
| Whole-product sunset trigger + date (if/when decided) | Product/Business Owner (STK-06) | DRR convene |
| Contractual export/grace window + termination notice periods | Phase 00 `Agreement_Register.md` / per-tenant DPA | §3 O3, §7, §8 dates |
| Statutory retention windows (audit metadata, Art. 30 records) | Legal / Privacy | §4.3, §9.2 archive retention |
| Legal-hold register | Legal | PONR precondition (O4/T6) |
| Confirm KMS waiting-period setting vs. 30-day SLA | SRE (STK-07) | §4.2 / REQ-SEC-08 conformance |
| Confirm org archive location + access controls | CM/Release Mgr | §9.2 |
| Reconcile `INC-*` teardown order against Phase 06 `Integration_Plan` | Integration Lead | CDR cross-check (§3) |
| Assign live `CR-<nn>`, `RB-<nn>`, `THR-<nn>` to the placeholders used here | Phase 09 / 10 / Security thread | ID reconciliation |

**DRR recommendation:** **Proceed-with-actions** for the **standing readiness** of `RB-OFFBOARD` (per-tenant offboarding is fully specified and may run under this plan); **hold the whole-product DRR verdict** until a sunset is actually triggered and the dated TODOs above (notice periods, retention windows, legal-hold register) are closed. No irreversible teardown step proceeds before DRR sign-off and a verified precondition. On DRR approval of a whole-product retirement, set this document's status → `Baseline (DRR-approved YYYY-MM-DD)` and the Product baseline → `Superseded`; the lessons-learned package flows forward to the Quality/Knowledge thread and the next project's Phase 01.
