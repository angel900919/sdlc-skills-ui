---
name: verify-gate
description: >-
  Runs and enforces the deterministic verification gate — tests, lint, a diff-size
  cap, forbidden markers, and an anti-slop check for weakened or disabled tests — so
  a step counts as done only when the gate is green. Use after finishing any
  implementation step, before committing or marking work complete, or when wiring a
  Stop hook / pre-commit gate. Explains how to extend the gate and enforce it in tiers.
---

# Verify Gate

<!-- Guide 01 §4 (wire a verification gate you cannot bypass) + the anti-slop gate (§7).
     The base gate (verify.sh) lives at the repo root; this skill enforces running it and adds an anti-slop layer. -->

## ⚠️ Must-not-miss (stays in the body)
- **A step is DONE only when the gate exits 0.** A checked box without a green gate is a lie — do not update `.ai/project-state.md` on red.
- **Never edit a test or the gate to make red go green.** Fix the code, or record why the check is wrong and change it deliberately. Weakening a test to pass is the failure this skill exists to catch.

## Workflow (after every implementation step)
1. Run the base gate at the repo root (tests + lint + 150-line diff cap + forbidden markers):
   !`./verify.sh`
2. Run the anti-slop layer (catches tests weakened/disabled/commented-out to force a pass):
   !`bash .ai/skills/verify-gate/scripts/slop_check.sh`
3. **Red?** Fix the code and re-run — do not proceed. **Green?** Only then check the box in `project-state.md`.
4. Keep each step a **vertical, ≤150-line diff**; if the cap trips, split the slice, don't raise the cap.

## Extend it for your stack
Add your project's real checks to `verify.sh` (each blocking when its file is present), but **keep the diff cap and the forbidden-marker scan** — they are stack-independent. Details and the tiered enforcement model (in-prompt → per-turn re-check → Stop hook → review subagent) → `references/enforcement-tiers.md`.

## Deeper material (loaded on demand)
- How to wire the gate as a Stop hook / pre-commit, the 4 enforcement tiers, and the anti-slop rubric → `references/enforcement-tiers.md`

*The base `verify.sh` starter lives in [`templates/verify.sh`](../../../templates/verify.sh); copy it to your repo root and `chmod +x`. Source: [`guides/01_agentic-coding.md`](../../../guides/01_agentic-coding.md) §4, §7.*
