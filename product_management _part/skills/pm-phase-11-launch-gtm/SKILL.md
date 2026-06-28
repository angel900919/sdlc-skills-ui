---
name: pm-phase-11-launch-gtm
description: Runs Phase 11 (Launch & Go-to-Market) of the framework-agnostic product-management workflow — the phase that *lands* a release in the market with GTM instead of just shipping it. It separates "release" (the staged, reversible engineering event owned by P10) from "launch" (the marketing/GTM moment), picks a launch tier (1/2/3), locks positioning + messaging (reusing P02's Dunford brief, validated with real customers), chooses the GTM motion (PLG/SLG/Hybrid/Community) and pricing model (per-seat/usage/outcome/credit), designs a progressive rollout (internal→canary→beta→GA behind flags) with guardrail metrics + auto-rollback thresholds, enables partner teams (PMM/Sales/Support/Success/Legal-PR) internal-before-external via RACI, and runs a pre-mortem + go/no-go. Produces Launch_Plan.md, GTM_Plan.md, Rollout_Plan.md, and Launch_Comms.md in 11_Launch/, and owns gate **G9 Launch Decision (GA)**. Conforms to ../../05_Conventions.md for IDs, gates, status, severity, and the §4 traceability spine; never redefines them. Use when you need to plan a launch or GA, build a go-to-market plan, choose a launch tier or rollout strategy, decide PLG vs sales-led or pricing/packaging, enable sales/support, run a launch go/no-go, or "do phase 11 launch". Triggers on phrasings like "launch plan", "go-to-market", "GTM", "launch tier", "staged rollout", "progressive delivery", "feature flag launch", "go/no-go", "pre-mortem", "PLG or sales-led", "pricing model", "launch comms", "sales enablement", "GA decision", "phase 11".
disable-model-invocation: true
user-invocable: true
---

# Phase 11 — Launch & Go-to-Market

<what-to-do>
This phase turns a release-ready build (G8) into a landed product: it owns **G9 Launch Decision (GA)**. The job is to *land it in the market with GTM, not just ship it* — separate the reversible engineering **release** (staged, flagged, owned by P10) from the **launch** (the GTM moment), choose how big a deal this launch is, position and message it, pick the motion and pricing, roll it out progressively with guardrails and a rollback, and enable the partner teams who carry it. The launch is **PMM-led and cross-functional**, internal-before-external, and its success is the **outcome it moves**, not the press it earns. This phase conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, status strings, severity, and the §4 traceability spine; it never redefines them.

## Inputs (from prior phases)
- **Phase 10 — `Release_Readiness.md`, `Risk_Register.md` (G8 passed).** Quality bar met, zero open S1/S2, instrumentation live, rollback/kill-switch in place. **Fallback:** if G8 is not passed, you cannot GA — loop to `pm-phase-10-delivery` and mark `TODO: G8 release readiness`.
- **Phase 02 — `Positioning_Brief.md` (Dunford), `Competitive_Analysis.md` (battlecards).** The positioning is the *foundation* of all messaging. **Fallback:** if no brief exists, run a lightweight Dunford 5-component exercise here and mark `TODO: ratify positioning in P02`.
- **Phase 01 — `North_Star_and_OKRs.md`.** Tells you the one outcome (`OBJ/KR`) this launch must move; success metrics ladder up to it. **Fallback:** ask for the single outcome in one question.
- **Phase 04 — `Business_Case.md`.** Pricing/packaging assumptions, GTM-motion economics (ACV, payback). **Fallback:** ask for ACV band + intended motion.
- **Phase 12 — `Measurement_Plan.md`, `Tracking_Plan.md`** *(if started)*. Source for `MET-*` definitions + live instrumentation. **Fallback:** define success/guardrail metrics here as `MET-TBD`, resolved in `pm-phase-12-analytics`.
- If a prior artifact is missing, proceed with what exists, mark the gap `TODO: <owed artifact>`, and **never fabricate a launch metric, a pricing benchmark, a customer quote, or a competitor claim**.

## Step-by-step
Interview-driven: ask **one topic at a time**, convert each answer into the deliverable, **show it back** for confirmation, then move on. Reuse prior-phase facts; never re-ask what P01/P02/P04/P10 already settled. Use **AskUserQuestion** for finite choices.

1. **Confirm scope & output path.** Default `<product-slug>/11_Launch/`. Confirm B2B vs B2C, the GTM-motion context, and tailoring depth ([Tailoring Guide](../../04_Tailoring_Guide.md) P11 row: soft-launch → tiered+GTM+rollback → full GTM/enablement/legal-PR/staged).
2. **Separate release from launch (topic 1).** Confirm the engineering release is staged and reversible (flags/canary/kill-switch, from P10) and define the *launch* as the distinct GTM moment. Conflating the two is the root of most launch risk — name them separately.
3. **Choose the launch tier (topic 2).** Tier 1/2/3 by reach × strategic impact × reversibility; **cap Tier 1 at ~2–3/quarter**. The tier sets the whole effort level for everything below. **AskUserQuestion** for the tier.
4. **Lock positioning & messaging (topic 3).** Reuse P02's Dunford brief (alternatives → unique attributes → value → best-fit segment → category). Lead with **"why now" + customer value before "what's new."** Validate messaging with **real customers**, not internal consensus. No "Mad-Libs" positioning template.
5. **Decide GTM motion + pricing (topic 4).** Motion: PLG / SLG / **Hybrid** / Community — match to complexity/ACV. Pricing: per-seat / usage / **outcome / credit** — never per-seat for an AI/agent product whose value is outcomes. **AskUserQuestion** for motion; record both as `DEC-*`.
6. **Design the rollout (topic 5).** Progressive delivery: internal → canary → beta → GA, with a **% rollout schedule behind flags**. Define **guardrail metrics + thresholds that auto-trigger rollback** and the kill-switch owner. Default is staged, not big-bang.
7. **Enable partner teams + RACI (topic 6).** PMM-led; **internal before external**. Enable Sales, Support, Success, Legal/PR with battlecards, FAQs, demos, and a one-pager. Each team is a `STK-*`; exactly one Accountable per RACI line.
8. **Define success + guardrail metrics (topic 7).** 2–3 success metrics tied to the `OBJ/KR`, reviewed at **7 / 30 / 90 days**; 2–3 guardrails with rollback thresholds. Log as `MET-*` (or `MET-TBD` → P12). Vanity counts (press, signups) are not success metrics.
9. **Run pre-mortem + go/no-go (topic 8).** Pre-mortem ("it's 90 days later and the launch failed — why?") → new `RSK-*`. Confirm legal/privacy sign-off and on-call. Run the RACI go/no-go. **AskUserQuestion** for the gate decision.
10. **Write comms & wire the spine.** Draft `Launch_Comms.md` (internal + external). Tie every plan element to a decision: log `DEC-*`, raise launch `RSK-*`, attach `MET-*`; hand off A/B fix-validation as `EXP-*` (P13), post-launch feedback as `FB-*` (P14), expansion bets as `GX-*` (P15).
11. **Run G9** (the gate block below) with the six-thread review. Recommend *Persevere · Persevere-with-actions · Pivot · Hold · Kill*.
12. **Done.** Print all output paths and hand off: `pm-phase-12-analytics` (instrument & measure the 7/30/90 review), `pm-phase-13-experimentation` (validate fixes), `pm-phase-14-feedback` (close the loop), `pm-phase-15-growth` (scale the motion).

## Decision points
- **Staged rollout or big-bang?** *How to decide:* **staged % rollout behind flags by default**; big-bang only when atoms (hardware — no silent rollback) or a genuinely coordinated reveal demands it, and even then with buffers + a comms-only plan. A marketing-only launch with no rollback is an anti-pattern.
- **Launch tier 1 / 2 / 3?** *How to decide:* reach × strategic impact × reversibility; reserve Tier 1 (full GTM machine) for the ~2–3 launches/quarter that earn it. Treating every launch as Tier 1 burns the org.
- **PLG / SLG / Hybrid / Community?** *How to decide:* match to product complexity and ACV — low-ACV self-serve → PLG; high-ACV/enterprise → SLG with enablement; most modern SaaS → **Hybrid** (hybrids outperform pure-PLG on NRR). Pure-PLG *or* pure-SLG as dogma is the anti-pattern.
- **Pricing model?** *How to decide:* per-seat / usage / outcome / credit — shift toward **usage or outcome/credit for AI/agent products** where value is per successful result, not per seat. Record as `DEC-*`; pricing *strategy* stays human-owned even when buyer-side agents screen it.
- **Launch now or hold?** *How to decide:* if G8 isn't met, messaging is unvalidated, or there's no rollback path → **Hold** or **Pivot**, not GA. The cheapest failed launch is the one a gate stopped.

## Rules
- **Conform to [`../../05_Conventions.md`](../../05_Conventions.md)** for every ID (`DEC-*`, `RSK-*`, `MET-*`, `EXP-*`, `FB-*`, `GX-*`, `STK-*`, `ASM-*`), the gate ladder, status strings, and severity. Cite shared conventions; never restate or drift them.
- **One topic at a time, show back each artifact.** Release/launch split → tier → positioning → motion/pricing → rollout → enablement → metrics → go/no-go. Never dump a wall of questions.
- **Release ≠ launch; staged-by-default; internal-before-external.** These three are non-negotiable defaults, overridden only with a recorded reason.
- **Outcomes over outputs.** Launch success is the **moved outcome** (`OBJ/KR`), not press, signups, or a ship date hit. A launch with no line back to a metric has failed its own gate.
- **AI accelerates, the human decides.** AI drafts positioning/messaging/copy/battlecards/checklists/RACI, synthesizes beta & ticket feedback, and monitors rollout metrics. The human owns the category & best-fit bets, pricing strategy, the rollback thresholds, internal alignment, and the **go/no-go**.
- **Never invent.** No launch metric, pricing benchmark, competitor claim, or customer quote without a source → `TODO:` + a recommendation to research or interview.
- **Pivot & Kill are valid.** A launch the guardrail metrics reject is a **rollback + Pivot**, not a cover-up; a value proposition the market rejects can be a **Kill** feeding back to P04/P03 — surface both.
</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../templates/) (`Launch_Plan.md`, `GTM_Plan.md`, `Rollout_Plan.md`, `Launch_Comms.md`). All carry the standard frontmatter from Conventions §6.

- **`Launch_Plan.md`** — the master: launch tier, timeline/owner, RACI, pre-mortem (`RSK-*`), the go/no-go record, success metrics, and the 7/30/90 review plan. Status: `Draft` → `Approved (G9-approved YYYY-MM-DD)`.
- **`Launch_Comms.md`** — internal announcement (Sales/Support/Success briefed first) + external comms (release notes, blog, PR, in-app), each gated on internal-before-external sequencing. Status: `Draft`.

### 1. `GTM_Plan.md` — positioning, motion, pricing, enablement
```markdown
---
Document: Go-to-Market Plan — <Product>
Document ID: GTM-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <PMM/PM>
Updated: <YYYY-MM-DD>
---
## Positioning (← P02 Positioning_Brief, Dunford order)
Alternatives → unique attributes → value → best-fit segment → category.
Core message: "why now" + customer value, *before* "what's new". Validated with <n real customers>.

## GTM motion (DEC-??)
PLG / SLG / Hybrid / Community — chosen because <complexity × ACV rationale>.

## Pricing & packaging (DEC-??)
Model: per-seat / usage / outcome / credit. Why <model> fits the value unit. Buyer-side-agent-readable? <y/n>

## Channels & funnel (AARRR)
Acquisition → activation ("first successful output") → retention → referral → revenue. Owner per stage.

## Partner enablement (internal-before-external)
| Team (STK-?) | Asset (battlecard/FAQ/demo/1-pager) | Accountable (RACI) | Ready? |
|---|---|---|---|

## Surfaced downstream
Success/guardrail metrics → MET-?? (P12) · A/B fix-validation → EXP-?? (P13) · Growth bets → GX-?? (P15)
```

### 2. `Rollout_Plan.md` — progressive delivery + guardrails + rollback
```markdown
---
Document: Rollout Plan — <Product>
Document ID: ROLLOUT-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM/Eng>
Updated: <YYYY-MM-DD>
---
## Release rings & % schedule (behind flags)
| Ring | Audience | % | Entry criteria | Exit criteria | Flag |
|---|---|---|---|---|---|
| internal | dogfood | — | … | … | <flag key> |
| canary | <1–5%> | … | … | … | … |
| beta | design partners | … | … | … | … |
| GA | 100% | … | … | … | … |

## Guardrail metrics & rollback thresholds (MET-??)
| Guardrail | Threshold that triggers rollback | Auto/manual | Owner |
|---|---|---|---|
| <error rate / latency / churn signal> | <value> | auto | <on-call> |

## Kill-switch & rollback
Mechanism: <flag / config>. Owner: <name>. Decision authority: <RACI A>. On-call window: <dates>.
```

## AI prompt pack
- **ELICIT —** "From `02_Market/Positioning_Brief.md`, `01_Strategy/North_Star_and_OKRs.md`, and `10_Delivery/Release_Readiness.md`, draft a launch plan starter: propose a launch **tier** with rationale, the one outcome (`OBJ/KR`) this launch must move, and the open questions you need me to answer before we set the motion. Confirm the release is staged/reversible before anything else."
- **GENERATE —** "Build the GTM plan: turn the Dunford brief into messaging that leads with 'why now' + value; recommend a motion (PLG/SLG/Hybrid/Community) and a pricing model (per-seat/usage/outcome/credit) for an ACV of <X> with a stated rationale and the assumptions (`ASM-??`); then draft a progressive `Rollout_Plan.md` (rings + % schedule + guardrail metrics with rollback thresholds) and a partner-enablement RACI. Refuse to produce vanity success metrics."
- **CRITIQUE / RED-TEAM —** "Run a pre-mortem on this launch: it's 90 days later and it failed — list the most likely causes as `RSK-??`. Then challenge: (1) are release and launch conflated? (2) is this really a Tier-1, or is everything a Tier-1? (3) is the messaging customer-validated or internal consensus? (4) is the rollout big-bang with no rollback? (5) are success metrics vanity (press/signups) vs outcome-linked? (6) is pricing per-seat for an outcome-based product? (7) does Sales/Support learn this from customers?"
- **GATE / HANDOFF —** "Check P11 against the G9 block. Confirm the tier is set, rollout is staged with guardrails + rollback thresholds, GTM (positioning/messaging/pricing/enablement) is ready and internal-before-external, success + guardrail `MET-*` are defined, and legal/privacy + on-call are confirmed. List every open `TODO` with an owner+date and recommend Persevere / with-actions / Pivot / Hold / Kill."

## Research & specialised-agent triggers
Reference [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md) for the standing protocol and the **research-execution ladder**.
- **Execute with `/research-report`**: research competitive positioning (Dunford), pricing/packaging norms (per-seat vs usage/outcome), and GTM-motion benchmarks via `/research-report` — use **Decision-brief** mode for the pricing-model choice — and cite the report in `GTM_Plan.md`. Plain `WebSearch` is the fallback.
- **Interview a customer when:** messaging/positioning is unvalidated (validate the message with real buyers before GA), or to run a **design-partner / beta** as a discovery motion — beta is *signal*, not a pure QA bug-hunt.
- **Web research when:** you need current pricing benchmarks (per-seat vs usage vs outcome/credit), competitor launch motions, channel/CAC norms, or regulatory constraints for the launch geography. Cite sources; separate fact from inference.
- **Spawn a specialised agent when:** a **launch-ops agent** to draft the timeline/RACI/checklist and monitor rollout metrics with auto-rollback recommendations (human sets thresholds & owns go/no-go); a **messaging agent** to draft copy/battlecards from the positioning brief; a **pricing-intel agent** to triangulate benchmarks. Use agents to produce evidence behind a claim, never to invent the claim. MCP connectors can expose your launch metrics to the agent as a live source.

## Cross-cutting hooks
P11 seeds and feeds these threads (full method in [`../../cross-cutting/`](../../cross-cutting/)):
- **Stakeholder Management** *(seeds heavily)* — PMM-led RACI, internal-before-external enablement, exec go/no-go via BLUF; a working demo beats a launch deck for buy-in. → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md)
- **Metrics & Experimentation** *(seeds heavily)* — success + guardrail `MET-*`, rollback thresholds, 7/30/90 review; fix-validation becomes `EXP-*`. → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md)
- **Continuous Discovery** *(feeds)* — beta/design-partner signal and messaging validation are discovery; post-launch `FB-*` flows back to P03/P04. → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md)
- **Product Ops** *(feeds)* — the launch calendar, the Tier-1 cap, RACI/checklist templates, and a single source of truth keep launches repeatable. → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md)
- **Responsible Product** *(floor — non-negotiable)* — truthful, non-deceptive claims; accessibility (EAA enforceable; EN 301 549 ≈ WCAG 2.1 AA); privacy/DPIA sign-off; **EU AI Act Art. 50** transparency (disclose AI interaction / label AI-generated content, from 2 Aug 2026). → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md)
- **Portfolio** *(multi-product)* — launch-slot contention and the Tier-1 cap across the portfolio; one product's launch shouldn't starve another. → [`../../cross-cutting/Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md)

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); cards in [`../../frameworks/`](../../frameworks/).
- **Launch Tier (1/2/3)** (Product Marketing Alliance) — right-size launch effort; cap Tier 1.
- **Positioning — *Obviously Awesome*** (April Dunford) — the 5 components + the sales pitch; the foundation of messaging.
- **GTM Motion Decision** — PLG / SLG / Hybrid / Community, matched to complexity × ACV.
- **Progressive Delivery / release rings** — internal→canary→beta→GA behind flags; % rollout; kill-switch.
- **Pre-mortem + go/no-go**; **RACI** (exactly one Accountable).
- **Design Partner Program** (vs beta); **Pricing models** (per-seat / usage / outcome / credit); **AARRR** for the launch funnel (activation = first successful output).

## Exit-gate checklist
**This phase owns a hard gate — G9 Launch Decision (GA).** The block below is copied verbatim from [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md); if they ever disagree, that file wins. The six-thread *every-gate* review runs first.

### G9 — Launch Decision (GA) *(owner: P11 Launch & GTM)*
- [ ] **Launch tier** chosen and rollout plan set (default: staged % rollout, not big-bang).
- [ ] GTM ready: positioning, messaging, pricing/packaging (if applicable), and **partner teams enabled** (PMM, Sales, Support, Success, Legal/PR as needed).
- [ ] Success metrics + **guardrail metrics** defined with thresholds that would trigger rollback.
- [ ] Comms ready (internal + external as applicable); support/docs in place.
- [ ] Legal/privacy sign-off where required; on-call confirmed for launch window.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Launch is a single big-bang event on a fixed date. | Release and launch conflated; no flags. | Separate release (staged, flagged, reversible) from launch (GTM moment); roll out by %. |
| Every launch run as Tier 1. | No tiering; launch theatre. | Tier by reach × impact × reversibility; cap Tier 1 at ~2–3/quarter. |
| "Mad-Libs" positioning, copy leads with "what's new." | Tagline-first, internal consensus. | Run the Dunford order; lead with "why now" + value; validate messaging with real customers. |
| Per-seat pricing on an AI/agent product. | Legacy seat model on outcome value. | Move to usage or outcome/credit; price the value unit (a successful result). |
| Pure PLG or pure SLG as dogma. | One-size motion. | Match motion to complexity × ACV; hybrid PLG+SLG for most SaaS. |
| Sales/Support learn of the launch from customers. | External-before-internal. | PMM-led RACI; brief & enable internal teams first. |
| Beta treated as a QA bug-hunt. | Beta scoped as test, not signal. | Run a design-partner/beta as discovery; capture `FB-*`/`INS-*`. |
| Marketing-only launch, no rollback. | Release de-risking skipped. | Define guardrail `MET-*` + rollback thresholds + kill-switch owner before GA. |
| Success = press/signups. | Vanity launch metrics. | Tie success to the `OBJ/KR` outcome; review at 7/30/90 days. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (`DEC/RSK/MET/EXP/FB/GX/STK/ASM-*`), gate ladder (G9), status, severity, §4 spine, §6 frontmatter, §8 canonical citations.
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — P11 closes the delivery diamond; G9 opens the continuous measure/grow loop (P12–P15).
- April Dunford — product positioning exercise: https://www.aprildunford.com/post/a-product-positioning-exercise
- Product Marketing Alliance — launch tier framework: https://www.productmarketingalliance.com/launch-tier-framework/
- SVPG (Cagan) — against big-bang releases: https://www.svpg.com/big-bang-releases/ · No-more-big-bang launches: https://abicox.medium.com/no-more-big-bang-launches-81f0ce5fdc91
- LaunchDarkly — progressive rollouts / guarded releases: https://launchdarkly.com/docs/home/releases/progressive-rollouts
- Monetizely — 2026 SaaS/AI/agentic pricing models: https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models · Userpilot — PLG vs SLG: https://userpilot.com/blog/product-led-vs-sales-led/
- Related phases: `pm-phase-10-delivery` (supplies G8 release readiness + rollback), `pm-phase-02-market-research` (supplies positioning + battlecards), `pm-phase-12-analytics` (instruments the 7/30/90 review), `pm-phase-13-experimentation` (validates fixes), `pm-phase-14-feedback` (closes the loop), `pm-phase-15-growth` (scales the motion).
- Curriculum: [`../../../PM_Final_WF/04-product-launch-playbook.md`](../../../PM_Final_WF/04-product-launch-playbook.md) — the launch/GTM playbook this phase operationalises.

</supporting-info>
