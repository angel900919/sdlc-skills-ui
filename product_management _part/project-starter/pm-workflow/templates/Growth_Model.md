---
Document: Growth Model — <PRODUCT_NAME>
Document ID: GROWTH-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM / Growth lead — name/role>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 15 · Product Growth & Optimization. Owning skill: pm-phase-15-growth.
Companion template: Growth_Experiment_Backlog.md (the GX-* bets this model spawns).
Conforms to ../05_Conventions.md (§3 IDs MET-/GX-/EXP-/OPP-/OBJ-KR-/RSK-/DEC-, §4 traceability
spine, §6 frontmatter, §7 outcomes-over-outputs, §8 framework citations).
This is a BLANK, reusable fill-in. Replace every <ANGLE_BRACKET>, resolve every "TODO:", or
delete the row. Don't ship the example IDs/benchmarks.
STATUS = Living per §6: a growth model is never "done" — re-run on the growth-review cadence,
bump the minor version each pass (activation/retention definitions decay).
NEVER invent an activation rate, NRR, conversion, or benchmark — cite MET-*/a sourced range, or
mark TODO: pull from analytics. AI accelerates; the human owns the activation event + value
hypothesis, defensibility, statistical rigor, and refusing dark patterns (§11).
-->

# Growth Model — <PRODUCT_NAME>

## How to read this
*Growth is a system of self-reinforcing **loops**, not a leaking funnel.* This model names the
one North Star value-exchange metric, the highest-leverage leak, the **activation event**, the
**retention curve** (the core), the compounding **loop(s)**, and the **monetization/GTM motion**.
AARRR appears only as *vocabulary to locate the leak* — never as the model itself.

<!-- Prime directive (§7): outcomes over outputs. A rising signups/pageviews/downloads number
while the retention curve keeps falling is theatre — refuse it. Retention is the core. -->

## Growth equation
> **Growth = (Acquisition + Retention + Monetization) × Defensibility**

- This product's equation, in its own terms: `TODO: write the equation for <PRODUCT_NAME>`
  <!-- e.g. "(new teams × invited members) × (weekly active rate) × (seats→paid) × (data network effect)" -->
- Dominant lever right now: `<Acquisition | Retention | Monetization | Defensibility>` — *why:* `<reason>`.
  <!-- 2026 shift: retention/NRR has overtaken acquisition. Default to retention/activation before acquisition. -->

## Traceability (inputs — §4 spine)
<!-- Cross-reference by ID; never re-describe (§4). If an input is missing, mark TODO and route
to the owning phase — do NOT fabricate to fill the cell. -->
- North Star + OKRs: `01_Strategy/North_Star_and_OKRs.md` — North Star `MET-<nn>`, `OBJ-<nn>` / `KR-<nn>` this model serves.
  <!-- No North Star? STOP — route to pm-phase-12-analytics / pm-phase-01-strategy. You can't tune a system with no headline value metric. -->
- Lifecycle metrics + tracking plan: `12_Analytics/Measurement_Plan.md` · `Tracking_Plan.md` · `KPI_Scorecard.md` — `MET-*`.
- Experiment engine (causal proof): `13_Experiments/Experiment_Plan.md` — `EXP-*`. Every `GX-*` graduates into an `EXP-*`.
- Feedback themes (the qualitative "why"): `14_Feedback/Insight_Synthesis.md` — `FB-*` (churn reasons, friction, unmet jobs).
- Validated opportunities (large bets re-enter discovery): `04_Opportunity/...` — `OPP-*`, `OBJ/KR-*`.

---

## 1. North Star & input metric tree
<!-- One value-EXCHANGE headline (value the user gets AND the business captures), with the input
levers that move it. Guardrail it so it can't rise while retention falls. Classify the star type. -->

- **North Star:** `MET-<nn>` — `<value-exchange metric>` · type: `<acquisition | retention | monetization>` growth metric.
  - Current value: `<__>` (src: `MET-<nn>`) — `TODO: confirm from analytics`. Why it's value-exchange (not vanity): `<reason>`.
- **Guardrail on the star:** retention `MET-<nn>` must not fall while the star rises. `TODO: set guardrail threshold`.

```
            North Star: MET-<nn> <value-exchange metric>
                 ├── Input MET-<nn> Acquisition  (<lever — e.g. activated new accounts/wk>)
                 ├── Input MET-<nn> Activation   (<measurable activation event — see §3>)
                 ├── Input MET-<nn> Retention    (<core curve / cohort — see §4>)
                 └── Input MET-<nn> Monetization (<expansion / NRR — see §6>)
```
<!-- Add a second level under any input that has its own drivers. Keep every leaf tied to a MET-*. -->

## 2. AARRR lifecycle — find the leak
<!-- AARRR is the diagnostic vocabulary, NOT the model. Walk every stage, mark its MET-* and rate,
then NAME the single highest-leverage leak (almost always activation or retention, before acquisition). -->

| Stage | What it means here | Metric | Current rate | Leak? | Why (FB-/INS-) |
|---|---|---|---|---|---|
| Acquisition | `<how users arrive>` | `MET-<nn>` | `<__>` / TODO | `<Y/N>` | `<FB-<nn>>` |
| Activation | `<first value — the aha>` | `MET-<nn>` | `<__>` / TODO | `<Y/N>` | `<FB-<nn>>` |
| Retention | `<they keep coming back>` | `MET-<nn>` | `<__>` / TODO | `<Y/N>` | `<FB-<nn>>` |
| Referral | `<they bring others>` | `MET-<nn>` | `<__>` / TODO | `<Y/N>` | `<FB-<nn>>` |
| Revenue | `<they pay / expand>` | `MET-<nn>` | `<__>` / TODO | `<Y/N>` | `<FB-<nn>>` |

- **Highest-leverage leak (fix first):** `<stage>` — *because* `<reason>`. Owner bet: `GX-<nn>` (see backlog).
  <!-- Don't pour acquisition into a leaking bucket — fix retention/activation first. If the retention
  curve NEVER flattens, it's a PMF/value problem, not a growth problem → route to pm-phase-04-opportunity / pm-phase-03-discovery. -->

## 3. Activation & the aha moment
<!-- Separate the FELT aha (the emotional "now I get it") from the MEASURABLE activation event
(the instrumented proxy you can move). One action toward value, not a product tour. -->

- **Felt aha moment:** `<the moment the user first feels the value>`.
- **Measurable activation event:** `<instrumented event>` within `<N>` days `(MET-<nn>)`.
  <!-- If unmeasured → TODO: instrument activation event; route to pm-phase-12-analytics. The 2026 gap:
  ~58% run PLG, only ~34% track activation. No event data = no growth model. -->
- **Value hypothesis:** "a user who does `<X>` within `<N>` days retains."
- **Current activation rate:** `<__%>` (src: `MET-<nn>`) — `TODO: pull from analytics`.
  - Directional benchmark: activation ~25–40% in 7–14 days; <20% is a problem `[cite: 2026_Research_Pack §15]`. *Cite the source, never assert from memory.*
- **Time-to-value (TTV):** `<current median TTV>` — target `<__>`. Onboarding = one action toward the aha, not a tour.
- **Setup → Aha → Habit (Balfour):**
  - Setup: `<minimal steps before value>` · Aha: `<the activation event above>` · Habit: `<the recurring trigger/action that compounds>`.

## 4. Retention — the core
<!-- Retention is the real PMF signal. Read the CURVE (does it flatten?), not a single rate. Cohort it. -->

- **Retention curve:** `<does it flatten, and at what level/week?>` `(MET-<nn>)` — `TODO: paste cohort curve / link dashboard`.
  - Flattening curve = real value/PMF. A curve that decays to ~0 = no retained value → not a growth problem.
- **Cohorts watched:** `<by segment / acquisition source / activation status>`.
- **Net Revenue Retention (NRR):** `<__%>` `(MET-<nn>)` — `TODO if unmeasured`.
  - Directional: NRR 120%+ ≈ ~2.5x faster growth `[cite: 2026_Research_Pack §15]`.
- **Churn reasons (top):** `<FB-<nn>>`, `<FB-<nn>>` → seed `GX-*` bets.

## 5. Growth loop(s) — the compounding engine
<!-- Draw each self-reinforcing loop where OUTPUT reinvests as INPUT and compounds. Name the
bottleneck step per loop (the GX-* that targets it). Note where AI changes the bottleneck, not the loop. -->

**Loop 1 — `<name, e.g. engagement→retention→monetization | content/UGC | viral output-sharing>`**
```
<action> → <output> → <reinvested as input> → <more of action>  ↺ compounds
```
- Bottleneck step: `<the weakest link>` · Owner bet: `GX-<nn>`.
- AI effect on the bottleneck (Balfour: AI changes *bottlenecks*, not fundamentals): `<e.g. AI drafts onboarding copy / removes eng bottleneck / personalizes in real time>`.

**Loop 2 — `<name>`** *(add/delete loops as needed)*
```
<action> → <output> → <reinvested as input>  ↺ compounds
```
- Bottleneck step: `<…>` · Owner bet: `GX-<nn>`.

<!-- AI-native PLG ("PLG 2.0"): distribution-by-output-sharing is a loop, not a channel —
model it here if the product's output is shareable (agents "don't read tooltips"). -->

## 6. Monetization & GTM motion
<!-- Match the model to traffic, time-to-value, and pricing architecture. Don't default to freemium
with no value model. Use AskUserQuestion for the finite choice when eliciting. -->

- **Monetization model:** `<freemium | free trial | reverse trial | usage-based>` — *rationale:* `<TTV / traffic / value shape>`.
  <!-- short TTV + self-serve aha → free trial / reverse trial; long TTV or breadth-of-value → freemium;
  consumption-shaped value (esp. AI) → usage-based. -->
  - Cited benchmark informing the call: `<e.g. free-trial ~2–3x freemium conversion; opt-out ~48.8% vs opt-in ~18.2%>` `[cite: 2026_Research_Pack §15]`.
- **GTM motion:** `<PLG | hybrid PLG + product-led sales (PQL)>` — *rationale:* `<self-serve vs expansion-account fit>`.
  <!-- "Pure PLG, no sales ever" is dogma; most products >$10M ARR run hybrid. Introduce PQL when
  PRODUCT signals (not lead forms) flag expansion-ready accounts. PQLs convert ~25–30% vs ~5–10% MQLs [cite]. -->
- **PQL definition (if hybrid):** `<the product behavior that marks an account sales-ready>` `(MET-<nn>)` — `TODO`.
- **Pricing architecture:** value metric = `<what the customer pays per unit of>` · tiers/packaging = `<…>`.

## 7. Responsible-product floor (non-negotiable — §10 / cross-cutting)
<!-- Every growth mechanic passes this floor. Raise an RSK-* instead of shipping a violation. -->
- [ ] **No dark patterns** dressed as "retention" (no roach-motel cancel, fake scarcity, forced continuity). New risks → `RSK-<nn>`.
- [ ] **Tracking consent** (GDPR) before behavioral instrumentation.
- [ ] **AI-onboarding/personalization discloses AI** per EU AI Act Art. 50 (binding 2026-08-02).
- [ ] Builds **genuine habit**, not novelty churn or manipulative engagement.

## 8. Growth health check (done-when) + cadence
<!-- P15 owns NO lifecycle gate — this is a recurring health check, run on a cadence (e.g. monthly/
quarterly growth review). First run the every-gate six-thread review (../checklists/gate-reviews.md). -->
- [ ] Growth modeled as **loops** (compounding), bottlenecks named — not funnel-only.
- [ ] North Star is **value-exchange** with input tree; **guardrailed** so it can't rise while retention falls.
- [ ] **Measurable activation event** + value hypothesis defined and instrumented (or `TODO:` → P12).
- [ ] Retention curve / NRR tracked; **retention prioritized over acquisition** where the bucket leaks.
- [ ] `GX-*` backlog prioritized with explicit Confidence; each bet has a single `MET-` + guardrail (→ `Growth_Experiment_Backlog.md`).
- [ ] Top bets proven via **causal `EXP-`** (P13), not correlation; winners shipped into the loop, losers killed.
- [ ] **Responsible-product floor** passed; new `RSK-` logged.
- [ ] No fabricated benchmark/rate; every number cites `MET-`/a sourced range or is `TODO:`.
- **Recommendation:** `<Persevere | Persevere-with-actions | Pivot | Hold | Kill>` — logged as `DEC-<nn>` in `_threads/Decision_Log.md`.
  <!-- If the curve structurally won't flatten and the loop can't compound, Kill/Pivot is the honest
  call → route to pm-phase-16-sunset. Set sunk cost aside. -->
- **Cadence:** `<e.g. monthly growth review>` · **Next review:** `<YYYY-MM-DD>`.

## Review cadence & change log
<!-- Living artifact (§6): minor bump on each re-run; major bump when the model materially changes. -->
| Date | vX.Y | Change (what shifted in the model) | Why | By |
|---|---|---|---|---|
| `<YYYY-MM-DD>` | v0.1 | Initial growth model | First post-launch growth review | `<name>` |

---
*Owning skill:* **pm-phase-15-growth** · *Companion template:* **Growth_Experiment_Backlog.md** (the `GX-*` bets) ·
*Feeds/consumes:* **pm-phase-12-analytics** (`MET-`) · **pm-phase-13-experimentation** (`EXP-`) · **pm-phase-14-feedback** (`FB-`) · **pm-phase-04-opportunity** (large bets) ·
*Conventions:* ../05_Conventions.md
