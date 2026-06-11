---
name: sunset
description: |-
  Retires a shipped feature through the lifecycle's final two human-gated flips — shipped to deprecated to removed — closing the gap after /ship and /measure. The deprecate phase blocks on live dependants first (depends_on in features.md), then plans the why, window, user comms, flag-off, and data handling into a sunset record under .ai/specs, flipping shipped to deprecated only on explicit approval. The remove phase verifies the window and comms, routes the removal as build work, and flips deprecated to removed only after the human confirms that work merged — it never deletes code, flags, or data itself. Use when the user says "/sunset", "deprecate the feature", "remove the feature", "retire X", "kill the feature", "turn off X", "decommission", or after /measure records a remove decision. Do NOT use for: cutting unbuilt features (/feature-map update), deleting code directly (the build loop executes routed work), the project kill decision (/measure plus /discovery), or rolling back a bad deploy (human ops).
---

# Sunset — the deprecate/remove lifecycle gate

Extends the feature lifecycle past `shipped` — **`shipped → deprecated → removed`** — and is the **only writer of both new states**. Like `/ship`, it is human-gated at every flip: it plans, verifies, and records; humans (and the build loop) execute.

<what-to-do>

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `features.md` and `sunset.md` schemas) before writing. The `sunset.md` skeleton, the removal-task template, the dependant-check method, and the tier matrix live in [references/templates.md](references/templates.md).

## Critical rules

1. **Two phases, detected from the `.ai/features.md` row — never asked.** `status: shipped` → **DEPRECATE** phase (plan + first flip). `status: deprecated` → **REMOVE** phase (route the removal work + final flip). Any other status → **`NOT-SHIPPED`**: a `planned`/`building`/`qa-approved` feature is cut via `/feature-map` update mode (or finished through the loop), never sunset; `removed` is a one-line no-op note; `blocked`/`cut` → `/feature-map`. Say which and route. Usually two separate runs: deprecate now, remove after the window.
2. **Dependants gate FIRST — before any question.** Scan every non-removed `features.md` row's `depends_on` for this feature. Any hit → **`BLOCKED-ON-DEPENDANTS`**: list the dependants by slug and stop. They must be sunset first, or their dependency re-pointed via `/feature-map` update mode. **Never proceed past a live dependant** — not even to write the plan.
3. **Never deletes anything itself.** No code, no flags, no data, no branches. The remove phase *routes* the removal as build work (rule below); the deprecate phase *records* the flag-off and data steps for humans/the loop to execute. `/sunset`'s only writes are `.ai/specs/<feature>/sunset.md`, the two `features.md` status flips, and the tracker append.
4. **Removal is build work, routed.** Big removals (many files, schema contraction, API consumers) → recommend `/prd <feature>` update mode + the normal loop (design → plan → to-issues → build). Small ones → write a free-form mtdd task at `tasks/remove-<feature>.md` (template in [references/templates.md](references/templates.md)), seeding its file list from `as-built.md`'s module map and the union of `issues/SLICE-*.md` `files:` manifests when present; acceptance covers **code + flags + data**, each per the sunset plan. The final flip waits for the human to confirm that work **merged**.
5. **Cites retention rules, never decides retention law.** Data handling quotes the feature's entities' rows from `.ai/data-management.md` (Retention & PII lifecycle) — what is kept, deleted, or exported, and when. A retention question the policy doesn't answer is recorded as an open question **flagged for human legal review**, never improvised. Flag-off cites `.ai/environments.md` `flag_system` when it covers the feature; `flag_system: none` → skip the step, note it.
6. **Human-gated at BOTH flips (like /ship).** The analysis is advisory; each flip happens only on an explicit plain-English yes. Every decision lands in `sunset.md`'s append-only `## Decision log` (most-recent first — same discipline as `/qa`'s approval block) with by/at/reason. A negative finding the human overrides → `verdict_overridden: true` + the reason on the record; never silently block or silently flip.
7. **Tier dial** (effective `tier` from `prd.md`; fallback `anchor.project_tier` + WARN). **prototype** = lightweight: one question ("why retire it?"), skip the comms + window steps (window `immediate`), deprecate and — if the human says so in the same breath — proceed to remove in the next run as usual; `sunset.md` ≤90 lines. **mvp** = window + comms, ≤185. **production** = full plan incl. per-entity data handling + comms + flag-off, ≤250. Full matrix: [references/templates.md](references/templates.md).
8. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, always with a proposed answer ("the outcome record says the metric missed by half — retire it for that reason?"). The jargon (deprecation window, retention, flag-off) lives in `sunset.md`, never in the question.
9. **Single feature per run; exactly one verdict** from: `SUNSET-PLANNED` · `DEPRECATED` · `REMOVAL-ROUTED` · `REMOVED` · `BLOCKED-ON-DEPENDANTS` · `NOT-SHIPPED`.
10. **No `.human` mirror.** The chat read-back + the approval questions are the human surface (same footprint as `/ship`); `sunset.md` is the durable record.
11. **Tracker.** Read top 5 at Phase 0; append one entry on each success verdict (`SUNSET-PLANNED`, `DEPRECATED`, `REMOVAL-ROUTED`, `REMOVED`). Skip on `BLOCKED-ON-DEPENDANTS` / `NOT-SHIPPED`.
12. **Stay in your lane.** No deploys (`/ship` + CI/CD), no roster re-prioritizing (`/feature-map`), no metric verdicts (`/measure`), no spec edits beyond `sunset.md` and the two status flips.

## Procedure

Copy this checklist:

```
sunset progress:
- [ ] Phase 0: Arg + tracker top 5; load inputs; detect phase from features.md status; announce
- [ ] DEPRECATE D1: Dependants gate (depends_on scan) — any live dependant → BLOCKED-ON-DEPENDANTS
- [ ] DEPRECATE D2: Interview — why (cite outcome.md) · window · comms · flag-off · data handling
- [ ] DEPRECATE D3: Write .ai/specs/<feature>/sunset.md (plan + decision log); read back
- [ ] DEPRECATE D4: Explicit approval → flip shipped→deprecated (else SUNSET-PLANNED)
- [ ] REMOVE R1: Verify window passed + comms done (ask, record); re-run the dependants gate
- [ ] REMOVE R2: Route the removal work — /prd update + loop, or tasks/remove-<feature>.md → REMOVAL-ROUTED
- [ ] REMOVE R3: Human confirms the removal work MERGED → flip deprecated→removed → REMOVED
- [ ] Final: Tracker append (success verdicts only); exactly one verdict + hand-off
```

### Phase 0 — Load + phase detection

Feature slug required — bare `/sunset` → refuse and ask which feature. Read `.ai/progress-tracker.md` top 5. Then load, frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/features.md` | **REQUIRED** — the row's `status` (phase detection) + every row's `depends_on` (dependants gate) | refuse; point at `/feature-map` |
| `.ai/specs/<feature>/sunset.md` | phase confirmation + the existing plan/decision log (REMOVE phase reads it; re-runs append) | fine on first run |
| `.ai/specs/<feature>/outcome.md` | the **why** — `/measure`'s verdict + `decision: remove` | warn (ask the human why instead) |
| `.ai/specs/<feature>/as-built.md` + `issues/SLICE-*.md` | the removal **file list** (module map + `files:` manifests) | warn (the routed task lists files as "to be scouted") |
| `.ai/data-management.md` | per-entity retention rows → the data-handling step | warn (data handling becomes open questions for legal/human review) |
| `.ai/environments.md` | `flag_system` → the flag-off step | warn (no flag step) |
| `.ai/anchor.md` | `project_tier` fallback for tier | warn |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Apply rule 1: status → phase (or `NOT-SHIPPED`, with the route). A `deprecated` row with **no** `sunset.md` (hand-flipped) → treat as DEPRECATE phase to reconstruct the plan first; say so. **Announce** one line: feature, tier, current status, detected phase, what this run will do.

### DEPRECATE phase (`status: shipped`)

**D1 — Dependants gate (rule 2).** Scan `features.md`; any non-removed row listing this feature in `depends_on` → **`BLOCKED-ON-DEPENDANTS`**: name each dependant + its status, and the two exits (sunset the dependant first, or re-point its `depends_on` via `/feature-map` update mode). Stop — nothing written.

**D2 — Interview** (one plain question at a time, each with a proposed answer; prototype = the "why" only, per rule 7):
- **Why** — if `outcome.md` exists, quote its verdict/decision and confirm ("`/measure` recorded the metric missed and a remove decision — is that the reason?"); else ask plainly.
- **Window** — a date or a condition ("when the last active user migrates"). The remove phase later verifies it.
- **User communication** — what users are told, and where (release note, email, in-app banner). Record the note text or its location.
- **Flag-off** — if `environments.md` `flag_system` covers this feature: which flag, who flips it, when in the window. Else skip + note.
- **Data handling** — for each of the feature's entities, cite the `data-management.md` retention row: kept / deleted / exported, and when. Uncovered entity or legal doubt → open question flagged for human legal review (rule 5).

**D3 — Write `.ai/specs/<feature>/sunset.md`** per the schema (skeleton: [references/templates.md](references/templates.md)) — plan sections in fixed order + the first `## Decision log` block. Enforce the tier line cap. Read it back in plain English; corrections win.

**D4 — Approval.** Ask plainly: deprecating means the feature is on notice — users get the message, the window starts, and removal work follows; nothing is deleted today. Explicit **yes** → flip the `features.md` row `shipped → deprecated`, append the decision-log block, verdict **`DEPRECATED`**. Not yet / waiting on the window or a stakeholder → verdict **`SUNSET-PLANNED`** (plan written, no flip; re-run to flip).

### REMOVE phase (`status: deprecated`)

**R1 — Verify.** Ask + record in the decision log: has the window passed (or the condition fired)? Were the comms actually sent? A no on either → stay `SUNSET-PLANNED` ("the plan stands; re-run `/sunset <feature>` when the window closes"). Then re-run the dependants gate (rule 2) — a dependency added since the plan → `BLOCKED-ON-DEPENDANTS`.

**R2 — Route the removal work (rules 3–4).** Recommend the route, human picks:
- **Big** → `/prd <feature>` update mode (rescope to the removal) + the normal loop. Record `removal_route: prd-update` in `sunset.md`.
- **Small** → write `tasks/remove-<feature>.md` from the template — file list from `as-built.md` + slice `files:` manifests (or "scout first" when absent), acceptance = code gone + flag removed + data handled, each per the plan. Record `removal_route: tasks/remove-<feature>.md`.

Append the decision-log block, verdict **`REMOVAL-ROUTED`**. Stop — the loop/human executes.

**R3 — Final flip.** On a later run (or in-session if the work is already merged): ask the human to confirm the removal work **merged** — cite the evidence they name (PR/merge commit/closed slices); never infer it. Confirmed → flip `deprecated → removed`, append the decision-log block, verdict **`REMOVED`**. Hand-off: *"`<feature>` is removed — the roster, census, and status views now show it retired. Next: nothing; or `/feature-map` to backfill the roster."*

### Verdicts (exactly one)

| Verdict | When | Written |
| :-- | :-- | :-- |
| `SUNSET-PLANNED` | plan written/standing; awaiting window, comms, or approval | `sunset.md` (no flip) |
| `DEPRECATED` | human approved the first flip | `sunset.md` + `features.md` flip + tracker |
| `REMOVAL-ROUTED` | removal work generated/routed; awaiting merge | `sunset.md` (+ `tasks/remove-<feature>.md` if small route) + tracker |
| `REMOVED` | human confirmed the removal work merged | `sunset.md` + `features.md` flip + tracker |
| `BLOCKED-ON-DEPENDANTS` | a non-removed feature still depends on this one | nothing |
| `NOT-SHIPPED` | row isn't `shipped`/`deprecated` — route per rule 1 | nothing |

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/sunset.md`** — MACHINE-facing deprecation plan + append-only decision log: why (citing `outcome.md`), window, comms, flag-off, per-entity data handling (citing `data-management.md`), removal route, decisions. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md); skeleton in [references/templates.md](references/templates.md).
- **`.ai/features.md`** — MUTATED twice, ever: `shipped → deprecated` (D4) and `deprecated → removed` (R3). `/sunset` is the only writer of both states.
- **`tasks/remove-<feature>.md`** — the small-route free-form mtdd task (optional; template in [references/templates.md](references/templates.md)).
- **`.ai/progress-tracker.md`** — one appended entry per success verdict. No `.human` mirror (rule 10).

## References
- `sunset.md` skeleton · removal-task template · dependant-check method · decision-log shapes · tier matrix: [references/templates.md](references/templates.md)

</supporting-info>
