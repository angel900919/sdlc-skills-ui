---
Document: Rollout Plan — <PRODUCT_NAME>
Document ID: ROLLOUT-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager / Eng
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 11 · Rollout Plan (progressive delivery · feature flags · guardrails · rollback). Owning skill: pm-phase-11-launch-gtm.
Companions: Launch_Plan.md (master + go/no-go) · GTM_Plan.md (positioning/motion/pricing) · Launch_Comms.md.
Conforms to ../05_Conventions.md (§3 IDs MET-*/RSK-*/STK-*, §5 severity S1–S4, §6 frontmatter/Living status, §7 outcomes-over-outputs).
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Default = STAGED % rollout behind flags, NOT big-bang. Big-bang only for atoms (hardware) or a genuinely coordinated reveal — and even then with buffers + a comms-only fallback.
This is the engineering RELEASE (reversible), distinct from the GTM LAUNCH (see Launch_Plan.md). Status: Living — it changes as rings advance.
-->

# Rollout Plan — <PRODUCT_NAME>

## Strategy
<!-- One line: how we ramp and why. Progressive delivery de-risks the release; the GTM launch moment is separate. -->
Progressive delivery **internal → canary → beta → GA**, each ring gated behind a feature flag with explicit entry/exit criteria and guardrails that auto-trigger rollback. TODO: <any deviation + recorded reason>.

## Release rings & % schedule (behind flags)
<!-- Advance a ring ONLY when exit criteria pass and no guardrail is breached. % is share of eligible traffic/users. -->
| Ring | Audience | % | Entry criteria | Exit criteria (advance when) | Flag key |
|---|---|---|---|---|---|
| internal | dogfood / employees | — | build deployed, instrumentation live | no S1/S2; core flow works | `<flag.key>` |
| canary | <1–5% / low-risk cohort> | <1–5%> | internal exit met | guardrails green for <duration> | `<flag.key>` |
| beta | design partners / opt-in | <…%> | canary exit met | guardrails green; beta `FB-*` reviewed | `<flag.key>` |
| GA | all eligible | 100% | beta exit met; G9 passed | <steady-state target> | `<flag.key>` |

- **Ramp cadence:** <e.g. hold each step ≥ <duration> / <n active users> before advancing>. <!-- don't ramp faster than guardrails can give a signal -->

## Guardrail metrics & rollback thresholds (MET-<nn>)
<!-- A guardrail is a metric that, if breached, STOPS or REVERSES the ramp. Define the threshold BEFORE GA (human-owned). Auto where the signal is fast & unambiguous; manual where it needs judgment. -->
| Guardrail (MET) | Threshold that triggers rollback | Auto / manual | Owner (on-call STK-?) |
|---|---|---|---|
| MET-<nn> error rate | <e.g. > x% over y min> | auto | <STK-nn> |
| MET-<nn> p95 latency | <e.g. > x ms sustained> | auto | <STK-nn> |
| MET-<nn> <churn / dissat / refund signal> | <value> | manual | <STK-nn> |
| MET-TBD <business guardrail> | <value> | <…> | <…> |

- **Success metrics** (do NOT gate rollback; tracked in `Launch_Plan.md` + pm-phase-12-analytics): MET-<nn>, MET-<nn>.

## Kill-switch & rollback
<!-- Every staged release needs a clean reversal path. A marketing-only launch with no rollback is an anti-pattern. -->
- **Mechanism:** <flag off / config revert / version pin> — verified working on <YYYY-MM-DD>.
- **Kill-switch owner:** <name / STK-nn>. **Decision authority (RACI A):** <name>.
- **On-call window:** <YYYY-MM-DD → YYYY-MM-DD>, coverage <hours / rota>.
- **Rollback runbook:** <link / steps> — time-to-rollback target: <minutes>.
- **Blast-radius check:** a breach at ring <X> affects ≤ <%> of users. <!-- keep early rings small -->

## Rollout risks
<!-- Surface release-specific risks; raise each as RSK-* in _threads/Risk_Register.md (Likelihood × Impact, §5.3). -->
- RSK-<nn> — <e.g. flag misconfig exposes feature to 100% prematurely> · mitigation: <…>.
- RSK-<nn> — <e.g. guardrail metric not yet instrumented at GA> · mitigation: <…>.

## Decision log (rollout)
<!-- Record each ring advance / hold / rollback as a decision. Pivot/Kill are valid: a guardrail-rejected launch is a ROLLBACK + Pivot, not a cover-up. -->
| Date | Ring action | Decision | Guardrails state | DEC-? |
|---|---|---|---|---|
| <YYYY-MM-DD> | <advance to canary> | <Persevere / Hold / Rollback> | <green/breached> | DEC-<nn> |

## Change log
| Date | vX.Y | Change | Why | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial rollout design | Launch planning | <name> |

---
*Owning skill:* **pm-phase-11-launch-gtm** · *Companions:* **Launch_Plan.md** · **GTM_Plan.md** · **Launch_Comms.md** · *Upstream:* pm-phase-10-delivery (G8 readiness + rollback) · *Conventions:* ../05_Conventions.md
