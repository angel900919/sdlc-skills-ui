---
Document: Disposal & Retirement Plan — EV Charging Station Network (EVCN)
Document ID: DISP-EVCN-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Disposal) + NIST SP 800-88 Rev. 1
Status: In Review
Owner: Program Management Office (Decommissioning Lead)
---

# Disposal & Retirement Plan — EVCN

> Phase 11 retires the EVCN safely, lawfully, and reversibly-enough. It sequences the teardown as the **reverse** of the Phase-06 integration order, sanitizes data per **NIST SP 800-88 Rev. 1**, meets RoHS/WEEE/e-waste obligations, winds down OCPP/OCPI/payment relationships, archives the engineering record, and captures lessons-learned. Its exit gate is the **DRR** ([Conventions §3](../../05_Conventions.md)). No irreversible step proceeds before its precondition clears and DRR sign-off is in hand.
>
> This plan conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all shared conventions (IDs, gates, T/I/A/D, severity, baselines, status strings, citations) and cites that file rather than redefining them. Worked-example local IDs (`I1`–`I9` integration increments, `EVCN-CR-*` change requests) follow the conventions already established in [`Phase_06_Integration/Integration_Plan.md`](../Phase_06_Integration/Integration_Plan.md) and [`Phase_09_Change_Config/Change_Management_Plan.md`](../Phase_09_Change_Config/Change_Management_Plan.md).

---

## 1. Purpose, Scope & Retirement Trigger

### 1.1 Why now (trigger)

The EVCN reaches the disposal stage of its lifecycle for two converging reasons:

- **Obsolescence of the deployed fleet** — the first-generation public pilot fleet (the 50 stations stood up at increment `I9`) reaches its 10-year design life (`Phase_10_Operations/Operations_Continuous_Validation.md §7`). The year-7 refurbishment window has passed; SiC power electronics and Level-2 contactors are end-of-life, and spares are entering DMSMS (Diminishing Manufacturing Sources & Material Shortages).
- **Replacement by a successor network (EVCN-2)** — a successor system built on **OCPP 2.1 / ISO 15118-20 bidirectional (V2G)** supersedes EVCN. The migration to 15118-20 was already begun under `EVCN-CR-014` ([`Phase_09_Change_Config/Change_Management_Plan.md §6`](../Phase_09_Change_Config/Change_Management_Plan.md)); EVCN-2 generalises it across the whole fleet. EVCN-2 go-live **gates** the EVCN teardown.

### 1.2 Target end-state

**Partial retirement → replacement by successor**, sequenced as a **hybrid** disposal:

| End-state element | Disposition |
|---|---|
| Cloud CSMS / backend (software/service) | Fully retired after data export and driver migration to EVCN-2. |
| Driver/operator data | Migrated to EVCN-2 (consented) or sanitized; legal-hold records archived. |
| Physical stations & SiC power electronics | De-energized, safed, recycled (RoHS/WEEE) or selectively redeployed/sold. |
| 18 pilot sites with EVCN-2 contracts | Site civil works retained; chargers swapped (host keeps the pad/conduit). |
| Engineering record (SysRS → ops) | Archived to the Quality/Knowledge thread; lessons-learned routed forward. |

### 1.3 Disposal mode

**Hybrid (software-EOL + hardware retirement), sequenced.** The cloud/service is drained and torn down first (so no station is orphaned mid-charge and no data is stranded), then each station is de-energized, safed, and recycled. A small **special-domain** overlay applies: **revenue-grade billing records (REQ-O-05, 7-year retention)** and **PCI cardholder-data-environment (CDE) decommissioning (PCI-DSS 4.0)** impose obligations that survive into disposal.

### 1.4 Retirement change request

The entire retirement is a controlled change against the EVCN product baseline (Phase 09):

- **`EVCN-CR-031` — "Decommission EVCN Gen-1 fleet & cloud; migrate to EVCN-2"** — Change **Class A (Critical)** (touches safety-path power electronics teardown, payment-data-flow, and GDPR data handling; [`Phase_09 §3`](../Phase_09_Change_Config/Change_Management_Plan.md)). Approval path: **CCB + Compliance + Safety officer**. The DRR is the gate at which `EVCN-CR-031` is authorised to proceed to irreversible execution.

### 1.5 Assumptions carried forward

- EVCN-2 is the consented destination for migrating drivers; drivers may decline migration (GDPR erasure path applies — REQ-SEC-06).
- Site hosts on EVCN-2 contracts retain civil works; only EVSE hardware is removed/swapped.
- All deployment is in a RoHS/WEEE jurisdiction (EU + equivalent regional e-waste regimes); `TODO` confirm per-site jurisdiction list (owed by Compliance Ops, by DRR-30 days).
- The Phase-00 `SEMP.md` / `Agreement_Register.md` were not available to this author — disposal authority, host handback terms, and contractual notice periods are marked `TODO` against Phase 00 below (`SKILL Inputs` fallback applied).

---

## 2. Authority & Stakeholders

### 2.1 Disposal authority

| Role | Authority | Source |
|---|---|---|
| **Decommissioning Lead (PMO)** | Owns `EVCN-CR-031`; chairs DRR; authorises each point-of-no-return. | This plan |
| **Safety Officer** | Signs off de-energize / lockout-tagout sequence before any physical disassembly. | `Phase_09 §3` Class-A path |
| **Compliance Ops** | Signs off retention/legal-hold satisfaction, PCI CDE decommissioning, WEEE certificates. | `Phase_10 §1` |
| **Security (SOC)** | Owns key/secret destruction, sanitization verification, media chain-of-custody. | `Phase_10 §1` |
| **CCB chair** | Approves `EVCN-CR-031`; ratifies DRR outcome. | `Phase_09 §4.4` |
| **Contractual disposal authority** | Who may authorise data destruction & asset disposal per the master agreement. | `TODO: owed by Phase 00 SEMP/Agreement_Register; by DRR-30 days` |

### 2.2 Contract EOL / handback terms

`TODO: extract from Phase-00 Agreement_Register.md — end-of-life clauses, data-return obligations, site-handback condition, termination notice periods (owed by Phase 00 / PMO Legal, by DRR-45 days).` Until these clear, **no contract or subscription is cancelled** (rule: cancel last; §7).

### 2.3 Notify-list (from Phase-01 stakeholders + Phase-10 user base)

Drivers (active + dormant accounts), site hosts, operator tenants, roaming partners (OCPI), payment processor (Stripe Terminal / Adyen), utility (OpenADR/DR program), the V2G/PnC certificate authority hierarchy, and regulators (PCI ASV, GDPR supervisory authority, UL/FCC for de-listing). Full comms timeline in §8.

---

## 3. Decommissioning Sequence (reverse-integration teardown)

The teardown **reverses the Phase-06 integration order** (`I9 → I1`): last integrated, first removed, so every dependent is detached before the thing it depends on. Software/service stages drain to read-only before any deletion; hardware stages de-energize and lockout-tagout before any disassembly. **Points of no return (PONR)** are flagged — everything before the first PONR is reversible (traffic-drain, read-only, mothball) so a failed EVCN-2 cutover can roll back.

| Seq | Precondition | Action | Owner | Reverses | Rollback point? | Verify | PONR? |
|---|---|---|---|---|---|---|---|
| **D1** | EVCN-2 live; driver comms sent (§8); export deadline published | **Public-pilot drain** — stop onboarding new drivers/sites to EVCN; redirect mapping-app/public-API discovery (REQ-F-09) to EVCN-2; sessions still complete on EVCN. | Cloud SRE | `I9` | Yes — re-enable onboarding | Public API returns EVCN-2 endpoints; in-flight sessions unaffected (REQ-O-04) | No |
| **D2** | D1 stable ≥ 1 sunset-notice period | **Operator dashboard & tariff freeze** — set dashboard read-only; freeze tariff edits; export RBAC config & audit log. | Operations | `I7` | Yes — restore write access | Dashboard read-only; audit log exported & hash-verified (REQ-F-12) | No |
| **D3** | D2 done; OCPI partners notified (notice period honoured) | **OCPI roaming wind-down** — stop accepting inbound roaming tokens; settle open CDRs; export `Sessions`/`CDRs`/`Tariffs`; de-register from OCPI Hub (ICD-07). | Cloud SRE | `I6` | Yes — re-register | Final CDR settlement reconciled; OCPI Hub shows EVCN de-listed | No |
| **D4** | D3 done; DR program exit notice sent to utility | **DR / site-energy detach** — opt out of OpenADR program (ICD-08); stop accepting `LOAD_DISPATCH`; release Modbus SEM coupling (ICD-09). | Cloud SRE + Field | `I5` | Yes — re-enrol | VTN shows VEN de-registered; sites no longer dispatchable | No |
| **D5** | D4 done; EVCN-2 cutover/parallel-run window closed (§8a); migration window expired | **Stop new sessions on EVCN; read-only cloud** — CSMS rejects `RequestStartTransaction`; allow in-flight sessions to finish; final billing reconciliation; **export all data** (drivers, sessions, payment tokens, logs — §4) to archive/EVCN-2. | Cloud SRE | `I4` | Yes — re-enable sessions | Zero active sessions; billing closed; export checksums verified | No |
| **D6** | D5 export verified; **Compliance sign-off that retention/legal-hold data is archived (§4.2)** | **CDE / cloud data sanitization** — cryptographic-erase managed-key stores (PONR for payment tokens, session logs, PII); decommission PCI CDE; tear down Kubernetes namespaces, databases, object storage, Kafka, secrets stores. | Security + Cloud SRE | `I1` | **No** | Sanitization validation passes; Certificates of Sanitization issued (§4); PCI CDE decommission attested | **YES — first cloud PONR** |
| **D7** | D6 done; cloud silent ≥ 24 h confirming no station dependency | **Station bring-down (per site)** — push final OCPP `RequestStopTransaction`; set stations offline; revoke device certificates at the CA (ICD-11); stations enter local safe-idle. | Field Service | `I2`/`I8` | Yes — recertify station | All stations report offline; device certs revoked (OCSP) | No |
| **D8** | D7 done; **Safety Officer authorises** | **De-energize & lockout-tagout (LOTO)** — open site breaker; verify zero-energy on DC bus & DC-link capacitors; discharge stored energy; remove station UPS batteries; LOTO applied. | Field Service (Safety) | `I8` site civil | Yes — re-energize under permit | Voltmeter confirms 0 V DC bus & link caps; LOTO log signed (`HAZ-D-01`) | No |
| **D9** | D8 LOTO verified | **Physical disassembly** — remove EVSE units, SiC power electronics, contactors, HMI, TPM/secure-element modules; sanitize/destroy data-bearing modules (§4); separate by RoHS/WEEE material class. | Field Service + Recycler | `I8` install | **No** | Each unit logged out; TPM modules destroyed & certified; chain-of-custody opened (§5) | **YES — hardware PONR** |
| **D10** | D9 done; certified recycler engaged (§5) | **Recycle / dispose / restore** — route material classes to R2v3/e-Stewards recycler; redeploy/sell reusable non-data-bearing assets (§6); restore site to handback condition. | Recycler + Field | `I8` civil | n/a (terminal) | Disposal certificates per asset class received; site handback signed | terminal |

> **Two points of no return:** **D6** (cloud data/key destruction) and **D9** (physical disassembly + TPM destruction). Both are gated on DRR approval *and* a verified precondition (export checksums verified at D5; LOTO verified at D8). Everything from D1–D5 is reversible to support EVCN-2 cutover rollback.

---

## 4. Data Handling & Sanitization (NIST SP 800-88 Rev. 1)

Sanitization action is chosen from the **data's confidentiality categorization**, not the medium ([SKILL §4](../../skills/se-phase-11-disposal/SKILL.md); escalate one level when unsure). For encrypted stores with well-managed keys, **cryptographic erase (key destruction)** is the controlling Purge act. Every sanitization is **verified and certified** (Certificate of Sanitization, NIST 800-88 App. G).

### 4.1 Per-store sanitization table

| Store/Media | Data categorization | Action (Clear/Purge/Destroy) | Method | Verification | Cert ref | Retention/Hold? |
|---|---|---|---|---|---|---|
| Driver PII DB (names, emails, vehicles, RFID UIDs) | High (GDPR personal data) | **Purge** | Crypto-erase: destroy DB envelope keys in managed KMS; then block-erase volumes | KMS key-deletion event + post-erase read-back null | `CoS-EVCN-01` | Migrate consented records to EVCN-2 first; non-consented → erase (REQ-SEC-06) |
| Payment tokens / EMV references (CDE) | High (PCI cardholder-data-adjacent) | **Purge** → **Destroy** for any HSM-resident key material | Crypto-erase token vault; HSM key zeroize (FIPS 140-3) | HSM zeroize attestation; PCI CDE decommission report | `CoS-EVCN-02` | No raw PAN stored (REQ-SEC-03); tokens purged after final settlement (D5) |
| Session/transaction logs (billing events) | Moderate (revenue + audit) | **Retain → archive, then Purge source** | Migrate to WORM archive (§9); crypto-erase live store after archive verified | Archive integrity hash matches source; source read-back null | `CoS-EVCN-03` | **YES — 7-year retention (REQ-O-05); pseudonymized after 90 days per Phase-10 §7. Do NOT purge source before archive verified.** |
| OCPP transcripts / station audit logs | Moderate (forensic) | **Retain → archive, then Purge** | Same as above | Archive verified; source erased | `CoS-EVCN-04` | YES — forensic/regulatory; retain per `REQ-O-05` window |
| Secrets stores (API tokens, OAuth refresh, OCPI tokens, TLS keys, DB creds) | High (credentials) | **Destroy (key material)** | Crypto-erase + secret-manager hard-delete; revoke at issuer | Secret-manager delete log; issuer revocation confirmed | `CoS-EVCN-05` | No retention; destroy at D6 (incl. backups & caches) |
| Backups & snapshots (DB, object-store, Kafka) | Inherits source (High) | **Purge** | Crypto-erase backup-encryption keys; delete snapshots across all regions (active-active, Phase-02 §7.3) | Per-region snapshot deletion list reconciled to zero | `CoS-EVCN-06` | **Classic miss — enumerate ALL regions/backups; retain only archived legal-hold copy** |
| Cloud object storage / analytics warehouse | Moderate | **Purge** | Crypto-erase bucket keys; lifecycle-delete objects | Inventory report shows zero objects | `CoS-EVCN-07` | Pseudonymized analytics may be retained if non-identifying (`TODO` Privacy Officer confirm) |
| Station Controller local storage (log buffer, configs) | Moderate (may hold session/PII fragments) | **Clear** (reuse) / **Destroy** (scrap) | Factory reset + overwrite if redeployed; physical destroy of storage chip if scrapped | Post-reset verification scan; destroy witnessed | `CoS-EVCN-08` | 24-h buffer (Phase-02 §7.3) drained to cloud at D7 before reset |
| TPM 2.0 / secure element (device cert private keys, REQ-SEC-02) | High (crypto root of trust) | **Destroy** | Physical destruction of the secure element; revoke device cert at CA (ICD-11) | Destruction witnessed + cert revocation (OCSP) confirmed | `CoS-EVCN-09` | Never reuse; destroyed at D9 |
| Firmware images & signing keys | Moderate (images) / High (signing keys) | Images **Retain**; signing keys **Destroy** | Images → indefinite forensic archive (Phase-10 §7); private signing keys crypto-erased in HSM | Archive verified; HSM key zeroize attested | `CoS-EVCN-10` | Images: indefinite retention (Phase-10 §7). Signing keys: destroy (REQ-SEC-04) |

### 4.2 Retention / legal-hold list (migrate to archive BEFORE any wipe)

- **Session/billing events** — 7-year window (`REQ-O-05`); WORM archive (§9). **Blocks D6** until archive verified.
- **OCPP transcripts & station audit logs** — forensic/regulatory retention (`REQ-O-05`).
- **Change records & CCB minutes** — ≥ 7 years (`Phase_09 §7`).
- **Firmware images** — indefinite (Phase-10 §7).
- **Active legal holds** — `TODO: query Legal for any open litigation/regulatory hold before D6 (owed by PMO Legal, by DRR-15 days).` **Never destroy-then-check.**

### 4.3 Customer-return list (export, confirm receipt, before wipe)

- **Consented drivers** — account/session/payment-method history migrated to EVCN-2 (§8a); export package offered for self-download before deadline (REQ-SEC-06 portability).
- **Operator tenants** — tariff configs, RBAC roles, station registry, CDR history exported per contract (`TODO` confirm return obligation from Phase-00 agreement).
- **Site hosts** — energy/usage reports for their sites.

### 4.4 Key-destruction plan (the controlling act for crypto-erase)

Destroy in this order at **D6** (cloud) and **D9** (station): (1) data-envelope keys in KMS → renders driver PII, tokens, logs, backups unreadable in one act; (2) HSM-resident payment-token & firmware-signing keys → zeroize per FIPS 140-3; (3) secrets-store credentials (OAuth/OCPI/TLS/DB) → hard-delete + issuer revocation; (4) station TPM device-cert keys → physical destroy + CA revocation (D9). Key destruction is logged as auditable security evidence (NIST 800-53 MP family; ISO/IEC 27001:2022).

---

## 5. Environmental & Recycling

All physical disposal occurs under **RoHS** (restricted-substance handling) and **WEEE / regional e-waste** take-back, routed to a **certified recycler (R2v3 / e-Stewards)** — consistent with the lithium-UPS-battery policy already set in [`Phase_10 §7`](../Phase_10_Operations/Operations_Continuous_Validation.md). A **chain-of-custody / disposal certificate** is required per asset class.

| Asset class | Hazard / restricted substance | Routing | Certificate |
|---|---|---|---|
| **SiC power electronics & IGBT modules** | Lead-free solder check (RoHS), high-voltage DC-link capacitors (stored energy — discharge at D8) | Certified recycler; recover SiC/copper/heatsinks | WEEE disposal cert |
| **Lithium UPS batteries** (Station Controller backup, ICD §4) | Lithium — fire/thermal-runaway in transit | R2v3 battery recycler; insulated terminals; UN-rated transport | Battery recycling cert (per Phase-10 §7) |
| **Contactors / power relays** | Possible Hg-free verification; copper recovery | Metals recycler | WEEE cert |
| **PCBs, controllers, HMI, modems** | RoHS-restricted substances; data-bearing (see §4 — sanitize/destroy first) | R2v3 e-waste recycler | WEEE + Certificate of Sanitization cross-ref (`CoS-EVCN-08/09`) |
| **Enclosures (NEMA 4X), cabling** | None significant | Metals/plastics recycling | Scrap manifest |
| **Refrigerant/coolant (liquid-cooled DCFC dispensers)** | Refrigerant — controlled venting prohibited | Licensed refrigerant-recovery vendor | Recovery cert |

**Environmental-impact assessment:** quantify recovered mass by class, landfill diversion %, and **embodied-carbon recovery**; record salvage value as an opportunity (§10, `OPP-D-01`). **Site restoration:** sites without EVCN-2 contracts restored to handback condition (cap conduits, make-safe breakers, remove pads if contracted); EVCN-2 sites keep civil works (charger swap only).

**Cloud-side environmental:** decommissioning the Kubernetes fleet, databases, and active-active regions releases compute/storage — record the **cloud-carbon/resource release** (right-sizing to zero) as part of the life-cycle-cost closure (§ Cross-cutting → Cost/Schedule).

---

## 6. Obsolescence & Spares Disposition

| Asset class | Disposition | Rationale (DMSMS) | Owner | Target date |
|---|---|---|---|---|
| Reusable Level-2 EVSE units (non-data-bearing after §4) | **Redeploy / sell** | Still serviceable; transfer to EVCN-2 secondary sites or resale | Asset Mgmt | `TODO` (by DRR-15d) |
| SiC power-electronics spares | **Bank a small reserve, recycle rest** | EVCN-2 differs (15118-20); limited backward value; DMSMS-obsolete | Field Service | `TODO` |
| Contactors / connectors (J1772/CCS/NACS) | **Harvest & bank** | EVCN-2 and field fleet still consume these; obsolete-part value | Field Service | `TODO` |
| HIL test rigs & tooling (Phase-06 §4) | **Redeploy to EVCN-2 V&V** | Power-bench / protocol HIL reusable for successor | QA Automation | `TODO` |
| Lithium UPS batteries | **Recycle (do not resell)** | End-of-life chemistry; safety | Field Service | At D9 |
| TPM / secure elements | **Destroy** | Crypto root of trust — never reuse (§4) | Security | At D9 |

> Salvage/redeploy value is logged as opportunity `OPP-D-01` (§10) and feeds life-cycle-cost closure.

---

## 7. License, Contract & Service Wind-Down

**Sequenced AFTER data export (D5) and after end-of-support — never cut a service the teardown still needs.** Notice periods honoured (from Phase-00 agreements — see §2.2 `TODO`s).

| Agreement | Action | Sequence constraint | Notice period |
|---|---|---|---|
| **Payment processor** (Stripe Terminal / Adyen) | Terminate merchant/terminal agreement; final settlement | After **D5** final billing reconciliation + token purge (D6) | `TODO` (Phase-00) |
| **OCPI roaming partner(s)** | Terminate roaming; settle final CDRs | After **D3** CDR settlement & de-registration | `TODO` |
| **Utility / DR program** (OpenADR) | Exit DR market participation | After **D4** VEN de-registration | Per program rules `TODO` |
| **Cloud subscriptions** (Kubernetes, DB, object store, KMS, Kafka) | Cancel | After **D6** export verified + sanitization complete — **export first, cancel last** | Monthly `TODO` |
| **Cellular / private APN** (LTE/5G per-site) | Terminate SIMs | After **D7** stations offline | `TODO` |
| **TLS certs & domain names** | Revoke device certs (D7, ICD-11); release public domains / let CA contract lapse | After app/API drain (D1) | n/a |
| **V2G / PnC certificate authority** contract | De-provision EVCN sub-CA hierarchy | After D7 device-cert revocation | `TODO` |
| **Software licenses** (firmware toolchain, SECC stack, conformance tools) | Transfer reusable licenses to EVCN-2; let EVCN-specific lapse | After §6 tooling redeploy | n/a |
| **SaaS** (Jira EVCN-CR, Confluence, observability — Phase-10 §3) | Export then cancel, OR retain for the retention window | Export CRs/minutes to archive (§9) before cancel | n/a |

---

## 8. End-of-Support / EOL Communications

Timeline built **backwards from the sunset date** `S` (EVCN cloud read-only at D5). Notice periods marked `TODO` are **not guessed** — confirm contractual/regulatory windows before scheduling.

| Audience | Message | Channel | Send date |
|---|---|---|---|
| **Drivers** | EOL announcement: sunset date, migrate to EVCN-2 (one-tap account migration), data-export/portability deadline, what stops working | In-app banner + email + app push (Phase-10 §3 channels) | `S − 90d`, reminders `S − 30d`, `S − 7d` `TODO` confirm |
| **Site hosts** | Charger swap (EVCN-2) or removal & site handback schedule | Account manager + email | `S − 90d` (notice period `TODO`, Phase-00) |
| **Operator tenants** | Dashboard read-only date; config/CDR export instructions; RBAC offboarding | Dashboard banner + PDF release notes (Phase-09 §4.7) | `S − 60d` |
| **OCPI roaming partners** | Roaming termination; final settlement window | Partner comms + OCPI `Credits` reconciliation | Per contract `TODO` (before D3) |
| **Payment processor** | Merchant wind-down; final settlement | Account rep | Before D5 settlement `TODO` |
| **Utility / DR program** | DR-program exit | Program contact | Per program rules `TODO` (before D4) |
| **Regulators** | PCI CDE decommission attestation; GDPR processing-cessation notice; UL/FCC de-listing | ASV/QSA, supervisory authority | Per PCI/GDPR/UL timelines `TODO` |
| **Internal staff** | Decommissioning schedule; HSI redeployment plan (§ Cross-cutting → HSI) | Slack + all-hands | `S − 90d` |

**Migration path** and **data-export deadline** are published at `S − 90d`. Driver self-export of personal data (REQ-SEC-06 portability) remains available until the export deadline; after that, non-migrated/non-consented data is sanitized per §4.

---

## 8a. Successor Handover (EVCN-2)

EVCN-2 go-live **gates** EVCN teardown (the Phase-10 ↔ Phase-11 hinge — predecessor teardown D5/D7 cannot start until the successor is proven live).

| Handover item | Detail |
|---|---|
| **Driver/account migration** | One-tap consented migration of profile, vehicles, payment methods, session history → EVCN-2. Non-consenting drivers: GDPR erasure (REQ-SEC-06). |
| **Site/charger migration** | EVCN-2 chargers installed on retained civil works; cutover per-site (charger swap during a maintenance window). |
| **Cutover / parallel-run** | Parallel run on pilot sites: EVCN read-only + EVCN-2 live in parallel for one notice period to confirm session success ≥ 97% (REQ-F-03) on EVCN-2 before EVCN D5. **Rollback to EVCN possible until D5/D6 PONR.** |
| **What EVCN-2 inherits** | Tariff configs, site registry, OCPI partner relationships (re-onboarded on EVCN-2), the **archived knowledge package** (§9), reusable HIL tooling (§6), and lessons-learned (§9). |

---

## 9. Knowledge Archival & Lessons-Learned

> This is the disposal step most often skipped — it is a **hard DRR exit criterion**, not optional. It is the one output that flows **forward**: to the Quality/Knowledge thread and to EVCN-2's Phase 01.

### 9.1 Archive package

| Contents | Source |
|---|---|
| Baselined `SysRS.md` (v1.1, incl. REQ-F-13/REQ-P-08 from `EVCN-CR-014`) | Phase 02 |
| Architecture description, all 7 PlantUML models, `ICD.md` (frozen, CDR-approved) | Phases 03–04 |
| Decision register / `DEC-*` and trade matrices | Phase 05 |
| Integration plan, verification matrix, V&V evidence, test cases (`TC-VER-*`/`TC-VAL-*`) | Phases 06–08 |
| Change records (`EVCN-CR-*`), CCB minutes, final CM status accounting (system marked **Retired/Superseded by EVCN-2**) | Phase 09 |
| Operations record: SLO history, incident postmortems, runbooks, OTA release records | Phase 10 |
| **This Disposal Plan + all Certificates of Sanitization (`CoS-EVCN-01..10`) + WEEE/disposal certificates** | Phase 11 |

| Property | Value |
|---|---|
| **Location** | Immutable WORM object store + offline cold copy (separate from the sanitized production estate). |
| **Retention** | ≥ 7 years for billing/CR records (`REQ-O-05`, `Phase_09 §7`); **indefinite** for firmware images (Phase-10 §7); engineering baseline retained per Quality thread policy. |
| **Access / integrity controls** | Read-only RBAC; cryptographic integrity hashing (tamper-evident); the archive is **sanitization-exempt** and explicitly excluded from the §4 wipe scope. |
| **Format** | Open, long-lived (Markdown, PDF/A, PlantUML source, PNG renders) so it survives tool obsolescence. |

### 9.2 Lessons-learned retrospective (whole-lifecycle → Quality/Knowledge thread)

Done = retrospective written, routed to the Quality/Knowledge thread, and action items have owners (not "template filled").

| What | Lesson | Action for EVCN-2 |
|---|---|---|
| Worked | Single ICD baseline + CR gate (Phase-06 §5) prevented vendor data-standard drift (Boeing-787 lesson held). | Keep one frozen ICD; CR-gate every interface change. |
| Worked | Local-first design (REQ-O-04) let stations finish in-flight sessions during cloud drain (D5) with no driver impact. | Preserve local-first autonomy in EVCN-2. |
| Failed / surprised | Backups across active-active regions were the hardest data to fully enumerate for sanitization (§4 classic miss). | Maintain a live data-store/secrets inventory from day 1; tag every store with its retention class. |
| Surprised | 15118-2 → 15118-20 migration (`EVCN-CR-014`) drove early obsolescence; bidirectional was the real successor trigger. | Design EVCN-2 for 15118-20/OCPP-2.1 from the start; plan V2G certification up front. |
| Process | Disposal authority & contractual notice periods (Phase-00) were not readily available at retirement. | Capture EOL/handback/notice terms in the Phase-00 agreement and keep them current. |
| Measurement | Final TPM actuals and whether MOEs were met over life close the `TPM_Tracker.md`. | Seed EVCN-2 targets from EVCN's measured field reality, not assumptions. |

---

## 10. Disposal Risk / Safety / Security

### 10.1 Disposal risks (`RSK-*`, scored L×I per [Conventions §5.3](../../05_Conventions.md))

| ID | Risk | L | I | Band | Response |
|---|---|---|---|---|---|
| **RSK-D-01** | Premature deletion of billing/audit records still under 7-year retention (REQ-O-05). | 2 | 5 | High | **Archive-then-wipe gate at D6**; Compliance sign-off blocks D6; legal-hold query (§4.2). |
| **RSK-D-02** | Recoverable PII/payment data leaks from media in transit to the recycler. | 3 | 5 | Critical | Sanitize/destroy **before** dispatch (§4); chain-of-custody (§5); Destroy TPM/data chips on-site. |
| **RSK-D-03** | A dependent system (mapping apps, roaming partner, EVCN-2) breaks when EVCN is removed too early. | 3 | 4 | High | Reverse-integration order (§3) detaches dependents first; blast-radius check; redirect public API at D1. |
| **RSK-D-04** | Environmental/regulatory violation (improper battery/refrigerant/WEEE disposal). | 2 | 4 | Medium | Certified R2v3/e-Stewards recycler; per-class disposal certificates (§5). |
| **RSK-D-05** | Irrecoverable knowledge loss when the team disbands at shutdown. | 3 | 4 | High | Archive package + lessons-learned as **DRR exit criteria** (§9); route to Quality/Knowledge thread. |
| **RSK-D-06** | Subscriptions cancelled before data export → data loss / runaway cloud bill. | 2 | 4 | Medium | Export first, cancel last (§7); cancellations sequenced after D6. |
| **RSK-D-07** | Cross a point-of-no-return (D6/D9) before DRR sign-off or before precondition verified. | 2 | 5 | High | Hard gate: D6/D9 require DRR approval + verified precondition; `EVCN-CR-031` authorises execution. |
| **OPP-D-01** | Salvage/redeploy value from reusable EVSE, banked obsolete parts, recovered materials. | — | — | — | Redeploy/sell (§6); feeds life-cycle-cost closure. |

### 10.2 New `Hazard_Log.md` entries (decommissioning hazards)

- **`HAZ-D-01`** — Stored energy in DC-link capacitors & high-voltage DC bus during disassembly. *Control:* de-energize + verified discharge + LOTO at **D8** before any D9 work; Safety-Officer sign-off.
- **`HAZ-D-02`** — Lithium UPS battery thermal runaway during removal/transport. *Control:* insulate terminals, UN-rated packaging, R2v3 battery recycler (§5).
- **`HAZ-D-03`** — Lone-working field teardown at remote sites. *Control:* two-person rule for energized/LOTO steps; check-in protocol.
- **`HAZ-D-04`** — Refrigerant release from liquid-cooled DCFC dispensers. *Control:* licensed refrigerant recovery (§5); no venting.

### 10.3 Data-at-rest exposure review (`Threat_Model.md`)

- **`THR-D-01`** — Data-bearing media (controllers, TPMs, storage chips) **in transit to the recycler** is a live attack surface until **Destroyed**. *Control:* sanitize/destroy on-site **before** dispatch (§4); chain-of-custody with tamper-evident seals; Certificates of Sanitization precede transport.
- **`THR-D-02`** — Orphaned secrets/keys in forgotten backups or caches re-enable access post-shutdown. *Control:* enumerate all regions/backups/secrets stores (§4 backups row); destroy keys + issuer revocation at D6.

---

## 11. DRR Readiness

Gate: **DRR (Decommissioning Readiness Review)** — *"Passes when: retirement plan, data sanitization, environmental & archival approved."* ([Conventions §3](../../05_Conventions.md)). The DRR authorises `EVCN-CR-031` to proceed to its irreversible steps (D6, D9).

### 11.1 Gate package summary

| DRR criterion | Status |
|---|---|
| Retirement trigger, end-state, mode documented; opened as `EVCN-CR-031` (Class A) | ✅ §1 |
| Decommissioning sequence reverses Phase-06 order; owner/rollback/verify per step; PONRs flagged (D6, D9) | ✅ §3 |
| §4 sanitization table complete — Clear/Purge/Destroy by categorization, method, verification, CoS ref | ✅ §4.1 |
| Retention/legal-hold data identified & **archived before any wipe**; customer-return path defined | ✅ §4.2–4.3; ⚠ open legal-hold `TODO` |
| Key/secret/credential destruction planned (incl. backups, caches, logs, secrets stores) | ✅ §4.4 |
| Environmental plan — RoHS/WEEE routing, hazmat, certified recycler + chain-of-custody per class; site restoration | ✅ §5 |
| Obsolescence & spares disposition decided per class (owner/date) | ⚠ §6 — dates `TODO` |
| License/contract wind-down sequenced after export & EOS, notice periods | ⚠ §7 — notice periods `TODO` (Phase 00) |
| EOL comms scheduled backwards from sunset; migration path + export deadline published | ⚠ §8 — some notice windows `TODO` |
| Successor handover defined; predecessor teardown gated on EVCN-2 go-live | ✅ §8a |
| Knowledge archive staged + lessons-learned written and routed to Quality/Knowledge thread | ✅ §9 |
| Disposal `RSK-*` scored; hazards in `Hazard_Log`; data-at-rest exposure in `Threat_Model` | ✅ §10 |
| Frontmatter present; all open items are named `TODO`s with owners/dates; no irreversible step before precondition clears | ✅ this doc |

### 11.2 Outstanding TODOs (owner / due)

| # | TODO | Owner | Due |
|---|---|---|---|
| 1 | Extract disposal authority + EOL/handback terms + contractual notice periods from Phase-00 `SEMP.md`/`Agreement_Register.md` | PMO Legal | DRR − 45d |
| 2 | Confirm open legal holds / litigation before D6 | PMO Legal | DRR − 15d |
| 3 | Confirm per-site RoHS/WEEE jurisdiction list & certified recycler accreditation | Compliance Ops | DRR − 30d |
| 4 | Confirm regulator notice windows (PCI ASV/QSA, GDPR supervisory authority, UL/FCC de-listing) | Compliance Ops | DRR − 30d |
| 5 | Set spares/obsolescence disposition target dates (§6) | Asset Mgmt / Field | DRR − 15d |
| 6 | Confirm operator-tenant data-return obligation (Phase-00 contract) | PMO Legal | DRR − 30d |

> **DRR decision options** ([Overview §6](../../01_Workflow_Overview.md)): Proceed · Proceed-with-actions · Hold · Re-baseline · Stop. With the open `TODO`s above, the recommended outcome is **Proceed-with-actions** — DRR may approve the reversible stages (D1–D5) while **blocking D6 and D9 (the points of no return)** until TODOs 1–4 clear. On full DRR approval and execution through D10, the EVCN lifecycle closes; CM status accounting marks the system **Retired — Superseded by EVCN-2**, and the lessons-learned package flows forward to the Quality/Knowledge thread and EVCN-2's Phase 01.
