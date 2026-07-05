# Verification Matrix & Validation Plan — <Product Name>

> **Phase 3 · feeds G3 Ship-Ready · matrix ~30 min, scripts ~1 h.** Both halves of V&V in one file — it exists to kill "I think it works." §1 proves you **built it right** (every REQ has a method, a named check, evidence). §2–4 prove you **built the right thing** (strangers, real environment, numeric targets set in advance). The hinge rule cuts both ways: **beta never counts as verification coverage; your own clicks never count as validation.** Delete sections that don't apply; log it as `tailored out: <reason>` in the tracker.

## 1. Verification matrix — "did we build it right?"

> **Coverage ≠ correctness.** A gap-free matrix proves the spec is *covered* — not that the spec was right, nor that the tests passed. Necessary, never sufficient.

**Two zero-rules — either non-zero blocks G3:**

- [ ] REQs without a T/I/A/D method: **0**
- [ ] REQs without a named check: **0**

One row per REQ from [06_spec.md](06_spec.md). Every check is *named* — a test path, a checklist, an analysis, a demo script. **Bare "Manual" is invalid**; a manual check names its checklist or it doesn't exist.

| REQ | Method (T/I/A/D) | Check (named) | Evidence |
|---|---|---|---|
| REQ-P-01 *(example — delete)* | T | `tests/test_latency.py::test_p95` | CI job link |
| REQ-SEC-01 *(example — delete)* | I | secrets-scan + config review checklist | `evidence/REQ-SEC-01/result.md` |
| REQ-O-01 *(example — delete)* | A | 30-day uptime-monitor report | dashboard export |
| REQ-F-03 *(example — delete)* | D | onboarding demo script `evidence/demo-onboarding.md` | screen recording |

Coverage rollup: <N> REQs · <N> covered · **0** without method · **0** without check.

**Evidence convention:** CI logs ARE the evidence for automated T rows. For everything else (I / A / D, bench work), one folder per check in `evidence/` with the raw files + a half-page result note: setup · observation · measured value vs threshold · pass/fail · date. **[AI]** golden-set runs land in the eval log of [07_ship_bar.md](07_ship_bar.md) §5 — link the row here. **[HW]** photos of the bench setup and meter readings count — attach them.

## 2. Validation scenario scripts — "did we build the right thing?"

> 5–8 half-page scripts, each traced to an SCN in [02_validation_log.md](02_validation_log.md) §8 (recapped in 06_spec.md §2), written so **a stranger can run one and record the verdict without you in the room.**

Rules:

- **Independence:** no script uses another script's result — Preconditions re-establish ALL state.
- Every step carries an observable **Expected:** line. **Actual** and **Pass/Fail** stay blank until executed.
- **Mandatory:** ≥1 concurrent-actors script (**[AI]** 3 sessions hitting the model at once · **[HW]** 3 sensors/devices firing at once) AND ≥1 mid-operation-failure script (**[AI]** LLM timeout mid-generation · **[HW]** network drop mid-command, power pull mid-write).
- Coverage check before beta: every core journey and every "could hurt someone / lose data" behaviour has a script.

### Script <n> — <scenario name> (validates SCN-<nn>)

| Who runs it | Preconditions (re-establish all state) |
|---|---|
| <role — not the author> | <account, data, device, environment> |

| # | Step | Expected: | Actual | Pass/Fail |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

Final expected outcome: <one sentence, naming the SN/REQ it validates>

*(copy this block per script)*

## 3. Numeric beta targets — set BEFORE the beta

> Written and dated before the first stranger touches the product. Deciding afterwards what counts as success is how founders lie to themselves. "Users seemed happy" is not a target.

| Target | Threshold | Measured | Verdict |
|---|---|---|---|
| ≥ <x> % complete <job> unaided in ≤ <t> *(example — delete)* | | | |
| ≥ <n> of <m> users return in week 2 *(example — delete)* | | | |
| Zero S1 defects open at beta end | 0 | | |

Targets set: <date> · Beta starts: <date>

## 4. Lean acceptance menu (pick what applies)

| Type | Lean form |
|---|---|
| **User test** | 5–10 real target users do their real task while you watch/log — say nothing, write everything. |
| **Ops dry-run** | You, on call for your own product: can you see the error, get the alert, and recover using [12_runbook.md](12_runbook.md)? |
| **[HW] FAT** | Bench-test the assembled unit BEFORE it ships. |
| **[HW] SAT** | Re-test AFTER install on site — the install environment kills units that passed the bench. Factory first, then Site. |
| **Pilot with telemetry** | Limited real cohort, real environment, instrumented. A staging-cloud run is integration, not validation. |

G3 reads this file as two named blocks: **VERIFIED** = §1 zero-rules pass + eval vs the *unchanged* bar in [07_ship_bar.md](07_ship_bar.md). **VALIDATED** = §2 scripts executed by strangers + §3 targets met.
