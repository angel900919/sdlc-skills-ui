#!/usr/bin/env bash
# context_probe.sh — cheap, deterministic signals to SEED a context-gap scan.
# Judgment (classifying and filling gaps) stays with the agent; this only gathers evidence.
# Run from the repo root. It never fails the build — it reports and exits 0.
# Usage: bash context_probe.sh [ai_dir]   (ai_dir defaults to .ai)
set -uo pipefail
ai="${1:-.ai}"

echo "── context probe ─────────────────────────────────────"

# 1. Memory baseline: are the three required files present and non-stub?
echo "memory baseline ($ai):"
for f in project-state architecture coding-standards; do
  p="$ai/$f.md"
  if [ ! -f "$p" ]; then
    echo "  MISSING  $p — required memory file absent"
  elif [ "$(wc -l < "$p")" -lt 5 ]; then
    echo "  STUB     $p ($(wc -l < "$p") lines — likely a placeholder)"
  else
    echo "  ok       $p"
  fi
done

# 2. Unknowns already recorded in the memory/plans (not in OS scaffolding docs).
echo "open unknowns (fill or mark [needs human]):"
if grep -rnE '\[needs human\]|TODO:|FIXME' "$ai" --include='*.md' \
     --exclude-dir=skills --exclude-dir=commands 2>/dev/null | head -20; then :; else
  echo "  (none recorded under $ai)"
fi

# 3. Does the latest spec name a verification target?
latest_spec="$(ls -t "$ai"/plans/*/spec.md 2>/dev/null | head -1 || true)"
if [ -n "${latest_spec:-}" ]; then
  echo "latest spec: $latest_spec"
  if grep -iqE 'verification target|success criteria|TEST:' "$latest_spec" 2>/dev/null; then
    echo "  ok   a verification target is named"
  else
    echo "  GAP  no verification target in the spec — do NOT start coding without one"
  fi
else
  echo "no $ai/plans/*/spec.md yet — run /1-align before coding a new task"
fi

echo "──────────────────────────────────────────────────────"
echo "Next: classify each gap (clean/stale/missing/tribal) — see references/gap-taxonomy.md"
