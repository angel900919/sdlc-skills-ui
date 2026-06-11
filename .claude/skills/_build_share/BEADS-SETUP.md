# Configuring beads so it never silently drops ticket state

The chain skills that touch beads (`/mtdd-implement`, `/mtdd-review`, `/mtdd-verify`,
`/mtdd-merge`, `/build`, `/publish-issues`, `/status`) close and update tickets as part of
normal operation. Under **one specific beads configuration**, a closed ticket can silently
revert to "open" after a routine `git checkout` — no error, it just reverts.

This file explains the failure mode and how to set beads up, in **any** project, so it can't
happen. It's a one-time setup decision, made before you start coding — not something the
skills can fix at runtime.

## The failure mode in one sentence

If beads is set up so that **(a)** `issues.jsonl` is git-tracked **and** **(b)** a git hook
re-imports that file into the beads database on every branch switch, then any ticket state
change that wasn't committed into `issues.jsonl` gets wiped the next time you switch branches.

Concretely: `/mtdd-merge` closes a bead but (by design) doesn't commit the export. You later
`git checkout` the feature branch to delete it; the hook rebuilds the database from that
branch's stale `issues.jsonl`; the close vanishes silently.

## The three ingredients — you need ALL THREE to be bitten

1. The beads database is rebuilt from `issues.jsonl` (classic JSONL-as-source-of-truth /
   `no-db` mode), or a hook imports JSONL → DB.
2. `issues.jsonl` is **git-tracked**, so it changes when you switch branches.
3. A `post-checkout` / `post-merge` git hook is **installed** that performs that re-import.

**Remove any one ingredient and the bug cannot occur.**

## Recommended setup (the safe default) — Dolt backend

Modern beads (1.0+) defaults to an embedded **Dolt** database as the source of truth. This is
the safe configuration because the database is decoupled from your git branches:

- The database lives in `.beads/embeddeddolt/` and is **gitignored** — `git checkout` never
  touches it. Dolt has its own versioning, independent of which git branch is checked out.
- `issues.jsonl` is just a **gitignored** local export, not the source of truth.
- No branch switch rebuilds the database.

Verify you're on this setup (all three should pass):

```sh
# 1. Dolt DB present and gitignored
git check-ignore .beads/embeddeddolt >/dev/null && echo "DB gitignored ✓" || echo "⚠ DB tracked — review"

# 2. JSONL export gitignored
git check-ignore .beads/issues.jsonl >/dev/null && echo "JSONL gitignored ✓" || echo "⚠ JSONL tracked — review"

# 3. re-import hooks — resolve the EFFECTIVE hooks dir. Beads usually routes via
#    core.hooksPath → .beads/hooks, NOT .git/hooks/, so checking .git/hooks/ alone LIES.
HOOKS_DIR="$(git config --get core.hooksPath || echo .git/hooks)"
ls "$HOOKS_DIR" 2>/dev/null | grep -Eq 'post-checkout|post-merge' \
  && echo "⚠ checkout/merge hooks ACTIVE in $HOOKS_DIR — JSONL→DB re-import path is live" \
  || echo "no checkout/merge hooks ✓"
```

**The decisive check is #2 (export gitignored).** Beads almost always keeps its hooks live via
`core.hooksPath → .beads/hooks`, so check #3 will usually report the re-import path as *active* —
that's normal and harmless **as long as the export is gitignored** (a gitignored `issues.jsonl`
doesn't change across branches, so the live hook has nothing stale to re-import). If #1 and #2
pass, you're immune even with the hooks active. This is exactly why `project_sample/` is safe —
its hooks ARE live via `core.hooksPath`, but its `issues.jsonl` is gitignored.

## Do NOT "fix" it by un-ignoring `issues.jsonl`

Tracking `issues.jsonl` adds **ingredient #2** — it moves you *toward* the vulnerable model,
not away from it, and adds git noise plus merge conflicts on that file. **Keep `issues.jsonl`
gitignored — that's the one lever you actually control.** In a beads repo the other two
ingredients (Dolt backend + live `core.hooksPath` hooks) are usually present already, so
whether you track the export is precisely what flips a repo between *safe* and *exposed*.

## If you deliberately use the classic JSONL model

Some teams want `issues.jsonl` tracked so ticket state shows up in git history / PRs. That's a
valid choice — but then the discipline is on you:

- **After every beads mutation, commit the export:**
  `bd export && git add .beads/issues.jsonl && git commit`. Never leave a close uncommitted.
- **Do not install a blind re-import `post-checkout` hook**, or accept that you must always
  commit the export *before* switching branches.

The `/mtdd-merge` skill does **not** commit the export for you ("human commits / human pushes"
by design), so in this model nothing protects an uncommitted close but your own discipline.

## What the skills do for you

`/mtdd-merge` runs a **close guard**: right after `bd close` it reads the bead back with
`bd show --json` and stops if the status isn't `closed`. This catches a *failed* close (wrong
ID, locked DB, no-op). It **cannot** catch a revert that happens *after* the skill exits — that
is what the configuration above prevents. The guard is a cheap sanity check; the configuration
is the real safety.

## One-time checklist before coding on a new project

- [ ] Beads uses the Dolt backend (`.beads/embeddeddolt/` exists).
- [ ] `.beads/embeddeddolt/` and `.beads/*.jsonl` are gitignored.
- [ ] Resolved the **effective** hooks dir (`git config core.hooksPath`, else `.git/hooks/`);
      if checkout/merge re-import hooks are live there — they usually are in beads repos — the
      gitignored export above is what protects you, so double-check that.
- [ ] You are NOT in `no-db` / JSONL-only mode (`no-db: false` in `.beads/config.yaml`).
