# Decision Log — <Product Name>

> **All phases · append-only · feeds every gate.** One line per non-obvious decision. This replaces 90% of meeting notes and is the file future-you reads first. Never edit a past row — supersede it with a new one (superseded-by pointer, never an edit). Time budget: 2 minutes for a log line, 30 minutes for an ADR — if it's taking longer, you're writing a business case; stop. Anti-pattern this file prevents: re-litigating a settled choice at 11 p.m. because nobody wrote down why. Delete sections that don't apply.
>
> **Door rule:** *two-way doors* (reversible) — decide fast, log one line. *One-way doors* (irreversible or expensive to undo) — slow down and climb the ADR ladder below. **[HW]** one-way doors hide in hardware: PCB layout sent to fab · connector/enclosure choice · MCU/SBC platform. **[AI]** local-vs-API model · any vendor with data gravity. Each costs a re-spin or a migration to reverse.

## The log (append-only)

| ID | Date | Decision | Why (evidence) | Door | Re-open when |
|---|---|---|---|---|---|
| DEC-01 | | | | 2-way / **1-way** | <e.g. "vendor changes terms" · "volume >10× plan" · "—"> |
| DEC-02 | | | | | |

## The ADR ladder — how much writing does this decision deserve?

| Tier | Reversibility test | What you write |
|---|---|---|
| 1 · Reversible | Undo = a commit or a config change | One log line above. Done. |
| 2 · Hard to reverse | Undo = BoM change, contract, data migration, re-architecture — or it drives a top metric | 1-page ADR (skeleton below) |
| 3 · Bet-the-product | Wrong = the product dies or pivots | ADR + mini-matrix + real 2-year TCO arithmetic |

## ADR skeleton (tiers 2–3) — copy per decision, one page max

### DEC-<nn> — <decision title> (<date>)

- **Context:** <the forcing situation, the constraint, the REQ/RSK that raised it>
- **Options (2–3, same level of abstraction — "do nothing" counts):**

| Option | Pros (name the EVIDENCE) | Cons (name the EVIDENCE) |
|---|---|---|
| A — <name> | <measured / quoted / tested — not asserted> | |
| B — <name> | | |

- **Decision:** <chosen option + one-sentence why>
- **Consequences:** <what we now own — new risks (add RSK rows in [`16_risk_register.md`](16_risk_register.md)), lock-in, what gets harder>
- **Runner-up wins if…** <one sentence — the lean heir of sensitivity analysis>
- **Revisit when:** <falsifiable trigger — date, volume, price, vendor event>

**Tier 3 add-on — mini-matrix + TCO.** Score only the 3–4 criteria that actually differ between the options (evidence notes, not invented weights). Then do the arithmetic: **upfront price ≠ TCO** — sum 2 years of per-token / per-device / per-seat / BOM+assembly cost at realistic volume ("verify current" on every price at decision time). The cheap option is usually cheap for exactly one year.

## The change-note block — a risky change IS a decision

Risky = any of: **breaking interface change · edit to a frozen artifact · model / prompt / eval-set swap (changing the eval set is itself a risky change) · firmware pushed to the fleet · anything touching security, safety, or user data.** Everything else is a normal change: just commit well.

Before shipping a risky change, answer the 5-question impact check in a DEC row (or a linked note):

| # | Question |
|---|---|
| 1 | What does this touch? (REQ / IF / RSK / HAZ IDs) |
| 2 | What could regress — and which tests/evals re-run to prove it didn't? |
| 3 | How long, including the re-runs? |
| 4 | Any compliance / safety / data angle? |
| 5 | Who must know? (users, beta testers, future-you) |

Then: **version bump + re-run the affected checks BEFORE ship** (the re-baseline rule — never a quiet edit to anything frozen). Hotfix under fire: fix now, write the note within 48 h. The 48 h is a debt, not a waiver.

## Superseded decisions

| Replaced | By | Date | What changed our mind |
|---|---|---|---|
| | | | |
