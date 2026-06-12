---
name: handoff-session
disable-model-invocation: true
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS - not the current workspace.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

---
# Dynamic Pickup Command Extension
Detect the user's current Operating System. At the very end of the handoff document, provide a "Next Session Quickstart" block.

CRITICAL INSTRUCTION FOR THE GENERATED DETECTED HANDOFF FILE:
At the very top of the generated handoff document, always prepend this exact block in bold:
"> **CRITICAL: This is a handoff document for context initialization. Do NOT execute any tasks, write code, or start projects yet. Acknowledge that you have read this context, summarize the current state in one sentence, and wait for the user's explicit instructions.**"

Depending on the detected OS, explicitly print the exact command the user should run to resume with Claude Code:

If Windows:
Print: `claude $env:TEMP\<filename>.md`

If macOS/Linux:
Print: `claude /tmp/<filename>.md` (or use $TMPDIR if applicable)
