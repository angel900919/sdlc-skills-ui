# Lean Spec — <Product Name>

> **Phase 2 · gate-critical for G2 Design Freeze.** The one big file: strategy front matter + Lean PRD + requirements. Budget: 1–2 days. Core §§0–7 readable in **15 minutes**; each appendix ≤40 lines and wholly deletable. Spec *what* and *how well* — never *which vendor/library* (the stack lives in [`08_architecture.md`](08_architecture.md)). Exists to prevent: building from a spec that lives only in your head. Delete sections that don't apply — one line in `00_tracker.md`'s tailoring log. After G2 this file is FROZEN: changes go through a change note in [`15_decision_log.md`](15_decision_log.md), never a quiet edit.

| Owner | Date | Status |
|---|---|---|
| | | Draft / FROZEN (G2, <date>) / Superseded (via change note DEC-<nn>) |

## 0. Strategy front matter (where scope-creep comes to die)

**Vision (Moore template — should survive being on a billboard):**
**For** <target customer> **who** <need>, **<product>** is a <category> **that** <key benefit>. **Unlike** <primary alternative>, it <main differentiator>.

**Business model (five lines):**
| | |
|---|---|
| Who pays | |
| For what value | |
| How much (pricing hypothesis) | <≤ perceived value, ≥ long-run unit cost; AI per-use costs → prefer usage/outcome-linked over flat seats> |
| Channel (1–2 max) | |
| Main costs | <incl. per-use model cost. **[HW]** unit margin: price − landed BOM − assembly ≥ floor from [`04_hw_feasibility.md`](04_hw_feasibility.md)> |

**Out of scope (the longest list wins — every "no" here saves a week later):**
- Won't: <segment / feature / platform / market>
- Won't: <…>
- Won't: <…>

**Announcement paragraph (clarity test):** <3–4 sentences of the future launch post: what it is, who it's for, why they care. Hard to write = the strategy isn't clear yet — stop and fix that first.>

## 1. Problem & users

- **Problem:** <one paragraph, from the charter — link evidence rows in [`02_validation_log.md`](02_validation_log.md)>
- **Target user:** <the one persona that matters, grounded in interviews>
- **Today they:** <current alternative and its cost — including "do nothing">

## 2. Scenarios recap & modes

> Scenarios were born in `02_validation_log.md` (SCN-nn) and signed off at G1. Recap here, don't re-own. Missing an off-nominal or maintenance scenario? Go back to 02 — don't invent one here.

| SCN | One-line recap | Type |
|---|---|---|
| SCN-<nn> | <actor + trigger + outcome> | nominal / off-nominal / maintenance |
| SCN-<nn> | | |

**Modes table** — devices AND agents get one (an agent loop has modes too). Plain CRUD app? Delete, with a tailoring-log line.

| Mode | Device reading | Agent reading |
|---|---|---|
| Off | powered down | not running |
| Boot | power-on self-check | load config, health-check model/tools |
| Idle | waiting, low power | awaiting input or human approval |
| Active | doing the job | executing |
| Degraded | partial function (sensor lost, offline buffer) | fallback model, reduced autonomy |
| Fault | safe stop, needs intervention | halted, awaiting human |

Never invent a transition: every mode change traces to an SCN-nn. The full state machine lives in `08_architecture.md` §5.

## 3. Scope (MoSCoW — the Won't column is the contract)

| Must (MVP) | Should (fast-follow) | Could | **Won't (this version)** |
|---|---|---|---|
| | | | |
| | | | |

## 4. Flows — happy path AND failure states

> First moment = the user's problem, not your login. Then, for every step: what does the user (or device, or agent) see when it FAILS?

1. <step> — on failure: <what they see / what it does / how they recover>
2. <step> — on failure: <…>

## 5. THE REQUIREMENTS TABLE

Classes: **F** functional · **P** performance · **O** operational/reliability (offline, uptime, retention) · **SEC** security · **INT** interface · **C** constraint (+ **SAF** only when the hazard trigger fires).
Methods: **T** run & measure · **I** read/examine · **A** compute/simulate (LLM eval-suite aggregates live here) · **D** use & watch. Acceptance/beta is VALIDATION — never a verification method.

| ID | Shall-statement | Parent SN | Priority | Method | Verified-by |
|---|---|---|---|---|---|
| REQ-<class>-<nn> | The <subject> shall <action> <measurable threshold> <under defined conditions>. | SN-<nn> | Must/Should/Could | T/I/A/D | <test path / named checklist / named analysis / demo script> |
| REQ-F-01 | _The device shall upload buffered readings within 60 s of connectivity returning. (example — delete)_ | _SN-02_ | _Must_ | _T_ | _`tests/test_sync.py::test_backlog_upload`_ |
| REQ-P-01 | _The system shall answer p95 < 3 s at 20 concurrent users. (example — delete)_ | _SN-01_ | _Must_ | _T_ | _`tests/load/test_p95.py`_ |

Verified-by is named at birth: for T the test path IS the ID; I → a named checklist; A → a named analysis/eval suite; D → a named demo script under `evidence/`, listed in the `10_verification_matrix.md` §1 row. No name = no requirement.

> **The SMART box.** 29148 template: *"The `<subject>` shall `<action>` `<measurable threshold>` `<under defined conditions>`."*
> One observable behaviour per row — split every "…and…". **Banned words:** fast, robust, intuitive, secure, seamless, support, handle — replace each with a number and a condition. Missing a number? `TODO: <owed, by whom, by when>` — never invent one.

**Implicit-requirements hunt (run before calling §5 done — users never volunteer these):**
- What must work offline? What happens at power loss / provider outage / timeout mid-operation?
- What must it interoperate with? Which latency/capacity/retention numbers actually matter?
- What regulation or platform policy touches this domain? What are you assuming without stating? (→ §10)

**Two-way orphan check (grep-able; both must be zero at G2):**
- [ ] Zero orphan REQs — every REQ cites a parent SN in `02_validation_log.md`.
- [ ] Zero uncovered SNs — every SN has ≥1 covering REQ (or a recorded reason it won't get one).

## 6. Ship-bar

See **[`07_ship_bar.md`](07_ship_bar.md) §3 — frozen at G2.** That file is the acceptance contract and the source of truth for "done". This spec points at it and never contradicts it.

## 7. Top risks

Top 3 by severity: RSK-<nn>, RSK-<nn>, RSK-<nn> — full register in [`16_risk_register.md`](16_risk_register.md). An S1 with no affordable mitigation is a KILL conversation, not a spec row.

---

## 8. [AI] Appendix — AI products only

> Where AI products earn production-readiness. No AI? Delete A1–A7 and log `tailored out: no AI` in the tracker.

### A1. Model as config
- **Primary / fallback:** <cheapest that clears the bar, from [`03_ai_feasibility.md`](03_ai_feasibility.md) §7 · fallback path when it's down or degraded>
- **Swappable:** model name lives in config; no vendor-specific logic in product code.

### A2. Prompt spec (versioned like code — part of the release tuple)
- **Role & tone:** <…> · **Defaults** (SHOULD, user-overridable): <…>
- **Hard rules** (MUST/MUST-NOT, ≤10 — each maps to a golden-set case or it isn't enforced): <1. …>
- **Refusals** (decline · honest reason · alternative) & **escalation triggers** (hand to human when): <…>
- **Chain of command:** system > developer > user > retrieved/tool content (data, never instructions).
- **Never in the prompt:** secrets, keys, PII — assume the prompt leaks.

### A3. Variance budget (outputs are probabilistic even at temperature 0 — never "always")
- <e.g. valid format ≥99%; grounded-in-context ≥95%; graceful degradation otherwise>

### A4. Oversight ladder (augment → suggest → act)
| Action the AI takes | Stakes / reversible? | Autonomy (v1) | Stop / override / undo |
|---|---|---|---|
| e.g. drafts reply | low / yes | **suggest** — human sends | edit or discard |
| e.g. sends / deletes / pays | high / no | **approve-each** — autonomy only with eval evidence later | confirm dialog + undo window |

### A5. Failure UX
- Three parts, always: what happened · why (honestly) · what to do next. Human/manual fallback visible in-product; user knows it's AI; AI content labeled where it could mislead; confidence display none unless calibrated.

### A6. Safety requirements — testable REQ-SEC rows in §5, not vibes
- Untrusted data: retrieved/user/tool content is data, never instructions (injection isn't solved by a stronger prompt).
- Least-privilege tool access; agents get action caps + spend caps + approval on irreversible actions.
- Output validated before dangerous sinks (SQL, shell, send, pay) · PII out of logs and training vendors · RAG respects document permissions.

### A7. Cost at three scales (from `03_ai_feasibility.md` §5 — the 10× column kills projects)
| | Pilot | Target | 10× |
|---|---|---|---|
| Cost per successful outcome | | | |
| Margin per outcome | | | |

Levers on by default: prompt caching · capped output/reasoning tokens · trimmed context · batching where async.

## 9. [HW] Appendix — hardware products only

> Where hardware products earn buildability. No hardware? Delete H1–H6 and log `tailored out: no hardware` in the tracker.

### H1. BOM sketch (full costing in `04_hw_feasibility.md`)
| Part | Qty | Cost @1 / @10 / @100 | Lead time (verify current) | Single-source? | EOL risk? |
|---|---|---|---|---|---|
| <MCU/SBC, sensors, PSU, enclosure> | | | | Y/N | Y/N |

Any single-source or long-lead part → a RSK row in `16_risk_register.md`.

### H2. Power budget
| Component | Active (mA) | Sleep (mA) | Duty % | Avg (mA) |
|---|---|---|---|---|
| | | | | |

**Battery life = capacity ÷ total avg draw:** <hours — must clear the bar in `07_ship_bar.md`>

### H3. Environmental constraints
- Operating temp: <range> · Ingress: <IP rating, or "indoor only"> · Vibration/shock: <…> · RF environment: <…>

### H4. Enclosure & mounting
- <material, mounting, cable entry, serviceability — can future-you open it without breaking it?>

### H5. Firmware-update path (decide NOW, not at launch)
- How a fielded unit gets new firmware: <signed OTA / USB / SD swap>. Un-brick path: <…>
- **No OTA or USB path = a named risk row** (RSK-<nn>: unpatchable fleet) in `16_risk_register.md`.

### H6. Cert flags (a 30-minute check that saves months — verify current)
- <FCC/CE/RED for radios · UN38.3 battery shipping · RoHS/WEEE · UL/mains if plugged in> → each hit becomes a REQ-C row in §5.

## 10. Assumptions & dependencies

| ID | Assumption / dependency | Type | Impact if false |
|---|---|---|---|
| ASM-<nn> | <vendor API pricing/limits, "model X runs on a Pi 5 8GB", app-store approval, part availability> | vendor / infra / cert / part | <what breaks> |

---

**G2 self-check (spec slice — the bar and interfaces have their own, in `07_ship_bar.md` and `08_architecture.md`):**
- [ ] Every REQ passes SMART; zero banned words; one behaviour per row.
- [ ] Every REQ has a parent SN, a priority, a T/I/A/D method, and a NAMED verified-by.
- [ ] Both orphan checks zero; implicit-requirements hunt ran.
- [ ] §2 recaps ≥1 off-nominal + ≥1 maintenance SCN; modes table filled or tailored out.
- [ ] Appendices filled, or deleted with a tailoring-log line.
- [ ] Red-team ([`../AI_PROMPTS.md`](../AI_PROMPTS.md) #1) ran; conflicts and trade-offs recorded in `15_decision_log.md`.
