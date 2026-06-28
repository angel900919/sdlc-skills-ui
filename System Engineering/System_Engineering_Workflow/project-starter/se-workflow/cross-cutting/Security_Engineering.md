# Security Engineering — the cross-cutting thread

> A **living** discipline that builds security *into* the system across all 12 stages — not a scan bolted on at the end. It runs from the first `STK-*`/`SN-*` through threat modeling, control selection, supply-chain provenance, and continuous validation, and it is reviewed at **every** gate.

**Why first-class:** the audit (`00_Skills_Audit_Report.md` Part D) found security existed "only as a `SEC` REQ class + scans." That is necessary-but-not-sufficient: a system with perfect `SEC-*` coverage can still be breached through an un-modeled trust boundary, an unselected control, or a poisoned dependency. Security is **emergent** and **adversarial** — it cannot be allocated to one block or proven once. It earns thread status because it cuts across requirements (02), interfaces (04), supply chain (06), and operations (10), and because a single missed boundary fails the whole system. Secure-by-design means the cost of a missed threat compounds with every downstream stage.

---

## What it is & why it matters

Security engineering is the disciplined identification of **what could go wrong on purpose** (threats), the **boundaries** an attacker would have to cross (trust boundaries), the **controls** that stop them, and the **evidence** that those controls work and keep working. It is distinct from Safety/RAMS: Safety asks "what fails by accident, harming people?"; Security asks "what does an *adversary* do, and what do we lose (confidentiality, integrity, availability)?" The two threads share machinery (logs, FMEA-style decomposition, gate review) but never the same hazard/threat record.

It matters because security defects are the most expensive to fix late and the only defect class with an intelligent opponent actively probing for them. Threats discovered at ORR (Stage 10) cost orders of magnitude more than threats designed out at PDR (Stage 04). The thread exists to **shift security left** onto the traceability spine ([`05_Conventions.md` §8](../05_Conventions.md)) so every threat traces to a control, every control to a requirement, and every requirement to a verification.

The thread is **domain-agnostic**: the same STRIDE-per-boundary loop applies to a web API, an embedded controller, or a hybrid hardware/software plant — only the assets and boundaries change. What stays constant is the obligation to keep the threat model, control matrix, and SBOM *current with the baseline* and reviewed at *every* gate, so security never silently falls behind the design it is meant to protect.

---

## Standards anchor

Use the canonical citations from [`05_Conventions.md` §9](../05_Conventions.md) — do not restate or re-version them here:

| Concern | Canonical citation (per §9) |
|---|---|
| ISMS / control framework | **ISO/IEC 27001:2022** (+ ISO/IEC 27002 control catalog) |
| Security & privacy controls catalog | **NIST SP 800-53 Rev. 5** |
| Systems security engineering process | **NIST SP 800-160** (Vol. 1 process, Vol. 2 cyber-resiliency) |
| Threat modeling method | **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) |
| Software supply-chain transparency | **SBOM** (SPDX / CycloneDX formats); provenance via SLSA / in-toto attestations |
| Secure media sanitization (handoff to Stage 11) | **NIST SP 800-88 Rev. 1** |

> Threat *severity* and *priority* reuse the project taxonomies in §5 — score threat impact on the `S1`–`S4` scale and response priority High/Medium/Low; **do not** invent a security-only severity. Likelihood × impact follows the §5.3 5×5 scheme shared with the Risk thread.

---

## The living artifact

The thread maintains one persistent artifact, the **Threat Model**, plus a derived **Security Control Matrix** and an **SBOM** per release.

- **ID grammar:** threats are `THR-<nn>` (per [§2.4](../05_Conventions.md)); security requirements are `REQ-SEC-<nn>` (per [§2.1](../05_Conventions.md), `SEC` class). Trust boundaries are referenced by the IBD/ICD elements they cut — e.g. `THR-03 @ ICD-07` means a Tampering threat on interface `ICD-07`. A not-yet-mitigated threat links to `REQ-SEC-TBD` until the control requirement is written (§2.4 placeholder rule).
- **Grammar of a threat row:** `THR-<nn> | STRIDE category | asset / boundary (IBD block or ICD-<nn>) | attacker & precondition | impact (S1–S4) × likelihood (1–5) → band | control (REQ-SEC-<nn>) | residual | verify (TC-VER-<nn>)`.
- **Worked row (illustrative):** `THR-03 | Tampering | command channel @ ICD-07 | network MITM, no transport auth | S1 × 4 → Critical | REQ-SEC-12 (mTLS + signed payloads) | Low | TC-VER-21` — reads as one auditable line on the spine from boundary → control → proof.
- **Where it lives:** in the project instance under `_cross_cutting/Threat_Model.md` (per [`05_Conventions.md` §10](../05_Conventions.md)); the SBOM lives beside the build recipe in `Phase_06_Integration/`; the control matrix is an appendix to `Phase_04_Architecture/Architecture_Description.md`.
- **Template:** [`../templates/Threat_Model.md`](../templates/Threat_Model.md) (blank `THR-*` table, STRIDE-per-boundary worksheet, control-mapping and SBOM stubs).
- **Status & versioning:** carries the standard frontmatter ([§6](../05_Conventions.md)); baselined at **PDR** with the allocated baseline, re-opened only via a `CR-<nn>` (Stage 09). A new threat on a baselined model **is** a change request.

---

## Lifecycle touchpoints

| Stage | What the Security thread does |
|---|---|
| **00 Agreement** | Capture security obligations as `STK-*` (regulators, attackers-as-anti-stakeholders, auditors); name applicable regimes (27001, GDPR/HIPAA, sector rules) in the SEMP; agree on supply-chain & data-handling clauses in the agreement. |
| **01 Concept** | Derive security `SN-*` from the mission; record the threat environment & assets to protect in the OpsCon; add an abuse/misuse scenario to the `SCN-*` set; feasibility study covers regulatory & crypto-export feasibility. |
| **02 Requirements** | Write the `REQ-SEC-*` class (authN/authZ, crypto, audit logging, key mgmt, data classification); define security `MOE/MOP` (e.g. % critical assets behind MFA); seed T/I/A/D methods. Baselined at **SRR**. |
| **03 Modeling** | Mark **trust boundaries** on the **IBD** (zones, data-in-transit/at-rest); the data-flow view feeds STRIDE. Requirements diagram shows `REQ-SEC-*` `derive`/`satisfy` links. |
| **04 Architecture & Design** | First full **threat model** (`THR-*`) over IBD boundaries + ICD seams; **select controls** (NIST 800-53 families, 27002) and allocate them to blocks/interfaces; freeze security-relevant ICD fields (mTLS, authN scheme). Threat model + control matrix baselined at **PDR**. |
| **05 Trade-off & Decision** | Security is a scored criterion in `DM-*`; control choices (e.g. HSM vs. software KMS, OAuth vs. mTLS) become `DEC-*`; residual-risk acceptance is an auditable decision. |
| **06 Integration** | Generate the **SBOM** per build; verify **provenance/attestations** (signed artifacts, SLSA level); wire SAST/DAST/SCA/secret-scanning + dependency gates into CI/CD per `INC-*`; HIL/staging gets the same controls as prod. |
| **07 Verification** | Each `THR-*` control is verified by a `TC-VER-*` (method T/I/A/D); pen-test/abuse-case coverage tracked in the Verification Matrix; **TRR** checks 100% control coverage. |
| **08 Validation** | Validate against real attacker scenarios (`TC-VAL-*`): red-team exercise, abuse-case acceptance, compliance audit evidence; sev-1 security defect blocks **PRR**. |
| **09 Change & Config** | Every config/dep change runs impact analysis vs. the threat model; new CVE in SBOM ⇒ `CR-<nn>`; security patches are tracked configuration items (`CI-*`). |
| **10 Operations & Continuous Validation** | **Continuous security validation**: live SBOM/CVE watch, secret rotation, IDS/SIEM `SLO-*`, incident runbooks (`RB-*`), periodic re-test & re-threat-model; security incidents use the `S1`–`S4` taxonomy. |
| **11 Disposal** | Cryptographic erasure & **secure sanitization per NIST SP 800-88** (handoff in §9); revoke keys/certs/credentials; deregister from trust stores; archive audit logs per retention obligation. |

---

## Method / activities

1. **Identify assets & boundaries.** From the IBD (Stage 03), list assets (data, credentials, functions) and draw trust boundaries — every place data crosses a privilege, network, or ownership change. Each `ICD-<nn>` is a candidate boundary.
2. **STRIDE-per-element.** For each boundary/data-flow, walk the six STRIDE categories and ask "how could an adversary do this here?" Record each plausible answer as a `THR-<nn>`. Spoofing↔authentication, Tampering↔integrity, Repudiation↔non-repudiation/audit, Information disclosure↔confidentiality, DoS↔availability, Elevation↔authorization.
3. **Score.** Rate each `THR-*` impact (`S1`–`S4`, §5.1) × likelihood (1–5, §5.3) → band. Prioritize Critical/High first.
4. **Select & allocate controls.** Map each threat to a control from **NIST 800-53 Rev 5** families (AC, IA, SC, SI, AU, CM, SR…) and/or **ISO/IEC 27002**. Write the control as a `REQ-SEC-<nn>` and `satisfy`-link it to the design block. Prefer eliminating the threat (remove the boundary) > preventing > detecting > responding.
5. **Supply-chain & provenance.** Generate an **SBOM** (SPDX/CycloneDX) per build; require signed, attested artifacts (SLSA/in-toto); gate merges on SCA + license + known-CVE checks.
6. **Verify & validate.** Bind each control to a `TC-VER-*` (Stage 07) and adversarial `TC-VAL-*` (Stage 08). Track residual risk; un-mitigated residuals become accepted `DEC-*` or open `RSK-*`.
7. **Operate & re-model.** Continuously watch the SBOM for new CVEs, monitor controls via `SLO-*`, and re-run the threat model whenever architecture, interfaces, or the threat landscape changes (a change-driven, never "done", loop).

> **Control-hierarchy heuristic (step 4, applied in order):** *eliminate* the threat (remove the boundary, drop the feature/data) → *prevent* (authN, encryption, input validation) → *detect* (audit logging, IDS/SIEM, anomaly alerts) → *respond/recover* (rate-limit, rotate keys, fail-secure, restore). Defense-in-depth means a Critical `THR-*` should rarely rely on a single control layer; record the layers as separate `REQ-SEC-*` so each is independently verified.

> **Where to start STRIDE per boundary:** external entity → check *Spoofing*; data flow → *Tampering* / *Information disclosure* / *DoS*; data store → *Tampering* / *Repudiation* / *Information disclosure*; process → *all six*. This mapping keeps the per-element walk fast and complete instead of guessing categories ad hoc.

---

## Gate-review questions

Ask these of the Security thread at each gate (full ladder in [`05_Conventions.md` §3](../05_Conventions.md)):

- **ATP (00):** Are security/compliance obligations and supply-chain clauses in the agreement & SEMP? Are regulators/attackers captured as stakeholders?
- **MCR (01):** Is the threat environment characterized in the OpsCon? Is at least one abuse/misuse `SCN-*` present? Any crypto/regulatory feasibility blockers?
- **SRR (02):** Does every security `SN-*` derive to a `REQ-SEC-*`? Are `REQ-SEC-*` SMART, with T/I/A/D seeded and security MOE/MOP defined?
- **PDR (04):** Is the threat model complete over **all** IBD trust boundaries and ICD seams? Is every Critical/High `THR-*` mapped to a selected, allocated control? Any critical open security risk?
- **CDR (06):** Are security-relevant ICD fields frozen? Is the SBOM produced and provenance verified for every build? Are CI/CD security gates wired into each `INC-*`?
- **TRR (07):** Is every `THR-*` control covered by a `TC-VER-*`? Is pen-test/abuse-case scope agreed and the environment representative?
- **PRR (08):** Validation ≥ targets with **zero sev-1 security defects**? Red-team / compliance-audit evidence on file? Residual risks formally accepted?
- **ORR / GA (10):** Are SBOM/CVE watch, secret rotation, IDS/SIEM SLOs, and incident runbooks live? Is re-threat-modeling cadence defined?
- **DRR (11):** Is sanitization per NIST 800-88 planned, are all keys/certs/credentials revoked, and audit logs archived per retention?

---

## AI prompt pack

Copy-paste; replace bracketed slots. Keep the AI on the conventions — make it cite `THR-*`/`REQ-SEC-*`/`ICD-*` IDs, never invent a severity scheme.

**1 — Build the threat model (STRIDE per boundary):**
> "You are a security engineer. Given this IBD and ICD list `[paste]`, enumerate trust boundaries, then apply **STRIDE** to each. Output a `THR-<nn>` table per `05_Conventions.md §2.4` with columns: STRIDE category, asset/boundary (cite IBD block or `ICD-<nn>`), attacker+precondition, impact (`S1`–`S4`) × likelihood (1–5) → band, proposed control. Flag any boundary with no candidate control as an open risk."

**2 — Select & allocate controls:**
> "For each `THR-*` in `[paste threat table]`, recommend the minimal set of **NIST SP 800-53 Rev 5** controls (give family + identifier) and the matching **ISO/IEC 27002** control. Write each as a SMART `REQ-SEC-<nn>` with a T/I/A/D verification method, and state which design block it should `satisfy`-link to. Prefer eliminate > prevent > detect > respond."

**3 — Supply-chain / SBOM triage:**
> "Given this SBOM `[paste SPDX/CycloneDX]` and CVE feed, list components with known CVEs ranked by CVSS, map each to the affected `THR-*`/`REQ-SEC-*`, and draft `CR-<nn>` stubs (per `05_Conventions.md §9` change flow) for any that breach a baselined control. Note any unsigned or unattested artifacts."

**4 — Red-team / critique (adversarial):**
> "Act as an external red-team reviewing this threat model `[paste]`. Find: (a) trust boundaries the author missed, (b) STRIDE categories under-covered per boundary, (c) controls that are *asserted* (`satisfy`) but never *verified* (no `TC-VER-*`), (d) residual risks silently accepted, and (e) any threat scored too low. Be specific and cite IDs. Assume the author was optimistic."

---

## Common pitfalls

- **Treating `SEC-*` REQs + scans as "security done."** The exact audit finding — a clean scan and full `REQ-SEC-*` coverage say nothing about an un-modeled boundary. Threat-model the architecture, don't just lint the code.
- **Threat-modeling once.** A PDR-era model rots; new interfaces, dependencies, and attacker techniques invalidate it. Re-model on change and on a cadence (Stage 10).
- **Bolting security on at the end.** Controls added at ORR cost orders of magnitude more and fit poorly. Secure-by-design means boundaries on the IBD at Stage 03 and controls in `REQ-SEC-*` at Stage 02.
- **`satisfy` without `verify`.** A control allocated to a block is an *assertion*, not proof (§7 vocabulary). Every control needs a `TC-VER-*`.
- **Ignoring the supply chain.** Most modern breaches enter through dependencies. No SBOM, no provenance check = blind to your largest attack surface.
- **Inventing a security-only severity or risk scale.** Reuse `S1`–`S4` (§5.1) and the 5×5 likelihood×impact (§5.3) so security risks aggregate with the rest.
- **Conflating Security with Safety.** Different threads, different logs (`THR-*` vs `HAZ-*`), different question (adversary vs. accident). Cross-reference where a threat causes a hazard, but keep the records distinct.
- **Accepting residual risk informally.** A residual must be an auditable `DEC-*` or an open `RSK-*` — never a silent gap.
- **Modeling only the boundaries you control.** Third-party APIs, identity providers, and cloud control planes are trust boundaries too; an `ICD-<nn>` to an external service needs the same STRIDE walk as an internal seam.
- **Testing controls only in the happy path.** Verification must include *abuse cases* — malformed input, expired/forged tokens, replayed requests — not just "control present." A `TC-VER-*` that never exercises the attack proves nothing.

---

## References

- [`05_Conventions.md`](../05_Conventions.md) — §2 IDs (`THR-*`, `REQ-SEC-*`, `ICD-*`), §3 gates, §4 T/I/A/D, §5 severity & scoring, §6 status, §8 traceability spine, **§9 canonical citations**, §10 folder layout.
- [`01_Workflow_Overview.md`](../01_Workflow_Overview.md) — the 12-stage spine, V-model, 15288 mapping, the 8 cross-cutting threads.
- `00_Skills_Audit_Report.md` — Part A (per-stage findings), Part D (the gap that created this thread).
- Sibling threads: [`Risk_and_Opportunity_Management.md`](Risk_and_Opportunity_Management.md) (shared 5×5 scoring), Safety/RAMS (`HAZ-*`), Configuration Management (SBOM as `CI-*`).
- Template: [`../templates/Threat_Model.md`](../templates/Threat_Model.md).
- Standards (canonical forms in §9): **ISO/IEC 27001:2022**, **NIST SP 800-53 Rev. 5**, **NIST SP 800-160**, **STRIDE**, **SBOM** (SPDX/CycloneDX), **NIST SP 800-88 Rev. 1**.
