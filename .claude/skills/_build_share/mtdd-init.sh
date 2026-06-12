#!/bin/sh
# mtdd-init.sh — one-time environment detection for the MTDD bundle.
# Git-only + standard POSIX tools (no Node/jq): needs `git`, `sh`, `grep`, `sed`.
#
# Detects, for the current repo, the values the mtdd-* phases would otherwise
# re-sniff (and re-ask) every run, and prints them as sh-sourceable key=value
# lines to STDOUT. The `mtdd-init` skill shows these to the user, lets them
# correct any, and writes the confirmed set to `.mtdd/config`. Diagnostics and
# validation warnings go to STDERR so STDOUT stays a clean config block.
#
# usage:
#   sh mtdd-init.sh            # print detected key=value lines to stdout
#   sh mtdd-init.sh --write    # also write/overwrite ./.mtdd/config
#
# exit codes:
#   0  detection ran (warnings, if any, on stderr)
#   2  not a git repo (cannot detect a target branch)

write=0
for a in "$@"; do
    case "$a" in
        --write) write=1 ;;
        *) ;;
    esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "SETUP: not inside a git work tree — run mtdd-init from the repo root." >&2
    exit 2
fi

root=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$root" ] && cd "$root"

# --- target branch ----------------------------------------------------------
# Prefer the remote's default head; else a local `develop`; else current branch.
target=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
if [ -z "$target" ]; then
    if git rev-parse --verify --quiet develop >/dev/null 2>&1; then
        target=develop
    else
        target=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    fi
fi

# --- language + typecheck/test commands -------------------------------------
# Heuristic, root-manifest based. The user confirms, so approximate is fine.
language=unknown
typecheck_cmd=""
test_cmd=""

if [ -f package.json ]; then
    language=typescript
    [ -f tsconfig.json ] || language=javascript
    if grep -q '"typecheck"' package.json 2>/dev/null; then
        typecheck_cmd="npm run typecheck"
    elif [ "$language" = typescript ]; then
        typecheck_cmd="npx tsc --noEmit"
    fi
    if grep -q '"test"' package.json 2>/dev/null; then
        test_cmd="npm test"
    fi
elif [ -f pyproject.toml ] || [ -f setup.py ] || [ -f setup.cfg ] || ls ./*.py >/dev/null 2>&1; then
    language=python
    typecheck_cmd="mypy ."
    test_cmd="pytest"
elif [ -f go.mod ]; then
    language=go
    typecheck_cmd="go vet ./..."
    test_cmd="go test ./..."
elif [ -f Cargo.toml ]; then
    language=rust
    typecheck_cmd="cargo check"
    test_cmd="cargo test"
fi

# --- task source ------------------------------------------------------------
# beads if the bd CLI + a beads DB are present; canonical if the chain's spec/
# ticket trees exist; otherwise the portable free-form core.
task_source=free-form
if command -v bd >/dev/null 2>&1 && [ -d .beads ]; then
    task_source=beads
elif [ -d .ai/specs ] || [ -d tickets ]; then
    task_source=canonical
fi

# --- validation (stderr only) -----------------------------------------------
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
if [ ! -f "$script_dir/gates/tdd-check.sh" ]; then
    echo "WARN: gates/tdd-check.sh not found next to this script ($script_dir/gates/). The shared bundle may not be laid out as .claude/skills/_build_share/ — the TDD-order gate will not run." >&2
fi
if [ ! -f "$script_dir/agents/verifier.md" ]; then
    echo "WARN: agents/verifier.md not found next to this script ($script_dir/agents/). The review/verify/qa phases will fall back to in-context grading." >&2
elif [ ! -f .claude/agents/verifier.md ]; then
    echo "INFO: verifier subagent not yet seeded at .claude/agents/verifier.md — run with --write to copy it." >&2
fi
if [ ! -d .claude/skills/mtdd-implement ]; then
    echo "WARN: .claude/skills/mtdd-implement/ not found from the repo root. Claude Code discovers skills only at .claude/skills/<name>/ — copy the mtdd-* folders there." >&2
fi
[ "$language" = unknown ] && echo "WARN: could not detect a language from root manifests — set mtdd_language and the commands by hand." >&2

# --- emit (stdout: clean, sh-sourceable) ------------------------------------
echo "mtdd_target_branch=$target"
echo "mtdd_language=$language"
echo "mtdd_typecheck_cmd=\"$typecheck_cmd\""
echo "mtdd_test_cmd=\"$test_cmd\""
echo "mtdd_task_source=$task_source"

# --- optional write ---------------------------------------------------------
if [ "$write" -eq 1 ]; then
    mkdir -p .mtdd
    {
        echo "# .mtdd/config — written by mtdd-init. Edit by hand or re-run /mtdd-init."
        echo "# Read by the mtdd-* phases; sh-sourceable (key=value) so the gates can read it too."
        echo "mtdd_target_branch=$target"
        echo "mtdd_language=$language"
        echo "mtdd_typecheck_cmd=\"$typecheck_cmd\""
        echo "mtdd_test_cmd=\"$test_cmd\""
        echo "mtdd_task_source=$task_source"
    } > .mtdd/config
    echo "WROTE: .mtdd/config" >&2

    # Seed the read-only verifier subagent (Claude Code discovers agents only at
    # .claude/agents/). Never overwrite a differing copy — a project may have
    # customized it; updating a customized grader is the human's call.
    if [ -f "$script_dir/agents/verifier.md" ]; then
        if [ ! -f .claude/agents/verifier.md ]; then
            mkdir -p .claude/agents
            cp "$script_dir/agents/verifier.md" .claude/agents/verifier.md
            echo "WROTE: .claude/agents/verifier.md" >&2
        elif ! cmp -s "$script_dir/agents/verifier.md" .claude/agents/verifier.md; then
            echo "WARN: .claude/agents/verifier.md differs from the bundle copy ($script_dir/agents/verifier.md) — left untouched; update by hand if intended." >&2
        fi
    fi
fi
