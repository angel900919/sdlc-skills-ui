# Validation Log — <Product Name>

> **Phase 1 Discover · the evidence base for G1 (Opportunity Gate).** Time budget: 1–2 weeks, building nothing. This is where opinions become evidence — and where the **problem space gets signed off before any REQ exists**. Weight what people *do* over what they *say*. Never fabricate — unknowns are `TODO: <owed, by whom, by when>`. Anti-pattern this file prevents: writing a spec for a problem nobody confirmed. Delete sections that don't apply — one line in the tracker's tailoring log.

| Owner | Date started | Status |
|---|---|---|
| | | Draft / FROZEN (G1, <date>) / Superseded (via change note DEC-<nn>) |

## 1. User interviews (≥5 real target users — strangers beat friends)

> Ask open-ended, past-tense questions: "How do you handle <job> today?" · "What have you already tried?" · "What did that cost you?" · "Walk me through the last time it happened." Don't pitch. When they ask what your product does, reflect: "what would you expect it to do?"

| # | Who (role, segment) | Date | How they solve it today | Pain (their words) | Pays today? What? | Signal (strong / weak / none) |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

**Themes across interviews:** <2–4 bullets — patterns, not transcripts>

## 2. Demand signals (behavior > stated intent)

| Signal | Source | Number | Read |
|---|---|---|---|
| e.g. search volume for "<problem phrase>" | | | |
| e.g. complaints in <community> about alternatives | | | |
| e.g. landing-page signups / waitlist | | / <visitors> | |

## 3. Competitors & alternatives (3–5, incl. "spreadsheet" and "do nothing")

| Alternative | What it offers | Price | Who uses it | Their gap (your opening) |
|---|---|---|---|---|
| Do nothing / manual | | free | | |
| | | | | |

**Where you'd win (one honest sentence):** <data / workflow depth / distribution / trust — "ours has AI" doesn't count>

## 4. Willingness to pay

- **What target users pay today for this problem** (tools, services, labor): <…>
- **Price tested & reaction:** <e.g. price on a landing page → % of visitors who clicked buy>
- **Read:** <would pay / might pay / hobby>

## 5. Riskiest assumptions & tests (ASM-nn)

> The four risks: **value** (do they want it) · **usability** (can they use it) · **feasibility** (can we build it) · **viability** (does the business work). Test the riskiest first, with the cheapest test that can kill it: landing page, mockup, concierge (do it manually), Wizard-of-Oz (fake the automation). **Write the pass/fail threshold before running the test.**
> **[AI]** Cheapest feasibility test = the zero-shot baseline on real examples — run it in [`03_ai_feasibility.md`](03_ai_feasibility.md), log the ASM row here.
> **[HW]** The hardware concierge test = a breadboard/dev-kit spike, measured — run it in [`04_hw_feasibility.md`](04_hw_feasibility.md), log the ASM row here.

| ID | Assumption (risk type) | Test | Pass threshold (pre-committed) | Result | Verdict |
|---|---|---|---|---|---|
| ASM-01 | | | | | pass / fail |
| ASM-02 | | | | | |

## 6. Market size (bottom-up, one page of arithmetic)

> An opportunity ceiling, not a forecast. `reachable users × realistic price × plausible share`.

- Reachable target users: <n> (how derived: <…>)
- × price <$> × plausible share <%> ≈ **<$ /yr ceiling>**
- **Read:** <big enough for the ambition? (a small market can still be a great solo business)>

## 7. Needs — solution-free (SN-nn)

> Outcome, never how. **Reframe rule:** if a "need" names a technology ("use AES-256", "needs a Pi 5"), park the tech as a candidate constraint and re-derive the outcome it serves. Every SN is born with a candidate outcome metric — that's the seed of the ship-bar. These rows are the parents of every future REQ; an orphan REQ later means this table was wrong.

**Stakeholder probe (one line, answer all five):** who **operates**, **maintains**, **regulates**, **pays for**, and **disposes of** this? <…> — anyone named here can veto or delay.

| ID | Need (outcome, solution-free) | Source (interview # / stakeholder) | Priority (H/M/L) | Candidate outcome metric |
|---|---|---|---|---|
| SN-01 | | | | |
| SN-02 | | | | |

**Parked constraints (smuggled tech → future REQ-C rows):** <…>

## 8. Scenarios (SCN-nn) — how it's actually used

> User journeys plus the failure modes journeys forget. **Mandatory: ≥1 off-nominal + ≥1 maintenance scenario** — this is where products actually die, and it informs the kill decision at G1.
> **[AI]** Off-nominal candidates: model hallucination, provider timeout, cost spike, injected prompt.
> **[HW]** Off-nominal candidates: power loss, offline, sensor failure; maintenance: firmware update, battery swap, recalibration.

| ID | Type | Actors | Trigger | Flow (3–6 steps) | Success outcome | Exercises |
|---|---|---|---|---|---|---|
| SCN-01 | nominal | | | | | SN-<nn> |
| SCN-02 | off-nominal | | | | | SN-<nn> |
| SCN-03 | maintenance | | | | | SN-<nn> |

## 9. Feasibility verdicts (four dimensions)

> Each dimension gets its own verdict: **Go / Conditional-Go / No-Go**, with evidence or a `TODO:`. A non-waivable No-Go blocks G1 no matter how good the rest looks.

| Dimension | The question | Evidence | Verdict | Conditions (if Conditional-Go) |
|---|---|---|---|---|
| Market | Real demand, real adoption? (§1–§4, §6) | | | |
| Technical | Buildable by us? **[AI]** see [`03_ai_feasibility.md`](03_ai_feasibility.md) · **[HW]** see [`04_hw_feasibility.md`](04_hw_feasibility.md) | | | |
| Regulatory | What standards/certs/laws apply — and can we afford them? (verify current) | | | |
| Economic | Rough cost vs benefit — worth building? | | | |

## Self-check before the gate

- [ ] ≥5 stranger interviews logged; ≥1 behavioral demand signal
- [ ] Every ASM tested against its pre-committed threshold — no post-hoc goalposts
- [ ] Every SN solution-free, prioritized, sourced, with a candidate metric
- [ ] Every high-priority SN exercised by ≥1 SCN; ≥1 off-nominal + ≥1 maintenance present
- [ ] All four feasibility dimensions verdicted, evidence cited

→ **Take it all to [`05_opportunity_gate.md`](05_opportunity_gate.md) and decide.**
