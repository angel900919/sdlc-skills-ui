# Continuous Discovery & Customer Insight — cross-cutting thread

> **Continuous discovery is the habit of the people building the product — the trio — touching customers *at least weekly*, in small frequent bites woven into the rhythm of delivery, so that every opportunity on the tree traces to a real human and the tree never closes.** (Thread 2 of 6 — [Conventions §10](../05_Conventions.md).)

This is Teresa Torres's bar, and it is deliberately a *cadence*, not a project: **frequency beats sample size.** A team that talks to one customer every week learns more, and corrects course faster, than one that runs a 30-interview study once a quarter and then goes dark.

---

## Why it's a thread, not a phase

[Phase 03](../../.claude/skills/pm-phase-03-discovery/) is where you *stand the system up* — the discovery plan, the interview guide, the first personas and jobs, the first pass at the tree. It owns **G2 (Problem Validated)**. But the moment you treat discovery as "done at G2," it rots: the tree freezes, opportunities lose their evidence trail, and by P08 you're building from a six-month-old memory of a customer who has since moved on.

So discovery runs **alive in every phase**:

- **P01 Strategy** — discovery tests whether the bet space is real before you commit a North Star.
- **P04 Opportunity** — the [Opportunity Solution Tree](../../.claude/skills/pm-phase-04-opportunity/) is a *living weekly layer*, not a one-time artifact; new `OPP-*` nodes appear as you keep listening.
- **P07 Solution** — story-based interviews surface the assumptions (`ASM-*`) you'll test before you build.
- **P12–P15** — behavioural data and the [feedback loop](../../.claude/skills/pm-phase-14-feedback/) feed straight back into the tree as fresh opportunities.

It is **reviewed at every gate** (questions below) because the question *"do we still have evidence a real customer wants this?"* is valid at G2 and at G9 alike. Stop asking it and you're back in the feature factory.

---

## The method — practices that make it real

**1. The weekly-touch habit (Torres).** The minimum bar is **≥1 customer interview per week, conducted by the team building the product** — not outsourced to a separate research team and read about later. Small and continuous beats big and episodic. *Get out of the building* (Blank): you are searching for a repeatable model, and you cannot find it from inside the office.

**2. The product trio.** Discovery is owned by **PM + design + engineering together** — they interview, synthesise, and decide as a unit so insights aren't lost in translation between a researcher's deck and a builder's backlog. A trio that hears the customer first-hand builds a shared mental model no summary can replace.

**3. Story-based interviewing — collect stories, not opinions.** Ask *"tell me about the **last time** you…"*, not *"would you use…"* or *"do you want…"*. Speculative and direct questions invite confabulation; a concrete past episode reveals the real job, context, and workaround. **Separate problem space from solution space — never pitch in a discovery interview.** (See *The Mom Test*, Fitzpatrick: ask about their life, not your idea.)

**4. The interview snapshot.** Synthesise **each interview fresh, on a one-page snapshot** — a portrait of the person, the key quotes, the observed job/pain/opportunity — *right after the conversation*, while it's warm. Snapshots make insights shareable across the trio and feed the tree without waiting for a big-bang synthesis at the end. AI can transcribe, tag, and draft the snapshot; the **human owns interpretation, bias control, and representativeness** — manual transcript coding is dead, but trusting AI themes blindly is the new research debt.

**5. The OST as a living layer.** The tree hangs every **opportunity (`OPP-*`)** off a single **target outcome** (a `KR-*` / `MET-*`), with solutions (`SOL-*`) and assumption tests (`EXP-*`) below. Revisit it weekly: add what you heard, prune what's dead, re-rank what shifted. The tree is the join between qualitative insight and the [traceability spine](../05_Conventions.md) (§4) — *nothing enters the roadmap without an opportunity, no opportunity without evidence.*

**6. Make recruiting automatic.** The cadence dies on the rock of *"who do we even talk to this week?"* Automate recruiting (in-product intercepts, a standing panel, a recurring slot) so the weekly touch is friction-free, not a scramble.

**7. Feed `OPP-*` from feedback.** Discovery and the [feedback system](../../.claude/skills/pm-phase-14-feedback/) are one organism. Most signal (the large majority) arrives **unsolicited** — tickets, reviews, sales calls, NPS verbatims, support chats. Run the **outer loop**: aggregate that stream into root-cause **feedback themes (`FB-*`)**, then promote validated themes onto the tree as **opportunities (`OPP-*`)**. Feedback is **raw material for discovery, not a backlog of orders** — frequency ≠ importance, and one enterprise renewal can outweigh a hundred free-tier asks. AI synthesis at scale is the default; human-in-the-loop is structural (source-ground every theme against real verbatims).

---

## The living artifact(s) it maintains

All carry **`Status: Living`** ([Conventions §6](../05_Conventions.md)) — never "done," always current.

| Artifact | IDs it produces / maintains | Lives in |
|---|---|---|
| `Research_Insights.md` (snapshots, findings) | `INS-<nn>` | `03_Discovery/` |
| `Personas.md` / `JTBD.md` | `PER-<nn>`, `JOB-<nn>` | `03_Discovery/` |
| `Opportunity_Solution_Tree.md` | `OPP-<nn>` (+ links to `SOL-*`, `ASM-*`, `EXP-*`) | `04_Opportunity/` |
| `Feedback_Log.md` / `Insight_Synthesis.md` | `FB-<nn>` → promoted to `OPP-<nn>` | `14_Feedback/` |
| Interview cadence + recruiting (discovery ops) | (cadence record; `DEC-*` for big calls) | `03_Discovery/`, `_threads/` |

The thread's job is to keep these **mutually traceable**: every `OPP-*` points back to at least one `INS-*` / `JOB-*` (forward and backward — [§4](../05_Conventions.md)), and every `INS-*` carries a real customer quote, never a paraphrased assumption.

---

## Reviewed at every gate

At each gate the AI runs these as a real check, not a formality ([Protocol §7](../02_AI_Product_Manager_Protocol.md)):

1. **Cadence held?** Has the trio talked to ≥1 customer per week since the last gate — or is this a "we've been heads-down building" gap?
2. **Evidence still live?** Does every `OPP-*` in scope trace to a real `INS-*` with a customer story/quote — not stale, not assumed, not a stakeholder's opinion?
3. **Tree current?** Does the OST reflect what we learned since the last gate (new opportunities added, dead branches pruned), or is it frozen?
4. **Right target outcome?** Is the outcome at the root still the one that matters, given what we just heard?
5. **New bets earned?** For each new `SOL-*`/`RMI-*`: which opportunity does it serve, and what evidence backs it?
6. **Feedback metabolised?** Are inbound `FB-*` themes being mined and the strong ones promoted to `OPP-*` — or piling up unread?

A gate where the answer to #1 or #2 is "no" is at best **Persevere-with-actions**, and may be a **Hold** ([Conventions §2](../05_Conventions.md)).

---

## Tailoring — how it scales

Per the [Tailoring Guide](../04_Tailoring_Guide.md) (§3), the thread is **never removed, only scaled** — the weekly-touch floor is non-negotiable even Solo.

- **Solo / Lean** — talk to **≥1 customer weekly**; lightweight snapshots in a single notes doc; the OST can be a sticky-note board or a list. Discovery and the build-measure-learn loop *dominate* the work — the goal is to retire uncertainty fast. Threads run as checklists.
- **Standard** — continuous discovery with an **insight repository** and a maintained OST; recruiting automated; feedback outer-loop wired into the tree; threads are living registers reviewed at major gates.
- **Enterprise / Formal** — full **ResearchOps**: panels, governed taxonomy, representativeness and ethics review (Torres's ethical assumption is first-class), per-squad research cadence, AI synthesis with mandatory human review; threads reviewed at **every** gate. Split discovery *enablement* (democratized) from strategic research (governed).

Right-size, but record it: a thinner discovery posture is logged as `tailored out: <reason>` — it is never silently dropped.

---

## Anti-patterns

- **Big upfront research, then build.** A phase-gated study at G2 and silence after is not discovery — it's a one-time guess that ages badly. Discovery is continuous or it isn't discovery.
- **Counting interviews as the metric.** *"We talked to 40 users"* measures activity, not learning. The metric is opportunities retired and decisions changed (outcomes over outputs — [Conventions §7](../05_Conventions.md)).
- **Speculative / leading questions and pitching in discovery.** *"Would you use this?"* and *"do you like our idea?"* harvest politeness, not truth. Collect stories of the last real time; keep problem and solution space apart.
- **Outsourcing discovery to a separate research team.** When the trio only reads someone else's deck, the shared mental model — the whole point — never forms.
- **A frozen tree / feedback that never becomes an opportunity.** A tree built once and never revisited, or a feedback inbox that's collected but never mined and closed-looped, breaks the spine: bets lose their evidence trail and you can't answer *"why are we building this?"*
- **Blindly trusting AI synthesis.** AI auto-tagging and summaries are table stakes, but ungoverned themes and synthetic "insights" entering the baseline without a real evidence trace is research debt waiting to mislead a gate.

---

## References

- Teresa Torres — *Continuous Discovery Habits*: interviewing for stories — https://www.producttalk.org/best-customer-interview-questions/
- Teresa Torres — The Interview Snapshot — https://www.producttalk.org/2024/02/interview-snapshot/
- Teresa Torres — Opportunity Solution Trees — https://www.producttalk.org/opportunity-solution-trees/
- User Interviews — How to interview customers continuously (with Teresa Torres) — https://www.userinterviews.com/blog/how-to-interview-customers-continuously-with-teresa-torres-of-product-talk
- Thematic — Close the customer feedback loop (inner/outer loop) — https://getthematic.com/insights/close-the-customer-feedback-loop
- Steve Blank — Customer Development Manifesto (get out of the building) — https://steveblank.com/category/customer-development-manifesto/
- Workflow contract — [`../05_Conventions.md`](../05_Conventions.md) (IDs §3, spine §4, status §6, threads §10) · [`../02_AI_Product_Manager_Protocol.md`](../02_AI_Product_Manager_Protocol.md) · [`../04_Tailoring_Guide.md`](../04_Tailoring_Guide.md)
