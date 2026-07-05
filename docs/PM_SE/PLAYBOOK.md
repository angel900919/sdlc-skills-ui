# PM_SE — Lean Product & Systems Engineering — Playbook

> **One lean lifecycle taking a product — software, AI, hardware, or all three — from raw idea to retirement, for a solo developer or a two-person team.** Seven phases, seven gates, five threads, ~19 templates. Lean PM is the chassis; SE is the graft: Lean PM contributes the shape and the kill-discipline; SE contributes the failure-prevention machinery Lean PM lacks — solution-free needs and off-nominal scenarios, verification-method-at-birth, the interface table, the verification matrix, verification ≠ validation, change discipline, hazard discipline, sunset discipline — each stripped to its minimum viable mechanism. Every step here forces a decision; anything that only *informs* has been cut.
>
> PM_SE supersedes `Lean_Product_Management/` as the default for new products. When a right-sizing trigger fires (see [README](README.md)), escalate to the heavy frameworks — PM_SE stays the floor. The rules of the road (IDs, T/I/A/D, S1–S4, verdicts, freeze semantics, the release tuple) live in [CONVENTIONS.md](CONVENTIONS.md) — when anything here disagrees with that file, that file wins.

---

## How to use this playbook

1. **Start a product**: create `products/<slug>/`, copy [`templates/00_tracker.md`](templates/00_tracker.md) as `TRACKER.md`, and set the product-type row (sw / hw / hybrid + AI archetype) — it switches every **[AI]** / **[HW]** block below on or off.
2. **Work the phases top to bottom.** Each phase gives you: objective, activities, templates, exit gate. Copy templates from [`templates/`](templates/) only when a phase calls for them — never in advance.
3. **Decide every gate explicitly.** A gate is a decision with a verdict, not a status update. Record every verdict + date in the tracker. **KILL and PIVOT are wins** — the cheapest outcomes this process can produce.
4. **Fill templates as thinking tools.** If a section doesn't apply, delete it and log one tailoring line. If you don't know an answer, write `TODO: <what's owed, by whom, by when>` — never invent numbers, dates, or names; verify volatile facts (prices, model terms, regulations) at decision time.
5. **Skip anything that doesn't force a decision — except the seven-item spine below.** Skips are recorded as `tailored out: <reason>`, never silent.

---

## Operating principles

Twelve rules are the whole philosophy. Everything else in this playbook is their application.

1. **Documents force decisions.** Keep every artifact that makes you choose; cut every artifact whose only job is to inform someone else. Solo, your documents are thinking tools, not coordination tools.
2. **Kill early, kill cheaply.** The gates exist to stop bad ideas at the cheapest point. A one-paragraph kill memo is the most valuable artifact in this playbook.
3. **Evidence over opinion.** Every gate verdict cites evidence — interviews, numbers, test results. Unknowns become `TODO:`, never fabricated facts.
4. **Outcomes over outputs.** Success is a change in a user or the business, never "feature shipped" or "model deployed." Apply the vanity-metric test to every metric: *would this number still rise if the product got worse?*
5. **Problem before solution.** Needs (`SN-*`) are solution-free and signed off at G1 before any requirement exists. "Use AI" (or "use a Pi") is never a problem statement; smuggled tech becomes a constraint seed and the underlying need is re-derived.
6. **Method at birth.** Freeze what "good" means — metric, threshold, eval-set version, judge method — *before* you build; and every requirement is born with its T/I/A/D verification method in the row. No conceivable method = rewrite the requirement now, not at ship time.
7. **The cheapest thing that works, first.** Rules before a model; a prompt before RAG; RAG before fine-tuning; a workflow before an agent; a dev kit before a custom board. Climb the ladder only when the cheaper rung measurably fails.
8. **Augment, then automate.** Version 1 assists a human. Autonomy — acting without per-action review — is earned with eval evidence. Keep a working stop/override/undo on anything that acts, whether it sends emails or switches a heater.
9. **Interfaces before build.** Pin every seam where independently built things meet — schema, auth, failure behaviour — before both sides exist. Seams are where solo hardware+software products die.
10. **Unit economics are a product metric.** Track cost-per-successful-outcome (and BOM + assembly vs price) against a margin floor from day zero. A product that loses money per use is a kill candidate no matter how good the demo.
11. **Everything shipped is reversible and observed.** Real users ⇒ a rollback path, a monitored dashboard, and runbooks that are real files. Launch is staged, never big-bang without a written reason.
12. **Re-baseline, never quiet-edit.** Frozen things change only via a logged change note + version bump + re-run of affected checks. Bars may be raised later, never quietly lowered.

---

## The lifecycle at a glance

```
 P0        P1           P2           P3            P4         P5              P6
 FRAME →   DISCOVER →   DESIGN   →   BUILD &   →   LAUNCH →   OPERATE     →   SUNSET
 (½ day)   (1–2 wks)    (1–2 wks)    PROVE         (1–2 wks)  & EVOLVE        (an
   │          │            │         (2–6 wks)        │       (continuous)    afternoon)
  G0         G1           G2            │            G4          G5              G6
 Frame     OPPORTUNITY   DESIGN        G3          Launched   Health          Clean
 Check     GATE ★        FREEZE ★     SHIP- ★      & landed   Check           Exit
           (kill-filter) (bar+spec+   READY                   (recurring)
                         interfaces)  (verified+
                                      validated)
           ── ★ = never skip ──
```

| # | Phase | Core question | Gate & verdicts | Templates used |
|---|---|---|---|---|
| P0 | [Frame](#p0--frame) | Is this worth spending discovery time on? | **G0 · Frame Check** · Proceed / Park | 01 charter (+ 00 tracker, 15 decisions, 16 risks) |
| P1 | [Discover](#p1--discover) | Is the problem real, feasible, viable — should we build at all? | **G1 · Opportunity Gate** ★ · GO / GO-with-de-risk / PIVOT / KILL | 02 validation log · 03 AI feasibility* · 04 HW feasibility* · 05 opportunity gate |
| P2 | [Design](#p2--design) | What exactly do we build, and what does "good" mean? | **G2 · Design Freeze** ★ · Approve-&-Freeze / Revise | 06 spec · 07 ship bar · 08 architecture |
| P3 | [Build & Prove](#p3--build--prove) | Does the real thing clear the unchanged bar, with real users? | **G3 · Ship-Ready** ★ · GO / Iterate / KILL | 09 build plan* · 10 verification matrix · 17 trial brief* · 11 launch checklist (go/no-go) |
| P4 | [Launch](#p4--launch) | Can we put it in front of everyone, reversibly? | **G4 · Launch** · Advance / Hold / Rollback per stage → Landed | 11 launch checklist · 12 runbook ×2–5 |
| P5 | [Operate & Evolve](#p5--operate--evolve) | Is it healthy, and what do we do next — on purpose? | **G5 · Health Check** (recurring) · Continue / Iterate / Re-open / Sunset | 13 ops review · 14 postmortem* · 17 trial brief* |
| P6 | [Sunset](#p6--sunset) | Can we walk away clean? | **G6 · Clean Exit** · Complete / Blocked | 18 sunset checklist |

`*` = conditional. Running artifacts alive in every phase: `00_tracker` (state + gate log + tailoring log + what's-deployed) · `15_decision_log` · `16_risk_register` (≤10 live rows).

---

## The never-skip spine (7 items)

Everything in PM_SE is tailorable — with a recorded reason — except these:

1. **The G1 kill-filter** — five filters scored as a gate, not an average; one hard FAIL stops the line. *(Lean)*
2. **Problem before solution** — `SN-*` needs + `SCN-*` scenarios signed off at G1 before any `REQ-*` exists. *(SE)*
3. **Ship-bar frozen before build** — raised later, never quietly lowered. *(Lean)*
4. **Verification method at requirement birth** — T/I/A/D in the row the moment it's written. *(SE)*
5. **Interfaces pinned before both sides are built** — every seam a named-schema row. *(SE)*
6. **Eval vs the unchanged bar + the matrix's two zero-rules + a separate validation block at G3** — neither may impersonate the other. *(Lean + SE)*
7. **Frozen things change only via re-baseline** — change note, version bump, affected checks re-run. *(SE)*

Even a throwaway spike does 2, 3, and 6 in miniature: state the problem, name a bar, check it.

---

## P0 — Frame

**Objective.** Decide, in half a day or less, whether this idea deserves real discovery time — and write down the frame you'll validate: the problem (technology-free), the owner, the budget cap, success as an outcome, the risk triggers, and the product's shape (sw / hw / hybrid, own product / client work).

**Timebox.** 2–4 hours. If the charter takes longer, you're writing a business case — stop.

**Templates.** [`01_charter.md`](templates/01_charter.md) · start [`00_tracker.md`](templates/00_tracker.md), [`15_decision_log.md`](templates/15_decision_log.md), [`16_risk_register.md`](templates/16_risk_register.md)

### Activities

1. **State the problem technology-free.** JTBD shape: "When <situation>, I want <motivation>, so I can <outcome>." Banned words: AI, ML, LLM, chatbot, agent, model, app, platform, device, sensor, board, Pi. If one appears, that's a solution wearing a problem's clothes — rewrite.
2. **Name the owner and the budget.** Who owns this end-to-end, and what time/money envelope is authorized for discovery? **An idea nobody owns or funds is Parked**, not Proceeded. Client work: two more lines — who pays, who accepts (acceptance seeds as `AC-*` rows with T/I/A/D) — promoted into ship-bar rows in P2; no seed dies silently.
3. **Sketch success as an outcome** (vanity test). Devices may state a mission: "greenhouse holds ±2 °C unattended for 30 days" — an outcome, not a board.
4. **Run the risk & tailoring check**: the README escalation triggers plus the safety question, verbatim — *"Can a failure of this system hurt someone or breach a safety regulation?"* Yes → activate the hazard block in `16_risk_register.md`. Record the answer even when it's "no".
5. **Record constraint seeds**: budget ceiling, mandated tech, hard dates, platform gatekeepers — future `REQ-C-*` rows; IDs assigned in P2, so nothing gets lost between phases.
6. **Set the product-type flag** in the tracker and open the tailoring log; run the pre-mortem — "it's launch day and we failed — why?" — to seed the first `RSK-*` rows.
7. **[AI]** Note the suspected archetype and run the honesty test: *would this still be worth building if you couldn't put "AI-powered" in the announcement?* If no, Park it.
8. **[HW]** Write the deployment-reality line, three fields: power source, indoor/outdoor, connectivity available.

**Monday morning:** 2–4 hours with `01_charter.md` — problem without the banned words, budget set, trigger check run; verdict by lunch.

### Exit gate — G0 · Frame Check

**Verdicts: Proceed / Park.**

- [ ] Problem stated technology-free, with a named user and a named cost of the status quo
- [ ] Owner named; discovery time/budget explicitly bounded
- [ ] Success sketched as an outcome (passes the vanity test)
- [ ] Risk & tailoring check done; safety question answered and recorded — even when "no"
- [ ] Constraint seeds + product-type flag recorded; tailoring log opened
- [ ] Verdict + date logged in the tracker

### Best practices

- The charter is a **thinking tool** — its value is forcing you to articulate the problem, not impressing anyone.
- Write the risk check even for toys. Two minutes now catches the "oh, this touches health data" surprise while it's still free.
- Park liberally. A Parked idea with a clean charter resumes cheaply; a half-validated zombie project is expensive.

### Pitfalls

- **Charter bloat.** TAM analyses and personas here mean you're procrastinating on talking to users.
- **"Use AI" (or "use a Pi") as the goal.** Frame the job; the technology is a P1–P2 decision.
- **Skipping the safety question because it's "just a small tool".** Small tools grow; the question costs one line.

---

## P1 — Discover

**Objective.** Prove with evidence — before building anything — that the problem is real and painful, that people would adopt and pay, that a solution is feasible on all four dimensions, and that the economics work. Baseline the **problem space** (needs + scenarios) so P2 derives from it, not from imagination. This phase exists to **kill bad ideas at the cheapest point.**

**Timebox.** 1–2 weeks. Research enough to decide, then decide.

**Templates.** [`02_validation_log.md`](templates/02_validation_log.md) · [`03_ai_feasibility.md`](templates/03_ai_feasibility.md) *(AI only)* · [`04_hw_feasibility.md`](templates/04_hw_feasibility.md) *(hardware only)* · [`05_opportunity_gate.md`](templates/05_opportunity_gate.md)

### Activities

1. **Interview ≥5 real target users** (strangers beat friends; 10 is better). Capture needs as solution-free `SN-*` rows, prioritised, each with a candidate outcome metric. Smuggled tech ("use MQTT", "use GPT") is parked as a constraint seed; re-derive the underlying need.
2. **Run the stakeholder probe** — one question, not a register: *who operates, maintains, regulates, pays for, and disposes of this?* Missing stakeholders are missing requirements.
3. **Collect the market evidence.** Demand signals (revealed behaviour over stated intent); 3–5 competitors and alternatives including "a spreadsheet" and "do nothing"; willingness-to-pay probe; bottom-up market arithmetic — a page of math, not a report.
4. **Write 3–6 scenarios** (`SCN-*`: actors / trigger / main flow / success outcome / exercises SN-x) — **mandatory ≥1 off-nominal and ≥1 maintenance scenario** (power loss, offline, sensor death, LLM timeout, update day). PM journeys map the happy path; off-nominal is where IoT and AI products actually die.
5. **Test the riskiest assumptions** (`ASM-*`) with the cheapest test first — landing page, concierge, Wizard-of-Oz, breadboard spike — pass/fail threshold **pre-committed before the test runs**.
6. **Verdict feasibility per dimension** — Market / Technical / Regulatory / Economic, each Go / Conditional-Go / No-Go with evidence. The regulatory scan is 30 minutes that saves months: radio → FCC/CE; personal data → GDPR; payments/health → escalate out of the lean lane (*verify current*).
7. **[AI]** The AI-or-not check (2–3 non-AI ways first). Error analysis on 30–100 **real** examples — read every output, name and count the failures. Record the **zero-shot baseline number** as the bar-to-beat before any data/tuning spend. Data reality check: provenance, license, lawful basis. Cost-per-outcome sketch at 3 scales. **Local-LLM:** measure latency / RAM / tokens-per-second on the actual target hardware; check the weights license.
8. **[HW]** The mirror-image spike: breadboard/dev-kit test = error analysis; measured numbers on the real board = the baseline; BOM at qty 1/10/100 = cost at 3 scales; supplier check (lead time, single-source, EOL) = vendor check; cert trigger scan (FCC/CE/UL, battery shipping).

**Monday morning:** book two user interviews this week; run 30–100 real examples through a frontier model, or wire the sensor on a breadboard and measure; Friday, check the assumption thresholds you pre-committed.

### Exit gate — G1 · Opportunity Gate ★

**Verdicts: GO / GO-with-de-risk / PIVOT / KILL.** Score it as a **gate, not an average** — one hard FAIL stops the line, no matter how good the rest looks.

- [ ] Five filters pass with cited evidence — Desirable / Viable / Feasible / Responsible / Differentiated (hard-fails: no learnable signal; unlawful data; unaffordable cert; single-source EOL part; a wrapper anyone clones in a weekend)
- [ ] All four feasibility dimensions verdicted; **no non-waivable No-Go**
- [ ] Needs solution-free and prioritised; every high-priority SN exercised by ≥1 SCN; off-nominal + maintenance covered
- [ ] Riskiest assumption tested against its pre-committed threshold
- [ ] [AI] AI-or-not decided; baseline number written down · [HW] spike measured; BOM ceiling recorded
- [ ] Verdict + evidence logged; KILL → one-paragraph kill memo in the tracker. **Celebrate the KILL** — it just saved you months.

### Best practices

- **Pre-commit your stop rule.** Decide what evidence kills the idea *before* collecting it — post-hoc rationalization is undefeated otherwise.
- **Talk to strangers.** Friends are polite; 10–30 strangers give real signal.
- **Never GO on a demo.** A cherry-picked pass is not feasibility; the baseline number on real examples is.
- **A KILL here costs days. The same KILL at launch costs months.**

### Pitfalls

- **Projecting yourself as the persona.** Interview before you write it.
- **Counting stated intent as demand.** "I'd totally use that" converts terribly; weight what people already pay and do.
- **Vibe-checking feasibility.** Three good outputs in a playground — or one sensor reading on a sunny bench — is not signal.
- **Treating the gate as a formality.** If GO was never in doubt, you held a ceremony, not a gate.

---

## P2 — Design

**Objective.** Turn the validated opportunity into a buildable, testable, *traceable* plan — and freeze three things before any build: **the ship-bar, the spec, the interfaces.** When this phase ends, you (or an AI agent, next Monday) can build without guessing what "done", "good", or "connected" means.

**Enforced order — spec before boxes:** needs → requirements → ship-bar → architecture → decisions. A requirement that names a component is a design smuggled into the spec; send it back.

**Timebox.** 1–2 weeks, prototype tests included.

**Templates.** [`06_spec.md`](templates/06_spec.md) · [`07_ship_bar.md`](templates/07_ship_bar.md) · [`08_architecture.md`](templates/08_architecture.md) · [`15_decision_log.md`](templates/15_decision_log.md)

### Activities

1. **Write the spec front matter** (the strategy, folded in): Moore vision line, business model in five lines, pricing hypothesis, and the **out-of-scope list** — the longest section wins.
2. **Validate the solution shape cheaply**: storyboard, lowest-fidelity prototype, ~5 target users watching it. Scope with MoSCoW; the Won't-have column is the contract.
3. **Write requirements as SMART shall-statements** — *"The <subject> shall <action> <measurable condition> <under defined conditions>"* — one behaviour per row, stable `REQ-<class>-nn` IDs, each row born with its parent SN, priority, and **T/I/A/D method**. Vague-verb ban: fast / robust / intuitive / secure / seamless / support / handle. Hunt the implicit requirements: what must work offline? interoperate with what? which numbers do users never volunteer? which regulation owns you?
4. **Run the two orphan checks** (they block G2): no REQ without a parent SN (gold-plating); no SN without a covering REQ (silent scope loss).
5. **Add the modes & states table** when the product has a device, agent loop, session, or droppable connection (Off / Boot / Idle / Active / Degraded / Fault / Maintenance). Never invent a transition.
6. **Freeze the ship-bar ★.** Non-AI: acceptance criteria + performance budgets. **[AI]** the four fields — **metric · threshold · eval-set version · judge method** — golden set built from the P1 error analysis, 30–100 real cases, versioned, held out. **[HW]** environmental/duty bars (temp range, battery ≥ N h, 7-day soak uptime, sensor ±x, RF range, IP rating), **each with its T/I/A/D method**. Threshold ≠ target on every number — equal is zero margin by design.
7. **Define the metrics**: one North-Star **outcome** metric, 2–4 drivers, ≥1 **counter-metric** that catches gaming; write the instrumentation plan now so analytics exist on day one.
8. **Draw the architecture on one page**: 3–5 drivers, 3–5 principles, one Mermaid context/deployment diagram (≤12 boxes, zones, **trust boundaries drawn**, crossing arrows labeled `IF-nn`), one sequence sketch of the critical flow, state machine if modes exist. Litmus, verbatim: *does it change which blocks exist or how they connect? Then decide now; otherwise defer.*
9. **Pin the interface table ★** — one row per seam where independently built things meet (device↔cloud, app↔API, code↔third-party, model↔app): transport + protocol, message format with a **named schema** (never "JSON over HTTP"), auth, cadence, latency budget from a REQ or `TODO:`, **failure behaviour** (timeout / retry / offline buffer / degrade), versioning, trust-boundary flag.
10. **Walk the threats** (STRIDE-lite, 30 min) along every trust boundary; top threats become `REQ-SEC-*` rows with tests. Third-party APIs, IdPs, and model providers are boundaries too. **[HW]** Hazard pass when triggered: guidewords lost / erroneous / inadvertent / degraded / late; each hazard → mitigation as a `REQ-SAF-*` row → proving test → residual accepted by name.
11. **Fill the stack table + the NOT-using list** (≥3 named rejections tied to a REQ or principle — the anti-shiny-object device). Record irreversible choices as `DEC-*` rows on the 3-tier ladder: reversible → one line; hard-to-reverse → 1-page ADR with "runner-up wins if…"; bet-the-product → ADR + mini-matrix + real 2-year TCO arithmetic.
12. **[AI]** Fill the spec's AI appendix: model as swappable config (cheapest that clears the bar, plus a named fallback — *verify current* pricing); prompt spec versioned like code; variance budget ("≥X% of cases", never "always"); oversight ladder per action (augment → suggest → act) with stop/override/undo designed now; failure UX (what happened · why · what next, plus a visible human fallback); safety rules as testable REQ rows; cost modeled at 3 scales.
13. **[HW]** Fill the spec's hardware appendix: BOM sketch (part, cost, lead time, single-source?, alternative), power budget table (worst-case draw vs supply per rail), enclosure/mounting, **firmware-update path — no OTA/USB path = a named risk**, cert flags. A relay that switches a heater rides the same oversight ladder; interlocks are its stop/override.

**Monday morning:** draft REQ rows — each born with its number, its need, and its method; draw the one deployment diagram; fill an interface row per crossing arrow; freeze the bar before you write a line of product code.

### Exit gate — G2 · Design Freeze ★

**Verdicts: Approve-&-Freeze / Revise.** Freezes THREE things: ship-bar, spec, interfaces.

- [ ] **Ship-bar FROZEN and dated** — AI: all four fields + versioned, held-out golden set; HW: bars with methods; threshold ≠ target throughout
- [ ] Every REQ SMART with method at birth; both orphan checks clean
- [ ] **Interface table pinned** — every seam has a row with named schema, auth, and failure behaviour; no vague rows
- [ ] Trust boundaries walked; [HW] every hazard mitigated → REQ-SAF → proving test, residual accepted by name
- [ ] MVP Won't-have list real; out-of-scope list real; counter-metric present; instrumentation planned
- [ ] AI/HW appendices complete — or deleted with a tailoring line; spec readable in 15 minutes
- [ ] Red-team ran and its findings addressed; verdict + date logged; git tag `baseline-g2`

### Best practices

- **Freeze the bar to protect your future self.** Mid-build, "the model gets 78%, let's call 78% the bar" will feel reasonable. That's exactly the move the freeze exists to block.
- **The prototype is the spec.** A clickable flow plus a tight spec beats 20 pages nobody reads.
- **Design failure UX with the same care as the happy path.** For AI products and devices, failure *is* a normal path.
- **Spend design effort where change is expensive later** (data model, interfaces, oversight, pricing structure); stay sketchy where iteration is cheap (copy, layout).

### Pitfalls

- **Choosing the model (or the board) before the bar.** Backwards: the bar defines "good enough"; the component is whatever clears it cheapest.
- **Deterministic acceptance criteria for AI** ("always does X"). You'll fail honest evals or pass dishonest ones.
- **"JSON over HTTP" interface rows.** A seam without a named schema is an integration surprise on order.
- **Skipping the counter-metric.** Every unpaired target will be gamed — by you, under deadline pressure.

---

## P3 — Build & Prove

**Objective.** Build the MVP in weekly learning loops, ordered by dependency weight; prove it clears the **unchanged** frozen bar (**VERIFIED**); prove real strangers succeed against pre-set numeric targets (**VALIDATED**) — before launch. G3 is a genuine go/no-go where No-Go is a live option.

**Timebox.** 2–6 weeks for a true MVP. If the estimate is months, re-scope P2 — the Won't-have list is too short.

**Templates.** [`09_build_plan.md`](templates/09_build_plan.md) *(hardware or ≥3 independent pieces)* · [`10_verification_matrix.md`](templates/10_verification_matrix.md) · [`17_trial_brief.md`](templates/17_trial_brief.md) *(per bench/soak trial)* · [`07_ship_bar.md`](templates/07_ship_bar.md) (eval log) · [`11_launch_checklist.md`](templates/11_launch_checklist.md) (go/no-go section)

### Activities

1. **Set the weekly cadence**: plan Monday ("what ships this week?"), demo Friday — working software, even to yourself. Track work in a real tracker (GitHub Issues, not markdown).
2. **Order the build by dependency weight**: what does everything else lean on? Build and prove that first. A walking skeleton of the core outcome end-to-end beats three polished, disconnected features.
3. **Keep interfaces honest**: every `IF-*` row is either real or faked with a mock generated from its schema (contract-tested in CI), plus the date the real one lands. No skipped seams. **[HW]** Two dependency types software brains forget: boot order (temporal) and shared buses/power rails (resource).
4. **Respect the safety net even solo**: version control, CI running tests (and evals) on every push, a self-review checklist, analytics events from the first build.
5. **Fill the verification matrix as you go**: `REQ | method | check | evidence link` — the check is a named test path, checklist, analysis, or demo script; **bare "Manual" is invalid**. CI logs are the evidence for T; a small `evidence/` folder holds bench photos and review notes. Banner: *coverage ≠ correctness.*
6. **Beta with 10–30 real strangers** once the skeleton stands — this is the validation evidence. Write the scenario scripts first: independent cases (preconditions re-establish all state), per-step *Expected:*, blank Actual; **≥1 concurrent-actors case and ≥1 mid-operation-failure case** (network drop mid-payment, LLM timeout mid-generation, sensor death mid-cycle); **numeric targets set before the beta starts** — "≥90% complete the core task unaided", never "users are happy".
7. **Triage severity (S1–S4) and priority separately.** Fix-before-launch = breaks the core outcome, corrupts trust, or leaks data. Hold the MVP line — new ideas go to the backlog, not the launch scope.
8. **Watch cost-per-successful-outcome on real traffic** vs the P2 model — token-hungry retry loops show up here, not in the pricing sheet.
9. **[AI]** Golden set on every prompt/model/pipeline change, versioned rows (eval-set · prompt · model · score · date), multiple runs with a variance read. Iterate **up the ladder, never down the bar** — prompt → RAG → fine-tune against the unchanged bar; ceiling below bar = an Escalate-or-KILL conversation, not a threshold edit. Red-team lite: direct + retrieved-content injection, PII extraction, out-of-scope action; **every exploit becomes an eval case**. Agents: action + spend caps, approval for irreversible actions, reliability = pass^k.
10. **[HW]** Bench rig at increment 1, not launch week: the real board, scripted stimuli, something that measures. Test the datasheet's claim before designing around it. Soak test (n units, days, real environment); watchdog + recovery proven; FAT line: bench-test each assembled unit before it ships.

**Monday morning:** "what ships this week?" — the next increment from the dependency-ranked list; CI runs tests + evals on every push; the bench rig is already on your desk; demo Friday, even to yourself.

### Exit gate — G3 · Ship-Ready ★

**Verdicts: GO / Iterate / KILL.** Run it as a meeting with a written verdict, even solo.

*VERIFIED — built it right:*

- [ ] **Eval passed against the unchanged frozen bar** — numbers written down with eval-set / prompt / model / firmware versions
- [ ] Verification matrix: **zero REQs without a method, zero without a check**; evidence linked
- [ ] Zero open S1; [AI] injection tests run, no secrets in prompts, no PII to vendors that train on it (*verify current*) · [HW] soak/burn-in passed against the environmental bar; every shipping unit FAT bench-tested

*VALIDATED — built the right thing:*

- [ ] Beta ≥ the pre-set numeric targets, run by **real strangers in a real environment** — a staging run is integration, not validation
- [ ] Feedback themes addressed or consciously deferred (in the log)

*READY:*

- [ ] Analytics verified end-to-end; rollback / kill-switch rehearsed once; unit economics positive at observed usage
- [ ] Go/no-go recorded with No-Go genuinely available; git tag `baseline-g3` pins the release tuple

### Best practices

- **Never lower the bar to make the date.** Slip the date, cut scope, or escalate — the bar is the product's honesty.
- **Demo weekly to stay honest.** Working software every Friday beats three weeks of "almost done."
- **Beta users are your cheapest red team.** Strangers break assumptions friends politely work around.
- **A No-Go is a plan, not a verdict on you.** Write what's missing, fix it, re-run the gate.

### Pitfalls

- **Goalpost-moving** — the deadliest pitfall: quietly re-defining the bar as whatever the build achieved this week.
- **Scope creep eating the launch.** The backlog exists so "one more thing" has somewhere to go that isn't the critical path.
- **Prompts (or firmware) as untracked strings.** When quality shifts you must know exactly what changed; version them like code.
- **Go/no-go theatre.** If the meeting can only ever say Go, you've built a rubber stamp.

---

## P4 — Launch

**Objective.** Put the product in front of all target users in **reversible stages**, with the ops floor proven *before* the spotlight: runbooks, SLOs, rollback, drift check. **Release ≠ launch**, and launch is the start of the work, not the finish line.

**Timebox.** 1–2 weeks from go/no-go to full availability (longer only if a stage says Hold).

**Templates.** [`11_launch_checklist.md`](templates/11_launch_checklist.md) · [`12_runbook.md`](templates/12_runbook.md) *(copy per failure mode, 2–5)*

### Activities

1. **Separate release from launch.** Release = engineering: code reaches production dark, behind a flag. Launch = users are told. Decoupling lets you verify stability before the spotlight.
2. **Lay the ops floor** (the launch checklist's ops block): 2–4 `SLO-*` rows derived from REQ-P/REQ-O rows — targets come from the requirement, not gut feel; **2–5 runbooks as real files** (the 2–5 classics named in `12_runbook.md`'s header) — an empty `runbooks/` folder is a Hold; alerting that actually reaches you; **deployed == tagged** (the drift check); rollback = one config flip, rehearsed once, with the two-line rollback note pre-written for 3 a.m.-you.
3. **Run the pull-the-plug test once**: kill the riskiest dependency on purpose; confirm sane degradation — and that you'd notice.
4. **Ramp in stages with dwell time**: internal → canary 1–5% → 25% → 50% → 100%. Verdict per stage: **Advance / Hold / Rollback**. Hold is cheap and legitimate; rollback on breach is automatic, not a debate. Big-bang only with a written reason (hardware, hard deadline, trivial change).
5. **Prep the support surface**: FAQ for the top questions, a findable feedback channel, canned first responses. Solo: you are support — budget the launch-week hours.
6. **Announce** through the 1–2 channels named in the spec front matter; thank people by name. Watch daily for the first week: North Star, errors, cost, every piece of feedback captured centrally with a theme tag.
7. **Arm auto-halt triggers** before the ramp, each with a threshold and an action: error spike → halt; cost >120% of forecast → halt + investigate; any PII/secret leak → instant rollback — every product arms these (07_ship_bar §4), not just AI. **[AI]** Gate ramp stages on **quality** signals (thumbs-down, regeneration, escalation, golden-set spot checks), not just uptime — a green error dashboard can hide a model doing worse. Transparency: users know it's AI; AI content labeled; duties checked for your jurisdictions (*verify current*).
8. **[HW]** Climb the device ladder: bench → own site → friendly pilot (1–5 units) → batch. **Canary-of-one** before any fleet push; OTA only signed and only with a tested downgrade/un-brick path; SAT line: re-check at the install site after install — the install environment kills devices that passed the bench.

**Monday morning:** watch the dashboard at the current ramp stage; verdict Advance / Hold / Rollback; don't start a stage on a Friday.

### Exit gate — G4 · Launch

**Verdicts: Advance / Hold / Rollback** per stage; the phase exits **Landed** when:

- [ ] Target audience reached; each stage verdict logged
- [ ] Week-one metrics within expected range; no open S1 incident
- [ ] Rollback unused — or used, and it worked
- [ ] Runbooks real; deployed matches tagged; SLOs green; support load manageable; feedback flowing into one themed place
- [ ] [AI] auto-halt stayed armed; quality stable across the ramp · [HW] fleet versions known

### Best practices

- **Default to gradual.** Every stage you ramp is risk retired before the full audience saw it.
- **Don't launch on Friday** (or before your holiday). Launch when you can watch it.
- **Do the boring reliability work before the exciting announcement work.** A viral moment against a broken product is negative marketing.
- **Feedback themes over feedback items.** Week one is noise; repeats are signal.

### Pitfalls

- **Big-bang by default.** Use it only with a written reason.
- **No tested rollback.** Untested rollback = no rollback. Rehearse the flip before you need it.
- **Conflating launching with landing.** The ops review (P5) is where "did it work" lives.
- **Acting on every launch-week request.** Early loud users are not the market; theme it, then decide.

---

## P5 — Operate & Evolve

**Objective.** Run the product as a living system: watch outcomes and money, change things without silent drift, close every incident loop upstream, improve through pre-committed trials, and re-decide the product's future on purpose — never by inertia.

**Cadence** (instead of a timebox):

| Rhythm | Ritual (time cost) |
|---|---|
| Weekly | 15-min metrics review: North Star, drivers, counter-metric, cost — vs last week |
| Weekly **[AI]** | Quality glance: spot-check ~10 live outputs; edit/regen/escalation rates; cost-per-outcome |
| Weekly **[HW]** | Fleet glance: uptime, reboot counts, last-seen, battery, RMA count |
| Monthly | 30-min retro: what's working, what's dragging, one process fix |
| Quarterly | G5 Health Check + strategy refresh + KPI pruning (retire one before adding one) |
| On incident | Blameless postmortem within 48 h |
| On risky change | Change note: the 5-question impact check |

**Templates.** [`13_ops_review.md`](templates/13_ops_review.md) · [`14_incident_postmortem.md`](templates/14_incident_postmortem.md) *(on incident)* · [`17_trial_brief.md`](templates/17_trial_brief.md) *(per trial)* · living: 07, 15, 16

### Activities

1. **Run the ops review at T+14/T+30, then quarterly**: results vs targets, retention shape by cohort, feedback themes (the underlying problem, not the stated request), and the explicit verdict. Define the **sunset condition** at the first review and keep it visible.
2. **Apply the change rule.** Normal change → commit with a decent message. *Risky change* (anything frozen/tagged/shipped: breaking interface, model/prompt/eval-set swap, firmware to the fleet, security/data path) → a change note: the 5-question impact check in `15_decision_log.md`; re-run affected matrix rows and evals, semver bump, re-tag. Hotfix now is allowed; the note follows within 48 h.
3. **Keep versions pinned**: every release tag names the tuple (CONVENTIONS §7). **Changing the eval set is itself a risky change.** Deployed-matches-tagged checked quarterly.
4. **Close every incident loop** — the crown jewel: blameless postmortem within 48 h; the incident is not closed when traffic recovers, but when the failure **can't silently recur** — an eval/test case that fails pre-fix and passes post-fix, a guardrail, or a changed requirement. The same failure twice = the loop is broken, and that's the finding. **[HW]** FRACAS-lite: every field failure gets a row — repro'd on the bench, HW rev + firmware recorded, added to the soak suite.
5. **Trial before committing**: hypothesis, minimal design, pre-committed decision rule. A/B above ~1k weekly actives; below that, pre/post comparison + 5 user conversations beats fake statistics. Bench / soak / field pilots use the same skeleton.
6. **Watch the money monthly**: cost-per-successful-outcome vs the margin floor. Engagement growing while margin quietly inverts is a classic AI-product failure mode.
7. **[AI]** Grow the eval set from production (+5–10 cases/week beats any quarterly review; the frozen version stays frozen for comparability). Re-run the full eval + injection tests on **every** model/prompt/retrieval change, shipped through the same canary ladder. Watch three drift signals with owners: input mix, quality, cost. Mind vendor terms at every renewal (*verify current*).
8. **[HW]** Re-run the pull-the-plug test yearly, or before any fleet expansion. Watch fleet drift: firmware-version spread, sensor drift/recalibration, battery degradation.

**Monday morning:** 15-minute metrics glance (outcome, counter-metric, cost, fleet heartbeats); spot-check 10 live outputs; anything painful last week? Close its loop.

### Recurring gate — G5 · Health Check

**Verdicts (re-decided quarterly): Continue / Iterate / Re-open / Sunset.**

- [ ] North Star trending vs target; counter-metric not degrading; unit economics at or better than plan
- [ ] No unresolved S1; last quarter's incident actions closed
- [ ] Versions deployed known — no silent drift between tagged and live
- [ ] [AI] eval set growing; no unexplained quality/cost drift · [HW] fleet health reviewed
- [ ] Risk register reviewed this cycle (a stale register blocks the verdict until it's refreshed)
- [ ] The verdict is written down — including "Continue" — so inertia never decides silently

### Best practices

- **Report outcomes, not activity.** "Handle-time −22%" — not "we retrained twice and shipped 14 tickets."
- **Fix the category, not the instance.** Postmortem actions that patch one case guarantee a rerun.
- **Keep a ~20% improvement budget** for debt and quality — pure-feature diets end in outages.
- **Fold every learning back into these templates** — the framework itself should iterate.

### Pitfalls

- **All product metrics green but the outcome unmet = built it right, wrong thing.** Watch the outcome.
- **Shipping "improved" AI (or firmware) on vibes.** Better-on-three-examples is how regressions ship; the eval set is the referee.
- **Never sunsetting.** Zombie products tax the attention your next product needs.
- **Metric zombies.** Unowned, un-updated KPIs create false confidence — prune ruthlessly.

---

## P6 — Sunset

**Objective.** Retire deliberately — reversibly until the point of no return, then irreversibly with your eyes open. Users respected, data destroyed properly, money stopped, learnings kept.

**Timebox.** An afternoon. This phase is a checklist, not a campaign.

**Templates.** [`18_sunset_checklist.md`](templates/18_sunset_checklist.md)

### Activities (the ordered teardown — the order *is* the content)

1. **Decide the end-state**: gone / replaced (migrate first — teardown gated on the successor's go-live) / mothballed / handed over.
2. **Announce**: sunset date, what stops working, data-export instructions + deadline — the timeline built backwards from the date.
3. **Go read-only / stop signups** (still reversible). Archive anything legally retained **before** any wipe.
4. **Export deadline passes → point of no return acknowledged.** Delete cloud data **and backups/snapshots**; revoke keys, OAuth apps, webhooks, certs; **cancel subscriptions LAST**; release or park the domain.
5. **[HW]** Destroy the disk-encryption key or physically wipe media before selling or binning — **a format is not a wipe**; a data-bearing device leaving your custody is an attack surface. E-waste to a proper recycler; harvest parts; **batteries never in the bin**.
6. **[AI]** Revoke provider keys; delete stored prompts/logs containing user data; close the vendor data-retention loop (*verify current* terms).
7. **Tag the final release; archive (don't delete) the repo** with an ARCHIVED note. Write the **10-line post-mortem** — what worked, what failed, what the next product inherits — and route it to the next product's P1. Sweep billing: zero charges next month.

**Monday morning:** work the checklist top to bottom; pause at the point of no return; cancel the subscriptions last.

### Exit gate — G6 · Clean Exit

**Verdicts: Complete / Blocked.**

- [ ] Every line ✓ — or consciously skipped with a reason
- [ ] No irreversible step ran before its precondition cleared
- [ ] Post-mortem written and routed forward — the only artifact that flows into the next product
- [ ] Billing sweep done or scheduled; verdict + date logged

### Best practices

- **Encrypt devices from day one**, so disposal = destroying a key.
- **Export before wipe; cancel last.** Never cut a service the teardown still needs.
- **The post-mortem is the compounding asset.** Ten honest lines beat a retrospective deck.

### Pitfalls

- **Users blindsided by the shutdown.** Comms run backwards from the sunset date.
- **"We formatted it."** Backups, caches, logs, and forgotten secrets stores are the classic misses.
- **Skipping the post-mortem because the product is dead.** That's the one output that outlives it.

---

## The five cross-cutting threads

Each thread = one home artifact + one question block at every gate; the gate red-team ([AI_PROMPTS.md](AI_PROMPTS.md) #1) interrogates all five thread questions before every gate. No thread has its own meeting.

| # | Thread | On? | Home artifact (what it owns) | The one gate question |
|---|---|---|---|---|
| 1 | **Risk & Kill Criteria** | always | `16_risk_register.md` — if/then/leading-to grammar, ≤10 live rows, L×I (3×3) + S1–S4 scored separately, trigger column, pre-mortem at kickoff, kill criteria per phase, escalation triggers out of the lean lane | "Reviewed this cycle? Top-3 shrinking? Any Kill-level row open?" |
| 2 | **Safety & Hazards** | trigger-gated: physical hardware, mains/battery/motors/heat, or failure-can-hurt-someone | hazard block in `16_risk_register.md` — guidewords lost/erroneous/inadvertent/degraded/late; unsafe state → worst harm → mitigation as REQ → how **proven** → residual accepted by name. Off = one line: `N-A: tailored out — no physical risk` | "Any open hazard without a proven mitigation?" |
| 3 | **Security & Data** | always | §Trust & Threats in `08_architecture.md` — boundaries on the deployment diagram, STRIDE-lite walk, the hygiene floor (secrets out of code, least privilege, HTTPS/auth everywhere, dependency scanning, backups TESTED, default-deny device ports), AI + IoT sub-lists, data-handling note | "Every boundary walked? Hygiene floor 100%? Zero S1 security defects?" |
| 4 | **Versions & Change** | always | [CONVENTIONS.md](CONVENTIONS.md) §Versions + the tracker's what's-deployed table + change notes in `15_decision_log.md` — tag per gate = baseline, semver by breaking/feature/fix, **the release tuple**, CHANGELOG, drift check, "changing the eval set is itself a risky change" | "Can you name every deployed thing's version? Anything frozen changed without a note?" |
| 5 | **Metrics & Money** | always | `07_ship_bar.md` + `13_ops_review.md` — outcome vs product metrics, threshold ≠ target on every tracked number, cost-per-successful-outcome vs the margin floor from day zero, runway cap, metric→SLO handoff at launch | "Any tracked number below threshold? Cost-per-outcome above the floor?" |

Thread 5's mantra rides every gate: *all product metrics green but the outcome unmet = built it right, wrong thing.*

---

## Universal gate rules

At **every** gate, no exceptions:

- **Verdict + date logged in the tracker.** *An unrecorded gate is a failed gate.*
- **Every pass cites evidence** — interviews, numbers, test results — not vibes.
- **The AI red-team prompt ([AI_PROMPTS.md](AI_PROMPTS.md) #1) runs before the gate.** It IS the review board at n=1: attack the artifacts as a hostile reviewer; refute, don't reassure; cite IDs.
- **Each of the five threads answers its one question.**
- A gate is never "passed" while a checklist item is unmet — name the item and the consequence.
- Skips recorded as `tailored out: <reason>` — never silent.

**The RE-BASELINE rule (available G2→G5).** Frozen artifacts — the ship-bar, the spec, the interfaces — change only via a logged change note (the 5-question impact check in `15_decision_log.md`) + a version bump + a re-run of the affected checks. Re-baseline is the *sanctioned* pivot, never a quiet edit. Bars may be raised later, never quietly lowered.

---

## If you only do four things

The 20% of this playbook that prevents 80% of product failures:

1. **Interview 5 real users and run the Opportunity Gate before building** (P1 → G1). Most doomed products die of "nobody wanted it" — diagnosable in a week, for free.
2. **Freeze the ship-bar, the spec, and the interfaces before you build** (P2 → G2). One metric, one threshold, one test set, one named schema per seam. It converts "are we done?" from a mood into a measurement.
3. **Verify against the unchanged bar and validate with strangers before launch** (P3 → G3). The two cheapest sources of pre-launch truth — and neither may impersonate the other.
4. **Stage the launch behind a tested rollback, and review at T+30** (P4–P5). Reversibility turns launch mistakes from disasters into Tuesdays; the review turns them into learning.

---

## The AI quick-reference

Every AI-specific practice in this playbook, on one card. (AI product = any product where a model's output reaches users or decisions.)

| # | Check | Phase |
|---|---|---|
| 1 | Problem stated AI-free; 2–3 non-AI alternatives seriously considered | P0–1 |
| 2 | Error analysis on 30–100 **real** examples; failures named and counted | P1 |
| 3 | Zero-shot baseline number recorded as the bar-to-beat before any data/tuning spend | P1 |
| 4 | Local-LLM: latency / RAM / tokens-per-second measured on the target hardware; weights license checked | P1 |
| 5 | Data obtainable lawfully; provenance + consent basis known; no PII to vendors that train on it | P1–2 |
| 6 | Cost-per-successful-outcome modeled (pilot/target/10×) against a margin floor | P1–2 |
| 7 | Ship-bar frozen pre-build: metric · threshold · eval-set version · judge method | P2 |
| 8 | Golden set versioned & held out; grown continuously from production | P2, 5 |
| 9 | Model chosen as swappable config: cheapest that clears the bar, plus a fallback; hosted→local is a bar + TCO decision, not ideology | P2 |
| 10 | Prompt spec versioned like code | P2–3 |
| 11 | Variance budget in acceptance criteria ("≥X% of cases"), never determinism | P2 |
| 12 | Oversight per action: augment → suggest → act; autonomy earned with eval evidence; stop/override/undo works | P2–3 |
| 13 | Failure UX: what happened · why · what next, plus a visible human fallback | P2 |
| 14 | Injection treated as unsolvable at the model layer: least-privilege tools, untrusted retrieved content, no secrets in prompts, output validated before dangerous sinks | P2–3 |
| 15 | Red-team lite before ship; every exploit becomes an eval case | P3 |
| 16 | Eval re-run on **every** model/prompt/pipeline change (CI if possible) | P3, 5 |
| 17 | Agents: action + spend caps, approval for irreversible actions, reliability = pass^k | P3 |
| 18 | Launch ramp quality-gated with auto-halt triggers (quality, cost-burn, PII = instant rollback) | P4 |
| 19 | Users know it's AI; AI content labeled; transparency duties checked for your jurisdictions (*verify current*) | P4 |
| 20 | Three drift signals owned (input mix, quality, cost); incident → postmortem → eval case → re-run — the loop that stops repeat failures | P5 |

## The hardware quick-reference

Every hardware-specific practice, mirroring the AI card row for row in spirit. (Hardware product = anything with a board, a battery, a sensor, or an enclosure.)

| # | Check | Phase |
|---|---|---|
| 1 | Problem stated hardware-free; the mission line names an outcome, not a board | P0–1 |
| 2 | Breadboard/dev-kit spike on real signals; failures named and counted | P1 |
| 3 | Measured numbers on the real board recorded as the baseline before any custom design spend | P1 |
| 4 | Deployment reality written: power source, indoor/outdoor, connectivity | P0–1 |
| 5 | Supplier check: lead times, single-source flags, EOL status — an EOL single-source part is a G1 hard-fail | P1 |
| 6 | BOM costed at qty 1/10/100 against price; BOM + assembly + shipping vs margin floor from day zero | P1–2 |
| 7 | Ship-bar has environmental/duty rows — temp range, battery ≥ N h, soak uptime, sensor ±x, IP rating — each with a T/I/A/D method | P2 |
| 8 | Power budget table: worst-case draw vs supply, per rail | P2 |
| 9 | Cert triggers scanned before building: radio → FCC/CE, mains/battery → safety marks, battery shipping rules (*verify current*) | P1–2 |
| 10 | Firmware versioned like code; every release tag pins firmware semver + hardware rev | P2–3 |
| 11 | Interface table covers physical seams too: connectors, pinouts, bus contracts, voltage levels | P2 |
| 12 | Actuation rides the oversight ladder: interlocks are the stop/override; hazards → REQ-SAF → proving test → residual accepted by name | P2–3 |
| 13 | Failure modes designed: watchdog recovery, offline buffering, degraded mode — a device fails in the field, not on your desk | P2 |
| 14 | Firmware-update path decided in the spec; no OTA/USB path = a named risk (an unpatchable fleet) | P2 |
| 15 | Bench rig on the desk at increment 1, not launch week; datasheet claims tested before designed around | P3 |
| 16 | Soak test re-run on every firmware/hardware change: n units, days, real environment; boot-order + shared-bus deps checked | P3, 5 |
| 17 | FAT/SAT: bench-test each assembled unit before it ships; re-check at the install site after install | P3–4 |
| 18 | Device ladder ramp: bench → own site → friendly pilot (1–5 units) → batch; OTA signed, **canary-of-one**, tested un-brick path — a device you can't un-brick doesn't ship | P4 |
| 19 | Device guardrails wired: watchdog reboot counts, over-temp shutdown, offline > N h alert | P4–5 |
| 20 | Fleet drift owned (firmware spread, sensor drift, battery degradation, RMA rows); disposal = destroy the key, wipe media, e-waste properly, batteries never in the bin | P5–6 |

---

*Templates for every artifact live in [`templates/`](templates/). Start any new product by copying [`templates/00_tracker.md`](templates/00_tracker.md) and opening P0.*
