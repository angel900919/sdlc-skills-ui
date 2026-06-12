#!/bin/sh
# guard-paths.sh — PreToolUse path guard for Edit|Write: mechanizes three
# prose invariants of the SDLC skill set as permission decisions.
#
#   deny  — secrets/keys and package-manager lockfiles (no legitimate agent
#           edit exists; the reason names the correct alternative).
#   ask   — discipline gates/hooks and frozen canonical SLICE files
#           (legitimate-but-exceptional edits exist; the human adjudicates).
#
# Advisory only: matches Edit|Write, not Bash — an agent can still `cat >` past
# it. Hard boundaries belong in permission settings, not hooks.
#
# Freeze signal (derived, not guessed):
#   _shared/ai-schema.md § SLICE-N.md: `status: open | published | removed`
#   build/SKILL.md rule 3: "The canonical file is frozen. ... a canonical
#     `status:` value (which only ever moves open → published → removed)"
#   publish-issues/SKILL.md rule 12: write-back sets `status: open → published`
# → a SLICE file whose frontmatter carries status published|removed is frozen;
#   status open is /to-issues authoring territory and stays editable.
# Why ask, not deny: legitimate post-freeze writers exist — /publish-issues
# adding a second backend_refs entry, /to-issues update-mode flipping a dropped
# slice to removed — and hook stdin carries no caller identity.
#
# Fail-open invariant: malformed stdin, missing key, or unreadable target file
# exits 0 silently. A guard that breaks must never block legitimate work.
# Portability bar matches _build_share/gates/: POSIX sh/grep/sed/awk only.

# First "file_path" key wins: for Edit|Write the real key precedes the
# old_string/new_string/content payload, so a payload that merely mentions
# "file_path" is not mis-read. Escaped quotes in paths are accepted misses.
path=$(awk '
    {
        i = index($0, "\"file_path\"")
        if (i == 0) next
        rest = substr($0, i + 11)
        if (match(rest, /^[[:space:]]*:[[:space:]]*"/) == 0) exit
        rest = substr(rest, RLENGTH + 1)
        end = index(rest, "\"")
        if (end > 1) print substr(rest, 1, end - 1)
        exit
    }
' 2>/dev/null)
[ -n "$path" ] || exit 0

decide() {
    printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"%s","permissionDecisionReason":"%s"}}\n' "$1" "$2"
    exit 0
}

# (a) Secrets and lockfiles — deny. Templates are exactly what the agent
# should maintain, so they pass before the .env patterns can match.
case "$path" in
    *.env.example|*.env.template|*.env.sample) exit 0 ;;
esac
case "$path" in
    *.env|*.env.*|*.pem|*.key|*/secrets/*|*/secrets.*)
        decide deny "Protected secret: $path. Secrets are never agent-edited - maintain the .env.example template and let a human set real values." ;;
    *package-lock.json|*pnpm-lock.yaml|*yarn.lock|*Cargo.lock|*poetry.lock|*uv.lock)
        decide deny "Protected lockfile: $path. Lockfiles are tool-managed - change the manifest and regenerate via the package manager (npm/pnpm/yarn/cargo/poetry/uv)." ;;
esac

# (b) Gate self-protection — ask. The agent being graded must not silently
# edit the grader; the one legitimate editor is a session maintaining the
# skill-set source repo itself, which only the human can recognize. The
# seeded verifier subagent prompt is a grader too.
case "$path" in
    *.claude/skills/_build_share/gates/*|*.claude/skills/_build_share/hooks/*|*.claude/skills/_build_share/agents/*|*.claude/agents/verifier.md)
        decide ask "Verification infrastructure: $path gates or grades the agent's work and is not normally agent-editable. Approve only if this session is intentionally maintaining the skill set; otherwise change it by hand or via the skill-set repo." ;;
esac

# (c) Frozen canonical specs — ask, content-aware. Only the frontmatter is
# consulted (first 40 lines); a missing file is /to-issues authoring a new
# slice and passes untouched.
case "$path" in
    *.ai/specs/*/issues/SLICE-*.md)
        [ -f "$path" ] || exit 0
        if sed -n '1,40p' "$path" 2>/dev/null | grep -Eq '^status:[[:space:]]*(published|removed)'; then
            decide ask "Frozen canonical spec: $path is status published/removed. Approve only /publish-issues write-back (backend_refs) or /to-issues re-slice; runtime status (Status log/Completion) belongs on the bead or published copy, never this file."
        fi
        ;;
esac

exit 0
