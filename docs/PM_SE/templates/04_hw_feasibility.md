# 04 · Hardware Feasibility — <Product Name>

> **Copy only when the product includes physical hardware you build, flash, or ship. Skipping? One line in the tracker's tailoring log.**
>
> **Phase 1 · feeds G1 Opportunity Gate** — §§1–6 plus §8's single-source / lead-time / lifecycle lines (a single-source part already EOL is a G1 hard fail). **Updated in Phase 2** — §7 platform decision and §8's buy-ahead line. Time budget: ~half a day plus bench time, most of it §2. Exists to prevent: a custom PCB for a product a $30 off-the-shelf device already does — or one built around a part you can't buy. AI in the product too? Fill `03_ai_feasibility.md` as well — they're twins.
>
> Part prices, stock, lead times, and certification rules move fast: **verify current** at decision time, never from memory, and date every number. Delete sections that don't apply — with a tailoring line.

| Owner | Date | Status |
|---|---|---|
| | | Draft / Final |

## 1. The custom-hardware-or-not check

> List the non-custom ways to solve the job. If one covers ~90% of cases at a fraction of the cost, don't build hardware — or build only the residual.

| Non-custom alternative | % of cases it covers | Cost/effort | Verdict |
|---|---|---|---|
| Off-the-shelf device / hub (rebrand, integrate) | | | |
| Phone or existing device as the sensor/UI | | | |
| No hardware — software/cloud only | | | |

**Decision:** custom hardware / hybrid (custom only for <residual>) / off-the-shelf — <why, one line>

## 2. Breadboard / dev-kit spike ← the highest-value bench day you'll spend

> Wire the ugly version on a breadboard or dev kit. Feed it **real stimuli** (the real room, the real signal, the real load — not the datasheet's ideal conditions). Run it long enough to fail. Label pass/fail. Name and count the failure modes. This is feasibility evidence *and* the seed of your Phase 3 bench rig.

- **Runs collected:** <n> — conditions: <where/how — must be real, not ideal>
- **Setup:** board <name+rev> · firmware v0 (keep it) · date <…>

| Failure mode (name it) | Count | Example | Fixable by… (component swap / layout-shielding / firmware / scope cut / nothing) |
|---|---|---|---|
| sensor drifts after 20 min warm-up *(example — delete)* | | | |
| WiFi drops through one brick wall *(example — delete)* | | | |

## 3. Measured numbers on the real board — the bar to beat

> Record these **before** spending anything on custom PCBs, enclosures, or tooling. Every later investment must measurably beat them. Measured on the target board — never extrapolated from a datasheet.

**Baseline:** <key numbers: accuracy vs reference ±<x>, current draw idle/active <mA>, boot <s>, range <m>> — board <name+rev>, firmware v0, <date>

**Read:** <strong signal / promising with fixes / physics says no → feasibility FAIL at G1>

## 4. Power & physical reality check

| Question | Answer |
|---|---|
| **Worst-case draw** — everything on at once — vs supply/battery capacity? (a budget that only balances at idle = dead product) | |
| Battery life at a realistic duty cycle? Recharge/replace path? | |
| Environment at the install site — temp range, moisture/ingress, vibration? | |
| Fits the enclosure, mounting, and cabling reality of where it actually lives? | |
| Connectivity where it actually lives — WiFi reach, cellular coverage? | |

## 5. BOM cost at three scales

> Not part-cost alone. Include assembly, enclosure, shipping, and failures: `cost ≈ (parts + assembly + landed logistics) ÷ yield`. A 70% assembly yield inflates cost ×1.4.

| | Qty 1 (prototype) | Qty 10 (pilot) | Qty 100 |
|---|---|---|---|
| BOM + assembly per unit | | | |
| Landed cost per working unit (incl. yield) | | | |
| Value per unit (price or savings) | | | |
| **Margin per unit** | | | |

**Read:** <positive with room / thin — reshape levers: cheaper MCU, drop a sensor, stock enclosure, pre-built module, narrow scope / underwater → viability FAIL>

## 6. Cert trigger scan *(delete only with a tailoring line — most products trigger something)*

> You won't certify at pilot scale, but a trigger you can't afford is a G1 hard fail. Rules and fees change: **verify current** for your target markets (e.g. FCC · CE/UKCA · RCM).

- [ ] **Radio** (WiFi/BLE/LoRa/cellular)? Pre-certified module keeps you out of intentional-radiator testing — custom RF does not
- [ ] **Mains power**? Safety marks apply (e.g. UL/CE-LVD) — or stay low-voltage DC behind a certified adapter
- [ ] **Lithium battery**? Shipping rules apply (e.g. UN 38.3) — check before promising delivery
- [ ] Domain-specific rules (medical, automotive, aviation)? → README Right-sizing escalation

**Read:** <no triggers / triggered but affordable via certified modules+PSU / triggered and unaffordable → feasibility FAIL at G1>

---

## 7. Platform decision *(Phase 2 — climb the ladder, don't leap it)*

> Rule: the **cheapest platform that clears your frozen ship-bar** (`07_ship_bar.md`), with a named fallback part. Buy the base (modules, dev kits); build only your differentiation. Ladder: **dev kit as product → dev kit + custom carrier/HAT → custom PCB** — climb only when the current rung measurably fails the bar (cost, size, power). MCU/SBC platform is a 1-way door → ADR in `15_decision_log.md`.

| | Choice | Why |
|---|---|---|
| **Primary platform** | <MCU/SBC + exact rev> | cheapest that clears the bar |
| **Fallback part(s)** | <second source / drop-in alternative> | when primary is out of stock or EOL'd |
| **Ladder rung** | dev kit / +carrier / custom PCB | <evidence the cheaper rung failed, if above "dev kit"> |
| **Price snapshot** (verify current) | <$ /unit at pilot qty> | verified <date> |

## 8. Supplier check *(first four lines in Phase 1 — G1 needs them; buy-ahead in Phase 2)*

> The deal-killers — check them at the distributor (dated), or redesign. Stock and lifecycle change: **verify current**.

- [ ] Every BOM line has a **named second source** or drop-in alternative — any single-source part gets an `RSK-` row in `16_risk_register.md`
- [ ] **Lead times** checked and dated for the long-pole parts; no part beyond <n> weeks without a plan
- [ ] **Lifecycle status** checked on MCU/SBC and key sensors — "active" today, NRND/EOL flags tomorrow
- [ ] Price breaks at qty 10/100 recorded and dated
- [ ] Buy-ahead decision made: order the pilot batch of scarce parts now, or accept the wait
