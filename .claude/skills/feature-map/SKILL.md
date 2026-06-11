---
name: feature-map
description: |-
  Decomposes a validated idea into a prioritized roster of atomic vertical features — each ships independently and delivers user value end-to-end. Reads understanding's behaviors as the primary decomposition source and discovery's scope as the envelope, traces every feature to a journey, forces 1–N priority (no all-P0), and honors the tier cap. Writes the machine roster to .ai/features.md and a plain-English dashboard with one validated diagram to .human/summaries/features.md. Use when the user says "/feature-map", "decompose features", "break this into features", "story map", or "what should I build", or after /understand. Do NOT use for: per-feature scope or NFRs (/prd), stack selection (/anchor, /architect), domain modeling (/understand), or idea validation (/discovery).
---

<what-to-do>

You turn a validated idea into the **roster of atomic vertical features** every downstream skill works on. Each feature is a slice that ships on its own and delivers a user-visible outcome — never a technical layer. You decompose, prioritize 1–N, trace each feature to a real journey, and write a machine roster plus a plain-English dashboard for the human.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/features.md` schema) before writing. Don't restate them — reference them.

## The decomposition model (read this first)

The three inputs are **not** equal. Each is the source of truth for one thing:

- **understanding's `behaviors` = the decomposition engine.** A vertical feature is a journey (or an independently-shippable slice of one). The journeys are your raw material. `satisfies` is a real pointer to a behavior — not a label slapped on afterward.
- **discovery's `scope` = the envelope + the P0 signal.** `v0_1` bounds what's in scope; `deferred` populates the Deferred rows with their dates; `non_goals` populate Never verbatim. The JTBD / success_metric tells you which features are P0 (the ones the metric depends on). Scope was *decided* at discovery — don't re-decide it here.
- **context.md entities = the naming + coverage check.** Name features off the domain language. A feature that introduces an undefined noun, or an in-scope entity that no feature touches, is a smell to surface.

Reading discovery alone (decomposing off 3–5 coarse capabilities) produces features that don't map to journeys — the orphan and mega-feature problems. Decompose off behaviors; frame with scope.

## Critical rules

1. **Vertical slices, not technical layers.** `api-layer`, `db-schema`, `auth-service` are NOT features — they're concerns inside features. Force user-visible capabilities: `session-timer`, `invoice-send`, `client-portal`. Test: *"What can a user DO when this ships?"* No answer → it's not a feature.
2. **Atomic.** If A can't ship without B shipping at the same moment, they're one feature. Split only when each half ships and delivers value alone.
3. **Behaviors drive decomposition; scope frames it.** Per the model above. Trace every feature to a behavior via `satisfies`; an orphan (no behavior, or an undefined entity) is dropped or surfaced to `/understand`.
4. **Tier-aware requiredness.** Read `predicted_tier` from `.ai/intake.md`. At **mvp / production**, understanding is effectively required — without journeys you can't slice or trace, so its absence is a real `BLOCKED-ON-UNDERSTANDING`. At **prototype**, decomposing off discovery's scope alone is acceptable: mark `trace_status: tentative`, point `satisfies` at discovery capabilities, and note it. Discovery is always required (no discovery → `BLOCKED-ON-DISCOVERY → /discovery`).
5. **Don't re-decide scope.** in / deferred / never come from discovery. A feature the user proposes that isn't in discovery's scope: push back — amend discovery, or defer it with a date. Record any addition under `beyond_discovery`. Don't silently expand scope.
6. **Force 1–N priority.** Every P0 ranks against every other P0; aim ≤4. Each P0 must serve the JTBD / success_metric. All-P0 means no priority — push back until the order is real.
7. **Tier cap.** prototype ≤4 in-scope · mvp 5–8 · production ≤10. `uplift_signals` in `.ai/intake.md` (money, pii, sla, external-dependants, regulatory) may bump the effective tier — surface it in plain English and raise the cap accordingly. Over cap → push back (defer, split, or bump tier).
8. **Don't overwrite — update mode.** If `.ai/features.md` exists, touch only the rows the user names; preserve every other row, its `status`, its `prd` link, and the `#`/order of unchanged rows (re-number only if a bucket's priority shifted). Full re-decompose only with explicit confirmation that PRD links and statuses will be lost.
9. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommendation, no jargon, adapt to `technical_user` from `.ai/intake.md`. Talk about "things the user can do," not "atomic vertical slices"; that term is for the roster, not the conversation. Never a wall of questions; wait for the answer.
10. **Read back before writing.** Paste the assembled roster; ask *"where did I misrepresent you?"* Edit for fidelity.
11. **Two registers.** `.ai/features.md` is structured (YAML index + tables, no diagrams). `.human/summaries/features.md` is prose + **one validated diagram** via the **mermaid skill**. Diagrams live in `.human/` only.
12. **The gate is advisory.** Issue the real verdict with reasons; the user may override on the record (`verdict_overridden: true` + reason). Never block silently or water down the analysis.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan the draft against it before writing.

## Procedure

Copy this checklist:

```
feature-map progress:
- [ ] Phase 0: Load intake (tier+uplift) + tracker top 5; detect existing features.md (update mode if present)
- [ ] Phase 1: Load discovery (required) + understanding (tier-aware) + context.md; restate inputs
- [ ] Phase 2: Decompose behaviors into atomic vertical features; frame with discovery scope
- [ ] Phase 3: Slug each (kebab-case, ≤30 chars, user-outcome)
- [ ] Phase 4: Trace — each feature → a behavior (satisfies); check entity coverage; resolve orphans
- [ ] Phase 5: Prioritize 1–N (force ranking; ≤4 P0; P0 serves the metric)
- [ ] Phase 6: Dependencies — non-obvious only (depends_on)
- [ ] Phase 7: Read back; scan anti-patterns; collect corrections
- [ ] Phase 8: Enforce tier cap; write .ai/features.md + .human/summaries/features.md (validated diagram)
- [ ] Phase 9: Append progress-tracker (success verdict only); issue verdict
```

### Phase 0 — Session context + mode
Read `.ai/intake.md` for `predicted_tier` and `uplift_signals` (the cap + requiredness dial) and `technical_user` (how plainly to phrase questions). Read `.ai/progress-tracker.md` top 5; seed it from the [`../_shared/conventions.md`](../_shared/conventions.md) stub if absent. Read `.ai/features.md` — if present, restate the roster (counts by priority + status), ask what to change, and switch to **update mode** (rule 8).

### Phase 1 — Load inputs
Read frontmatter first, then only the sections you need.
- `.ai/discovery/<slug>.md` — **required.** Pull `scope` (`v0_1`, `deferred`, `non_goals`) and the JTBD / success_metric. Missing → refuse, `BLOCKED-ON-DISCOVERY → /discovery`. Stop.
- `.ai/understanding/<slug>.md` — pull `behaviors` (the decomposition source) and `boundaries` (cross-check vs discovery scope; surface drift). Missing: at mvp/production → `BLOCKED-ON-UNDERSTANDING`; at prototype → proceed tentative (rule 4).
- `.ai/context.md` — pull entities/glossary for naming + coverage.

Restate in one paragraph: *"Discovery scope = [v0.1 / deferred / never]. Understanding has [N] behaviors: [...]. Tier = [tier] (cap [N]). Right?"* Confirm before decomposing.

### Phase 2 — Decompose
Walk the **behaviors**, not the capability bullets. For each journey ask: *"Is this one shippable slice, or several?"* Apply the atomic test (rule 2). Reject technical splits (`X-frontend` + `X-backend` = one feature). Frame against discovery: every in-scope feature must fall inside `v0_1`; `deferred` items become Deferred rows (don't promote); `non_goals` become Never verbatim. See [references/examples.md](references/examples.md) for vertical-vs-technical and atomic-vs-mega shapes.

### Phase 3 — Slug
kebab-case, ≤30 chars, names the user outcome — not the implementation. `invoice-send`, not `feature-1` / `invoice_send` / `api-v2-invoice-endpoint`. Force differentiation on near-collisions (`invoice-create` vs `invoice-send`).

### Phase 4 — Trace + coverage
For each feature: *"Which behavior does this serve?"* → that's `satisfies`. No behavior → orphan: drop it, or surface a missing behavior to `/understand` (record under `orphans`). Cross-check entities: a feature touching an undefined noun, or a load-bearing entity no feature touches, gets surfaced. If understanding is absent (prototype), mark `trace_status: tentative` and point `satisfies` at discovery capabilities.

### Phase 5 — Prioritize 1–N
Push back on all-P0 (rule 6). P0 = the JTBD/success_metric fails without it (aim ≤4); P1 = high value, MVP ships short-term without it; P2 = cuttable. Force the order within each bucket: *"If you could ship only one P0 this week, which?"* That order becomes `features:`.

### Phase 6 — Dependencies
*"Which features are actually broken without another — not just 'nicer if X came first'?"* Capture only **non-obvious** deps in `depends_on` (skip the obvious: `stripe-webhook` needs `invoice-send`). A dependency on something not in the roster reveals a missing feature — surface it.

### Phase 7 — Read back
Assemble the draft. Scan against [references/anti-patterns.md](references/anti-patterns.md) and strip any symptoms. Paste; ask *"where did I misrepresent you? Any P0 that's really P1? Any orphan or mega-feature I missed?"* Edit for fidelity. Pull elicitation phrasing from [references/probes.md](references/probes.md) when stuck.

### Phase 8 — Write the artifacts
Enforce the **tier cap** first (rule 7); over cap → push back. Then write both:
1. **`.ai/features.md`** — structured per [`../_shared/ai-schema.md`](../_shared/ai-schema.md): frontmatter index (verdict, tier, tier_cap, in_scope_count, trace_status, `features`, `p0`, links, `consumed_by`) + In scope / Deferred / Never / Priority key / Trace status / Notes. No diagrams.
2. **`.human/summaries/features.md`** — lead with the verdict in one sentence; 3–6 plain bullets (what's in, what got cut and why, the critical few); **one validated diagram** via the **mermaid skill** — a priority-grouped feature map (flowchart) with dependency edges, the dashboard you scan first. Link back to `.ai/features.md`.

### Phase 9 — Verdict
Append a tracker entry on `READY-FOR-ANCHOR` only (per [`../_shared/conventions.md`](../_shared/conventions.md) format). Issue exactly one:

- **READY-FOR-ANCHOR** — roster atomic, prioritized, every feature traces to a behavior, within cap. *"Next: `/anchor` to lock the stack (if not done), then `/prd <feature>` starting with #1 ([name])."*
- **NEEDS-DECOMPOSITION** — a feature is too coarse (3+ journeys inside). Name it; loop to Phase 2.
- **BLOCKED-ON-UNDERSTANDING → /understand** — mvp/production with no usable behaviors to trace against. Roster written tentative. *"Run `/understand` to capture the journeys, then re-run `/feature-map` in update mode to confirm traces."*
- **BLOCKED-ON-DISCOVERY → /discovery** — no discovery doc. Nothing written. State why.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason in the artifact, and route onward.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). `.ai/features.md` (frontmatter index + structured tables, no diagrams) is read by `/prd` to pick the next feature and `/anchor` to size the build.

## References
- Elicitation question bank (decompose / slug / trace / prioritize / dependencies): [references/probes.md](references/probes.md)
- Anti-patterns to scan against before writing: [references/anti-patterns.md](references/anti-patterns.md)
- Good-vs-bad shape examples (vertical slicing, atomic, priority, slug, trace): [references/examples.md](references/examples.md)

## Slugging
Reuse the upstream `slug` for the artifact path. Feature slugs are minted here (kebab-case, ≤30 chars, user-outcome) and reused by `/prd`, `/design`, `/plan` under `.ai/specs/<feature>/`.

</supporting-info>
