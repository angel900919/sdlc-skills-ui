---
name: threat-model
disable-model-invocation: true
description: |-
  Runs a STRIDE-lite threat-modeling pass over the locked architecture after /architect — derives trust boundaries from the dependency-edge table and entry points, names the assets worth attacking, and registers every credible threat scored 1-9 with a mitigation status. Routes each unmitigated high-score threat as a candidate invariant to /architect and a candidate Unwanted-behavior EARS clause to /prd, feeding the /to-fitness pipeline; drafts and routes, never adopts. Gated to production tier or uplift signals pii, money, regulatory, external-dependants; refreshed at /promote and on architecture changes. Writes .ai/architecture/threat-model.md plus a .human mirror diagram. Use when the user says "/threat-model", "threat model", "STRIDE", "security design", "who can attack this", "trust boundaries", or "attack surface". Do NOT use for: code vulnerability scanning (/health-audit, /security-review), the QA security check (/qa), mechanizing rules (/to-fitness), or architecture authoring (/architect).
---

<what-to-do>

You answer the one question no other chain stage asks: **who attacks this system, through which trust boundary, and what do we do about each credible threat?** You run **once per project** after `/architect` (the boundaries are derived from its dependency-edge table), and you **refresh** at `/promote` to production and after any `/architect` update that changes components or edges.

Your signature move is the **routed candidate**: for each unmitigated high-score threat you DRAFT (a) a candidate architecture invariant routed to `/architect` and/or (b) a candidate Unwanted-behavior EARS clause per affected feature routed to `/prd`. They own adoption; once adopted, the existing `/to-fitness` machinery mechanizes the result. You never edit their artifacts.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/architecture/threat-model.md` schema) before writing. Don't restate them — reference them.

## Critical rules

1. **Architecture and anchor are required.** No `.ai/architecture[.md|/]` (components + dependency edges) → `BLOCKED-ON-ARCHITECT → /architect`; nothing written. No `.ai/anchor.md` / no `project_tier` → `BLOCKED-ON-ANCHOR → /anchor`; nothing written. Check anchor first (you need the tier gate), then architecture.
2. **Tier gate.** Run when `project_tier` is `production` **OR** `anchor.uplift_signals` contains any of `pii`, `money`, `regulatory`, `external-dependants`. Below that, offer `SKIPPED-TIER` plainly: *"Nothing here handles money, personal data, or outside users yet — a threat model would be guessing. Skip until promote, or run a light pass anyway?"* If the user insists, run the **lite pass** (≤90 lines: top boundaries, assets, ≤10 threats, routed candidates, verdict; `mode: lite`).
3. **Draft and route — never adopt.** Candidate invariants are *proposed to* `/architect`; candidate Unwanted-EARS clauses are *proposed to* `/prd` for the affected feature. Never write into `.ai/architecture/02-components.md`, ADRs, or any `prd.md`. Each routed candidate carries `status: proposed`; a later run flips it to `adopted` only when the adopting artifact verifiably contains it.
4. **Match the architect's risk scale.** Score every threat **1–9 = impact × likelihood**, the same convention as `03-risk-storming.md` ([`../architect/references/characteristics.md` § Risk storming worksheet](../architect/references/characteristics.md)). Every threat scoring **≥6** needs a mitigation, a recorded acceptance with a named reason, or a routed candidate — same bar risk storming applies. If `03-risk-storming.md` exists, cross-reference overlapping risks by `R-NN` instead of duplicating them.
5. **No theater.** Every registered threat names a **credible actor and a path** through a confirmed boundary. "A hacker could hack it" is not a threat; "anyone with the public webhook URL can replay a captured payment notification because nothing checks a signature" is. Quality over quantity — an honest register of 6 beats a padded one of 30.
6. **Boundaries are derived mechanically, then confirmed.** Walk the architecture dependency-edge table and entry points per [references/boundaries.md](references/boundaries.md) — every edge crossing a process/network/org line, every external entry point (UI, API, webhook, queue, file upload, third-party callback). Propose the list; the user confirms or amends. Never invent a boundary no edge or entry point supports.
7. **Plain English in conversation, STRIDE letters in the artifact.** Ask *"could someone pretend to be another user here?"* — never *"Spoofing?"*. The question bank with the plain phrasings per category is [references/stride-questions.md](references/stride-questions.md). Record the category letter (S/T/R/I/D/E) only in the `.ai` register.
8. **Refresh mode preserves decisions.** If `threat-model.md` exists, compare the architecture's current component names + edges against the frontmatter `scored_against` snapshot. Diverged → announce *"NEEDS-REFRESH: architecture changed — [named diffs]"* and re-walk **only** the affected boundaries. Update in place: keep stable T-N ids, **never discard an `accepted` entry with its recorded reason** (re-confirm it instead), refresh the snapshot.
9. **Mitigation status is one of three.** `mitigated-by:` (a *named* existing control — architecture invariant, anchor `security_gate` entry, environments control, or PRD EARS clause id), `accepted` (with the user's recorded reason), or `open`. No vague "handled".
10. **No pen-testing, no code scanning, no compliance advice.** You model design-time threats; you never probe a running system or read source for vulnerabilities (`/health-audit`, `/security-review`). On regulatory/legal questions, record the user's decision and flag it `needs human review` — never advise. If asked for any out-of-lane work, capture it as a follow-up and steer back.
11. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, propose a recommended answer, wait. Adapt to `technical_user` from `.ai/intake.md`. The jargon (STRIDE, spoofing, repudiation, trust boundary) lives in the `.ai` artifact, never in the question.
12. **Two registers.** `.ai/architecture/threat-model.md` = structured register (it belongs in the architecture bundle; create the folder if a prototype-shaped single-file architecture has none). `.human/summaries/threat-model.md` = derived mirror — 3–6 plain bullets + **ONE** validated Mermaid boundary/data-flow flowchart (boundaries as subgraphs) via the [mermaid skill](../mermaid/SKILL.md). Diagrams never go in `.ai/`.
13. **Line caps.** Full register ≤250 lines; lite pass ≤90. Over cap → keep the highest-scored threats, fold the rest into `## Out of scope` with a one-line reason each.
14. **The gate is advisory.** Issue the real verdict with reasons; the user may override a negative verdict → `verdict_overridden: true` + recorded reason, still write the artifact. Never water down.
15. **Tracker.** Read `.ai/progress-tracker.md` top 5 at Phase 0; append one entry on a success verdict (`THREAT-MODEL-LOCKED[-WITH-OPEN-THREATS]`) per the [`../_shared/conventions.md`](../_shared/conventions.md) format. Skip on refusal verdicts.

## Procedure

Copy this checklist:

```
threat-model progress:
- [ ] Phase 0: Tracker top 5; detect existing threat-model.md → refresh mode + staleness check vs scored_against
- [ ] Phase 1: Load anchor (REQUIRED → tier gate) + architecture (REQUIRED) + environments/context/understanding/features/intake (warn); announce
- [ ] Phase 2: Derive trust boundaries from edges + entry points; propose; user confirms
- [ ] Phase 3: Name the assets worth attacking (context entities + uplift signals)
- [ ] Phase 4: STRIDE-lite walk per boundary — plain-English, one question at a time
- [ ] Phase 5: Register credible threats (T-N, score 1-9, mitigation status)
- [ ] Phase 6: Draft routed candidates for unmitigated ≥6 threats (invariants → /architect, Unwanted-EARS → /prd)
- [ ] Phase 7: Read back; write .ai register + .human mirror (one diagram via mermaid skill)
- [ ] Phase 8: Append tracker (success only); issue verdict
```

### Phase 0 — Session context + mode
Read `.ai/progress-tracker.md` top 5 (expect an `architect landed` entry). If `.ai/architecture/threat-model.md` exists: read its `scored_against` snapshot, diff against the architecture's current component names + dependency edges, and either announce **refresh mode** with the named diffs (rule 8) or, if nothing diverged, restate the register (boundary/threat/open counts) and ask what to update. Otherwise proceed fresh.

### Phase 1 — Load inputs, gate the tier, announce
Frontmatter-first, then only the sections you consume:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (tier gate), `uplift_signals` (gate + asset hints), `security_gate` (existing controls), stack | **BLOCKED-ON-ANCHOR** |
| `.ai/architecture[.md\|/]` | components, **dependency-edge table**, entry points, existing invariants, `03-risk-storming.md` if present | **BLOCKED-ON-ARCHITECT** |
| `.ai/environments.md` | env roster, secrets storage, deploy mechanism → env/secrets attack surface | warn (thinner surface) |
| `.ai/context.md` | entity names → asset candidates | warn |
| `.ai/understanding/<slug>.md` | domain invariants → existing mitigations | warn |
| `.ai/features.md` | feature slugs → where to route Unwanted-EARS candidates | warn (route project-level) |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Apply the tier gate (rule 2). If it passes, announce: *"Production-tier threat model over [N] components and [N] edges; uplift signals: [list]. I'll propose the trust boundaries first, then walk each one with a few plain questions. Proceed?"*

### Phase 2 — Derive trust boundaries
Walk the checklist in [references/boundaries.md](references/boundaries.md): every dependency edge crossing a process, network, or org line; every external entry point (UI, API, webhook receiver, queue consumer, file upload, third-party callback, scheduled external pull); plus the `environments.md` surfaces (secret stores, CI, deploy path). Present the proposed `B-N` table in plain words (*"the line between your app and Stripe's callbacks"*) and confirm one round of additions/removals. A boundary the user names that no edge supports → either a missing architecture edge (`NEEDS-ARCHITECTURE-UPDATE`, rule on Phase 8) or out of scope, recorded.

### Phase 3 — Name the assets
From `context.md` entities + `uplift_signals` + `security_gate`, list what an attacker actually wants: credentials, session tokens, PII fields, money paths, write access to records, the secrets in `environments.md`. One confirm round: *"If someone broke in, the prizes are [list] — what am I missing?"* Asset prompts: [references/stride-questions.md](references/stride-questions.md).

### Phase 4 — STRIDE-lite walk
Per confirmed boundary, walk the six categories conversationally using [references/stride-questions.md](references/stride-questions.md) — **one question at a time, plain English, with a proposed answer** (rule 11). Skip categories that obviously don't apply to a boundary (say so in one line). Record the STRIDE letter only in the artifact (rule 7). Lite pass: top 2–3 boundaries only.

### Phase 5 — Register the threats
Each credible threat (rule 5) becomes a `T-N` block: STRIDE letter · boundary `B-N` · actor · plain scenario · impact × likelihood → score 1–9 (rule 4) · mitigation status (rule 9). Check claimed mitigations against the *named* control before accepting them. Cross-reference `03-risk-storming.md` `R-NN` overlaps.

### Phase 6 — Draft routed candidates
For every threat scoring ≥6 with status `open`: draft a candidate **architecture invariant** (one falsifiable sentence, routed to `/architect`) and/or a candidate **Unwanted-behavior EARS clause** per affected feature (If–Then shape per [`../prd/references/ears.md`](../prd/references/ears.md), routed to `/prd <feature>`), as `RC-N` entries with `status: proposed`. Prefer mitigations `/to-fitness` could later mechanize (structural or numeric, not "be careful"). Read each candidate back: *"I'll propose this rule to the architecture / the X feature's requirements — sound right?"* On refresh, flip `proposed → adopted` only when the target artifact now contains the rule.

### Phase 7 — Read back, then write both registers
Read back boundaries, top threats, acceptances, and routed candidates in plain English: *"where did I misrepresent the risk?"* Enforce the line cap (rule 13). Write **`.ai/architecture/threat-model.md`** per the schema (skeleton: [references/template.md](references/template.md)) — frontmatter counts + `scored_against` snapshot + fixed sections `## Trust boundaries` · `## Assets` · `## Threat register` · `## Routed candidates` · `## Out of scope` · `## Verdict`. Then write the **`.human/summaries/threat-model.md`** mirror — 3–6 bullets + ONE boundary/data-flow flowchart (boundaries as subgraphs) generated via the [mermaid skill](../mermaid/SKILL.md). Refresh mode: update in place, preserve accepted entries + ids (rule 8).

### Phase 8 — Tracker + verdict
Append a tracker entry on success only. Issue exactly one verdict:

- **`THREAT-MODEL-LOCKED → /prd`** — register written; no `open` threats ≥6 (each is mitigated, accepted-with-reason, or routed). Hand off: *"Threat model locked. Next: `/prd <feature>` — at production it reads the Routed candidates for its Unwanted-behavior clauses."*
- **`THREAT-MODEL-LOCKED-WITH-OPEN-THREATS → /prd`** — register written but `open_count` > 0. Same hand-off, said loudly: name every open T-N + score and state that `/qa`'s security check will WARN on them until they're mitigated or accepted.
- **`SKIPPED-TIER`** — gate below threshold and the user didn't insist. Nothing written; note it for `/promote` (promotion to production will ask again).
- **`NEEDS-ARCHITECTURE-UPDATE → /architect`** — a threat or boundary revealed a missing component/edge (name it). Route to `/architect` first; save partial work as `status: draft`.
- **`BLOCKED-ON-ARCHITECT → /architect`** — no architecture artifact; nothing written.
- **`BLOCKED-ON-ANCHOR → /anchor`** — no anchor / no `project_tier`; nothing written.

If the user overrides a negative verdict, set `verdict_overridden: true`, record the reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/architecture/threat-model.md`** — MACHINE-facing register in the architecture bundle. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Read by `/prd`, `/architect`, `/qa`, `/promote`. No diagrams.
- **`.human/summaries/threat-model.md`** — HUMAN-facing derived mirror: 3–6 plain bullets + one validated boundary/data-flow flowchart via the mermaid skill.

## References
- Boundary-derivation checklist (edge crossings, entry-point inventory, environments surfaces, B-N table shape): [references/boundaries.md](references/boundaries.md)
- STRIDE-lite question bank — plain-English phrasings per category, credibility bar, asset prompts: [references/stride-questions.md](references/stride-questions.md)
- Full `.ai` artifact skeleton + lite-pass shape + `.human` mirror skeleton: [references/template.md](references/template.md)
- Risk-scoring convention to match (1–9 impact × likelihood, ≥6 bar): [`../architect/references/characteristics.md`](../architect/references/characteristics.md)
- Unwanted-behavior EARS clause shape the routed candidates use: [`../prd/references/ears.md`](../prd/references/ears.md)

</supporting-info>
