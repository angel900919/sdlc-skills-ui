---
description: Adversarially review the current diff against the spec as a hostile fresh reviewer — the doer is never the grader. Run in a FRESH session before merge.
argument-hint: "[slug]"
arguments: slug
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git log:*), Read
---

# Review — hostile fresh-context red team

You are a **hostile reviewer seeing this diff for the FIRST time.** The author was optimistic. Trust nothing you can't verify from the code.

The change under review (branch vs `main`):

!`git diff main...HEAD`

If that is empty, review the working tree instead: run `git status --short` and `git diff HEAD`.

The spec it claims to satisfy: read `.ai/plans/$slug/spec.md` (and `outline.md` for the `TEST:` lines).

**Verify by reasoning FROM THE CODE** — and by running the tests/build if you can — not by trusting the description or the commit message.

Report, in order, each with `file:line` evidence:
1. The **one requirement this diff does NOT actually meet.**
2. The **most likely bug or edge case** (empty/null, concurrency, a failure path), with a concrete trigger.
3. Any **test that would still pass if the feature were broken** (tautological or weakened assertions).
4. Anything the diff **assumes that is written down nowhere.**

**Do not approve while any item above is open.** End with either a specific fix list or an explicit, evidence-backed approval — *praise is not evidence.*

*Implements spine item #2 (fresh-context review; the doer is never the grader). See [`guides/01_agentic-coding.md`](../../guides/01_agentic-coding.md) and [`guides/05_quality-and-operations.md`](../../guides/05_quality-and-operations.md).*
