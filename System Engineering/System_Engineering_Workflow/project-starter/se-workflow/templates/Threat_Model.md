---
Document: Threat Model — <PROJECT NAME>
Document ID: THM-<PROJECT_SLUG>-v0.1
Standard: STRIDE; ISO/IEC 27001:2022; NIST SP 800-53 Rev. 5; NIST SP 800-160
Status: Draft
Owner: <Security Lead>
---

# Threat Model

> The persistent security artifact: trust boundaries identified, **STRIDE** applied per boundary to produce `THR-*`, each threat scored, mapped to a control (`REQ-SEC-*`), and verified (`TC-VER-*`). Security is **emergent** and **adversarial** — it cannot be allocated to one block or proven once. Keep this model, the control matrix, and the SBOM **current with the baseline** and reviewed at **every** gate, so security never silently falls behind the design it protects.
>
> Baselined at **PDR** with the allocated baseline; re-opened only via a `CR-<nn>` (Stage 09). **A new threat on a baselined model *is* a change request.**
>
> Conventions: `THR-*`/`REQ-SEC-*`/`ICD-*` IDs §2.1, §2.4 · severity `S1`–`S4` §5.1 · 5×5 likelihood×impact §5.3 (do **not** invent a security-only scale) · satisfy-vs-verify §7 · folder layout §10. Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. Scope, assets & regimes

| Field | Value |
|---|---|
| System / release under model | `<name + version>` |
| Applicable regimes | `<ISO 27001 / GDPR / HIPAA / sector rules — TODO>` |
| Assets to protect (data, credentials, functions) | `<TODO list>` |
| Security properties at stake | Confidentiality · Integrity · Availability `<note which dominate>` |
| Attacker model (anti-stakeholders) | `<external / insider / supply-chain — TODO>` |

---

## 2. Trust boundaries

> Every place data crosses a **privilege, network, or ownership** change is a trust boundary. Each `ICD-<nn>` is a candidate boundary — and **third-party APIs, identity providers, and cloud control planes are boundaries too**, owed the same STRIDE walk as an internal seam.

| Boundary ref | IBD block / `ICD-<nn>` | Crosses (privilege / network / ownership) | Data in transit / at rest | External? |
|---|---|---|---|---|
| `<B1>` | `<block / ICD-nn>` | `<TODO>` | `<TODO>` | `<Y/N>` |
| `<TODO>` | `<TODO>` | | | |

---

## 3. Threat register (`THR-*`, STRIDE per boundary)

> Walk the six STRIDE categories at **each** boundary/data-flow. *Where to start per element:* external entity → **Spoofing**; data flow → **Tampering / Information disclosure / DoS**; data store → **Tampering / Repudiation / Information disclosure**; process → **all six**.
> STRIDE ↔ property: Spoofing↔authentication · Tampering↔integrity · Repudiation↔non-repudiation/audit · Information disclosure↔confidentiality · DoS↔availability · Elevation↔authorization.
> Score impact (`S1`–`S4`, §5.1) × likelihood (1–5, §5.3) → band. A boundary with **no candidate control** is an open risk.

| `THR-<nn>` | STRIDE category | Asset / boundary (IBD block or `ICD-<nn>`) | Attacker & precondition | Impact (S1–S4) | L (1–5) | Band | Control (`REQ-SEC-<nn>`) | Residual | Verify (`TC-VER-<nn>`) |
|---|---|---|---|---|---|---|---|---|---|
| THR-01 | _(example — delete)_ Tampering | `<command channel @ ICD-07>` | `<network MITM, no transport auth>` | `<S1>` | `<4>` | `<Critical>` | `REQ-SEC-01` `<mTLS + signed payloads>` | `<Low>` | `TC-VER-01` |
| THR-02 | `<Spoofing / … >` | `<TODO>` | `<TODO>` | | | | REQ-SEC-TBD | | TC-VER-TBD |
| THR-`<nn>` | … | | | | | | | | |

---

## 4. Security control matrix

> Map each threat to a control from **NIST SP 800-53 Rev 5** families (AC, IA, SC, SI, AU, CM, SR…) and/or **ISO/IEC 27002**, written as a SMART `REQ-SEC-*` and `satisfy`-linked to a design block.
> **Control hierarchy (apply in order):** *eliminate* (remove the boundary/feature/data) → *prevent* (authN, encryption, input validation) → *detect* (audit logging, IDS/SIEM) → *respond/recover* (rate-limit, rotate keys, fail-secure). A Critical `THR-*` should rarely rely on a single layer — record each layer as a separate `REQ-SEC-*` so each is independently verified.

| `REQ-SEC-<nn>` | Mitigates `THR-*` | NIST 800-53 family/id | ISO/IEC 27002 ref | Hierarchy tier (elim/prev/det/resp) | Satisfy-linked block | Method (T/I/A/D) | Verify (`TC-VER-<nn>`) |
|---|---|---|---|---|---|---|---|
| REQ-SEC-01 | `<THR-01>` | `<SC-8>` | `<8.24>` | Prevent | `<block>` | T | `TC-VER-01` |
| REQ-SEC-`<nn>` | `<TODO>` | `<TODO>` | `<TODO>` | | | | TC-VER-TBD |

---

## 5. SBOM & supply-chain provenance (per release)

> Generate an **SBOM** (SPDX / CycloneDX) per build; require signed, attested artifacts (SLSA / in-toto); gate merges on SCA + license + known-CVE checks. Most modern breaches enter through dependencies — no SBOM, no provenance = blind to the largest attack surface. SBOM lives beside the build recipe in `Phase_06_Integration/`; an SBOM/CVE is itself a `CI-*`.

| Component | Version | License | Source / provenance (signed? SLSA level) | Known CVE (CVSS) | Affected `THR-*` / `REQ-SEC-*` | Action (`CR-<nn>`) |
|---|---|---|---|---|---|---|
| `<dep>` | `<x.y.z>` | `<SPDX id>` | `<signed? attested? — TODO>` | `<CVE-… / none>` | `<THR-nn>` | `<CR-nn / none>` |
| `<TODO>` | | | | | | |

---

## 6. Residual risk acceptance

> A residual must be an auditable `DEC-*` or an open `RSK-*` — **never a silent gap**.

| `THR-<nn>` | Residual band | Accepted as | Owner / approver | Rationale |
|---|---|---|---|---|
| `<THR-nn>` | `<Low / Med>` | `DEC-<nn>` / `RSK-<nn>` | `<role>` | `<TODO>` |

---

## 7. Per-gate review snapshot

| Gate | Date | Boundaries modeled? | Critical/High `THR-*` all controlled? | SBOM current & provenance verified? | Sign-off / outcome |
|---|---|---|---|---|---|
| SRR (02) | `<date>` | n/a | `<REQ-SEC SMART?>` | n/a | `<TODO>` |
| PDR (04) | | `<all boundaries?>` | `<Y/N>` | `<draft>` | `<baseline model>` |
| CDR (06) | | | | `<per build>` | |
| TRR (07) | | | `<every THR has TC-VER?>` | | |
| PRR (08) | | | `<zero sev-1 sec defect?>` | | |
| ORR / GA (10) | | | `<re-threat-model cadence?>` | `<live CVE watch>` | |
| DRR (11) | | | `<keys/certs revoked?>` | `<sanitization per 800-88>` | |

---

## 8. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<first full threat model at PDR; cite CR-nn for any post-baseline change>`
- `TODO:` `<re-run the model whenever architecture, interfaces, or the threat landscape changes — never "done">`

---

### References
- `05_Conventions.md` — §2 (`THR-*`, `REQ-SEC-*`, `ICD-*`), §3 (gates), §4 (T/I/A/D), §5 (severity & scoring), §6 (status), §7 (satisfy vs verify), §8 (traceability spine), §9 (citations), §10 (folder layout).
- `cross-cutting/Security_Engineering.md` — owning thread (STRIDE-per-boundary loop, control hierarchy, SBOM, gate questions).
- Sibling threads: `Risk_and_Opportunity_Management.md` (shared 5×5 scoring; residuals → `RSK-*`), `Safety_RAMS_Engineering.md` (`HAZ-*` ≠ `THR-*`), `Configuration_Management.md` (SBOM as `CI-*`).
- Standards: **ISO/IEC 27001:2022**, **NIST SP 800-53 Rev. 5**, **NIST SP 800-160**, **STRIDE**, **SBOM** (SPDX/CycloneDX), **NIST SP 800-88 Rev. 1**.
