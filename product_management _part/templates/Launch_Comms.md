---
Document: Launch Comms — <PRODUCT_NAME>
Document ID: COMMS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: PMM / Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 11 · Launch Comms (internal-before-external). Owning skill: pm-phase-11-launch-gtm.
Companions: Launch_Plan.md (master + go/no-go) · GTM_Plan.md (positioning/messaging source) · Rollout_Plan.md (rings).
Conforms to ../05_Conventions.md (§3 IDs STK-*/MET-*, §6 frontmatter, §7 outcomes-over-outputs).
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
HARD RULE — internal-before-external: every external asset is GATED on its internal prerequisite (Sales/Support/Success briefed FIRST).
Sales/CS learning of a launch from customers is the anti-pattern this file exists to prevent. All messaging reuses GTM_Plan.md positioning — lead with "why now" + value, not "what's new".
-->

# Launch Comms — <PRODUCT_NAME>

## Sequencing rule (internal → external)
<!-- No external asset ships until its internal prerequisite is done. Phase gates, not a single blast. -->
**Internal enablement complete → external comms go live.** External T-0 = `Launch_Plan.md` GA date. Tier (from `Launch_Plan.md`) sets which external channels apply (Tier 3 = release notes only).

## Phase 1 — Internal (BEFORE any external comms)
<!-- Brief & enable the teams who carry the launch. Each row is gated "ready" before Phase 2 opens. -->
| Audience (STK-?) | Asset / message | Channel | Owner | Send by (≤ T-0) | Ready? |
|---|---|---|---|---|---|
| Sales | battlecard + pitch + pricing (← GTM_Plan) | <enablement call / deck> | <PMM> | <YYYY-MM-DD> | <…> |
| Support | FAQ + troubleshooting runbook | <wiki / training> | <Support lead> | <YYYY-MM-DD> | <…> |
| Customer Success | onboarding / expansion playbook | <CS sync> | <CS lead> | <YYYY-MM-DD> | <…> |
| Exec / leadership | BLUF + the outcome (MET) it moves | <brief / demo> | <PM> | <YYYY-MM-DD> | <…> |
| Whole company | launch announcement + where to point customers | <all-hands / Slack> | <PMM> | <YYYY-MM-DD> | <…> |

- **Gate to Phase 2:** all rows above `Ready = Y` AND G9 passed (`Launch_Plan.md`). <!-- a working demo beats a launch deck for internal buy-in -->

## Phase 2 — External (AFTER internal is ready)
<!-- Lead with "why now" + customer value. Truthful, non-deceptive claims only (Responsible Product floor). -->
| Asset | Audience | Channel | Owner | Go-live (≥ internal done) | Internal prereq |
|---|---|---|---|---|---|
| Release notes / changelog | all users | in-product / docs | <PMM> | <YYYY-MM-DD> | Support FAQ live |
| In-app announcement | active users | in-app / banner | <PM> | <YYYY-MM-DD> | Support + CS ready |
| Blog post | market | website | <PMM> | <YYYY-MM-DD> | Sales briefed |
| Email / lifecycle | <segment> | email | <Lifecycle> | <YYYY-MM-DD> | CS playbook ready |
| PR / press *(Tier 1)* | press / analysts | PR | <Comms/Legal> | <YYYY-MM-DD> | Legal claims sign-off |
| Social / community | followers | <channels> | <Social> | <YYYY-MM-DD> | Blog live |

## Core messaging (reuse — do not re-invent)
<!-- Single source = GTM_Plan.md positioning. Keep these consistent across every asset above. -->
- **Headline ("why now" + value):** <one line — the customer outcome, not the feature>.
- **One-liner:** <…> · **Proof point:** <validated benefit / customer quote — TODO: cite, never fabricate>.
- **What's new (secondary):** <feature list goes LAST, not first>.

## Responsible-comms checklist (floor)
<!-- Mark N/A — why, never silent. -->
- [ ] Claims truthful, non-deceptive, substantiated.
- [ ] **EU AI Act Art. 50** — disclose AI interaction / label AI-generated content (from 2026-08-02), if applicable.
- [ ] Accessibility of comms assets (alt text, captions, contrast — WCAG 2.1 AA).
- [ ] Legal/PR sign-off on external claims and any customer name/quote.

## Crisis / rollback comms (if guardrails trip)
<!-- Pre-draft the message so a rollback isn't a scramble. Ties to Rollout_Plan.md kill-switch owner. -->
- **Trigger:** guardrail breach / rollback per `Rollout_Plan.md`.
- **Holding statement (internal first, then external):** TODO: <pre-draft>.
- **Owner:** <STK-nn>. **Channel:** <…>.

## Comms outcomes (not vanity)
<!-- Comms exist to move the launch outcome, not to earn impressions. Tie to the OBJ/KR via MET-* — press/signups alone are not success (§7). -->
- Primary: MET-<nn> — <activation / adoption the comms drive>. Reviewed at 7/30/90 (`Launch_Plan.md`).

## Change log
| Date | vX.Y | Change | Why | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial draft | Comms planning | <name> |

---
*Owning skill:* **pm-phase-11-launch-gtm** · *Companions:* **Launch_Plan.md** · **GTM_Plan.md** · **Rollout_Plan.md** · *Conventions:* ../05_Conventions.md
