# Promotion gates

The criteria `/promote` evaluates in Phase 2, the evidence each item is checked against, and the defaults used when the team left `anchor.promotion_criteria` empty. Every item must cite **real** project evidence (rule 6) — a feature slug + its `status`, a `qa-report.md` path, a named anchor field — never a generic checkbox.

## Which criteria to use

1. Read `anchor.promotion_criteria.to_<target>` from `.ai/anchor.md`.
2. **Non-empty** → that list IS the gate; evaluate each item against the evidence sources below.
3. **Empty / absent** → use the **default gate** for the transition below.

Render each item as `✓ met` / `✗ unmet` / `? needs-confirmation`. The gate is advisory: `✗` items become **GATE-NOT-MET** with the specific missing evidence, but the human may override on the record (rule 7).

## Evidence sources (where to look)

| Source | Read for |
| :-- | :-- |
| `.ai/features.md` | the `status` column per feature — `shipped`, `qa-approved`, `building`, `planned`, `blocked`, `cut` (lowercase, per the features schema); the `priority` column (P0/P1 = core) |
| `.ai/specs/<feature>/qa-report.md` | QA approval evidence for a feature (presence + approved outcome) |
| `.ai/anchor.md` | `*_tentative: yes` flags and the `## TODO (tentative fields)` list; `ai_in_core_path` |
| `.ai/discovery/<slug>.md` | open questions still unresolved (prototype→mvp) |
| the human | validation judgement a file can't show ("has the prototype been demoed and judged worth expanding?") |

## Default gate — prototype → mvp

| Gate item | How to check | Verdict rule |
| :-- | :-- | :-- |
| Prototype validated by a human | Ask plainly: *"Has the prototype been used or demoed and judged worth expanding?"* | human "yes" → ✓; "no/unsure" → ✗ |
| Open questions / tentatives resolved | Scan `## TODO (tentative fields)` in `anchor.md` + open questions in `.ai/discovery/<slug>.md` | no unresolved blockers → ✓; list each blocker on ✗ |
| A feature roster exists | `.ai/features.md` present with ≥1 prioritized in-scope feature | present → ✓; absent → ✗ (route to `/feature-map`) |

prototype→mvp is a **light** gate — the prototype's job was to learn, not to be production-hard. Don't invent QA or security items here.

## Default gate — mvp → production

| Gate item | How to check | Verdict rule |
| :-- | :-- | :-- |
| Core features shipped or qa-approved | `.ai/features.md` — every P0/P1 in-scope feature has `status` `shipped` or `qa-approved` | all core done → ✓; list each lagging feature + its actual status on ✗ |
| QA evidence exists for core features | `.ai/specs/<feature>/qa-report.md` present + approved for each core feature | present/approved → ✓; missing → ✗ naming the feature |
| No unresolved tentative production fields | `anchor.md` has no `*_tentative: yes` on a field the production tier requires | none → ✓; list each tentative field on ✗ |
| Security & scale expectations known | Ask the user to confirm the production security/NFR expectations exist (detail is elicited later by `/anchor` update mode + `/architect` — here just confirm they're *known*, not "we'll figure it out later") | confirmed → ✓; "TBD" → ? needs-confirmation |
| Threat model exists or skip recorded | `.ai/architecture/threat-model.md` exists and is not stale vs the architecture (`scored_against` matches), OR a SKIPPED-TIER/skip decision is recorded — promotion to production requires a threat model or a recorded skip | current → ✓; recorded skip → ? needs-confirmation; neither → ✗ recommend `/threat-model` |
| SLOs locked or skip recorded | `.ai/slo.md` exists with verdict `SLO-LOCKED` (written by `/runbook --slo`), or the user records a skip with a reason | locked → ✓; recorded skip → ? needs-confirmation; neither → ✗ recommend `/runbook --slo` |

mvp→production is the **heavy** gate — it asserts the project will carry real users/data/SLAs. Be strict about core-feature completion and tentative fields; those are the items most often hand-waved.

## Writing `promotion_criteria` (for teams that customize)

If a team wants their own gate, it lives in `anchor.md` under `## Lifecycle`:

```yaml
promotion_criteria:
  to_mvp: [ "prototype demoed to 3 real users", "core invoice flow works end-to-end" ]
  to_production: [ "all P0 features qa-approved", "load test at 100 rps passes", "security review signed off" ]
```

Each string is one gate item; `/promote` checks it against the evidence sources above (asking the human where no file can confirm it). An empty list for a transition means "use the default gate."
