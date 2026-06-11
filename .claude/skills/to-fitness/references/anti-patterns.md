# /to-fitness anti-patterns

Patterns to reject. Scan before writing files (Phase 6) and before issuing the verdict.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Vacuous fitness function | A test that passes no matter what the code does; no concrete `FAILS WHEN:` can be named | The rule is unmechanizable as written → route to `## Cannot mechanise`; flag the source line. A green-always test is worse than none — it signals coverage that isn't there. |
| Faked mechanization | Writing a "test" for a subjective rule ("API is consistent", "naming is clear") | Don't. List it under `## Cannot mechanise`; bounce to `/prd`/`/architect` to rephrase, or accept as manual review. |
| Editing upstream to fit | Silently rewriting a PRD / architecture / anchor line so a rule becomes mechanizable | Never. Bounce `NEEDS-MECHANIZATION` and tell the user which line to rephrase upstream, then re-run. |
| Authoring a new rule | Inventing an invariant / NFR the source artifacts never stated | This skill transforms existing rules only. A missing rule is an upstream gap (`/architect` or `/prd`). |
| Auto-deleting orphans | Removing a `fitness/` file because its source line vanished | List it as an orphan in the verdict; let the user confirm. A stale fitness function is often the only surviving record of a removed invariant. |
| Citation-less header | A generated file with no `Source: file:line` | Every file cites its source artifact + the rule verbatim, or it can't be re-checked for orphan status next run. |
| Backward-compat shim | On re-write, keeping both the old and new source citation | Overwrite cleanly — one citation, the current one. |
| Line-number filenames | `fitness/rule-42.ts`, `fitness/invariant-3.py` | Name from the rule's verb + subject (intent), so source re-orderings don't churn file paths. |
| Running the suite | Invoking `vitest`/`pytest` after writing the files | Generator, not executor. Emit the command; the user runs it (and verifies red-first). |
| Generating below production | Writing `fitness/` files at prototype/mvp | `SKIPPED-NON-PRODUCTION`. Cheap to write, heavy to maintain, and nothing runs them at lower tiers. |
| Skipping CODEOWNERS | Writing `fitness/` without marking it human-owned | Append `fitness/ @<team>` — the agent CI must not be able to edit the rules it's meant to obey. |
| NFR adjective as a number | Mechanizing "fast" / "responsive" as if it had a threshold | An NFR without a number + named measurement source → `Cannot mechanise`; bounce to `/prd` for a real threshold. |
