# Tailoring Guide — right-size the rigour

> Running the full 17-phase, 6-thread process on a two-person 0→1 prototype is malpractice in the other direction — you drown a small bet in ceremony and miss the window. The opposite — shipping a regulated, high-blast-radius product with a one-line "we'll figure out privacy later" — is how companies get fined and customers get harmed. This guide tells you **how much of the workflow to run**, and records the decision so a teammate (or future you) can see *why*.
>
> Tailoring is itself a product decision. Capture it in `00_Charter/Operating_Model.md` (or the product README for the leanest profile).

---

## 1. The tailoring dimensions

Score your product/initiative on these five axes — they drive the profile in §2.

| Dimension | Low ↔ High |
|---|---|
| **Stage / maturity** | idea, 0→1, pre-PMF ↔ scaling, mature, multi-segment |
| **Blast radius / criticality** | minor inconvenience if wrong ↔ money/health/safety/legal exposure; hard to reverse |
| **Regulatory regime** | none ↔ regulated (health, finance, children, AI-as-decision, accessibility-mandated) |
| **Novelty / uncertainty** | well-understood problem & solution ↔ new market, new behaviour, unproven model |
| **Org scale / governance** | one team, internal ↔ many teams, exec/board governance, external commitments |

> **Heuristic:** **blast radius and regulation dominate.** A small but safety- or money-critical feature (a payments flow, a medical reminder, a kids' product) is *Formal* on the risk-bearing parts despite its size. A large but low-risk internal tool can stay *Standard*.

---

## 2. Three reference profiles

| | **Solo / Lean** | **Standard** | **Enterprise / Formal** |
|---|---|---|---|
| Fits | 0→1, startups, internal tools, single small team | most commercial products at a scaling company | large, regulated, multi-team, high-stakes |
| Phases run | 01, 03, 04, 07, 08, 10, 11 + the loop (12–15); 00/02/05/06/09/16 folded in or lightweight | 00–16, lightly | **all 00–16, fully** |
| Strategy (P01) | one-page vision + 1 North Star + 1–3 OKRs | full strategy + OKRs cascaded | strategy + portfolio alignment + board-level OKRs |
| Discovery (P03) | weekly interviews, lightweight notes | continuous discovery + insight repo | full ResearchOps, panels, ethics review |
| Roadmap (P05) | Now/Next/Later in a doc | Now/Next/Later tied to OKRs + release plan | portfolio roadmap + governance + dependency mgmt |
| Spec (P08) | one-pager / lean PRD | full PRD + NFR checklist | PRD + formal NFRs + compliance/sign-offs |
| Delivery (P10) | Kanban or light Scrum; ship continuously | Scrum/Kanban + flow metrics | scaled agile + release management + change control |
| Launch (P11) | soft launch / % rollout | tiered launch + GTM + rollback | full GTM, enablement, legal/PR, staged rollout |
| Experimentation (P13) | qualitative + simple before/after | A/B with significance + guardrails | full platform, holdouts, sequential testing, review |
| Threads | as checklists | living registers, reviewed at major gates | full registers, reviewed at **every** gate |
| Gates | informal self-review | lightweight gate reviews | **formal gate reviews with named approvers** |
| Documentation | README + the few artifacts | the artifact set | full set + evidence/audit packs |

A product may be **mixed**: *Formal* on the payments/PII track and *Standard* on the marketing-site track. Record the per-track profile — this is normal and healthy.

---

## 3. Per-thread "how deep?"

The six cross-cutting threads are never *removed*, only *scaled*:

| Thread | Always (even Solo/Lean) | Escalates to full when… |
|---|---|---|
| **Stakeholder Mgmt** | know your sponsor + a decision log | many teams/execs → stakeholder map + RACI + comms plan |
| **Continuous Discovery** | talk to ≥1 customer weekly | scaling → insight repo, OST, research cadence per squad |
| **Metrics & Experimentation** | track the 2–3 numbers that matter + a North Star | growth stage → metric tree, experimentation platform, guardrails |
| **Product Ops** | tidy templates + a single source of truth | multi-squad → tooling stack, rituals, a product ops function |
| **Responsible Product** | the **non-negotiable floor** (see below) | sensitive data / AI decisions / regulated / vulnerable users → full review + DPIA |
| **Portfolio & Lifecycle** | n/a for single product | multi-product → portfolio prioritization + lifecycle governance |

> **The responsible-product floor is non-negotiable.** Even a prototype answers: *Can this harm someone, exclude someone, or leak/misuse personal data?* If yes on any, you are at least **Standard** on the Responsible Product thread regardless of product size — privacy-by-design, basic accessibility (WCAG A/AA intent), and a security/ethics gut-check are never tailored out. See [`cross-cutting/Responsible_Product.md`](cross-cutting/Responsible_Product.md).

---

## 4. Domain overlays

Stack these on top of a base profile:

- **Regulated data (health / finance / children / consumer privacy):** Responsible Product thread to full (GDPR/CCPA, HIPAA, COPPA), privacy-by-design, DPIA, consent flows, data-residency, right-to-erasure handled in P16 Sunset, audit evidence.
- **AI-powered product:** add model/eval thinking, the **EU AI Act** risk tiering, transparency/explainability, human-in-the-loop, bias evaluation, and a kill-switch — to P07/P08/P13 and the Responsible Product thread.
- **PLG / self-serve SaaS:** Growth thread to full (activation, retention, expansion loops), experimentation platform, in-product onboarding/feedback; lean on heavy launch ceremony.
- **Sales-led / enterprise B2B:** heavier P11 (PMM, sales enablement, references), roadmap commitments governance, slower release cadence, beta/design-partner programs in P07.
- **Hardware-enabled / physical:** Stage-Gate cadence; no silent rollback (you can't patch atoms) → P11 leans Big-Bang-with-buffers; supply chain + spares in P16.
- **0→1 / pre-PMF:** Solo/Lean everything; the goal is to *retire uncertainty fast* — the Lean Startup loop and Continuous Discovery dominate; explicitly defer formalisation to "if it graduates."

---

## 5. Quick profile picker

Answer these; take the **highest** profile any answer triggers:

1. Can a failure harm a person, exclude a group, cause irreversible loss, or large legal/financial exposure? → **Formal** on the affected parts.
2. Regulated, or handling sensitive/personal data, or an AI making consequential decisions? → Responsible Product thread **full**; base at least **Standard**.
3. Multiple teams, exec/board governance, or external commitments? → at least **Standard**.
4. New market / new behaviour / unproven model? → discovery + experimentation **full**; base at least **Standard**.
5. None of the above, small and internal/0→1? → **Solo / Lean**.

---

## 6. Record the decision (tailoring log)

Tailoring is an auditable product decision. Capture it once, in `00_Charter/Operating_Model.md`, as a short table:

| Phase / thread | Profile applied | Tailored out? | Rationale |
|---|---|---|---|
| P02 Market Research | Lean — desk research only | formal market study | internal tool, no external market |
| P13 Experimentation | Solo — qualitative + before/after | A/B platform | not enough traffic for significance yet |
| Responsible Product | Full | — | handles PII + an AI recommendation (EU AI Act limited-risk) |
| P16 Sunset | Standard | environmental section | pure-software, no hardware to recycle |

> **Never silently skip.** A tailored-out phase or artifact is *recorded* with a reason, not omitted. That single discipline is the difference between "right-sized" and "cut corners."

---

*The [AI Product Manager Protocol §8](02_AI_Product_Manager_Protocol.md) makes the AI ask the §1 questions at kickoff and apply the matching profile automatically — and re-propose it if blast radius or regulation changes mid-project.*
