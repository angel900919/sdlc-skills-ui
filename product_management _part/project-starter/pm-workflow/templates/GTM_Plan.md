---
Document: Go-to-Market Plan — <PRODUCT_NAME>
Document ID: GTM-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: PMM / Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 11 · Go-to-Market Plan (positioning · motion · pricing · enablement). Owning skill: pm-phase-11-launch-gtm.
Companions: Launch_Plan.md (master + go/no-go) · Rollout_Plan.md (rings/guardrails) · Launch_Comms.md (sequencing).
Conforms to ../05_Conventions.md (§3 IDs DEC-*/MET-*/STK-*/ASM-*, §4 spine, §6 frontmatter, §7 outcomes-over-outputs, §8 canonical frameworks).
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Defaults: positioning BEFORE messaging · "why now" + value BEFORE "what's new" · validate the message with REAL customers, not internal consensus · no "Mad-Libs" template.
Never fabricate a pricing benchmark, competitor claim, or customer quote → TODO: + research/interview.
-->

# Go-to-Market Plan — <PRODUCT_NAME>

## Positioning (← P02 Positioning_Brief · Dunford order)
<!-- Deliberate context, NOT a tagline. Run the order; reuse 02_Market/Positioning_Brief.md — don't re-derive. -->
1. **Competitive alternatives** (incl. the status quo / "do nothing"): <…>
2. **Unique attributes** (what only we have): <…>
3. **Value** those attributes enable (the "so what"): <…>
4. **Best-fit segment** (who cares most): <PER-nn / segment>
5. **Market category** (the frame that makes the value obvious): <…>

- **Core message:** lead with **"why now" + customer value**, *before* "what's new". <!-- not a feature list -->
- **Validated with:** <n> real customers / buyers. <!-- TODO: if internal-consensus only, this is unvalidated → interview before GA -->

## GTM motion (DEC-<nn>)
<!-- Match to product complexity × ACV. Pure-PLG OR pure-SLG as dogma is the anti-pattern; most modern SaaS is Hybrid (hybrids outperform pure-PLG on NRR). -->
| Option | Fits when | Chosen? |
|---|---|---|
| **PLG** (self-serve) | low ACV, fast time-to-value, self-serve activation | <…> |
| **SLG** (sales-led) | high ACV / enterprise, complex buy, needs enablement | <…> |
| **Hybrid** (PLG + SLG) | self-serve bottom + sales-assist expansion | <…> |
| **Community** | developer / network-driven adoption | <…> |
- **Chosen:** <PLG / SLG / Hybrid / Community> — DEC-<nn> · rationale: <complexity × ACV>.

## Pricing & packaging (DEC-<nn>)
<!-- Price the VALUE UNIT. Shift toward usage or outcome/credit for AI/agent products — never per-seat when value is per successful result. Pricing STRATEGY stays human-owned even when buyer-side agents screen it. -->
| Model | Value unit | Use when | Chosen? |
|---|---|---|---|
| Per-seat | a user | stable per-user value | <…> |
| Usage | a unit consumed | value scales with consumption | <…> |
| Outcome / credit | a successful result | AI/agent value is per outcome | <…> |
- **Chosen model:** <…> — DEC-<nn> · why it fits the value unit: <…>
- **Packaging / tiers:** <free / pro / enterprise; what gates each>. **ASM-<nn>:** <key pricing assumption to test>.
- **Buyer-side-agent-readable?** <y/n> <!-- expose machine-readable / MCP-readable pricing where buyers' AI agents screen it -->

## Channels & funnel (AARRR — owner per stage)
<!-- Activation for an AI/agentic product = "first successful output", not signup. Tie each stage to a MET-*. -->
| Stage | Definition for this product | Channel(s) | Owner (STK-?) | MET |
|---|---|---|---|---|
| Acquisition | <how they discover> | <…> | <…> | MET-<nn> |
| Activation | <first successful output> | <…> | <…> | MET-<nn> |
| Retention | <repeat value> | <…> | <…> | MET-<nn> |
| Referral | <…> | <…> | <…> | MET-TBD |
| Revenue | <…> | <…> | <…> | MET-<nn> |

## Partner enablement (internal-before-external · RACI)
<!-- PMM-led. Brief & enable internal teams FIRST — Sales/Support learning of a launch from customers is an anti-pattern. Exactly one Accountable per row; each team is a STK-*. -->
| Team (STK-?) | Asset (battlecard / FAQ / demo / 1-pager) | **Accountable (one)** | Ready? (Y/N) |
|---|---|---|---|
| Sales | battlecard + sales pitch (Dunford) | <STK-nn> | <…> |
| Support | FAQ + troubleshooting runbook | <STK-nn> | <…> |
| Customer Success | onboarding / expansion playbook | <STK-nn> | <…> |
| Legal / PR | claims review + press kit | <STK-nn> | <…> |
| Solutions / SE | demo script + 1-pager | <STK-nn> | <…> |

## Competitive frame
<!-- From 02_Market/Competitive_Analysis.md battlecards. Separate fact from inference; no phantom competitors; lead with status-quo displacement. -->
- Primary alternative we displace: <…>. Our wedge: <…>. <!-- TODO: cite source; never invent a competitor claim -->

## Surfaced downstream (wire the spine)
- Success / guardrail metrics → `MET-*` (pm-phase-12-analytics) · messaging A/B fix-validation → `EXP-*` (pm-phase-13-experimentation) · post-launch voice-of-customer → `FB-*` (pm-phase-14-feedback) · growth/expansion bets → `GX-*` (pm-phase-15-growth).

## Change log
| Date | vX.Y | Change | Why | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial draft | GTM planning start | <name> |

---
*Owning skill:* **pm-phase-11-launch-gtm** · *Companions:* **Launch_Plan.md** · **Rollout_Plan.md** · **Launch_Comms.md** · *Conventions:* ../05_Conventions.md
