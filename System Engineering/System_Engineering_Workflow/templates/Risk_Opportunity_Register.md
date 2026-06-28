---
Document: Risk & Opportunity Register — <PROJECT NAME>
Document ID: ROR-<PROJECT_SLUG>-v0.1
Standard: ISO 31000:2018
Status: Draft
Owner: <Risk Lead / role>
---

# Risk & Opportunity Register

> Living register of uncertainties — downside (`RSK-*`) and upside (`OPP-*`) — identified, scored `Likelihood × Impact`, owned, tracked, and **reviewed at every gate** (ATP→DRR). It is never "done." This is **one** register for the whole project — not a copy per phase. Because it is living, its `Status` stays `Draft`/`In Review` and is **not** frozen at a gate; only its per-gate *snapshot* is baselined.
>
> Conventions: IDs §2.4 · 5×5 scoring & priority §5.2–5.3 · frontmatter §6 · folder layout §10 (`_cross_cutting/`). Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. How to use this register

- Write each item as a **falsifiable** statement: **"If `<cause>`, then `<event>`, leading to `<effect on which REQ / TPM / MOE / SLO>`."** A bare "the thing might break" is not an entry.
- A **solution is not a risk.** "We need a backup sensor" is a *mitigate* action; the risk is the *event* the sensor guards against.
- `RSK-<nn>` / `OPP-<nn>` — uppercase, zero-padded two digits, **stable for project life**. Never renumber; retire with `(closed)` / `(deprecated)`. A not-yet-assigned response is `RSK-TBD` / `OPP-TBD`, never a blank cell.
- Score `Likelihood (1–5) × Impact (1–5)` → `Score` → `Band`. For opportunities, **Impact = benefit if realized**.
- Every item needs an **owner**, a **trigger/indicator** (what says "act now"), and — if accepted — a **contingency reserve**.
- Set `Last review (gate)` every time the item is reviewed; a stale item at a gate is a *Hold* signal.

---

## 2. Scoring scale & bands (Conventions §5.3)

`Score = L × I`. **Bands: Low 1–4 · Medium 5–9 · High 10–14 · Critical 15–25.**

```
 I=5 │  5   10   15   20   25     Likelihood (1–5): 1 rare · 2 unlikely · 3 possible · 4 likely · 5 near-certain
 I=4 │  4    8   12   16   20     Impact (1–5):     1 negligible · 2 minor · 3 moderate · 4 major · 5 severe
 I=3 │  3    6    9   12   15                       (cost / schedule / performance / safety, worst applicable)
 I=2 │  2    4    6    8   10     Bands:  Low 1–4   Medium 5–9   High 10–14   Critical 15–25
 I=1 │  1    2    3    4    5     Opportunity: same grid; Impact = benefit; band = priority to pursue.
     └────────────────────────
        L=1  L=2  L=3  L=4  L=5
```

**Response strategies** — Risk: Mitigate · Avoid · Transfer · Accept. Opportunity: Enhance · Exploit · Share · Accept.
Critical/High items demand an active strategy and a named owner; Low items may be **Accepted** with a contingency reserve and a watch-trigger (accepting is a recorded *decision*, not silence).

---

## 3. Risk register (`RSK-*`)

| ID | Title / event (if-cause-then-event-leading-to-effect) | Cause → effect | Type | L (1–5) | I (1–5) | Score | Band | Strategy | Response (`RSK-*` actions) | Owner | Trigger / indicator | Status | Last review (gate) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RSK-01 | _(example — delete)_ If `<cause>`, then `<event>`, leading to `<effect on REQ-…/TPM-…>` | `<cause>` → `<effect>` | Risk | `<1–5>` | `<1–5>` | `<L×I>` | `<Low/Med/High/Crit>` | `<Mitigate/Avoid/Transfer/Accept>` | `<action + reserve>` | `<role>` | `<what says act now>` | Open | `<gate>` |
| RSK-02 | `<TODO>` | `<TODO>` | Risk | | | | | | RSK-TBD | `<TODO>` | `<TODO>` | Open | — |
| RSK-`<nn>` | … | | | | | | | | | | | | |

---

## 4. Opportunity register (`OPP-*`)

| ID | Title / event | Source → benefit | Type | L (1–5) | I = benefit (1–5) | Score | Band (priority) | Strategy | Response (`OPP-*` actions) | Owner | Trigger / window | Status | Last review (gate) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| OPP-01 | _(example — delete)_ If `<source>`, then `<upside event>`, enabling `<benefit to objective>` | `<source>` → `<benefit>` | Opportunity | `<1–5>` | `<1–5>` | `<L×I>` | `<Low/Med/High/Crit>` | `<Enhance/Exploit/Share/Accept>` | `<action>` | `<role>` | `<closing window>` | Open | `<gate>` |
| OPP-`<nn>` | `<TODO>` | `<TODO>` | Opportunity | | | | | | OPP-TBD | `<TODO>` | `<TODO>` | Open | — |

---

## 5. Risk burndown (per-gate snapshot)

> Track **count and total score by band over time**. Healthy projects see Critical/High exposure fall left-to-right down the V; exposure that **rises** approaching a gate is itself a *Hold* / *Re-baseline* signal. Opportunities track an *up*-and-to-the-right realized-benefit line.

| Gate | Date | Critical (#) | High (#) | Medium (#) | Low (#) | Total open score | Δ vs last gate | Notes |
|---|---|---|---|---|---|---|---|---|
| ATP | `<YYYY-MM-DD>` | `<n>` | `<n>` | `<n>` | `<n>` | `<Σ>` | — | _(example — delete)_ |
| MCR | | | | | | | | |
| SRR | | | | | | | | |
| PDR | | | | | | | | `<critical open count gates PDR>` |
| CDR | | | | | | | | |
| TRR | | | | | | | | |
| PRR | | | | | | | | `<zero critical open required>` |
| ORR / GA | | | | | | | | |
| DRR | | | | | | | | `<register close-out>` |

---

## 6. Top-N at this gate

| Rank | ID | Score / Band | Owner | Next action | Trigger | Drives gate outcome? |
|---|---|---|---|---|---|---|
| 1 | `<RSK-nn>` | `<n / Band>` | `<role>` | `<TODO>` | `<TODO>` | `<Proceed / Hold / …>` |
| 2 | `<TODO>` | | | | | |
| 3 | `<TODO>` | | | | | |
| 4 | `<TODO>` | | | | | |
| 5 | `<TODO>` | | | | | |

---

## 7. Linkage check (cross-thread)

> A `HAZ-*`, `THR-*`, slipping `TPM`, or failed `MOP` should each prompt "is there a `RSK-*` for this?" Record the links so the risk thread and the other threads agree.

| This register item | Linked artifact | Relationship |
|---|---|---|
| `<RSK-nn>` | `<HAZ-nn / THR-nn / TPM-nn / MOE-nn / MOP-nn / SLO-nn / CR-nn>` | `<threatens / derived-from / re-scored-by>` |
| `<TODO>` | `<TODO>` | `<TODO>` |

---

## 8. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<what changed; cite CR-nn if a baselined snapshot was altered>`
- `TODO:` `<seed this register at ATP from the agreement; first full identification pass at MCR>`

---

### References
- `05_Conventions.md` — §2.4 (RSK/OPP grammar), §3 (gates & baselines), §5.2–5.3 (priority & 5×5 scoring), §6 (frontmatter), §10 (register location).
- `cross-cutting/Risk_and_Opportunity_Management.md` — owning thread (CRM loop, strategies, burndown, gate questions).
- Sibling threads (shared identification sources): `Safety_RAMS_Engineering.md` (`HAZ-*`), `Security_Engineering.md` (`THR-*`), `Measurement_MOE_MOP_TPM.md`, `Configuration_Management.md` (`CR-*`).
- Standards: **ISO 31000:2018**, **ISO/IEC/IEEE 15288:2023**, **INCOSE SE Handbook v5 (2023)**, **NASA/SP-2016-6105 Rev 2**, FMEA/FTA, ISO/IEC/IEEE 31010.
