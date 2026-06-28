---
Document: Disposal Plan — <PROJECT NAME>
Document ID: DISP-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Disposal) + NIST SP 800-88 Rev. 1
Status: Draft
Owner: <role — e.g. Decommissioning Lead / Configuration Manager>
---

# Disposal Plan — <PROJECT NAME>

> Blank template. Replace every `<ANGLE-BRACKET>` placeholder, resolve every `TODO:`, and delete every row marked `(example — delete)`. Conforms to [`../05_Conventions.md`](../05_Conventions.md) — cite shared conventions (IDs `RSK-*`/`CI-*`/`CR-*`/`RB-*`/`REQ-*`, the **DRR** gate, severity, status strings, citations); do not redefine them.
>
> **Retire reversibly until the point of no return; then irreversibly only with DRR sign-off.** No irreversible step (deletion, destruction, disassembly) proceeds before its precondition clears and the **DRR** passes.

---

## 1. Purpose, Scope & Retirement Trigger

- **Why now (trigger):** <obsolescence / EOL of a key dependency / business decision / replacement by successor / regulatory mandate>.
- **Target end-state:** <fully gone · replaced by successor · partially retired / mothballed · sold / transferred>.
- **Disposal mode:** <Software / service EOL · Physical / hardware · Hybrid · Special-domain (space / nuclear / medical)>. TODO: confirm via triage.
- **The retirement is a controlled change:** opened as `CR-NN` against the product baseline ([Phase 09](Change_Management_Plan.md)).

## 2. Authority & Stakeholders

- **Disposal authority:** <from Phase-00 `SEMP.md` — who can authorise retirement>. TODO if absent.
- **Contract EOL / handback terms:** <data-return obligations, termination/notice periods from `Agreement_Register.md`>. TODO.
- **Notify-list:** <stakeholders from Phase-01 register + Phase-10 user base — see §8>.

## 3. Decommissioning Sequence (reverse-integration teardown)

Build by **reversing the Phase-06 integration order** — last integrated, first removed — so dependents detach before the things they depend on. Flag every **point of no return** (first irreversible destruction). For software: traffic-drain / read-only stages before deletion. For hardware: de-energize / lockout-tagout / drain before disassembly.

| Seq | Precondition | Action | Owner | Reverses INC-NN | Rollback point? | Verify (stays safe/observable) | Point of no return? |
|---|---|---|---|---|---|---|---|
| 1 | <…> | <e.g. drain traffic / put service read-only> | <role> | `INC-NN` | yes | <SLO still green> | no |
| 2 | <…> | <detach dependent system X> | <role> | `INC-NN` | yes | <…> | no |
| N | <retention/hold cleared (§4); DRR approved> | <delete data store / disassemble> | <role> | `INC-NN` | **no** | <sanitization certified> | **YES** |
| 3 | DRR-approved | Wipe payment DB cluster | DBA | INC-07 | no | Cert-of-Sanitization filed | YES | *(example — delete)* |

## 4. Data Handling & Sanitization (NIST SP 800-88 Rev. 1)

Choose the action from the **data's confidentiality categorization**, not the medium alone; **verify + certify each** (Certificate of Sanitization). For encrypted media, key destruction is the controlling act. **Never destroy data still under a retention or legal-hold obligation — migrate it to the archive first (§9).**

| Store / Media | Data categorization | Action (Clear / Purge / Destroy) | Method | Verification | Cert ref | Retention / Hold? |
|---|---|---|---|---|---|---|
| <e.g. primary DB> | <Confidential / PII> | <Purge> | <crypto-erase / block-erase> | <validation step> | <CoS-NN> | <no / until YYYY-MM> |
| <e.g. backups + caches + secrets store> | <…> | <…> | <…> | <…> | <…> | <…> |
| <e.g. decommissioned disks → recycler> | <High> | <Destroy> | <shred / degauss> | <witnessed> | <CoS-NN> | <no> |
| Audit logs (object store) | Regulated | (none) — RETAIN | migrate to archive | hash-verify copy | n/a | until 2033 (REQ-O-05) | *(example — delete)* |

- **Clear** — overwrite / factory reset (defeats simple recovery; reuse inside org).
- **Purge** — crypto-erase / block-erase / degauss (defeats lab recovery; reuse outside org).
- **Destroy** — shred / disintegrate / incinerate / melt (highest assurance; no reuse).

**Retention / legal-hold list (migrate to archive, do NOT destroy):** <records + their retention windows from `REQ-O-*` / `REQ-D-*`>. TODO: never guess retention windows.
**Customer-return list (export, confirm receipt, then wipe):** <data owned by the customer per the Phase-00 contract>.
**Key / secret / credential destruction:** <keys, certs, tokens — including those in backups, caches, logs, secrets managers>.

## 5. Environmental, Recycling & Hazardous-Material Disposition

*(Skip hardware-only rows for pure software, but keep cloud-resource teardown + carbon in scope.)*

| Asset class | RoHS / WEEE / e-waste routing | Hazardous material? | Certified recycler / vendor | Chain-of-custody / disposal cert | Site restoration |
|---|---|---|---|---|---|
| <e.g. chargers / servers> | <WEEE take-back> | <batteries / capacitors / refrigerants> | <R2 / e-Stewards vendor> | <cert ref> | <restore to …> |
| <cloud resources> | <region teardown> | n/a | <provider> | <deletion confirmation> | n/a |

- **Environmental-impact assessment:** <summary / link>. TODO.
- **Governing regime (controlled domains):** <space-debris mitigation · nuclear decommissioning · biohazard — cite, don't choose freely>. TODO if applicable.

## 6. Obsolescence & Spares Disposition

| Asset class | Disposition (redeploy / sell / donate / recycle / destroy) | Owner | Target date | DMSMS / warranty notes |
|---|---|---|---|---|
| <spares> | <…> | <role> | <YYYY-MM-DD> | <obsolete parts other systems still need?> |
| <tooling> | <…> | <role> | <…> | <…> |

## 7. License, Contract & Service Wind-Down

> Sequence cancellations **last** — after the data each governs is exported and after end-of-support. Honour contractual notice periods (from Phase 00).

| Agreement | Action (terminate / transfer / lapse / cancel) | Notice period | Cancel only after | Owner |
|---|---|---|---|---|
| <software license> | <…> | <N days> | <data export done> | <role> |
| <SaaS / cloud subscription> | cancel after data export | <…> | <export + EoL> | <role> |
| <support / maintenance> | <…> | <…> | <…> | <role> |
| <domain names / TLS certs> | release / revoke | <…> | <traffic drained> | <role> |

## 8. End-of-Support / EOL Communications

Build the timeline **backwards** from the sunset date; honour each audience's contractual notice period. **Mark unknown legal notice windows as `TODO` — do not guess.**

| Audience | Message | Channel | Send date (backwards from sunset) | Required lead time |
|---|---|---|---|---|
| <end users> | <sunset date, supported-until, what stops working> | <in-app / email> | <YYYY-MM-DD> | <TODO> |
| <partners / regulators> | <EOL notice + obligations> | <formal> | <YYYY-MM-DD> | <TODO: contractual> |

- **Sunset date:** <YYYY-MM-DD>. **Supported-until:** <YYYY-MM-DD>. **Data-export deadline:** <YYYY-MM-DD>.
- **Migration path to successor (if any):** <§8a>.

## 8a. Successor Handover (if replaced)

- **Data migration:** <approach>. **User / account migration:** <approach>.
- **Cutover / parallel-run window:** <dates>. **Predecessor teardown is gated on successor go-live.**
- **Successor inherits:** <configs · integrations · the archived knowledge package (§9)>.

## 9. Knowledge Archival & Lessons-Learned

> The disposal step most often skipped — make it a **DRR exit criterion**. The archive itself is sanitization-exempt and tamper-evident.

**Archive package**

| Content | Location | Retention period | Access / integrity controls | Format |
|---|---|---|---|---|
| <SysRS · architecture · ICDs · `DEC-*` register · V&V evidence · CM status accounting · ops record> | <repository / cold storage> | <N years> | <read-only · hash-verified> | <open / long-lived> |

**Lessons-learned retrospective (route to the Quality/Knowledge thread):** what worked · what failed · what surprised us · what the next system should do differently. Action items get **owners** and feed the next project's Phase 01. TODO: schedule the retrospective; it is done only when written, routed, and actioned — not when a template is filled.

## 10. Disposal Risk / Safety / Security

Score disposal-specific risks `RSK-*` (Likelihood × Impact, [`Conventions §5.3`](../05_Conventions.md)).

| RSK | Risk | L | I | Score | Mitigation |
|---|---|---|---|---|---|
| `RSK-NN` | premature deletion of still-needed data | <1–5> | <1–5> | <L×I> | <retention check before §3 step N> |
| `RSK-NN` | recoverable data leaks via media to recycler | <…> | <…> | <…> | <Destroy + chain-of-custody> |
| `RSK-NN` | dependent system breaks when dependency removed | <…> | <…> | <…> | <reverse-integration order; blast-radius check> |
| `RSK-NN` | environmental / regulatory violation | <…> | <…> | <…> | <certified recycler + cert> |
| `RSK-NN` | irrecoverable knowledge loss | <…> | <…> | <…> | <archive + lessons-learned (§9)> |

- **New `Hazard_Log.md` entries:** <stored energy · hazardous materials · lone-working teardown>.
- **Data-at-rest exposure review (`Threat_Model.md`):** <media in transit to the recycler is a live attack surface until Destroyed>.

## 11. DRR Readiness

Gate: **DRR (Decommissioning Readiness Review)** — passes when the retirement plan, data sanitization, environmental, and archival packages are all approved ([`Conventions §3`](../05_Conventions.md)).

- [ ] Retirement trigger, end-state, mode documented; retirement `CR-NN` opened against the product baseline.
- [ ] Decommissioning sequence is the reverse of Phase-06 integration; each step has owner, rollback point, verification; **points of no return** flagged.
- [ ] §4 sanitization table complete — action by **data categorization**, method, verification, Certificate-of-Sanitization ref per store.
- [ ] Retention / legal-hold data migrated to archive **before any wipe**; customer-return path defined.
- [ ] Key / secret / credential destruction planned (incl. backups, caches, logs, secrets stores).
- [ ] Environmental plan complete (RoHS/WEEE/e-waste, hazardous materials, certified recycler + chain-of-custody, site restoration). Cloud teardown + carbon for pure software.
- [ ] Obsolescence & spares disposition decided per asset class with owner + date.
- [ ] License/contract/service wind-down sequenced **after** export and end-of-support, notice periods honoured.
- [ ] EOL comms scheduled backwards from the sunset date; migration path + data-export deadline published.
- [ ] Successor handover (if any) defined; predecessor teardown gated on successor go-live.
- [ ] **Knowledge archive package staged AND lessons-learned written + routed to the Quality/Knowledge thread.**
- [ ] Disposal `RSK-*` scored; hazards in `Hazard_Log.md`; data-at-rest exposure in `Threat_Model.md`.
- [ ] This plan carries Conventions frontmatter; all open items are named `TODO`s with owners/dates; **no irreversible step proceeds before its precondition clears.**

---

*Gate this plan supports:* **DRR** ([`Conventions §1`](../05_Conventions.md)). The lessons-learned package is the one output that flows **forward** — to the Quality/Knowledge thread and the next project's Phase 01.
