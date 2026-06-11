# Verdict-specific hand-off prose

Pick the block matching the verdict issued in Phase 8.

## `READY-FOR-COMPREHEND → /comprehend`

> Recon landed: `.ai/recon.md`. Citations verified. Next: **`/comprehend`** (the brownfield domain-recovery skill — *not* greenfield `/understand`).
>
> When `/comprehend` confirms the domain, paste **Section C** (glossary candidates + invariants + inferred journeys) as starting input. The glossary terms come from real identifiers in the code — `/comprehend` confirms them into `.ai/context.md` and surfaces any conflicts with terms you already use.
>
> **Section E (Mystery zones)** is the list of things the code can't answer — `/comprehend` will ask you about each one directly. Skim it now so you're ready.
>
> After `/comprehend` finishes, run `/architect` (update mode if `.ai/architecture.md` or `.ai/architecture/` exists). At that point paste **Sections A + B + D**.

## `READY-FOR-ARCHITECT → /architect`

> Recon landed: `.ai/recon.md`. The domain model (`.ai/understanding/<slug>.md`) is already recovered — skipping straight to architecture.
>
> Next: **`/architect`**. If `.ai/architecture.md` or `.ai/architecture/` exists, it detects that and switches to update mode. Paste:
>
> - **Section A** (repo shape) — runtimes, deployment surface, datastores → seeds C4 Context + Container.
> - **Section B** (component decomposition) — existing components → either updates the documented list or replaces it if the code has drifted.
> - **Section D** (decisions already made) — visible decisions → seed the ADR backlog (capture context for future readers, even if the decision was implicit).
>
> Then follow whatever verdict `/architect` issues.

## `SKIPPED-GREENFIELD`

> No recon written. Either `anchor.md` says `project_type: greenfield` or no application manifests were detected on disk.
>
> If this is a **truly new project**: skip `/explore`, run `/understand` next.
>
> If this is **brownfield but anchor disagrees with the filesystem**: anchor and disk are in conflict — re-run `/anchor` (it scans the repo and proposes the detected stack) to reconcile, then re-run `/explore`.

## `BLOCKED-ON-ANCHOR → /anchor`

> No `.ai/anchor.md` found. `/explore` needs the locked stack to scope the sub-agent scan (otherwise the sub-agent wastes its context window probing irrelevant directories).
>
> Run `/anchor` first. On brownfield it scans manifests automatically and proposes the detected stack — usually a 2-minute step. (If you haven't run `/onboard` yet, start there — it writes the intake stub `/anchor` needs.) Then re-run `/explore`.
