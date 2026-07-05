# Charter — <Product Name>

> **Phase 0 / feeds G0 Frame Check (Proceed / Park).** Time budget: **2–4 hours, one page.** Exists to stop you building before naming the problem, the owner, the budget, and the risk. If a section drags past 20 minutes you're writing a business case — stop and call the verdict. Delete sections that don't apply — one line in the tracker's tailoring log.

**Owner:** <you> · **Date:** <YYYY-MM-DD> · **Status:** Draft / Final

## 1. The problem (technology-free)

> Shape: *When <situation>, <who> wants <motivation>, so they can <outcome>.* Banned words here: AI, ML, LLM, chatbot, agent, model, app, platform, device, sensor, board, Pi. If the problem isn't compelling without them, it isn't real.

- **Who is stuck:** <specific person/role, not "everyone">
- **The job they're trying to do:** <when… they want… so they can…>
- **What the status quo costs them:** <time / money / errors / frustration — concrete>
- **Why now:** <what changed — market, technology, regulation, behavior>

## 2. The deal

| | |
|---|---|
| **Owner / sponsor** (end-to-end) | <name — an idea nobody owns is Parked; solo, you fund it: name what you're forgoing> |
| **Discovery budget** | <e.g. 2 weeks of evenings / $500 — a hard cap; breach forces G1 now> |

## 3. Success, as an outcome

> One line. A change in the user or the business — not "ship X". Vanity test: *would this number still improve if the product got worse?* If yes, rewrite.

**If this works:** <e.g. "target users resolve <job> in minutes instead of days, and ≥N pay $X/mo">

## 4. Risk check (2 minutes — do not skip)

> Any YES → PM_SE is the floor, not the ceiling: see the PM_SE README → Right-sizing; one trigger ⇒ tier up, in doubt ⇒ tier up. YES on the safety question also switches on the hazard block in `16_risk_register.md`.

| Trigger | Y/N | Notes |
|---|---|---|
| PII at scale, or health / financial / biometric / children's data? | | |
| Regulated domain (hiring, lending, medical, insurance, legal, safety)? | | |
| AI acting autonomously on the world (send / pay / delete / execute)? | | |
| Decisions affect third parties who didn't opt in? | | |
| Can a failure of this system hurt someone or breach a safety regulation? | | |
| External contract with formal acceptance? | | |

**Result:** LEAN OK / ESCALATE (<which trigger · which parent framework>)

## 5. Constraint seeds (→ `REQ-C` in the spec)

> Real limits imposed on you: budget ceiling, mandated tech, standard, deadline. Seed now, ID later — a constraint lost here resurfaces as a rewrite in P3.

- <e.g. must run fully offline on the user's existing hardware>

## 6. Acceptance seeds

> Under what conditions would you call this done? One behaviour per row, verification method at birth. Missing number = `TODO: <owed, by whom, by when>` — never invent one.

| ID | Criterion | Threshold | Method (T/I/A/D) |
|---|---|---|---|
| AC-01 | <e.g. resolves <job> end-to-end> | <TODO: threshold — you — before G1> | <T/I/A/D> |

## 7. Client mode (delete if own product)

- **Who pays:** <client> · **Who accepts:** <named person — the acceptance authority for the AC table> · **IP / payment terms:** <one line, or `TODO: owed by client`>

## 8. Product-type notes

**[AI] If AI is on the table** — suspected archetype: <chatbot·RAG / extraction / recommendation / forecasting / generation / agent / none — decide in Phase 1>. Honesty test: still worth building if you couldn't say "AI-powered" anywhere? <yes/no — if no, Park>

**[HW] If hardware is on the table** — deployment reality, three lines:
- **Power:** <mains / battery ≥N h / solar — `TODO` if unknown>
- **Environment:** <indoor / outdoor · temp range · dust / water exposure>
- **Connectivity:** <Wi-Fi / LTE / BLE / offline-first — and what happens when it drops?>

## 9. Verdict — G0 Frame Check

- [ ] Problem stated technology-free; no banned word survives §1.
- [ ] Owner named; discovery budget is a hard cap.
- [ ] Outcome passes the vanity test.
- [ ] All 6 risk triggers answered; any YES has an escalation note.
- [ ] Constraint and acceptance seeds captured — TODOs owned, nothing invented.
- [ ] Product type set in the tracker; skipped sections logged as `tailored out: <reason>`.

**Proceed / Park** — <date, one-line reason>. Log it in the tracker's gate log.
