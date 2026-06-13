#!/bin/sh
# secrets-scan.sh — PreToolUse gate on `git commit` / `git push` (POSIX, no Node).
#
# Blocks a commit/push whose new content contains a likely secret. The mode is
# passed as $1 from settings.json so the gate scans the right target:
#   commit → the STAGED diff (what the commit will record).
#   push   → the UNPUSHED range @{u}..HEAD. The index is empty at push time, so a
#            staged scan would see nothing; scanning the range also catches a
#            secret committed OUTSIDE this gate (e.g. a human's manual commit).
#
# Uses gitleaks when present (authoritative); otherwise a conservative regex pass,
# so the gate still bites on machines without gitleaks. A blocking hook is the only
# reliable place for this — a CLAUDE.md "never commit secrets" line is guidance the
# model can skip; this runs as code regardless (see ARCHITECTURE.md "Hook strategy").
#
# Mechanism: a PreToolUse hook that exits 2 DENIES the tool call and feeds stderr
# back to Claude. Every git/tool error fails OPEN — a guard must never wedge a
# legitimate commit/push; the real enforcement is also CI-side. The gitleaks call
# runs with `--exit-code 7`: a leak is the sentinel 7, clean is 0, and ANY other
# code (a bad flag, a gitleaks version where the subcommand moved, a missing
# feature) is an EXECUTION error that falls through to the regex pass — never a
# false "secret found" block. gitleaks subcommands target the 8.x CLI.

mode="${1:-commit}"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Resolve the scan target and remediation wording per mode.
case "$mode" in
    push)
        upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null) || exit 0
        [ -n "$upstream" ] || exit 0          # no tracking branch → can't scope the push → fail open
        range="$upstream..HEAD"
        diff_cmd="git diff --no-color $range"
        gitleaks_scan="gitleaks git --log-opts=$range --no-banner --exit-code 7"
        where="the commits about to be pushed ($range)"
        remedy="It is already in committed history — rewrite it out (git rebase / filter-repo) and rotate the credential before pushing."
        ;;
    *)
        diff_cmd="git diff --cached --no-color"
        gitleaks_scan="gitleaks protect --staged --no-banner --exit-code 7"
        where="the staged changes"
        remedy="Remove it from the staged content (and rotate it if it was ever real) before committing."
        ;;
esac

# Prefer gitleaks — the source of truth. 0 = clean, 7 = leak (our sentinel),
# anything else = gitleaks execution error → fall through to the regex pass.
if command -v gitleaks >/dev/null 2>&1; then
    $gitleaks_scan >/dev/null 2>&1
    rc=$?
    if [ "$rc" -eq 0 ]; then
        exit 0
    elif [ "$rc" -eq 7 ]; then
        echo "secrets-scan: gitleaks flagged a likely secret in $where. $remedy" >&2
        exit 2
    fi
    # rc is neither 0 nor 7 → gitleaks could not run cleanly → do not block.
fi

# Fallback: conservative pattern scan over the ADDED lines only. POSIX character
# classes ([[:space:]], not the non-portable \s) so it holds on BSD/busybox grep.
added=$($diff_cmd 2>/dev/null | grep '^+' | grep -v '^+++') || exit 0
[ -n "$added" ] || exit 0

# High-signal patterns: cloud keys, private-key headers, provider tokens, and the
# classic API_KEY=/SECRET=/PASSWORD= assignment with a long quoted value.
hit=$(printf '%s\n' "$added" | grep -nE \
  -e 'AKIA[0-9A-Z]{16}' \
  -e 'ASIA[0-9A-Z]{16}' \
  -e '-----BEGIN [A-Z ]*PRIVATE KEY-----' \
  -e 'gh[pousr]_[A-Za-z0-9]{20,}' \
  -e 'xox[baprs]-[A-Za-z0-9-]{10,}' \
  -e 'sk[-_](live|test|ant|proj)[A-Za-z0-9_-]{16,}' \
  -e '(api[_-]?key|secret|password|passwd|token|private[_-]?key|client[_-]?secret)["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"']{12,}' \
  2>/dev/null | head -5)

if [ -n "$hit" ]; then
    echo "secrets-scan: $where appear to contain a secret (key/token/password). Move it to an environment variable or secret store and never commit the value. Matches:" >&2
    printf '%s\n' "$hit" >&2
    echo "(False positive — a placeholder/example? Edit the value so it does not look like a live credential. To bypass deliberately, a human must approve this tool call or adjust .claude/settings.json; note 'git commit --no-verify' does NOT skip Claude Code hooks.)" >&2
    exit 2
fi
exit 0
