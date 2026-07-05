#!/usr/bin/env bash
# verify.sh — the deterministic gate. Copy to your repo root and `chmod +x`.
# A step is "done" only when this exits 0. Wire it as a Stop hook or pre-commit (Guide 01 §4).
# Tailor the checks to your stack; keep the diff cap + marker scan.
set -euo pipefail

# 1. Diff-size cap (staged) — reject sprawling, unreviewable changes.
added=$(git diff --cached --numstat | awk '{s+=$1+$2} END {print s+0}')
if [ "$added" -gt 150 ]; then
  echo "✗ staged diff is ${added} lines (> 150 cap) — split the slice"; exit 1
fi

# 2. Forbidden markers — no debug cruft / unfinished work in committed code.
if git diff --cached -U0 | grep -E '^\+' | grep -Eq 'TODO|FIXME|console\.log|dbg!'; then
  echo "✗ forbidden marker (TODO/FIXME/console.log/dbg!) in staged diff"; exit 1
fi

# 3. Project checks — lint + tests. Auto-skip what's absent; each is BLOCKING when present.
if [ -f package.json ];   then npm run -s lint && npm test --silent; fi
if [ -f pyproject.toml ]; then ruff check . && pytest -q; fi
if [ -f Cargo.toml ];     then cargo clippy -q -- -D warnings && cargo test -q; fi

echo "✓ verify.sh green"
