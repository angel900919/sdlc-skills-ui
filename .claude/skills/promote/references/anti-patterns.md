# Anti-patterns + refused questions

Scan the run against this before writing (SKILL.md backstop). Each row is a failure mode and why `/promote` refuses or corrects it.

## Anti-patterns

| Anti-pattern | Refuse / correct because |
| :-- | :-- |
| Skipping a stage (prototype → production) | The intermediate stage's rigor must be validated first; the gates assume a single step. Promote prototype→mvp, validate, then mvp→production. |
| Promoting without showing the gate | The human must approve with evidence in front of them, not blind (rule 5). |
| Bumping `project_tier` but not `lifecycle_stage` (or vice-versa) | Breaks the `lifecycle_stage == project_tier` invariant every downstream reader depends on. Always lockstep (rule 4). |
| Touching `stage: anchor` | That's the producer marker, unrelated to lifecycle. The lifecycle field is `lifecycle_stage`. Never edit `stage:`. |
| Letting the body `current:` line diverge from frontmatter `lifecycle_stage` | Frontmatter is the single source of truth; the body line only restates it. Update both together. |
| Eliciting the new tier's stack fields here (db, auth, observability, security_gate) | That's `/anchor` update mode's job; `/promote` routes there, doesn't duplicate it (rule 9). Leave those fields absent. |
| Inventing the new tier's fields with placeholder values | Same — leave absent; `/anchor` elicits them for real. Placeholders read as decided when they aren't. |
| Auto-running `/anchor` / `/architect` after promotion | The chain never auto-invokes; print the re-run checklist and let the user run it. |
| Demoting via `/promote` | Monotonic by design (rule 3); demotion is a deliberate manual `anchor.md` edit. |
| Silently blocking on an unmet gate | The gate is advisory — issue GATE-NOT-MET with specifics and offer the override; never just refuse (rule 7). |
| Silently bumping when the gate is unmet | The opposite failure — never promote past an unmet gate without an explicit human override recorded as `overridden: true` + reason. |
| Appending to the tracker on a `no` / blocked / no-op | Only a real promotion is a decision worth logging (rule 12). |
| Promoting with unresolved `*_tentative` production fields, silently | Surface each as `✗`; require explicit override with a reason. |
| Generic checklist items ("tests pass", "docs done") | Every gate item must cite *this* project's real evidence — feature slug + status, qa-report path, named anchor field (rule 6). |
| Treating a feature's lifecycle as the project's | Features have no `lifecycle_stage`. `/promote` advances the whole project; `/build`→`/qa`→`/ship` advance a feature; `/prd` uplifts a feature's tier. |

## Refused questions (and where they go)

- *"Just set the tier to production."* → No silent bump. The gate + approval is the whole point.
- *"Add the production security fields."* → `/anchor` update mode — `/promote` routes you there.
- *"Promote feature X to production."* → Features don't have a stage. Per-feature rigor is `/prd`'s automatic `max(project_tier, signal)`.
- *"Roll back to prototype."* → Manual `anchor.md` edit; `/promote` is forward-only.
- *"Ship this feature."* → `/ship <feature>`.
- *"Is the architecture ready for production?"* → `/architect` update mode / `/coherence-check`; `/promote` checks lifecycle gates, not design quality.
- *"Skip mvp, go straight to production."* → Validate mvp first; single-step only.