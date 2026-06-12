#!/bin/sh
# inject-state.sh — SessionStart orientation block for the SDLC chain.
#
# stdout is injected straight into the session's context (wired via the
# target project's .claude/settings.json — see README § Session-start
# orientation). Every line must earn its place: hard cap ~12 lines, and a
# missing artifact prints nothing rather than a placeholder.
#
# Fail-open invariant: this hook must NEVER block or noise a session start —
# any missing file, foreign format, or non-git dir prints nothing for that
# line and the script still exits 0. Read-only by contract: no writes, ever.
# Portability bar matches _build_share/gates/: git + POSIX sh/grep/sed/awk.

branch=$(git branch --show-current 2>/dev/null) || exit 0
[ -n "$branch" ] && echo "Active branch: $branch"

# .mtdd/cycle-state is sh-sourceable key=value, written only by /mtdd-cycle.
# done = a finished cycle (noise); halted = an abnormal stop the human must see.
if [ -f .mtdd/cycle-state ]; then
    phase=$(sed -n 's/^mtdd_cycle_phase=//p' .mtdd/cycle-state 2>/dev/null | head -n 1)
    case "$phase" in
        implement|review|verify|halted)
            cid=$(sed -n 's/^mtdd_cycle_id=//p' .mtdd/cycle-state 2>/dev/null | head -n 1)
            echo "MTDD cycle in flight: phase=$phase id=$cid"
            ;;
    esac
fi

# Canonical branches are feature/<feature>-slice-<N>; recover the feature slug
# to surface its spec folder. Beads (feature/<bead-id>--<slug>) and free-form
# branches simply won't match a folder — silence is the designed outcome.
slug=${branch#*/}
slug=$(printf '%s' "$slug" | sed 's/-slice-[0-9][0-9]*$//')
[ -n "$slug" ] && [ -d ".ai/specs/$slug" ] && echo "Spec folder for this branch: .ai/specs/$slug/"

# features.md roster: status is the 4th table column (ai-schema.md). In-flight
# rows (building, qa-approved) are named; planned is only counted; the retired
# set (shipped, deprecated, removed, cut) is never listed.
if [ -f .ai/features.md ]; then
    awk -F'|' '
        /^\|/ {
            id = $2; st = $5
            gsub(/^[ \t]+|[ \t]+$/, "", id)
            gsub(/^[ \t]+|[ \t]+$/, "", st)
            if (st == "building" || st == "qa-approved")
                list = list (list ? ", " : "") id " (" st ")"
            else if (st == "planned")
                planned++
        }
        END {
            if (list)    print "Features in flight: " list
            if (planned) print "Planned features: " planned
        }
    ' .ai/features.md 2>/dev/null
fi

# The tracker is append-only with the NEWEST entry on TOP (PROGRESS-TRACKER.md),
# so take the FIRST "## " header and its "- Next:" line — never the tail.
if [ -f .ai/progress-tracker.md ]; then
    awk '
        /^## / { if (seen) exit; seen = 1; sub(/^## /, ""); print "Last breadcrumb: " $0; next }
        seen && /^- Next:/ { print "  " $0; exit }
    ' .ai/progress-tracker.md 2>/dev/null
fi

# Anchor LOCKS the tier; intake only predicted it — label the fallback so a
# session never mistakes a prediction for the locked value.
tier=$(awk '/^project_tier:/ { sub(/^project_tier:[ \t]*/, ""); sub(/[ \t]*#.*/, ""); print; exit }' .ai/anchor.md 2>/dev/null)
if [ -n "$tier" ]; then
    echo "Project tier: $tier (locked by anchor)"
else
    tier=$(awk '/^predicted_tier:/ { sub(/^predicted_tier:[ \t]*/, ""); sub(/[ \t]*#.*/, ""); print; exit }' .ai/intake.md 2>/dev/null)
    [ -n "$tier" ] && echo "Project tier: $tier (intake prediction — not locked)"
fi

exit 0
