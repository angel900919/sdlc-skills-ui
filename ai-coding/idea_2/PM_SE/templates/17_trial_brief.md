# Trial Brief — <trial name>

> **Copy only when running an experiment or trial — one file per trial** (`17_trial_<slug>.md`). Skipping? One line in the tracker's tailoring log.
>
> **Phases 3 & 5 · one page · results feed `07_ship_bar.md`'s eval log and the G5 Health Check.** The point is pre-commitment: metric, duration, and decision rule are written **before** data arrives, so the result can actually change your mind.
>
> **Traffic reality check:** A/B testing needs volume (rough floor ~1k weekly actives). Below that, don't fake statistics — ship the change, compare against the pre-change baseline, and talk to 5 users.

| Owner | Trial type | Dates (start → planned end) | Status |
|---|---|---|---|
| | A/B · pre-post · bench · soak · field pilot | | Planned / Running / Decided |

## 1. Hypothesis

> Shape: *If we <change/build>, then <primary metric> will <direction + size>, because <mechanism from evidence>.*

<…>

## 2. Design

| | |
|---|---|
| **Arms / setup** | A/B: A (control) <current> · B <change> — randomize by **user**, not request. Pre-post: <baseline window> vs <after>. |
| **Primary metric** | <one, an outcome — from `07_ship_bar.md`> |
| **Guardrail metric(s)** | <what must not degrade — quality, cost, latency> |
| **Smallest effect worth acting on** | <decide this now, not after> |
| **Sample / duration** | <n per arm, or fixed dates — full weeks, to dodge day-of-week bias> |

**[AI]** rows (delete if N/A):

| | |
|---|---|
| **Model + prompt versions** | <pinned model ID · prompt-set version — hold constant across arms> |
| **Eval-set version** | <hash — changing it mid-trial is itself a risky change> |

**[HW]** rows for bench / soak / field pilot (delete if N/A):

| | |
|---|---|
| **Units under test** | <n units> |
| **Firmware + HW rev** | <fw semver · board rev> |
| **Environment / duration** | <e.g. 3 units · 7-day soak · outdoor> |

## 3. Decision rule (pre-committed — no peeking, no early stop on a green spike)

- If primary ≥ <threshold> and guardrails hold → **ship / adopt / soak passed**
- If primary < <threshold> → **keep A / trial failed**, log the learning
- If guardrail breached → **stop, keep A**, investigate

## 4. Result & decision

| Metric | Baseline / A | Trial / B | Δ | Read |
|---|---|---|---|---|
| Primary | | | | |
| Guardrail | | | | |

**Decision & date:** <ship / keep / iterate> — **What we learned:** <one honest sentence, even (especially) when it lost>

- [ ] Result row copied into `07_ship_bar.md`'s eval log — firmware/HW-rev columns filled for device trials
