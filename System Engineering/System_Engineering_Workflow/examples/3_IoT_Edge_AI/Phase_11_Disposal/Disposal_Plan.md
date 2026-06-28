---
Document: Disposal & Retirement Plan — SentinelEdge
Document ID: DISP-SENTINELEDGE-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Disposal) + NIST SP 800-88 Rev. 1
Status: Draft
Owner: Decommissioning Lead (PMO) / Sustainability & Compliance Lead (STK-07 liaison)
---

# Disposal & Retirement Plan — SentinelEdge

> Phase 11 retires SentinelEdge — the industrial predictive-maintenance edge-AI fleet (vibration/acoustic/temperature sensor node carrying an embedded on-device model, a local gateway, and a cloud fleet-management + analytics backend with signed OTA firmware/model updates) — safely, lawfully, and reversibly-enough. It sequences the teardown as the **reverse** of the integration order, sanitizes data per **NIST SP 800-88 Rev. 1** (per Conventions §9), meets RoHS/WEEE/battery obligations (REQ-D-02), revokes device identity and destroys keys (REQ-SEC-04), winds down PKI/cloud/CMMS relationships, archives the engineering record, and captures lessons-learned. Its exit gate is the **DRR** (per Conventions §3). No irreversible step proceeds before its precondition clears and DRR sign-off is in hand.
>
> This plan conforms to `../../05_Conventions.md` for all shared conventions (IDs `RSK-*`/`CI-*`/`CR-*`/`RB-*`/`SLO-*`/`REQ-*`, the **DRR** gate, the gate ladder, T/I/A/D methods, S1–S4 severity, baselines, status strings, and the §9 standard citations) and **cites** that file rather than redefining it. It reuses the stable IDs established in `../Phase_01_Concept/Concept.md` and `../Phase_02_Requirements/SysRS.md`; it never renumbers them (Conventions §2).
>
> **Phase-status note.** Per `../README.md`, only Phases 01–02 are authored in this backbone; Phases 03–10 are forward markers. Where this plan needs an artifact those phases own — the integration increments (`INC-*`) to reverse, the frozen interface rows (`ICD-*`), the configuration items (`CI-*`), the runbooks (`RB-*`) and SLOs (`SLO-*`), and the retirement change request (`CR-*`) — it cites the **forward ID** and grounds it in the architecture-dependency order implied by `SysRS §2/§13`, marking the upstream source `TODO: owed by Phase NN`. No upstream content is invented.

---

## 1. Purpose, Scope & Retirement Trigger

### 1.1 Why now (trigger)

SentinelEdge reaches disposal for two converging reasons, both anticipated since Concept:

- **Per-device end-of-life across the managed fleet** — battery-powered nodes reach the end of their service-free operating life (`REQ-O-01`, `TODO: life_target` years), and host assets are retired or re-instrumented. SentinelEdge is a **fleet**, so retirement is **rolling and per-device** (the `Decommissioning` state in `SysRS §9`, exercised by `SCN-05`), not a single big-bang cutover. Disposal is therefore a **standing operational process** as well as a whole-program terminal event.
- **Whole-program retirement / replacement by a successor (SentinelEdge-2)** — when the product line is sunset or superseded (e.g. a new node compute platform from `DEC-01`, or a re-architected model-governance backend from `DEC-04`), the entire fleet, cloud backend, signing PKI, and CMMS integration are wound down. SentinelEdge-2 go-live **gates** the whole-program cloud teardown.

This plan covers **both modes**: §3.A is the per-device field decommissioning loop (runs continuously in operations); §3.B is the whole-program backend/PKI/contract wind-down (runs once at program retirement). The DRR governs the whole-program teardown and ratifies the standing per-device procedure.

### 1.2 Target end-state

| End-state element | Disposition |
|---|---|
| **Fielded nodes (edge)** | Identity revoked, keys/data/model irrecoverably sanitized (REQ-SEC-04), battery removed and recycled (REQ-D-02), node routed to WEEE e-waste stream (SCN-05). |
| **Gateways** | Drained, de-registered, sanitized (buffered evidence + credentials), recycled or redeployed. |
| **Cloud fleet backend** (device/model registry, analytics, OTA, dashboards) | Fully retired after data export, lineage archival, and (if applicable) driver/operator migration to the successor. |
| **Signing PKI / SBOM toolchain** | Device-identity CA and firmware/model signing keys revoked and destroyed last, after all field revocations land. |
| **Alert/lineage records** | Retention-window records (REQ-O-04) migrated to the archive **before** any wipe; the rest sanitized. |
| **Engineering record** (Concept → Ops) | Archived to the Quality/Knowledge thread; lessons-learned routed forward (§9). |

### 1.3 Disposal mode (triage)

**Hybrid (hardware retirement + software/service EOL), sequenced — with a safety overlay.** Per the SEMP framing ("Disposal (Stage 11→DRR) is **physical decommissioning** — identity revocation + secure sanitization per NIST SP 800-88 Rev. 1 (REQ-SEC-04) plus battery/e-waste handling under RoHS/WEEE (REQ-D-02)"):

- **Hardware** — battery-powered/wired nodes and gateways: de-energize, remove battery, sanitize data-bearing modules, route to certified e-waste recycler.
- **Software / service** — cloud backend, OTA pipeline, signing PKI, CMMS integration: drain, export, sanitize, tear down.
- **Safety overlay (special-domain-lite)** — SentinelEdge is mounted **on or near rotating machinery** and is **advisory-only / fail-passive** (`REQ-SAF-01`, linked `HAZ-01`). Field decommissioning therefore inherits the rotating-machinery hazard and the **LOTO** discipline of `REQ-SAF-02`; the node carries **no actuation path to the machine**, so removing it can never trip the host (the fail-passive property is itself a disposal-safety asset). A small battery-transport regime (UN/EU battery transport, RoHS/WEEE) also governs the physical leg.

### 1.4 Retirement change request

The whole-program retirement is a controlled change against the SentinelEdge **Product baseline** (set at CDR; owned by Phase 09 — Conventions §3):

- **`CR-31` — "Retire SentinelEdge fleet, cloud backend & signing PKI; migrate to successor"** — change priority **High / S1-class** (touches the IEC 61508 advisory-only safety thread via field teardown near rotating machinery, the security thread via key/identity destruction, and regulated record retention). Approval path: **CCB + Safety/RAMS Lead + Security Lead + Sustainability/Compliance Lead**. The DRR is the gate at which `CR-31` is authorised to proceed to its **irreversible** steps (key destruction, node disassembly). `CR-31` is logged in `Phase_09_Change_Config/CR_Log.md` — `TODO: owed by Phase 09; the CR-* number is reserved here and confirmed when the CR log is authored`.
- The standing **per-device** decommissioning (§3.A) runs under the operations change process as a routine, pre-approved procedure (runbook `RB-DECOM`, §3.A) — it does not need a new CR per node, but each node's sanitization is individually certified (§4).

### 1.5 Assumptions carried forward

- The successor (if any) is the consented destination for migrated operator/CMMS configuration; where no successor exists, the end-state is "fully gone" with the engineering record archived.
- Nodes are deployed across **RoHS/WEEE jurisdictions**; the per-region e-waste/battery-transport regime and certified-recycler list are `TODO: confirm per deployment region (owed by Sustainability/Compliance Lead STK-07, by DRR − 30 days)` — the plant-environment/region list was already flagged `TODO: confirm per site` in `Concept §6`.
- Phase-00 `SEMP.md` exists (read); the **Agreement_Register** (`AGR-SENTINELEDGE-v0.1`) is still `TODO` per `SEMP §1.4`, so **contractual data-return obligations, EOL/handback terms, and notice periods are `TODO` against Phase 00** and gate the contract wind-down (§7).
- The integration order to reverse (`INC-*`) and the frozen interface rows (`ICD-*`) are owed by Phases 06/04 (not yet authored); §3 derives the teardown order from the architecture dependency chain in `SysRS §2` (node → gateway → cloud) and the seam list in `SysRS §6`/§13, and reverses it. `TODO: re-baseline §3 against Phase_06_Integration/Integration_Plan.md INC-* when authored.`

---

## 2. Authority & Stakeholders

### 2.1 Disposal authority

| Role | Authority | Source |
|---|---|---|
| **Decommissioning Lead (PMO)** | Owns `CR-31`; chairs the DRR; authorises each point-of-no-return for the whole-program teardown. | This plan |
| **Sustainability / Compliance Lead** (STK-07 liaison) | Signs off RoHS/WEEE routing, battery transport/disposal, retention/legal-hold satisfaction, certified-recycler accreditation. **R on REQ-D-02 + REQ-SEC-04 sanitization evidence** per `SEMP §3`. | `SEMP §3`, Concept STK-07 |
| **Security Lead** (STK-04 liaison) | Owns key/secret destruction, device-identity **revocation**, sanitization **verification**, and media chain-of-custody. **A on security gate evidence** (`SEMP §3`). REQ-SEC-01..04. | `SEMP §3`, Concept STK-04 |
| **Safety / RAMS Lead** (STK-06 liaison) | Signs off the field de-energize / clearance-of-rotating-parts / LOTO procedure before any node is removed; confirms the advisory-only/fail-passive property holds through teardown (REQ-SAF-01/02, HAZ-01). **A on IEC 61508 safety evidence** (`SEMP §3`). | `SEMP §3`, Concept STK-06 |
| **Edge-AI / Data Science Lead** (STK-05) | Owns model-registry archival, training-data **lineage** retention (REQ-F-07/REQ-O-04), and model-artifact destruction on retired nodes. | `SEMP §3`, Concept STK-05 |
| **CM / Release Manager** | Owns `CR-31`, the `CI-*` register (hardware rev + firmware + **model version** + SBOM as configuration items), and final status accounting ("Retired/Superseded"). | `SEMP §3`/§8 thread 2 |
| **Maintenance Technician** (STK-02) | Executes the field decommissioning per `RB-DECOM` (§3.A): node removal clear of rotating parts, battery removal, on-node wipe trigger. | Concept STK-02, SCN-05 |
| **Contractual disposal authority** | Who may authorise data destruction & asset disposal per the master agreement. | `TODO: owed by Phase 00 Agreement_Register (AGR-SENTINELEDGE-v0.1, still TODO per SEMP §1.4); by DRR − 30 days` |

### 2.2 Contract EOL / handback terms

`TODO: extract from Phase-00 Agreement_Register.md — end-of-life clauses, customer data-return obligations, host-asset handback condition, and contractual notice periods (owed by Phase 00 / PMO Legal, by DRR − 45 days).` Until these clear, **no contract, subscription, or PKI service is cancelled** (rule: cancel last; §7). `SEMP §1.4` confirms acceptance/return criteria are owned by the (still-`TODO`) Agreement_Register.

### 2.3 Notify-list (from Phase-01 stakeholders + the operational footprint)

Plant Reliability/Maintenance Managers (STK-01, the alert consumers), Machine/Process Operators (STK-03), Maintenance Technicians (STK-02), OT/Plant IT & Security (STK-04), the Fleet/Data-Science team (STK-05), EHS/Safety (STK-06), Sustainability/Compliance (STK-07), the Product/Commercial Owner (STK-08), and Regulators/Certification bodies (STK-09 — UL/CE/FCC de-listing, IEC 61508 assessor closure, battery/RoHS authorities). The CMMS integration owner (the customer's maintenance-system admin) is on the list because alert routing (`REQ-F-05`, `REQ-INT-02`) terminates in their system. Full comms timeline in §8.

---

## 3. Decommissioning Sequence (reverse-integration teardown)

The teardown **reverses the integration order** — last integrated, first removed — so every dependent is detached before the thing it depends on. The forward integration order is owed by `Phase_06_Integration/Integration_Plan.md` (`INC-*`, not yet authored); pending it, the order below is **derived from the architecture dependency chain** in `SysRS §2` (`node → gateway → cloud`, edge-first) and the seam list in `SysRS §6`/§13, then reversed. `TODO: re-baseline the "Reverses" column against the real INC-* sequence when Phase 06 is authored.`

Two teardown procedures run at different cadences:
- **§3.A — Per-device field decommissioning** (the `SCN-05` loop; runs continuously in operations under runbook `RB-DECOM`).
- **§3.B — Whole-program backend / PKI / contract wind-down** (runs once, under `CR-31`, gated by the DRR).

Software/service stages drain to read-only before any deletion; hardware stages de-energize, clear rotating parts, and lockout-tagout before any disassembly. **Points of no return (PONR)** are flagged — everything before the first PONR is reversible.

### 3.A — Per-device field decommissioning (`SCN-05`, runbook `RB-DECOM`)

This is the standing operational procedure for retiring **one node** (and, when a site closes, its gateway). It is the direct elaboration of `SCN-05` ("cloud revokes the device identity → technician triggers secure wipe → removes battery → routes to e-waste → records disposal") and the `Decommissioning` mode in `SysRS §9`.

| Seq | Precondition | Action | Owner | Reverses (derived) | Rollback point? | Verify (stays safe/observable) | PONR? |
|---|---|---|---|---|---|---|---|
| **F1** | Node flagged EOL (battery life reached `REQ-O-01`, or host asset retired); work order raised in CMMS | **Cloud-side revoke & quarantine** — mark node "decommissioning" in the device registry; stop assigning OTA cohorts to it; revoke its device identity / certificate at the CA (REQ-SEC-01), so it can no longer enrol or transmit. | Security Lead (cloud) | node enrolment (SCN-04) | Yes — re-enrol identity (re-attest) | Registry shows node revoked; node can no longer authenticate node↔gateway (REQ-INT-01) | No |
| **F2** | F1 done; node still powered | **Drain buffered evidence** — let the node sync any locally-buffered alerts/evidence (the `Monitoring (Offline)` buffer, REQ-F-03/REQ-O-02) to the cloud so no detection is lost; confirm lineage references retained cloud-side (REQ-F-07/REQ-O-04). | Technician + cloud | offline-buffer behaviour (SCN-02) | Yes — leave node monitoring | Buffer empty; last evidence synced & lineage-linked | No |
| **F3** | F2 done; node enters `Decommissioning` state | **On-node secure sanitization** — technician triggers the on-device wipe: irrecoverably sanitize the secure-element keys, buffered data, and the on-device model image (REQ-SEC-04, NIST SP 800-88 — see §4). Node confirms wipe and powers down. | Technician (+ secure element) | edge-AI/secure-boot provisioning | **No** | Node attests sanitization complete; secure element reports keys destroyed; Certificate of Sanitization raised (§4) | **YES — node data PONR** |
| **F4** | F3 sanitization certified | **Safe physical removal** — using `REQ-SAF-02` procedure: respect the host machine's LOTO; mount/dismount clear of rotating parts; remove the node (and gateway if site closing). Advisory-only/fail-passive (REQ-SAF-01) means removal cannot trip the host machine. | Technician (Safety-supervised) | node install (SCN-04) | Yes — node already wiped; only physical | Node removed with machine running safely; LOTO log signed (`HAZ-01` controls) | No |
| **F5** | F4 done | **Battery removal & safing** — remove battery; insulate terminals; package per battery-transport regime; route node + battery to the certified e-waste / battery recycler (§5). Record disposal against the asset (closes SCN-05). | Technician + Recycler | — (terminal for the device) | n/a | Battery removed & safed; chain-of-custody opened (§5); disposal recorded in registry | terminal (device) |

> **Per-device PONR is F3** (on-node key/data/model destruction). It is gated on F2 (buffer drained, lineage retained) — never wipe before the retention-relevant evidence is safely cloud-side and archived (§4.2). The fail-passive property (REQ-SAF-01) makes the physical steps F4/F5 low-risk to the host machine.

### 3.B — Whole-program backend / PKI / contract wind-down (`CR-31`, DRR-gated)

Runs once when the product line is retired, **after** the fielded fleet has been decommissioned (or migrated) via §3.A. Reverses the integration chain from the cloud edge inward.

| Seq | Precondition | Action | Owner | Reverses (derived) | Rollback point? | Verify | PONR? |
|---|---|---|---|---|---|---|---|
| **P1** | Successor live (if any); EOL comms sent (§8); export deadline published | **Onboarding & OTA freeze** — stop enrolling new nodes/sites; freeze the OTA pipeline (no new firmware/model cohorts, REQ-F-06); redirect new-asset onboarding to the successor. Existing nodes keep monitoring. | Cloud SRE | OTA/registry enrolment | Yes — re-enable onboarding | No new enrolments/OTA; existing fleet unaffected | No |
| **P2** | P1 stable ≥ 1 sunset-notice period | **CMMS & dashboard wind-down** — set operator dashboard read-only (REQ-U-02); stop routing alerts to the customer CMMS (REQ-F-05/REQ-INT-02); export tariff/asset-profile/RBAC config and the alert/work-order history. | Operations | CMMS/dashboard integration | Yes — restore routing | Dashboard read-only; CMMS endpoint quiesced; config exported & hash-verified | No |
| **P3** | P2 done; **all fielded nodes decommissioned via §3.A or migrated** (no node depends on this backend) | **Export all cloud data** — model registry + **training-data lineage** (REQ-F-07/REQ-O-04), alert/evidence store, drift telemetry (REQ-P-04/MOP-09), device registry, SBOM store (REQ-SEC-03) → archive (§9) and/or successor. | Cloud SRE + Edge-AI Lead | analytics/registry build-up | Yes — re-enable backend | Export checksums verified; lineage archive integrity-hashed | No |
| **P4** | P3 export verified; **Compliance sign-off that retention/legal-hold records are archived (§4.2)** | **Cloud data sanitization** — cryptographic-erase managed-key stores for the alert/lineage/registry/telemetry data and backups (PONR); tear down databases, object storage, message bus, and the analytics estate; hard-delete secrets stores. | Security + Cloud SRE | cloud backend stand-up | **No** | Sanitization validation passes; Certificates of Sanitization issued (§4); backups across all regions reconciled to zero | **YES — first cloud PONR** |
| **P5** | P4 done; **confirmed no node certificate still needs validation** | **PKI / signing-key destruction** — revoke and destroy the **device-identity CA** and the **firmware/model signing keys** in the HSM (REQ-SEC-02), so no future image can ever be signed under SentinelEdge trust. | Security Lead | signing-PKI provisioning (SEMP §1.5) | **No** | HSM key-zeroize attestation; CA marked retired; OCSP responders for live certs decommissioned last | **YES — trust-root PONR** |
| **P6** | P4/P5 done; data exported (P3); EOS reached (§8) | **Contract & subscription wind-down** — cancel cloud subscriptions, CMMS-integration agreements, dataset-supply contracts, domains/TLS — **export first, cancel last** (§7). | CM / PMO | service/contract stand-up | n/a (terminal) | Cancellation confirmations filed; no orphaned billing | terminal |

> **Whole-program PONRs are P4** (cloud data/key destruction) and **P5** (PKI/signing-key destruction). Both require **DRR approval + a verified precondition**. P5 is sequenced **after** P4 and after the last field certificate is revoked (§3.A F1 across the fleet) — destroying the CA before the fleet is revoked would strand still-trusted nodes.

---

## 4. Data Handling & Sanitization (NIST SP 800-88 Rev. 1)

Sanitization action is chosen from the **data's confidentiality categorization**, not the medium alone (per the stage skill; escalate one level when unsure). For encrypted stores with well-managed keys, **cryptographic erase (key destruction)** is the controlling Purge act — this is exactly what `REQ-SEC-04` mandates on the node ("irrecoverably sanitize keys, buffered data, and the on-device model per NIST SP 800-88 Rev. 1"). Every sanitization is **verified and certified** (Certificate of Sanitization, NIST 800-88 App. G).

### 4.1 Per-store sanitization table

| Store/Media | Data categorization | Action (Clear/Purge/Destroy) | Method | Verification | Cert ref | Retention/Hold? |
|---|---|---|---|---|---|---|
| **Node secure element** (device-identity private key, attestation key — REQ-SEC-01) | High (crypto root of trust) | **Destroy** (key material) | Secure-element key-zeroize on `Decommissioning`-state wipe; CA revocation (REQ-SEC-01) | Secure element attests keys destroyed; OCSP shows cert revoked | `CoS-SE-NN` | Never reuse; destroyed at **F3** |
| **Node on-device model image** (embedded AI model — REQ-F-01) | Moderate (IP; may encode learned plant signatures) | **Purge** → **Destroy** if chip scrapped | Crypto-erase model partition (key destruction); physical destroy of flash if node scrapped | Post-erase read-back null; destroy witnessed if scrapped | `CoS-MDL-NN` | Master model retained in cloud Model Registry (archive §9); **node copy** purged at F3 |
| **Node buffered alerts/evidence** (offline buffer — REQ-F-03/REQ-O-02) | Moderate (operational; may name asset/site) | **Clear** (if node redeployed) / **Purge** (default) | Drain to cloud first (F2), then factory-reset + crypto-erase buffer partition | Buffer read-back null after sync confirmed | `CoS-BUF-NN` | Drained & lineage-linked at **F2** before wipe; do **not** wipe before drain |
| **Node firmware image** | Low (signed, publicly-versioned binary) | **Clear** | Factory reset / overwrite if node redeployed; destroyed with flash if scrapped | Reset verification scan | `CoS-FW-NN` | Master images retained in archive (§9) |
| **Gateway buffer & credentials** (aggregated evidence, mTLS keys — REQ-INT-01) | High (credentials) / Moderate (buffer) | **Destroy** (keys) + **Purge** (buffer) | Crypto-erase gateway credential store; revoke gateway identity at CA; block-erase buffer | Credential-store delete log; CA revocation confirmed | `CoS-GW-NN` | Buffer drained to cloud first; keys destroyed at gateway decommission |
| **Cloud alert / evidence store** | Moderate (operational; per-asset) | **Retain → archive, then Purge source** | Migrate retention-window records to WORM archive (§9); crypto-erase live store after archive verified | Archive hash matches source; source read-back null | `CoS-CL-ALERT` | **YES — retain per `REQ-O-04` (`TODO: retention_target` years); do NOT purge source before archive verified** |
| **Cloud model registry + training-data lineage** (REQ-F-07/REQ-O-04) | Moderate (audit/IP; lineage is regulated evidence) | **Retain → archive, then Purge source** | Archive model versions + lineage graph; crypto-erase live registry after archive verified | Archive integrity-hashed; lineage completeness check | `CoS-CL-MDL` | **YES — lineage retained per `REQ-O-04` for audit; blocks P4 until archived** |
| **Cloud device registry + SBOM store** (REQ-SEC-03) | Moderate (provenance) | **Retain → archive, then Purge** | Archive SBOMs + build provenance; crypto-erase live store | Archive verified; source erased | `CoS-CL-SBOM` | SBOM/provenance retained for supply-chain audit (`TODO`: window per security policy) |
| **Cloud drift telemetry** (REQ-P-04/MOP-09) | Low (operational metrics) | **Purge** | Crypto-erase bucket keys; lifecycle-delete | Inventory report shows zero objects | `CoS-CL-DRIFT` | Pseudonymized aggregates may be retained for lessons-learned (`TODO` confirm) |
| **Cloud secrets stores** (signing keys, OTA keys, OCSP keys, DB creds, API tokens) | High (credentials) | **Destroy (key material)** | Crypto-erase + secret-manager hard-delete; HSM zeroize for signing keys (FIPS 140-3); issuer revocation | HSM zeroize attestation; secret-manager delete log | `CoS-CL-SEC` | No retention; destroyed at **P4/P5** (incl. backups & caches) |
| **Cloud backups & snapshots** (DB, object store, message bus) | Inherits source (up to Moderate) | **Purge** | Crypto-erase backup-encryption keys; delete snapshots **across all regions** | Per-region snapshot deletion list reconciled to zero | `CoS-CL-BAK` | **Classic miss — enumerate ALL regions/backups; retain only the archived legal-hold copy** |
| **Device-identity CA + firmware/model signing keys** (REQ-SEC-02) | High (trust root) | **Destroy** | HSM key-zeroize; CA retired; OCSP responders decommissioned **last** | HSM zeroize attestation; CA retirement attested | `CoS-PKI` | Destroyed at **P5**, after the last field cert is revoked |

> Per-node certificates (`CoS-SE-NN`, `CoS-MDL-NN`, …) are issued **per device** during §3.A and reconciled to the device registry, so the program can prove every retired node was sanitized (`SN-12` MOE: "% retired units with verified sanitization & disposal").

### 4.2 Retention / legal-hold list (migrate to archive BEFORE any wipe)

- **Alert/evidence records** — retained per `REQ-O-04` (`TODO: retention_target` years; the value is held as a named `TODO` in `SysRS §7.1` — **not invented here**). WORM archive (§9). **Blocks P4** until archive verified.
- **Model-version + training-data lineage** — retained per `REQ-O-04` for audit/explainability (`REQ-F-07`, `SN-09`). **Blocks P4.**
- **SBOM / build provenance** — retained for supply-chain audit (`REQ-SEC-03`); window `TODO` per security policy.
- **IEC 61508 safety case + V&V evidence** (REQ-D-01, REQ-SAF-01/02, HAZ-01) — retained per the functional-safety record-keeping obligation; window `TODO`. Archived (§9), never sanitized.
- **Change records & CCB minutes** (`CR-*`) — retained per the CM policy (`TODO` window, owed by Phase 09).
- **Active legal holds** — `TODO: query Legal for any open litigation/regulatory hold before P4 (owed by PMO Legal, by DRR − 15 days).` **Never destroy-then-check.**

### 4.3 Customer-return list (export, confirm receipt, before wipe)

- **Plant customer (STK-01)** — their assets' alert/work-order history, asset profiles, and any reports they own, exported per the (still-`TODO`) Phase-00 return obligation before the cloud store is purged.
- **CMMS integration data** — the work-order linkage and history pushed into the customer's CMMS (REQ-F-05) stays in the customer's system; export the SentinelEdge-side mapping for their records.
- **Operator/fleet configuration** — tariff/asset-profile/RBAC config exported to the successor or to the customer.

### 4.4 Key-destruction plan (the controlling act for crypto-erase)

Key destruction is the controlling act for every crypto-erase above and the explicit subject of `REQ-SEC-04` (node) and `REQ-SEC-02` (signing trust). Order:

1. **Per node (F1→F3):** revoke device-identity cert at the CA → drain buffer (F2) → zeroize secure-element keys, crypto-erase model + buffer partitions (F3). One secure-element zeroize renders the node's data and model unreadable.
2. **Cloud (P4):** crypto-erase the data-envelope keys in the managed KMS → renders alert/lineage/registry/telemetry stores and their backups unreadable in one act; hard-delete secrets-store credentials (OTA/OCSP/DB/API) with issuer revocation.
3. **PKI (P5, last):** HSM-zeroize the device-identity CA root and the firmware/model signing keys (FIPS 140-3) → no future image can ever be signed under SentinelEdge trust; decommission OCSP responders last.

All key destruction is logged as auditable security evidence (NIST SP 800-53 Rev. 5 MP family; ISO/IEC 27001:2022 — per Conventions §9). This directly retires `RSK-06` residue (a compromised/spoofed device or unsigned OTA is impossible once the trust root is destroyed and field certs revoked).

---

## 5. Environmental & Recycling

All physical disposal occurs under **RoHS** (restricted-substance handling) and **WEEE / regional e-waste** take-back, routed to a **certified recycler (R2v3 / e-Stewards)**, with a **chain-of-custody / disposal certificate per asset class**. This realises `REQ-D-02` ("The node and its battery shall conform to RoHS and WEEE obligations and to applicable battery transport/disposal regulations, with conformity evidence retained") and closes the `SCN-05` environmental leg. Sustainability/Compliance Lead (STK-07) owns the evidence.

| Asset class | Hazard / restricted substance | Routing | Certificate |
|---|---|---|---|
| **Node battery** (primary cell / Li chemistry) | Lithium — fire/thermal-runaway in transit; battery-transport regime | Certified battery recycler; insulate terminals; UN/EU-rated transport packaging | Battery recycling cert (REQ-D-02) |
| **Node PCB + MCU/NPU + secure element** | RoHS-restricted substances; **data-bearing** (sanitize/destroy per §4 first) | R2v3 e-waste recycler | WEEE cert + Certificate-of-Sanitization cross-ref (`CoS-SE-NN`/`CoS-MDL-NN`) |
| **Node sensors** (MEMS accelerometer, MEMS mic, temperature) + enclosure | RoHS check; ruggedized enclosure (metals/plastics) | E-waste / metals-plastics recycling | WEEE cert / scrap manifest |
| **Gateway** (SBC/controller, modem, PCB) | RoHS-restricted substances; data-bearing (credentials/buffer — §4 first) | R2v3 e-waste recycler | WEEE cert + `CoS-GW-NN` cross-ref |
| **Cabling / mounting hardware** (wired-power variant) | None significant | Metals/plastics recycling | Scrap manifest |

**Battery is the headline environmental item** — it is the asset class STK-07 (Sustainability/Compliance) cares about most (`SN-12`), the reason `REQ-D-02` calls out battery transport/disposal explicitly, and a tracked risk (`RSK-07`). It is removed at **F5**, never resold, and routed to a certified battery recycler.

**Environmental-impact assessment:** quantify recovered mass by class, landfill-diversion %, and battery-recovery rate across the retired fleet; record salvage value as opportunity `OPP-D-01` (§10). `TODO: EIA summary owed by Sustainability/Compliance Lead.`

**Site/asset restoration:** the host machine keeps its mounting point unless the customer requests removal; remove the node, cap/clean any mounting interface, leave the machine in its pre-instrumentation condition. Advisory-only/fail-passive (REQ-SAF-01) means no machine recommissioning is needed after node removal.

**Cloud-side environmental:** tearing down the backend (databases, object storage, analytics estate, message bus, OTA/PKI services across regions) releases compute/storage — record the **cloud-carbon/resource release** (right-sizing to zero) in the life-cycle-cost closure (§ cross-cutting → Cost/Schedule).

---

## 6. Obsolescence & Spares Disposition

| Asset class | Disposition | Rationale (DMSMS) | Owner | Target date |
|---|---|---|---|---|
| **Reusable nodes** (non-data-bearing after §4 Clear) | **Redeploy / sell** | Serviceable nodes still within battery life; transfer to successor fleet or resale | CM / Asset Mgmt | `TODO` (by DRR − 15d) |
| **MCU/NPU + secure-element spares** | **Bank a small reserve, recycle rest** | Successor may use a different compute platform (`DEC-01`); limited backward value; DMSMS-obsolete | Firmware/HW Lead | `TODO` |
| **MEMS sensor spares** (accelerometer/mic/temp) | **Harvest & bank** | Field fleet still consumes these; obsolete-part value | Field Service | `TODO` |
| **Gateways** | **Redeploy / sell** (after §4 sanitize) | Reusable for successor sites | Field Service | `TODO` |
| **Node batteries (unused stock)** | **Recycle or return to supplier** | Shelf-life/chemistry; do not field on a retired product | Sustainability/Compliance | `TODO` |
| **HIL fleet rig & bench tooling** (`SEMP §2.2` Phase 06) | **Redeploy to successor V&V** | OTA-rollback / power-bench HIL reusable for the successor | QA / V&V Lead | `TODO` |
| **Secure elements / signing HSM** | **Destroy / zeroize** | Crypto root of trust — never reuse (§4 P5) | Security Lead | At P5 |

> Salvage/redeploy value is logged as opportunity `OPP-D-01` (§10) and feeds the life-cycle-cost closure. Banking obsolete MEMS/secure-element parts hedges DMSMS for the field fleet still under §3.A decommissioning.

---

## 7. License, Contract & Service Wind-Down

**Sequenced AFTER data export (P3) and after end-of-support — never cut a service the teardown still needs.** Notice periods honoured (from the still-`TODO` Phase-00 agreements — see §2.2).

| Agreement | Action | Sequence constraint | Notice period |
|---|---|---|---|
| **Cloud subscriptions** (DB, object store, KMS, message bus, compute) | Cancel | After **P4** export verified + sanitization complete — **export first, cancel last** | `TODO` (Phase 00) |
| **Signing PKI / CA service** (device-identity CA, OCSP) | De-provision after **P5** key destruction & last field-cert revocation | After all field certs revoked (§3.A F1) + P5 | `TODO` |
| **SBOM toolchain / dataset-supply contracts** (`SEMP §1.5`) | Export SBOMs + datasets to archive, then terminate | After **P3** export | `TODO` |
| **CMMS integration agreement** | Terminate after dashboard/CMMS wind-down | After **P2** | `TODO` (customer contract) |
| **Cellular/WAN at the gateway** (per-site uplink) | Terminate SIMs/uplinks | After the site's nodes & gateway are decommissioned (§3.A) | `TODO` |
| **TLS certs & domain names** | Revoke device certs (F1/P5); release public domains | After app/API drain (P1/P2) | n/a |
| **IEC 61508 assessment / certification body** (STK-09) | Notify of product retirement; close the safety-case engagement; retain the safety record (§9) | After whole-program retirement decision | Per assessor terms `TODO` |
| **UL/CE/FCC listings** (STK-09) | De-list the product where required | After production ceases | Per authority `TODO` |
| **SaaS** (CM/issue tracker, observability) | Export `CR-*`/CM records & ops history to archive (§9), then cancel | Export before cancel | n/a |

---

## 8. End-of-Support / EOL Communications

Timeline built **backwards from the sunset date** `S` (whole-program cloud read-only at P2). Notice periods marked `TODO` are **not guessed** — confirm contractual/regulatory windows before scheduling.

| Audience | Message | Channel | Send date |
|---|---|---|---|
| **Plant Reliability/Maintenance Managers** (STK-01) | EOL announcement: sunset date, supported-until, what stops working (alerts/CMMS routing), migration path to successor, data-export deadline | Account manager + email + dashboard banner | `S − 90d`, reminders `S − 30d`, `S − 7d` `TODO` confirm |
| **Machine/Process Operators** (STK-03) | What changes on the line; no impact to machine operation (advisory-only) | Via plant ops + dashboard | `S − 60d` |
| **Maintenance Technicians** (STK-02) | Field decommissioning schedule & `RB-DECOM` procedure refresh (LOTO, battery handling) | Field-ops brief + training | `S − 60d` |
| **OT / Plant IT & Security** (STK-04) | Device-identity revocation schedule; network de-registration; key/secret destruction plan | Security comms | `S − 60d` (before any F1 batch) |
| **Fleet / Data-Science team** (STK-05) | Model-registry & lineage archival; drift-telemetry cutoff | Internal | `S − 60d` |
| **CMMS integration owner** (customer admin) | CMMS endpoint wind-down date; export instructions | Integration contact | `S − 60d` (before P2) |
| **Sustainability/Compliance** (STK-07) | Battery/WEEE disposal schedule; recycler engagement; conformity-evidence collection | Internal + recycler | `S − 90d` |
| **Regulators / Certification bodies** (STK-09) | IEC 61508 safety-case closure; UL/CE/FCC de-listing; battery/RoHS conformity | Assessor / authority | Per IEC 61508 / UL / FCC / battery timelines `TODO` |
| **Product/Commercial Owner** (STK-08) | Retirement business decision; LCC closure | Internal | `S − 120d` |

**Migration path** and **data-export deadline** are published at `S − 90d`. Where a successor exists, operator/CMMS configuration migration is offered until the deadline; after it, non-migrated data is sanitized per §4.

---

## 8a. Successor Handover (if replaced)

If a successor (SentinelEdge-2) exists, its go-live **gates** the whole-program teardown (the Phase-10 ↔ Phase-11 hinge: §3.B P3/P4 cannot start until the successor is proven live).

| Handover item | Detail |
|---|---|
| **Fleet/account migration** | Per-site cutover: successor nodes commissioned (its own `SCN-04` equivalent) while SentinelEdge nodes decommission via §3.A. Asset profiles, baselines, and operator config migrate. |
| **Model & lineage inheritance** | The successor inherits the archived **Model Registry + training-data lineage** (REQ-F-07/REQ-O-04) so model history and explainability survive the cutover. |
| **Cutover / parallel-run** | Parallel run on pilot sites: SentinelEdge read-only + successor live for one notice period to confirm detection parity (TPM-01/02) before the predecessor's P4. **Rollback to SentinelEdge possible until P4 PONR.** |
| **What the successor inherits** | Operator/CMMS config, OCSP/PKI relationships (re-rooted under the successor's own trust — SentinelEdge's CA is **not** reused, it is destroyed at P5), reusable HIL tooling (§6), the archived knowledge package (§9), and lessons-learned (§9). |

If **no successor** exists, the end-state is "fully gone": all data archived (§9) or sanitized (§4), all hardware recycled (§5), all contracts wound down (§7).

---

## 9. Knowledge Archival & Lessons-Learned

> This is the disposal step most often skipped — it is a **hard DRR exit criterion**, not optional. It is the one output that flows **forward**: to the Quality/Knowledge thread and to the successor's Phase 01.

### 9.1 Archive package

| Contents | Source |
|---|---|
| Baselined `Concept.md` (STK/SN/SCN/MOE/RSK) and `SysRS.md` (30 REQ-*, MOP-01..10, TPM-01..05) | Phases 01–02 |
| 7-of-9 SysML PlantUML models + Requirements_Diagram; coverage matrices | Phase 03 (`TODO`: when authored) |
| Architecture description (42010), `ICD-*` (frozen seams: node↔gateway, gateway↔cloud, OTA channel), Tech_Stack_Rationale | Phase 04 (`TODO`) |
| Decision register / `DEC-01..05` and trade matrices `DM-01..05` | Phase 05 (`TODO`) |
| Integration plan (`INC-*`), Verification_Matrix (`TC-VER-*`), V&V evidence, Test_Cases (`TC-VAL-*`) | Phases 06–08 (`TODO`) |
| **IEC 61508 safety case + HAZ-01 hazard log** (advisory-only/fail-passive evidence) | Safety/RAMS thread |
| **STRIDE threat model (`THR-*`) + SBOM/provenance store** (REQ-SEC-03) | Security thread |
| **Edge-AI V&V record**: held-out evaluation, **model registry + training-data lineage** (REQ-F-07/REQ-O-04), drift history (MOP-09) | Edge-AI thread |
| Change records (`CR-*`, incl. `CR-31`), CM status accounting (system marked **Retired/Superseded**) | Phase 09 (`TODO`) |
| Operations record: `SLO-*` history, incident postmortems, runbooks (`RB-*`, incl. `RB-DECOM` and the OTA-rollback runbook), OTA/model release records | Phase 10 (`TODO`) |
| **This Disposal Plan + all Certificates of Sanitization (`CoS-*`) + WEEE/battery disposal certificates** | Phase 11 |
| **Final `TPM_Tracker.md`**: measured TPM-01..05 field actuals vs. target; whether MOE-01..07 (esp. **MOE-07 = zero system-induced unsafe events**) held over life | Measurement thread |

| Property | Value |
|---|---|
| **Location** | Immutable WORM object store + offline cold copy, separate from the sanitized production estate. |
| **Retention** | Per `REQ-O-04` for alert/lineage records (`TODO: retention_target` years); per IEC 61508 record-keeping for the safety case (`TODO` window); firmware/model master images per security policy; engineering baseline per Quality-thread policy. |
| **Access / integrity controls** | Read-only RBAC; cryptographic integrity hashing (tamper-evident); the archive is **sanitization-exempt** and explicitly excluded from the §4 wipe scope. |
| **Format** | Open, long-lived (Markdown, PDF/A, PlantUML source + PNG renders, SPDX/CycloneDX SBOMs) so it survives tool obsolescence. |

### 9.2 Lessons-learned retrospective (whole-lifecycle → Quality/Knowledge thread)

Done = retrospective written, routed to the Quality/Knowledge thread, and action items have owners (not "template filled"). `TODO: schedule the retrospective; owner Lead SE + QA/V&V Lead, by DRR − 15 days.`

| What | Lesson (candidate — confirm at retrospective) | Action for successor |
|---|---|---|
| Worked | **Advisory-only / fail-passive (REQ-SAF-01)** made field teardown low-risk — removing a node can never trip the host machine, so decommissioning never threatened production. | Keep the no-actuation architecture in the successor; it pays off again at disposal. |
| Worked | **Edge-first design (REQ-F-02/REQ-O-02)** let nodes drain their offline buffer (F2) before wipe, so no detection was lost at decommissioning. | Preserve local-first autonomy + drain-before-wipe in the successor. |
| Failed / surprised | Cloud **backups across regions** and forgotten **secrets stores** were the hardest data to fully enumerate for sanitization (§4 classic miss). | Maintain a live data-store/secrets inventory tagged with retention class from day 1. |
| Surprised | Destroying the **device-identity CA (P5)** before the last field cert was revoked would have stranded still-trusted nodes — sequencing the trust-root destruction last was non-obvious. | Bake "revoke field, then destroy root" into the successor's PKI lifecycle. |
| Measurement | Whether the accuracy/footprint/battery/latency quadrilemma (`RSK-01/05`, TPM-01..05) actually held in the field over multi-year life is the single most valuable closing datum. | Seed successor targets from SentinelEdge's measured field reality, not assumptions. |
| Process | Disposal authority & contractual notice periods (Phase 00 Agreement_Register) were not available at retirement (still `TODO`). | Capture EOL/handback/notice terms in the Phase-00 agreement and keep them current. |

---

## 10. Disposal Risk / Safety / Security

### 10.1 Disposal risks (`RSK-*`, scored L×I per Conventions §5.3)

These elaborate the seed `RSK-07` ("improper battery/e-waste disposal or recoverable data on retired devices → compliance breach") from `Concept §9` into disposal-specific risks.

| ID | Risk | L | I | Band | Response |
|---|---|---|---|---|---|
| **RSK-D-01** | Premature purge of alert/lineage records still under `REQ-O-04` retention or an open legal hold. | 2 | 4 | High | **Archive-then-wipe gate at P4**; Compliance sign-off blocks P4; legal-hold query (§4.2). |
| **RSK-D-02** | Recoverable data/keys leak from data-bearing media (secure element, model flash, gateway) in transit to the recycler. | 3 | 5 | Critical | Sanitize/destroy **on-node before dispatch** (F3); Destroy secure element; chain-of-custody (§5); CoS precedes transport. |
| **RSK-D-03** | Destroying the device-identity CA (P5) before the fleet is revoked strands still-trusted nodes / breaks OCSP for live certs. | 2 | 4 | High | Sequence P5 **after** all field-cert revocations (F1) + P4; decommission OCSP last; verified precondition. |
| **RSK-D-04** | A dependent consumer (customer CMMS, dashboard, successor) breaks when the backend is removed too early. | 3 | 3 | Medium | Reverse-integration order (§3); detach CMMS/dashboard (P2) before backend purge (P4); blast-radius check. |
| **RSK-D-05** | Battery/e-waste mishandled → fire in transit or RoHS/WEEE compliance breach (the `RSK-07` core). | 2 | 4 | Medium | Certified R2v3/e-Stewards + battery recycler; UN/EU-rated battery transport; per-class disposal certificate (§5). |
| **RSK-D-06** | Node removed unsafely near rotating machinery during field decommissioning. | 2 | 5 | High | `REQ-SAF-02` LOTO + clearance procedure; Safety-Officer sign-off; two-person rule for energized steps (§10.2). |
| **RSK-D-07** | Irrecoverable knowledge loss — model lineage / safety case / field-measured TPMs lost when the team disbands. | 3 | 4 | High | Archive package + lessons-learned as **DRR exit criteria** (§9); route to Quality/Knowledge thread. |
| **RSK-D-08** | Cross a point-of-no-return (F3 / P4 / P5) before DRR sign-off or before precondition verified. | 2 | 5 | High | Hard gate: irreversible steps require DRR approval + verified precondition; `CR-31` authorises execution. |
| **OPP-D-01** | Salvage/redeploy value from reusable nodes/gateways, banked obsolete MEMS/secure-element parts, recovered battery/metal mass. | — | — | — | Redeploy/sell (§6); feeds life-cycle-cost closure. |

### 10.2 New `Hazard_Log.md` entries (decommissioning hazards — linked to `HAZ-01`)

- **`HAZ-D-01`** — Node removal/service **near rotating machinery** during field decommissioning (the same rotating-machinery hazard as `HAZ-01`, now in a teardown context). *Control:* `REQ-SAF-02` procedure — mount/dismount clear of rotating parts; respect host LOTO; Safety-Officer sign-off at F4; advisory-only/fail-passive (REQ-SAF-01) means removal cannot trip the host.
- **`HAZ-D-02`** — **Lithium battery** thermal runaway during removal/transport. *Control:* insulate terminals at F5; UN/EU-rated packaging; certified battery recycler (§5).
- **`HAZ-D-03`** — **Lone-working** field teardown at remote/in-plant sites. *Control:* two-person rule for LOTO/energized steps; check-in protocol.

### 10.3 Data-at-rest exposure review (`Threat_Model.md`, `THR-*`)

- **`THR-D-01`** — Data-bearing media (secure element, model flash, gateway credential store) **in transit to the recycler** is a live attack surface until **Destroyed**. *Control:* sanitize/destroy **on-node before dispatch** (F3/§4); chain-of-custody with tamper-evident seals; Certificate of Sanitization precedes transport. Directly mitigates the `RSK-07`/`RSK-06` residue.
- **`THR-D-02`** — Orphaned signing/OTA keys in forgotten cloud backups or caches re-enable malicious-image signing post-shutdown (`RSK-06`). *Control:* enumerate all regions/backups/secrets stores (§4 backups + secrets rows); HSM-zeroize signing keys + CA at P5; revoke at issuer.

---

## 11. DRR Readiness

Gate: **DRR (Decommissioning Readiness Review)** — *"Passes when: retirement plan, data sanitization, environmental & archival approved."* (Conventions §3). The DRR authorises `CR-31` to proceed to its irreversible steps (P4, P5; and ratifies the standing per-device PONR F3).

### 11.1 Gate package summary

| DRR criterion | Status |
|---|---|
| Retirement trigger, end-state, mode documented; opened as `CR-31` (High/S1-class) | ✅ §1 |
| Decommissioning sequence reverses integration order; owner/rollback/verify per step; PONRs flagged (F3, P4, P5) | ✅ §3 — ⚠ `INC-*` mapping `TODO` (Phase 06 not authored) |
| §4 sanitization table complete — Clear/Purge/Destroy by categorization, method, verification, CoS ref | ✅ §4.1 |
| Retention/legal-hold data identified & **archived before any wipe** (alert/lineage/safety-case); customer-return path defined | ✅ §4.2–4.3; ⚠ open legal-hold `TODO`; retention windows `TODO` (carried from `SysRS §7.1`) |
| Key/secret/credential destruction planned (incl. secure element, signing CA, backups, caches, secrets stores) | ✅ §4.4 |
| Environmental plan — RoHS/WEEE/battery routing, certified recycler + chain-of-custody per class; site restoration | ✅ §5 — ⚠ per-region recycler list `TODO` |
| Obsolescence & spares disposition decided per class (owner/date) | ⚠ §6 — dates `TODO` |
| License/contract/service wind-down sequenced after export & EOS, notice periods | ⚠ §7 — notice periods `TODO` (Phase 00 Agreement_Register still `TODO`) |
| EOL comms scheduled backwards from sunset; migration path + export deadline published | ⚠ §8 — some notice windows `TODO` |
| Successor handover (if any) defined; predecessor teardown gated on successor go-live | ✅ §8a |
| Knowledge archive staged + lessons-learned written and routed to Quality/Knowledge thread | ✅ §9 — ⚠ retrospective `TODO: schedule` |
| Disposal `RSK-*` scored; hazards in `Hazard_Log` (HAZ-D-01..03); data-at-rest exposure in `Threat_Model` (THR-D-01/02) | ✅ §10 |
| Frontmatter present; all open items are named `TODO`s with owners/dates; no irreversible step before precondition clears | ✅ this doc |

### 11.2 Outstanding TODOs (owner / due)

| # | TODO | Owner | Due |
|---|---|---|---|
| 1 | Author Phase-00 `Agreement_Register.md`; extract disposal authority + EOL/handback terms + contractual notice periods | PMO Legal / STK-08 | DRR − 45d |
| 2 | Confirm open legal holds / litigation before P4 (and before any F3 batch) | PMO Legal | DRR − 15d |
| 3 | Confirm per-region RoHS/WEEE jurisdiction list, battery-transport regime & certified-recycler accreditation | Sustainability/Compliance (STK-07) | DRR − 30d |
| 4 | Confirm regulator notice windows (IEC 61508 assessor closure, UL/CE/FCC de-listing, battery/RoHS authorities) | Sustainability/Compliance (STK-07) | DRR − 30d |
| 5 | Resolve retention windows from `SysRS §7.1` (`REQ-O-04` `retention_target`; SBOM/safety-case windows) | Security + Safety Leads | DRR − 30d |
| 6 | Re-baseline §3 "Reverses (derived)" column against real `INC-*` once `Phase_06_Integration/Integration_Plan.md` is authored | Lead SE / Integration | DRR − 30d |
| 7 | Set spares/obsolescence disposition target dates (§6) | CM / Field Service | DRR − 15d |
| 8 | Confirm `CR-31` number against `Phase_09_Change_Config/CR_Log.md` when authored | CM / Release Manager | DRR − 30d |
| 9 | Schedule the lessons-learned retrospective; route to Quality/Knowledge thread | Lead SE + QA/V&V Lead | DRR − 15d |

> **DRR decision options** (Conventions §3 gate ladder; proceed/proceed-with-actions/hold/re-baseline/stop): with the open `TODO`s above, the recommended outcome is **Proceed-with-actions** — the DRR may **ratify the standing per-device procedure (§3.A) and approve the reversible whole-program stages (P1–P3)** while **blocking P4 and P5 (the cloud-data and trust-root points of no return)** until TODOs 1–5 clear. The per-device PONR **F3** is pre-authorised only once a node's retention-relevant evidence is drained (F2) and a legal-hold check (TODO 2) is in place. On full DRR approval and execution, CM status accounting marks SentinelEdge **Retired** (or **Superseded by successor**), and the lessons-learned package + measured TPM-01..05 field actuals flow **forward** to the Quality/Knowledge thread and the successor's Phase 01 — closing the concept-to-disposal lifecycle.

---

*Gate this plan supports:* **DRR** (Conventions §3). The lessons-learned package and the archived model-lineage + safety-case record are the outputs that flow **forward** — to the Quality/Knowledge thread and the next project's Phase 01.
