---
name: environments
disable-model-invocation: true
description: |-
  Writes .ai/environments.md — the project-level environment spec: the environment roster, the config/env-var inventory, the secrets policy, config conventions, the feature-flag system, and IaC location. Records secret NAMES and storage locations only — never a secret value. Runs after /bootstrap on greenfield, or after /explore on brownfield in recovery mode (scans the repo and confirms with file:line citations, never inventing); re-run in update mode whenever a slice adds config. Use when the user says "/environments", "environment spec", "env vars", "config inventory", "secrets policy", "where does this config go", or "add an environment". Do NOT use for: deploying or releasing (/ship plus CI/CD), choosing hosting (/anchor), scaffolding the skeleton (/bootstrap), or writing application config code (the build phase).
---

# Environments — the env roster + config inventory lock

<what-to-do>

You lock the **project environment spec** — the environment roster, the config/env-var
inventory, the secrets policy, the config conventions, the feature-flag system, and the
IaC location — into `.ai/environments.md`, which `/design`, `/to-issues`, and `/ship` read.
You enumerate and record; you never provision, deploy, or write config code.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory
gates, tier dial, tracker, Talking to the human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md)
(the `.ai/environments.md` schema) before writing. Don't restate them — reference them.

## Critical rules (read before starting)

1. **NAMES and storage locations — NEVER values.** The inventory records each variable's
   name, type, secret flag, required-in envs, and where it is SET (`.env` file, CI secret
   store, cloud secret manager). If the user pastes a secret value (an API key, a connection
   string with a password, a token), **refuse to write it anywhere** — not in `.ai/`, not in
   `.human/`, not in chat read-backs. Say where it belongs (the named store for that env) and,
   because it was pasted into a chat transcript, recommend rotating it. No exceptions, any tier.
2. **Anchor required.** No `.ai/anchor.md` → `BLOCKED-ON-ANCHOR → /anchor`. It supplies
   `project_tier` (INHERIT — never recompute), `project_type`, `hosting`, and
   `deployment_target`. Never re-choose hosting here — that's `/anchor`'s lock.
3. **Greenfield needs a skeleton.** If `project_type: greenfield` and the filesystem probe
   finds no skeleton (no manifests, no `.env.example`, no CI files, no config module) →
   `BLOCKED-ON-BOOTSTRAP → /bootstrap`; there is nothing to enumerate yet. A missing
   `.ai/bootstrap.md` *artifact* with a real skeleton on disk is only a warning.
4. **Brownfield = RECOVERY mode: scan first, propose, confirm.** Scan `.env.example`, CI
   workflow files, IaC, docker-compose, and config modules per
   [references/brownfield-scan.md](references/brownfield-scan.md); propose the **detected**
   inventory with a `file:line` citation per claim and let the user confirm or correct.
   **Never invent** an environment, variable, or store the scan didn't find — an uncited
   guess becomes an Open question instead.
5. **Tier dial + hard line caps 90 / 185 / 250.** prototype: the skill is optional — offer
   `SKIPPED-PROTOTYPE`; if the user proceeds, a single-env one-pager. mvp: required —
   roster + inventory + secrets policy + conventions, and the `.human` mirror. production:
   full — adds secrets rotation, IaC location + apply mechanism, and a smoke command per env.
   Over cap → prune detail, never drop a required section.
6. **Enumerate, never act.** No provisioning, no deploys (`/ship` + CI/CD own those), no
   scaffolding (`/bootstrap`), no application config code (build phase). This skill's only
   side effects are the two artifact files and a tracker append.
7. **Update mode.** If `.ai/environments.md` exists, restate it (env count, var count,
   secret count), ask which rows/sections to refresh, change only those, preserve the rest —
   the expected steady state, since every slice that adds config re-runs this skill.
8. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the
   human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) —
   one question at a time, always with a proposed answer, adapted to `technical_user` from
   `.ai/intake.md`. Say "settings your app reads at startup," not "config inventory," to a
   non-technical user.
9. **Two registers.** `.ai/environments.md` is structured (frontmatter index + fixed-order
   tables, no diagrams). At **mvp+**, also write `.human/summaries/environments.md` — plain
   English + ONE validated Mermaid diagram (the env promotion flow, e.g. dev → staging →
   prod) generated via the **mermaid skill**. No mirror at prototype.
10. **Advisory gate + tracker + one verdict.** Issue the real verdict with reasons; an
    override sets `verdict_overridden: true` + the recorded reason. Read
    `.ai/progress-tracker.md` top 5 at Phase 0; append one entry **only** on
    `ENVIRONMENTS-LOCKED`. Exactly one verdict per run.

## Procedure

Copy this checklist:

```
environments progress:
- [ ] Phase 0: Tracker top 5; detect existing environments.md (update mode if present)
- [ ] Phase 1: Load anchor (REQUIRED) + intake + bootstrap/recon; gates; announce tier + mode
- [ ] Phase 2: Prototype offer (SKIPPED-PROTOTYPE) / brownfield RECOVERY scan (cited proposal)
- [ ] Phase 3: Environment roster (envs, purpose, URL, deploy mechanism, smoke per env)
- [ ] Phase 4: Config inventory (names + where SET — never values) + secrets policy
- [ ] Phase 5: Config conventions + feature flags + IaC (tier-gated)
- [ ] Phase 6: Read back; confirm no value leaked into the draft
- [ ] Phase 7: Write .ai/environments.md (tier cap) + .human mirror at mvp+ (mermaid skill)
- [ ] Phase 8: Append tracker (success only); issue verdict
```

### Phase 0 — Tracker + mode
Read `.ai/progress-tracker.md` top 5 (expect `bootstrap landed` on greenfield or
`explore landed` on brownfield). If `.ai/environments.md` exists → **update mode** (rule 7):
restate, ask what changed (usually "slice N added a variable" or "we added staging"),
touch only that.

### Phase 1 — Load inputs + gates
Frontmatter-first:

| File | For | Missing → |
| :-- | :-- | :-- |
| `.ai/anchor.md` | `project_tier` (INHERIT), `project_type`, `hosting`, `deployment_target` (mvp+) | **BLOCKED-ON-ANCHOR** |
| `.ai/bootstrap.md` | greenfield: the scaffolded `.env.example`, CI, and dev-script steps to seed from | warn (greenfield) |
| `.ai/recon.md` | brownfield: Section A (deploy surface, datastores) + Section D (decisions) seed the scan | warn (brownfield) |
| `.ai/intake.md` | `technical_user` → question depth | warn |

Greenfield + no skeleton on disk (rule 3 probe) → `BLOCKED-ON-BOOTSTRAP → /bootstrap`.
**Announce:** *"Anchor: tier `mvp`, greenfield, hosting Vercel. Running mvp-tier
environments: roster + config inventory + secrets policy + conventions, ≤185 lines,
plus a human summary with the promotion-flow diagram. Proceed?"*

### Phase 2 — Tier offer / RECOVERY scan
- **prototype:** offer the skip — *"At prototype tier this is optional: usually one env
  (your machine) and a handful of settings. Skip for now, or write the one-pager?"* Skip →
  `SKIPPED-PROTOTYPE` (nothing written). Proceed → single-env one-pager, ≤90 lines.
- **brownfield (any tier):** run the RECOVERY scan per
  [references/brownfield-scan.md](references/brownfield-scan.md) before asking anything.
  Present the detected roster + inventory as a cited proposal (*"CI deploys `main` to Fly.io
  — `.github/workflows/deploy.yml:31`; `.env.example` names 14 vars — confirm?"*) and let
  the user correct per row. Unfindable facts (e.g. where prod secrets actually live) become
  direct questions; still-unknown → Open questions, never guesses.
- **greenfield:** seed the draft from `.ai/bootstrap.md`'s `.env.example` + CI steps and
  anchor's hosting; the skeleton defines the first environment.

### Phase 3 — Environment roster
One row per **real** environment (dev/staging/prod, or whatever actually exists — don't
impose the classic trio on a project with two): purpose · URL/host · deploy mechanism
(exact command or CI trigger, e.g. "merge to `main` runs deploy.yml") · smoke command
(per env at production; at least prod at mvp). Table shape:
[references/template.md](references/template.md).

### Phase 4 — Config inventory + secrets policy
One row per config/env var: **name · purpose · type · secret yes/no · required-in envs ·
where SET per env**. Walk the seed list (Phase 2) first, then ask once: *"Any settings the
app reads that aren't on this list — API keys, connection strings, feature switches?"*
Enforce rule 1 loudly the moment a value appears. Then the **secrets policy**: the store(s)
in use per env, the never-in-repo rule (`.env` gitignored; `.env.example` carries names +
placeholders only), and — production — the rotation note (what rotates, roughly when, who).

### Phase 5 — Conventions + flags + IaC (tier-gated)
- **Config conventions** (mvp+): naming pattern (e.g. `APP_*`, SCREAMING_SNAKE), the one
  code location new config is read in, and the validation-at-boot expectation (the app
  fails fast on a missing required var — name the mechanism if one exists).
- **Feature flags** (if any): where flags live, naming pattern, lifecycle (created → rolled
  out → removed). This is the flag system `/ship` cites when noting "shipped ≠ exposed."
  None → record `flag_system: none`.
- **IaC** (production): path + apply mechanism (e.g. `infra/` via `terraform apply` in CI).
  None → `iac_path: none` + an Open question if hosting implies infra someone hand-built.

### Phase 6 — Read back
Assemble from [references/template.md](references/template.md). Scan the draft for
anything value-shaped (long random strings, `key=AKIA…`, passwords in URLs) — strip and
replace with the var name + store. Paste; ask: *"Is every environment real? Any variable
missing or misplaced? Where did I misrepresent you?"* Their corrections win.

### Phase 7 — Write the artifacts
1. **`.ai/environments.md`** — per the schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md);
   enforce the tier line cap (90/185/250). Update mode preserves untouched rows.
2. **`.human/summaries/environments.md`** (mvp+) — one plain sentence ("here are the
   environments and where every setting lives"), 3–6 jargon-free bullets, ONE validated
   Mermaid promotion-flow diagram via the **mermaid skill**, link back to the `.ai` file.

### Phase 8 — Tracker + verdict
Append a tracker entry on `ENVIRONMENTS-LOCKED` only (per
[`../_shared/conventions.md`](../_shared/conventions.md); update-mode runs note which
rows changed). Issue exactly one verdict:

| Verdict | When | Hand-off |
|---|---|---|
| `ENVIRONMENTS-LOCKED` | artifact written (first run or update) | *"Environment spec locked: N envs, M vars (S secret). Next: `/pipeline` to lock the delivery contract over this roster — or `/test-strategy` first if that stage hasn't run yet. Re-run `/environments` whenever a slice adds config."* |
| `SKIPPED-PROTOTYPE` | prototype tier, user took the skip | nothing written; *"Re-run when a second environment or a real secret appears — or after `/promote`."* |
| `BLOCKED-ON-ANCHOR → /anchor` | `.ai/anchor.md` missing | nothing written |
| `BLOCKED-ON-BOOTSTRAP → /bootstrap` | greenfield + no skeleton on disk | nothing written |

If the user overrides a negative verdict, set `verdict_overridden: true`, record the
reason, route onward.

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/environments.md`** — MACHINE-facing environment spec (schema in
  [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). No diagrams, **no values**. Read by
  `/design`, `/to-issues`, `/ship`.
- **`.human/summaries/environments.md`** (mvp+) — plain-English mirror + ONE validated
  promotion-flow diagram via the mermaid skill.

## References
- Skeleton + roster/inventory table templates + human-mirror shape: [references/template.md](references/template.md)
- Brownfield RECOVERY scan checklist: [references/brownfield-scan.md](references/brownfield-scan.md)

</supporting-info>
