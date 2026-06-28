---
Document: Stakeholder Management & Communication — cross-cutting thread
Document ID: THREAD-STAKEHOLDER-v1.0
Status: Living
Owner: Product Manager
Updated: 2026-06-26
---

# Stakeholder Management & Communication

> **The discipline of earning alignment and decision rights — mapping who can help or block, leading them through influence rather than authority, and recording the *why* so a settled call is never silently re-litigated.**

This is **Thread 1 of the six** ([Conventions §10](../05_Conventions.md)). The frame for 2026 is **collaboration, not control**: a PM who treats colleagues as people to be "managed up" via persuasion theatre is running a feature factory ([SVPG](../05_Conventions.md)). You don't manage stakeholders — you give them shared problems, shared context, and co-ownership of the outcome.

---

## Why it's a thread, not a phase

You set up the stakeholder map and decision rights at **P00** (`Stakeholder_Map.md`, `STK-*`), but alignment is not a thing you finish at kickoff. People change roles, sponsors lose interest, a new VP arrives with a pet feature, a gate forces a contested trade-off. **Every phase produces decisions and every gate is a moment where misalignment surfaces** — so this thread is alive in all 17 phases and **reviewed at every gate (G0–G10)** before any phase-specific check ([gate-reviews](../checklists/gate-reviews.md)). Its outputs (the map, the decision log) are `Living` artifacts that accrete across the whole lifecycle, never "phase output" you close out.

A PM's authority is almost always **borrowed**: you lead engineers, designers, sales, legal, and execs who don't report to you. Credibility — not your title — is the currency, and it's earned continuously from expertise, reliable delivery, and trusted relationships ([hackread, 2025](https://hackread.com/without-authority-product-managers-influencers-ai-age/)). Influence is now an explicitly-taught **AI-era PM skill**, not a soft extra ([Lenny, 2026](https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management)).

---

## The method (the practices)

**1. Influence without authority.** Lead through credibility, not org chart. Bring evidence (`INS-*`, `MET-*`), not opinion; deliver what you promised; make others' wins visible. The traceability spine ([Conventions §4](../05_Conventions.md)) *is* your influence engine — "here's the insight → opportunity → bet" beats "trust me."

**2. Map before you manage — Mendelow Power/Interest grid.** Score each `STK-*` on **Power** (ability to help or block) × **Interest** (how much the outcome affects them) → four quadrants that set the engagement strategy ([Improvement Service](https://www.improvementservice.org.uk/business-analysis-framework/consider-perspectives/powerinterest-grid)):

| | High interest | Low interest |
|---|---|---|
| **High power** | **Manage closely** — partner, co-own decisions | **Keep satisfied** — enough to keep onside; don't overload |
| **Low power** | **Keep informed** — consult; mine for insight | **Monitor** — light touch |

A stakeholder list that's all execs is a defect — **who *uses*, *supports*, *sells*, and is *affected*?** Missing stakeholders are missing requirements and late surprises.

**3. Make decision rights explicit — RACI with exactly one Accountable.** For the consequential calls only, name **R**esponsible (does the work), **A**ccountable (the single answerable owner), **C**onsulted (two-way), **I**nformed (one-way). The non-negotiable rule: **exactly one A per decision** — two "A"s means no one is accountable ([Symmetry / RACI](https://medium.com/the-symmetry/stakeholder-management-for-product-managers-raci-model-c4864d984267)). Maps to gate decision rights ([Conventions §2](../05_Conventions.md)): PM recommends, the named Accountable decides.

**4. BLUF executive comms.** **B**ottom **L**ine **U**p **F**ront: lead with the **decision + trade-off + ask**, then the supporting detail — and lead with **outcome, not output** ([Conventions §7](../05_Conventions.md)). "We shipped X" is an output update; "We moved activation +4pts; to hold the gain we need one more sprint — approve?" is a BLUF. Tailor by audience: execs want decision/trade-off/ask; engineers want context and constraints.

**5. Decision log — document the why.** Every material, hard-to-reverse, or contested call lands in `Decision_Log.md` as `DEC-*` with context, options, the one Accountable owner, rationale, and a Bezos **door type** (two-way = reversible, decide fast; one-way = decide carefully). This is the product's institutional memory and, increasingly, a **regulatory expectation** — not just hygiene.

**6. Collaboration, not control (SVPG).** Reframe "manage up" as "share the problem." Bring stakeholders into discovery and the trade-offs early so they co-own the call instead of approving (or vetoing) a finished plan ([SVPG: feature vs. product teams](https://www.svpg.com/product-vs-feature-teams/)).

**7. Prototype for buy-in.** In 2026, **a prototype beats a spec** for alignment — a clickable build (Figma Make / v0 / Lovable / Replit / Claude Code) makes the bet tangible and surfaces disagreement in minutes, where a doc invites edits to wording ([Productside, 2026](https://productside.com/the-ai-product-management-workflows-2026/)). AI drafts the audience-tailored update and the prototype; **the human owns the relationship and the strategic narrative.**

---

## The living artifacts it maintains

| Artifact | Location | IDs | Status |
|---|---|---|---|
| **Stakeholder Map** (register + Mendelow grid + RACI + comms plan) | `00_Charter/Stakeholder_Map.md` ([template](../templates/Stakeholder_Map.md)) | `STK-<nn>` | Living |
| **Decision Log** | `_threads/Decision_Log.md` ([template](../templates/Decision_Log.md)) | `DEC-<nn>` | Living |

Every phase skill appends to the Decision Log at loop step 7 ([Protocol §7](../02_AI_Product_Manager_Protocol.md)). IDs are stable for life — never renumber; supersede with a `(superseded by DEC-<nn>)` note ([Conventions §3](../05_Conventions.md)).

---

## Reviewed at every gate

At G0–G10, before any phase-specific check, answer:

- **Are the key decisions since the last gate logged as `DEC-*`** — with one Accountable owner, options, and rationale?
- **Is there any unmanaged misalignment?** Is the sponsor still bought in, or has power/interest shifted (re-map `STK-*`)?
- **Does every consequential call have exactly one Accountable** (no two-"A" RACI rows)?
- **Has each audience had a BLUF update** — decision/trade-off/ask, led by outcome not output?
- **For this gate's go/no-go, is the decision right clear** and the recommendation backed by evidence, not the loudest voice?

---

## Tailoring (see [Tailoring Guide §3](../04_Tailoring_Guide.md))

The thread is **never removed, only scaled**:

- **Solo / Lean** — know your sponsor + keep a decision log. Mendelow and RACI live in your head or a three-row table; comms is a weekly async update. The floor: *someone* is Accountable and the why is written down.
- **Standard** — full `Stakeholder_Map.md` with Mendelow grid + RACI for the big calls + a comms cadence; the Decision Log is a living register reviewed at major gates.
- **Enterprise / Formal** — full stakeholder map, RACI with **named approvers per gate**, a structured comms plan per quadrant, and the Decision Log as an audited record (regulatory defensibility). Reviewed at **every** gate.

---

## Anti-patterns

- **"Stakeholder management" as persuasion theatre / managing up.** Selling a finished plan upward instead of sharing the problem — a feature-factory symptom (SVPG). Fix: co-own the trade-off early.
- **RACI with multiple Accountables.** Two "A"s = diffused accountability = the decision stalls or gets re-litigated. Exactly one A, always.
- **Output-only exec updates.** "We shipped X / we're 80% done" with no outcome, trade-off, or ask. Lead with BLUF + the moved metric.
- **A stakeholder list that's all execs.** Misses the users, supporters, sellers, and affected parties — i.e. misses requirements. Map all four.
- **Undocumented decisions.** No `DEC-*` → the call gets silently re-opened, and you can't answer "why did we decide this?" Document material/one-way/contested calls.
- **Spec-first alignment when a prototype would settle it.** Weeks of doc review on a disagreement a 30-minute clickable would resolve.

---

## References

- Mendelow Power/Interest grid — [Improvement Service, Business Analysis Framework](https://www.improvementservice.org.uk/business-analysis-framework/consider-perspectives/powerinterest-grid)
- RACI for PMs (one Accountable) — [The Symmetry, Medium](https://medium.com/the-symmetry/stakeholder-management-for-product-managers-raci-model-c4864d984267)
- Influence without authority in the AI age — [hackread](https://hackread.com/without-authority-product-managers-influencers-ai-age/)
- Collaboration not control / product vs. feature teams — [SVPG, Marty Cagan](https://www.svpg.com/product-vs-feature-teams/)
- Prototype-for-buy-in & influence as an AI-era pillar — [Productside, AI PM Workflows 2026](https://productside.com/the-ai-product-management-workflows-2026/) · [Lenny's Newsletter, How AI will impact PM](https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management)
- Conventions (threads §10, IDs §3, gates §2, outcomes §7) — [../05_Conventions.md](../05_Conventions.md)
