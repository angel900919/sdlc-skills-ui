#!/bin/sh
# test_guard_paths.sh — exercises guard-paths.sh by piping sample PreToolUse
# stdin JSON and asserting the emitted permission decision. POSIX sh, no jq.
# Exits non-zero on the first failed case. Paths need not exist on disk for the
# path-based rules; only the frozen-spec rule (d) reads file contents.

set -u
dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
guard="$dir/hooks/guard-paths.sh"
fails=0

# run "<case name>" "<expected: ask|deny|allow>" "<absolute file_path>"
run() {
    name=$1
    expect=$2
    fp=$3
    out=$(printf '{"tool_input":{"file_path":"%s","content":"x"}}' "$fp" | sh "$guard")
    case "$expect" in
        ask|deny|allow) : ;;
        *) echo "BAD EXPECT: $expect"; exit 2 ;;
    esac

    if [ "$expect" = allow ]; then
        # Allow = fail-open: the guard emits nothing (empty stdout).
        if [ -z "$out" ]; then
            echo "PASS  $name -> allow (no decision)"
        else
            echo "FAIL  $name -> expected allow, got: $out"
            fails=$((fails + 1))
        fi
    else
        # The guard emits compact JSON ("permissionDecision":"ask"); match that.
        compact='"permissionDecision":"'"$expect"'"'
        if printf '%s' "$out" | grep -q "$compact"; then
            echo "PASS  $name -> $expect"
        else
            echo "FAIL  $name -> expected $expect, got: $out"
            fails=$((fails + 1))
        fi
    fi
}

root=$(CDPATH= cd -- "$dir/../../.." && pwd)

# (b) derived .human mirrors → ask
run ".human design mirror"   ask   "$root/.human/specs/system-map/design.md"
run ".human anchor summary"  ask   "$root/.human/summaries/anchor.md"

# (b) exception: .human/intake is human-authored input → allow
run ".human/intake idea"     allow "$root/.human/intake/idea.md"

# .ai source is the thing the rule steers toward → allow (from the .human rule)
run ".ai prd source"         allow "$root/.ai/specs/demo/prd.md"

# (a) precedence proof: deny still wins, .human rule did not displace it
run "secret .env"            deny  "$root/services/api/.env"

if [ "$fails" -ne 0 ]; then
    echo "FAILED: $fails case(s)"
    exit 1
fi
echo "OK: all cases passed"
