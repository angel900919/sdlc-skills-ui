# Verdict routing, re-run checklists, and the human mirror

What `/promote` prints in Phase 5 (the rigor skills the new stage requires — the user runs these; promote never invokes them), the shape of `.human/summaries/promotion.md`, and worked examples.

## Re-run checklists (Phase 5)

Single-step only, so exactly one of these applies per run.

### Promoted to mvp — run, in order
1. `/anchor` (update mode) — elicit the mvp-required fields: `db`, `auth`, `deployment_target`, `nfr_ceiling_latency_p95_ms`, `approved_dependencies`.
2. `/architect` (update mode) — upgrade the single-file HLD to the mvp bundle (C4 Context + Container, a few ADRs).
3. `/pipeline` (update mode) — the mvp-mandatory gates (pre-merge test gate, branch protection, dep-update automation, deploy + smoke wiring) land in the gap table, routed as slices.
4. Re-run `/prd <feature>` per active feature — adds user stories, lightweight NFRs, risks.
5. `/design`, `/plan`, `/qa` inherit mvp depth automatically from the bumped `project_tier`.

### Promoted to production — run, in order
1. `/anchor` (update mode) — elicit the production-required fields: `observability`, `security_gate`, `codebase_legibility_rules`; and if `ai_in_core_path`, the judge≠drafter / eval-framework fields.
2. `/architect` (update mode) — add quality characteristics + per-container C4 Component + risk storming.
3. `/to-fitness <feature>` — now unlocked; mechanize invariants + characteristics into `fitness/`.
4. Re-run `/prd <feature>` — adds EARS syntax + T/I/A/D verification + unwanted-behavior clauses.
5. `/pipeline` (update mode) — the production-mandatory gates (blocking dep audit, SBOM, provenance, fitness wiring, E2E gate, monitoring-as-code, named rollback) land in the gap table, routed as slices.

## Verdict tokens

- **PROMOTED** → `/anchor` (update mode) → … — stage advanced; print the matching checklist. The hand-off line: *"You're now at `<target>`. This raises the rigor floor for the whole project — every new PRD, design, and QA runs at `<target>` depth from here. Next: run `/anchor` in update mode to fill the `<target>` foundation fields, then `/architect`."*
- **GATE-NOT-MET** — *"Not promoting yet — these aren't met: [specific evidence]. Fix them (or re-run and tell me to override with a reason). Nothing was written."*
- **AWAITING-APPROVAL** — *"Gate's in front of you; you said no / haven't decided. Nothing changed. Re-run `/promote` when you're ready."*
- **ALREADY-AT-PRODUCTION** — *"You're already at the top stage. There's nothing above production to promote to."*
- **BLOCKED-ON-ANCHOR → /anchor** — *"There's no `.ai/anchor.md` (or it has no lifecycle fields), so there's no locked stage to advance. Run `/anchor` first. Nothing was written."*

## `.human/summaries/promotion.md` — the shape

Plain-English approval surface. No machine schema, no jargon.

```markdown
# Promotion — <slug>

**You're now at `<target>`.** <one plain sentence: what changed and why it matters.>

## What cleared the gate
- <plain-English evidence item, e.g. "All 4 core features are QA-approved.">
- <plain-English evidence item>
- <if overridden: "You chose to promote before <item> was met, because <reason>.">

## What changed
- The project's rigor bar moved from `<current>` to `<target>`.
- Every new spec, design, and QA from here runs at the higher bar.

## What to run next
1. <first re-run step in plain words>
2. <next step>

State lifecycle:

<validated mermaid stateDiagram-v2 via the mermaid skill — current position marked>

---
Machine detail: `.ai/anchor.md`.
```

The diagram is a `stateDiagram-v2` of `prototype → mvp → production` with the **new** stage marked as current. Generate it via the **mermaid skill** (hand it the three states, the two transitions, and which one is current); never hand-write the Mermaid.

## Worked example A — prototype → mvp, gate met

```
You're at prototype. Promoting to mvp. Here's what I checked:

✓ Prototype validated — you confirmed the cardboard demo is worth expanding.
✓ Open questions resolved — the snapshot-location TODO in anchor.md is closed.
✓ Feature roster exists — .ai/features.md has 4 features (invoice-send P0, …).

Promoting means every new spec/design/QA runs at a higher bar from now, and we'll
fill in a few more foundation details (a real database, sign-in). Promote? (yes/no)
> yes

PROMOTED → /anchor

Now at mvp. anchor.md updated (lifecycle_stage + project_tier → mvp; stage_history
appended), .human/summaries/promotion.md written, tracker logged.
Run next: /anchor (update) → /architect → re-/prd per feature.
```

## Worked example B — mvp → production, gate not met, then overridden

```
You're at mvp. Promoting to production. Here's what I checked:

✗ Core features not all done — invoice-send is qa-approved, but reports-export is
  still `building` (.ai/features.md).
✓ QA evidence — .ai/specs/invoice-send/qa-report.md is approved.
✓ No tentative production fields outstanding.
? Security & scale expectations — not yet confirmed.

GATE-NOT-MET → finish reports-export and confirm the production security/scale
expectations, then re-run /promote. Or tell me to promote anyway with a reason.
> promote anyway — reports-export is being cut, and security is signed off verbally

PROMOTED → /anchor   (overridden)

stage_history entry records: overridden: true, rationale: "reports-export cut; security
signed off verbally — approved by user". Same note in .human/summaries/promotion.md.
Run next: /anchor (update — observability, security_gate) → /architect → /to-fitness → /pipeline (update).
```
