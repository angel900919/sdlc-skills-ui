---
name: your-skill-name            # gerund preferred (processing-pdfs); ≤64 chars; a–z 0–9 - only;
                                 #   never contains "claude" or "anthropic"
description: >-                  # THIRD PERSON; ≤1024 chars; states WHAT + WHEN + the trigger terms
  <What it does, in one or two sentences.>
  Use when <the concrete situations and words that should load this>.
# disable-model-invocation: true # add for skills a human should invoke by hand, not the model
# user-invocable: false          # add for background knowledge: model-loadable but hidden from the menu
---

# Your Skill Name

<!-- BODY ≤500 lines. Write ONLY what the model doesn't already know. Delete these comments. -->

## ⚠️ Must-not-miss (stays in the BODY — agents skip reference files)
- <the one landmine the model's prior gets wrong; keep it here, not in references/, because it's load-bearing>

## Workflow (do in THIS order)
1. ...   2. ...   3. ...          # an opinionated sequence for fragile flows; a checklist, not prose

## Evidence (deterministic facts, auto-injected — Claude Code)
!`your-script.sh`                 # backtick-command injection = real data, not a guess

## Deeper material (progressive disclosure — ONE level deep)
- <advanced topic> → references/<topic>.md   # loaded only on the branch that needs it
