---
Document: Usability Test Plan — <SOLUTION / FLOW NAME>
Document ID: UTP-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <role/name — default: Product Manager>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 07 · Solution Discovery & Design (skill: pm-phase-07-solution-design).
Usability testing is a G5 item — "it's obvious how to use it" is the anti-pattern. Tasks must be
REALISTIC and NON-LEADING; bake in the accessibility floor (WCAG 2.2 AA), don't bolt it on.
Conforms to ../05_Conventions.md: IDs §3, traceability spine §4, frontmatter §6. Metrics: HEART
(Google — task Success, Time-on-task, Errors; plus SUS). ~5 users is fine for qualitative
iteration, NOT for quantitative claims.
Replace every <ANGLE_BRACKET>; leave unknowns as `TODO:`. Delete example rows before sharing.
Related: Assumption_Map.md (the usability ASM-* this tests) · Prototype_Plan.md · Solution_Validation.md.
-->

## 1. Objective & research questions

- **Solution / prototype:** `SOL-<nn>` via `Prototype_Plan.md` (`PROTO-<PRODUCT_SLUG>`)
- **Usability assumption(s) tested:** `ASM-<nn>` (Usability), `EXP-<nn>` <!-- from Assumption_Map.md -->
- **Outcome at stake:** `OBJ-<nn>`/`KR-<nn>` → `MET-<nn>`
- **Research questions** (open, not yes/no):
  - RQ1: TODO: <where do users get stuck / how do they interpret X?>
  - RQ2: TODO: <…>

## 2. Participants & recruit

| Field | Value |
|-------|-------|
| Target segment / persona | `PER-<nn>` — <one line> |
| Sample size | <~5 per round; iterate> <!-- qualitative; don't over-claim from small n --> |
| Screener criteria | TODO: <must-have behaviors/context> |
| Exclusions | TODO: <e.g. employees, prior testers> |
| Accessibility recruit | <include ≥1 participant using assistive tech (screen reader / keyboard-only)> |
| Incentive | <amount/voucher> |
| Recruit owner · by | <name> · <YYYY-MM-DD> |

## 3. Method & setup

- **Type:** <moderated remote / in-person / unmoderated (Maze/Sprig)>
- **Environment:** <device, browser, assistive tech>
- **Recording/consent:** <recorded? consent captured — privacy-by-design, GDPR>
- **Roles:** facilitator <name> · note-taker <name> · observer(s) <name>
- **Think-aloud:** ask participants to narrate thoughts <!-- "tell me what you're thinking" — not "do you like it?" -->

## 4. Tasks & success criteria (HEART task-success / time)

<!-- Write tasks as a REALISTIC scenario + goal, then let the user find the path. Give success
criteria as Given/When/Then. Capture success unaided vs. aided. Set thresholds BEFORE testing. -->

### Task 1 — <short name>
- **Scenario (context):** "TODO: <realistic situation putting the user in their own shoes>"
- **Prompt (the goal, non-leading):** "TODO: <what they need to accomplish — never name the button>"
- **Success criterion:**
  - **Given** <starting state> **When** <user completes the goal their own way> **Then** <observable success state reached>
- **Measures:** completion (unaided / aided / fail) · time-on-task <≤ Xs> · errors <≤ N> · ease rating (1–5)
- **Pass/fail threshold:** <≥ 4/5 complete unaided in ≤ Xs>

### Task 2 — <short name>
<!-- copy the block above -->

## 5. Non-leading facilitation rules (read before every session)

<!-- The fastest way to invalidate a usability test is to lead the witness. -->
- Ask **open** questions: "What would you do next?" — never "Would you click the blue button?"
- Use the user's **own words**; don't introduce product/feature terms they haven't used.
- **No hints** until a task is abandoned; if helping, log it as *aided*.
- Don't **defend or explain** the design; silence is a tool — let them struggle and observe.
- Don't ask **leading/loaded** questions ("How easy was that?" → "How did that feel?").
- Test the **prototype, not the participant** — reassure "there are no wrong answers."
- Capture **behavior and verbatim quotes**, not your interpretation; interpret in synthesis.

## 6. Accessibility checks (WCAG 2.2 AA floor — verify current)

<!-- POUR: Perceivable, Operable, Understandable, Robust. EN 301 549 / EU Accessibility Act
(in force June 2025). Confirm the current WCAG target before locking — label "verify current". -->

- [ ] **Keyboard-only:** every task completable without a mouse; visible focus order logical.
- [ ] **Screen reader:** labels, roles, alt text, and live-region announcements present.
- [ ] **Color contrast:** text ≥ 4.5:1 (≥ 3:1 large); info not conveyed by color alone.
- [ ] **Target size & spacing:** interactive targets meet WCAG 2.2 minimums.
- [ ] **Content:** plain language; errors clearly identified with guidance.
- New accessibility gaps → log as `RSK-<nn>` (severity §5.3) in `_threads/Risk_Register.md`.

## 7. Logistics

| Session | Date/time | Participant | Facilitator | Link/location |
|---------|-----------|-------------|-------------|---------------|
| 1 | <YYYY-MM-DD HH:MM> | <P1 — PER-<nn>> | <name> | <…> |

## 8. Analysis & output

- Synthesize findings into `INS-<nn>` (link back to the `ASM-<nn>` each confirms/disconfirms).
- Severity-rate usability issues (§5.1, S1–S4); decide fix-now vs. backlog.
- Roll results into `Solution_Validation.md` (`VAL-<PRODUCT_SLUG>`) → **G5**.
- *(If sessions produce more notes than you can read, delegate synthesis to a research agent — then verify themes against raw quotes; guard against synthetic confidence.)*

## 9. Open items / TODO

- TODO: <unresolved recruit/setup question — who — by when>

---
*Owning skill: **pm-phase-07-solution-design**. Tests the usability `ASM-*` from `Assumption_Map.md` on the `Prototype_Plan.md` build; feeds `Solution_Validation.md`. Cross-cutting: Continuous Discovery, Responsible Product (accessibility floor).*
