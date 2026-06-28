---
Document: <Project> COCOMO Effort Estimate
Document ID: COCOMO-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (System Analysis); Boehm, Software Engineering Economics (1981)
Status: Draft
Owner: <Lead Systems Engineer>
---

<!--
HOW TO USE THIS TEMPLATE
- This is the OPTIONAL Phase 05 software effort/schedule estimate (Boehm's COCOMO, Basic + Intermediate).
- RUN IT WHEN: software ≥ ~10 KLOC (Basic + Intermediate). SKIP for hardware-only (record the reason).
  For hybrid, COCOMO the SOFTWARE scope only.
- CRITICAL: RECOMPUTE every number from the constants below. NEVER copy a value out of the worked
  example or any other project. The three formulas are:
      E = a · KLOC^b        (effort, person-months)
      T = c · E^d           (schedule, calendar months)
      N = E / T             (average staff, engineers)
  After computing, BACK-CHECK that your printed E, T, N satisfy T = c·E^d and N = E/T — the most common
  error is a garbled T or N that doesn't satisfy its own formula.
- Pick the project type by the KLOC band (not by guess). Constants are listed per type below.
- All IDs and citations come from ../05_Conventions.md — cite, do not redefine.
-->

# <Project> — COCOMO Effort Estimate

> Run condition: <software ≥ ~10 KLOC → run Basic + Intermediate> / <hardware-dominated → "Skipped: <reason>" and delete the rest>.

## 1. Assumptions & size basis

- **Sizing method:** <SLOC count method — e.g. new code only, generated/reused code excluded or counted with adjustment>.
- **What is excluded:** <reused libraries / vendor SDKs / generated code — state how reuse is handled>.
- **Estimation horizon:** <v1 scope / full scope>.
- **Constants source:** Boehm Basic/Intermediate COCOMO (1981) — see the constants tables below. TODO: prefer org historical actuals over Boehm's generic bands if available.

## 2. Per-module size breakdown (KLOC)

> Break the size out per module and assign a project type by KLOC band. Sum to total.

| Module | KLOC | Project type (by band) | Rationale |
|---|---|---|---|
| `<module 1>` | <X> | <Organic / Semi-Detached / Embedded> | <why this type> |
| `<module 2>` | <X> | <…> | <…> |
| Edge controller (example — delete) | 40 | Embedded | Real-time, hardware-coupled, safety-relevant |
| **Total** | **<ΣKLOC>** | — | — |

**Project-type KLOC bands (pick the type from the size, not by guess):**

| Project type | KLOC band | Character |
|---|---|---|
| Organic | 2–50 | Small team, familiar, well-understood problem |
| Semi-Detached | 50–300 | Mixed experience, mixed rigidity of requirements |
| Embedded | 300+ (or tight HW/real-time/safety constraints) | Tightly constrained, hardware-coupled, safety-critical |

## 3. Basic COCOMO

> **Formulas (compute — do not copy):**
> `E = a · KLOC^b`  (person-months) · `T = c · E^d`  (months) · `N = E / T`  (engineers)

**Basic constants (KB-verified):**

| Project type | a | b | c | d |
|---|---|---|---|---|
| Organic | 2.4 | 1.05 | 2.5 | 0.38 |
| Semi-Detached | 3.0 | 1.12 | 2.5 | 0.35 |
| Embedded | 3.6 | 1.20 | 2.5 | 0.32 |

**Your computation** (one row per type present in §2; fill from YOUR KLOC):

| Type | KLOC | a | b | c | d | E = a·KLOC^b | T = c·E^d | N = E/T |
|---|---|---|---|---|---|---|---|---|
| <Organic> | <X> | 2.4 | 1.05 | 2.5 | 0.38 | <compute> | <compute> | <compute> |
| <Semi-Detached> | <X> | 3.0 | 1.12 | 2.5 | 0.35 | <compute> | <compute> | <compute> |
| <Embedded> | <X> | 3.6 | 1.20 | 2.5 | 0.32 | <compute> | <compute> | <compute> |

**Aggregate:**
- Total effort (sum of E): **<Σ E> person-months**
- Critical-path duration (the **largest** T, not the sum): **<max T> months** — driven by the **<type>** branch.
- Team if fully parallel (Σ E ÷ critical-path T): **≈ <N> engineers**

> Back-check: for each row confirm `T = c·E^d` and `N = E/T` hold. If a printed number doesn't satisfy its formula, it is wrong — recompute.

## 4. Intermediate COCOMO (Effort Adjustment Factor)

> 15 cost drivers, each rated. **EAF = product of the 15 selected multipliers.** Adjusted effort: `E_int = EAF · a·KLOC^b`. Then recompute `T` and `N` from `E_int`.

**Cost-driver multiplier table (select one rating per driver):**

| Category | Driver | V.Low | Low | Nom | High | V.High | X.High |
|---|---|---|---|---|---|---|---|
| Product | RELY required reliability | 0.75 | 0.88 | 1.00 | 1.15 | 1.40 | — |
| | DATA database size | — | 0.94 | 1.00 | 1.08 | 1.16 | — |
| | CPLX product complexity | 0.70 | 0.85 | 1.00 | 1.15 | 1.30 | 1.65 |
| Hardware | TIME exec-time constraint | — | — | 1.00 | 1.11 | 1.30 | 1.66 |
| | STOR storage constraint | — | — | 1.00 | 1.06 | 1.21 | 1.56 |
| | VIRT VM volatility | — | 0.87 | 1.00 | 1.15 | 1.30 | — |
| | TURN turnaround time | — | 0.87 | 1.00 | 1.07 | 1.15 | — |
| Personnel | ACAP analyst capability | 1.46 | 1.19 | 1.00 | 0.86 | 0.71 | — |
| | AEXP applications exp. | 1.29 | 1.13 | 1.00 | 0.91 | 0.82 | — |
| | PCAP programmer capability | 1.42 | 1.17 | 1.00 | 0.86 | 0.70 | — |
| | VEXP VM experience | 1.21 | 1.10 | 1.00 | 0.90 | — | — |
| | LEXP language experience | 1.14 | 1.07 | 1.00 | 0.95 | — | — |
| Project | MODP modern practices | 1.24 | 1.10 | 1.00 | 0.91 | 0.82 | — |
| | TOOL software tools | 1.24 | 1.10 | 1.00 | 0.91 | 0.83 | — |
| | SCED required schedule | 1.23 | 1.08 | 1.00 | 1.04 | 1.10 | — |

**Your ratings (fill the Rating + Multiplier columns):**

| Driver | Rating | Multiplier |
|---|---|---|
| RELY | <rating> | <value> |
| DATA | <rating> | <value> |
| CPLX | <rating> | <value> |
| TIME | <rating> | <value> |
| STOR | <rating> | <value> |
| VIRT | <rating> | <value> |
| TURN | <rating> | <value> |
| ACAP | <rating> | <value> |
| AEXP | <rating> | <value> |
| PCAP | <rating> | <value> |
| VEXP | <rating> | <value> |
| LEXP | <rating> | <value> |
| MODP | <rating> | <value> |
| TOOL | <rating> | <value> |
| SCED | <rating> | <value> |
| **EAF (product of all 15)** | — | **<compute>** |

> Do not assume the EAF shrinks effort: a Very-High-reliability/complexity system can have EAF > 1.0 even with a strong team. VERIFY the product — multiply all 15, don't guess the direction.

**Adjusted estimate:**
- `E_int = EAF · (a·KLOC^b)` = **<compute> person-months**
- `T_int = c · E_int^d` (driving branch) = **<compute> months**
- Sustained team `N_int = E_int / T_int` = **≈ <compute> engineers**

## 5. Sensitivity (±20% KLOC)

> Size is the dominant uncertainty. Recompute E, T, N at 0.8× and 1.2× the §2 total to bracket the estimate.

| Scenario | KLOC | E (PM) | T (mo) | N (eng) |
|---|---|---|---|---|
| Low (−20%) | <0.8·ΣKLOC> | <compute> | <compute> | <compute> |
| Baseline | <ΣKLOC> | <compute> | <compute> | <compute> |
| High (+20%) | <1.2·ΣKLOC> | <compute> | <compute> | <compute> |

## 6. Team-plan implication & critical path

- **Planned capacity:** <N engineers × M months = P person-months> (from the Project Development Plan).
- **COCOMO estimate vs plan:** <adjusted E_int> PM vs <P> PM → <ratio>× <under/over>.
- **Critical path:** the **<type>** branch (longest T) sets the floor at <T_int> months.
- **Reconciliation levers (if over):** <reuse % reduction, outsource a module, defer scope to v1.1 — show the re-estimate after each lever>. TODO: complete if estimate exceeds plan.

## 7. Modern complements (note in rationale)

- **COCOMO II** — 17 multipliers + 5 scale factors; agile-friendly; prefer for re-estimation if calibration data exists.
- **Story points + velocity** — for Agile tracks; COCOMO used at portfolio level, sprint commitments from velocity.
- **Monte-Carlo schedule simulation** — wrap the point estimate in a probability band rather than a single number.
- Reference: Boehm, *Software Engineering Economics* (1981); Boehm et al., *Software Cost Estimation with COCOMO II* (2000).

---

### Exit-gate self-check (delete once green)

- [ ] Run condition recorded (run for software ≥ ~10 KLOC, else "Skipped: <reason>").
- [ ] Size broken out per module with a project type assigned by KLOC band.
- [ ] Basic E, T, N computed from the constants — each row back-checked against `T=c·E^d` and `N=E/T`.
- [ ] Intermediate EAF = product of all 15 driver multipliers; `E_int = EAF·a·KLOC^b` recomputed.
- [ ] ±20% KLOC sensitivity table filled.
- [ ] No number copied from the worked example — all recomputed for this project.
