---
name: promote
description: |-
  Advances a project's lifecycle one step — prototype to mvp, or mvp to production — through an advisory, human-approved, recorded gate. Reads .ai/anchor.md (lifecycle_stage, project_tier, stage_history), .ai/features.md statuses, qa-reports, and the progress tracker; runs the full promotion-gate analysis and shows the evidence; on explicit human approval bumps lifecycle_stage AND project_tier in lockstep (one step, never backward), appends a stage_history entry, writes a plain-English human mirror, logs the tracker, and routes to the rigor skills the new stage requires. It mutates anchor; it does not write code, stack fields, or specs. Use when the user says "/promote", "promote to mvp", "promote to production", "graduate this prototype", "level up the project", or "move to the next stage". Do NOT use for: per-feature tier uplift (that is /prd's automatic max of project_tier and signal), locking the initial stack or tier (/anchor), high-level design (/architect), or shipping one feature (/ship).
---

<what-to-do>

Advance a project's `lifecycle_stage` one step (the only skill that does so): **gate** (run the full promotion analysis and show the evidence), **record** (mutate `.ai/anchor.md` + write the human mirror + log the tracker), and **route** (point the user at the new stage's rigor skills). `lifecycle_stage` and `project_tier` move in **lockstep** (invariant: equal at all times); promotion is **human-approved**.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (advisory gates, tier dial, tracker, **§ Talking to the human**) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/anchor.md` schema — you **mutate** it; read the `## Lifecycle` block + `stage_history` shape carefully) before writing. Reference them; don't restate them.

## Critical rules

1. **`lifecycle_stage` is the field — not `stage`.** You read and bump `lifecycle_stage` + `project_tier`. `stage: anchor` is the unrelated producer marker; **never touch it**. The frontmatter `lifecycle_stage` is the single source of truth for the current stage; the body `current:` line only restates it — keep them identical.
2. **Single-step only.** prototype→mvp **or** mvp→production. Never skip a stage (prototype→production). If asked to skip, refuse and explain the intermediate stage must be validated first.
3. **Monotonic — forward only.** No `/promote` path moves a stage backward. Demotion is a rare, deliberate manual `anchor.md` edit by the user; this skill refuses it.
4. **Lockstep bump.** On promotion set `lifecycle_stage` AND `project_tier` to the new value together. The invariant `lifecycle_stage == project_tier` must hold after the write. Never bump one without the other.
5. **Gate before approval.** Run the full gate analysis and show the evidence *before* asking for approval (rule 7). Never ask the user to approve blind.
6. **Cite real evidence.** Every gate item names *this* project's actual evidence — feature slugs + their `status` from `.ai/features.md`, `qa-report.md` paths, open `*_tentative` fields and `## TODO` items in `anchor.md`. Never a generic checklist. Gate criteria + defaults: [references/gates.md](references/gates.md).
7. **The gate is advisory, not blocking.** If criteria aren't met, issue **GATE-NOT-MET** naming the **specific** missing evidence — but the human **may override**. On override: promote anyway, set `overridden: true` in the `stage_history` entry, and record the reason in **both** `anchor.md` and the human mirror. Never silently block, never silently bump.
8. **Human-approved.** The bump happens only on an explicit "yes" (or an explicit override). `no` → write nothing.
9. **Stay in your lane — no stack fields.** Capturing the new tier's required anchor fields (mvp's `db`/`auth`; production's `observability`/`security_gate`) is `/anchor` update mode's job. You bump the stage and **route** there; you never elicit or invent those fields. Leave them absent.
10. **Project-level only.** You advance the *project's* lifecycle. Per-feature tier uplift stays in `/prd`'s `max(project_tier, signal)`. Features have no lifecycle_stage.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions). You mostly ask for **approval** — that prompt must be everyday words: explain that promoting means every new spec/design/QA from now runs at a higher bar and you'll flesh out a few more foundation details. Keep lifecycle jargon ("tier dial", "lockstep") in the artifact, never in the question. Adapt to `technical_user` if known.
12. **Append the tracker on success only.** A `no`, a blocked gate with no override, or a no-op never logs.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — scan before writing.

## Procedure

Copy this checklist:

```
promote progress:
- [ ] Phase 0: Read tracker top 5; read anchor.md → lifecycle_stage, project_tier, project_type, promotion_criteria
- [ ] Phase 1: Resolve current + target stage (single-step, forward); handle no-op / blocked-on-anchor
- [ ] Phase 2: Run the promotion gate; cite real evidence; show it
- [ ] Phase 3: Human approval (plain-English) — or explicit override if gate not met
- [ ] Phase 4: Apply — bump lifecycle_stage + project_tier in lockstep; append stage_history; write human mirror; log tracker
- [ ] Phase 5: Route to the new stage's rigor skills + verdict
```

### Phase 0 — Load context
Read `.ai/progress-tracker.md` top 5 (session context). Then read `.ai/anchor.md`:
- **Absent, OR present but has no `lifecycle_stage`/`project_tier` fields** → **BLOCKED-ON-ANCHOR → /anchor**. Nothing written; state why.
- Extract `lifecycle_stage`, `project_tier`, `project_type`, `stage_history`, and `promotion_criteria` (if non-empty).
- If `lifecycle_stage != project_tier` → **STOP and report the broken invariant**; the user must reconcile `anchor.md` by hand before promoting.

### Phase 1 — Resolve the target stage
- Current = `anchor.lifecycle_stage`.
- Current is `production` → **ALREADY-AT-PRODUCTION** (no-op). Stop.
- Target = the single next step: prototype→mvp, or mvp→production. If the user named a target, confirm it equals the single next step; if they asked to skip, refuse (rule 2).
- State it plainly: *"You're at `prototype`. Promoting to `mvp`. Here's what I'll check first."*

### Phase 2 — Run the gate
Use `anchor.promotion_criteria.to_<target>` if non-empty; else the **default gate** in [references/gates.md](references/gates.md). Render every item `✓ met` / `✗ unmet` / `? needs-confirmation`, each citing **real** evidence (rule 6): feature slugs + `status` from `.ai/features.md`, `.ai/specs/<feature>/qa-report.md` paths, anchor tentatives/TODO. Show the full result.

### Phase 3 — Approval (advisory gate)
- **All items met** → ask the plain-English approval question (rule 11), one question, recommended framing. `yes` → Phase 4. `no` → **AWAITING-APPROVAL**, write nothing.
- **One or more `✗`** → issue **GATE-NOT-MET** naming the specific missing evidence, then offer the override plainly: *"These aren't met yet: [list]. You can fix them first, or tell me to promote anyway and I'll record that you chose to."* If the human overrides with a reason → Phase 4 with `overridden: true`. Otherwise stop at GATE-NOT-MET (nothing written).

### Phase 4 — Apply (mutate anchor + mirror + tracker)
Edit `.ai/anchor.md` in **update mode — preserve every other field**:
1. Set `lifecycle_stage: <target>` **and** `project_tier: <target>` (lockstep, rule 4).
2. Append one `stage_history` entry in the canonical one-shape form (matches what `/anchor` seeds):
   ```yaml
   - { from: <current>, to: <target>, date: <today>, by: <human approver>, rationale: <gate summary>, overridden: <true|false> }
   ```
   On override, `overridden: true` and put the waived items + reason in `rationale`.
3. Update the `## Lifecycle` body `current:` line to the new stage + date so it restates `lifecycle_stage` exactly (rule 1).
4. Leave the new tier's higher-rigor fields **absent** (rule 9) — Phase 5 routes to `/anchor` to elicit them.

Write **`.human/summaries/promotion.md`** — the plain-English approval surface (shape + worked example: [references/hand-off.md](references/hand-off.md)): "you're now at `<target>`", the evidence that cleared the gate (and any overridden items + reason), what changed, the rigor steps to run next, and a link back to `.ai/anchor.md`. Include a **state-lifecycle diagram** (prototype → mvp → production, current position marked) generated via the **mermaid skill** so it's validated before it ships.

Append to `.ai/progress-tracker.md` per the [`../_shared/conventions.md`](../_shared/conventions.md) format (a `promote landed` entry; note any override + reason).

### Phase 5 — Route + verdict
Print the **re-run checklist** for the target stage from [references/hand-off.md](references/hand-off.md) (the user runs these; you do not invoke them), then issue exactly one verdict:

- **PROMOTED** — stage advanced.
  - to **mvp** → route: `/anchor` (update mode — mvp fields: `db`, `auth`, `deployment_target`, `nfr_ceiling_latency_p95_ms`, `approved_dependencies`) → `/architect` → `/pipeline` (update mode — the mvp-mandatory gates land in the gap table).
  - to **production** → route: `/anchor` (update mode — production fields: `observability`, `security_gate`, `codebase_legibility_rules`; AI judge≠drafter if AI) → `/threat-model` (full pass, or refresh if one exists) → `/to-fitness` → `/pipeline` (update mode — blocking dep audit, SBOM, provenance, monitoring-as-code land in the gap table), then re-`/prd` per feature, etc.
- **GATE-NOT-MET** — gate shown, items unmet, not overridden; lists the specific evidence to resolve, then re-run. Nothing written.
- **AWAITING-APPROVAL** — gate met (or shown) but the human said no / hasn't decided. Nothing written.
- **ALREADY-AT-PRODUCTION** — already at the top stage; no-op.
- **BLOCKED-ON-ANCHOR → /anchor** — no `anchor.md`, or it has no lifecycle fields. Nothing written.

</what-to-do>

<supporting-info>

## Output artifacts (mutation + mirror — no new .ai artifact kind)
- **`.ai/anchor.md`** — MUTATED in update mode (schema: [`../_shared/ai-schema.md`](../_shared/ai-schema.md)).
- **`.human/summaries/promotion.md`** — human approval surface (shape: [references/hand-off.md](references/hand-off.md)).
- **`.ai/progress-tracker.md`** — one appended `promote landed` entry on success.

## References
- Promotion-gate criteria per transition, evidence sourcing, `promotion_criteria` defaults: [references/gates.md](references/gates.md)
- Verdict routing / per-stage re-run checklists + the `.human/summaries/promotion.md` shape + worked examples: [references/hand-off.md](references/hand-off.md)
- Anti-patterns + refused questions: [references/anti-patterns.md](references/anti-patterns.md)

</supporting-info>
