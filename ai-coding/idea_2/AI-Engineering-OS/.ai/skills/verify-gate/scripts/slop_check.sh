#!/usr/bin/env bash
# slop_check.sh — the anti-slop layer that COMPLEMENTS verify.sh.
# verify.sh handles tests/lint/diff-cap/markers; this catches the "trusting green"
# failure mode: tests weakened, skipped, or commented out to force a pass.
# Scans the STAGED diff. Exits 1 on a finding, 0 when clean. Run it right after verify.sh.
set -uo pipefail

diff="$(git diff --cached -U0)"
fail=0

# 1. Removed assertions — the classic way to turn a red test green.
removed_asserts=$(printf '%s\n' "$diff" | grep -E '^-' \
  | grep -Ec 'assert|expect\(|\.toBe|\.toEqual|should\.' || true)
if [ "${removed_asserts:-0}" -gt 0 ]; then
  echo "✗ slop: ${removed_asserts} assertion line(s) REMOVED — weakening tests to pass?"
  fail=1
fi

# 2. Newly skipped/disabled tests.
if printf '%s\n' "$diff" | grep -E '^\+' \
  | grep -Eq '\.skip\(|\bxit\(|\bxdescribe\(|@pytest\.mark\.skip|t\.Skip\(|#\[ignore\]'; then
  echo "✗ slop: a test was skipped/disabled in this diff — fix it or justify it, don't mute it"
  fail=1
fi

# 3. Blocks of commented-out code parked instead of deleted.
added_comment_code=$(printf '%s\n' "$diff" | grep -E '^\+[[:space:]]*(//|#)[[:space:]]*(if|for|while|def |function |return |const |let |var )' \
  | wc -l | tr -d ' ')
if [ "${added_comment_code:-0}" -gt 5 ]; then
  echo "✗ slop: ${added_comment_code} lines of commented-out code added — delete it, git remembers"
  fail=1
fi

if [ "$fail" = 0 ]; then echo "✓ slop_check clean"; fi
exit "$fail"
