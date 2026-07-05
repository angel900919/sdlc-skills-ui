# Build Plan — <product>

> **Copy only when: hardware is involved, or the product has ≥3 independently built pieces** (firmware + API + app counts). Skipping? One line in the tracker's tailoring log (`00_tracker.md`).
>
> **Phase 3 · feeds G3 Ship-Ready · ~2 hours to draft, glanced at every Monday.** This file exists to prevent Big Bang integration — build everything, wire it together at the end, lose a week to a fault that could belong to anything (the 787 pattern). Integrate incrementally and a break is traceable to the piece just added. Delete sections that don't apply.

| Owner | Status | Interfaces frozen at G2? |
|---|---|---|
| | Draft / Active / Done | yes / no — **no build plan until yes** |

## 1. Dependency-weight ranking

> What does everything else lean on? **Build and prove that first.** Count each piece's dependents; the most-depended-upon integrates in increment 1, so the highest-risk interactions surface while you still have schedule to react.

| Piece | Depended on by (#) | Rank | Proven in increment |
|---|---|---|---|
| <message broker + schema> (example — delete) | 3 | 1 | 1 |
| | | | |

The two dependency types software brains forget — check both before ranking:

- [ ] **Temporal** — what must boot/init before what? (the device service that races the network at power-on)
- [ ] **Resource** — anything sharing a bus, power rail, DB lock, or rate limit?

## 2. Increments

> One end-to-end behaviour per increment, with an exit signal you can **observe**. Pass/fail = one metric or one test path. **"Looks good" is not an exit criterion.**

| # | Goal (one end-to-end behaviour) | Adds | Exit signal (observable pass/fail) | Target week |
|---|---|---|---|---|
| 1 | <sensor reading lands in dashboard> (example — delete) | <firmware read+publish · API ingest> | `tests/e2e/test_ingest.py` green · zero S1 | |
| 2 | | | | |
| 3 | | | | |

## 3. Interface mocks — every seam, exactly once

> Every `IF-nn` from `08_architecture.md` appears here exactly once. **A skipped seam is a guaranteed integration surprise.** Generate mocks from the named schema and contract-test them in CI — hand-rolled fakes drift, and mock drift is the classic "worked on my bench" failure.

| IF | Real now? | Faked how (tool) | Real lands in increment |
|---|---|---|---|
| IF-01 (example — delete) | no | mock server generated from the schema | 2 |
| | | | |

- [ ] Every mock is generated from the schema named in the interface table — never hand-written
- [ ] A contract test runs in CI against both sides of every faked seam

## 4. Test harness at increment 1, not launch week

**[AI]** Eval harness in CI from increment 1: the golden set (version pinned in `07_ship_bar.md`) scores every push against the unchanged bar, so quality drift shows up in days — not at G3.

**[HW]** Bench rig on the desk at increment 1: the real board + scripted stimuli (sensor injection, load, network drop) + something that measures (scope, logic analyzer, multimeter, or a Python-driven harness). Rare and dangerous conditions get tested repeatably here. A rig that arrives at launch week verifies nothing about the weeks before it.

| Rig element | This product |
|---|---|
| Device under test (board + HW rev) | |
| Stimuli (scripted how) | |
| Measured by | |
| Automated how / run cadence | |

## 5. CI definition of done

One line, honoured on every push: **build + unit + contract tests — [AI] + golden-set eval — [HW] + firmware build for the target board — all green; one deploy path; rollback is one command.** Split firmware CI from app CI only if their velocities actually differ.

## Failure smells (reread weekly)

- **Big Bang** — everything integrates in the final increment; fault isolation destroyed.
- **Mock drift** — a hand-edited fake diverges from the real schema; contract tests catch this, vibes don't.
- **Rig at launch** — bench rig or eval harness stood up in the final week; see §4.
- **Skipped seam** — an `IF-nn` missing from §3. That is where the surprise lives.
