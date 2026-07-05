# Gap taxonomy — classify, prioritize, fill, feed back

Every missing piece of context is one of four kinds. Name the kind, because the fix differs.

| Type | What it is | How to detect | Fix |
|---|---|---|---|
| **clean** | Documented and correct — no gap | The `.ai/` file or code answers it directly | Use it; cite `file:line` |
| **stale** | Documented but wrong/outdated | Doc disagrees with the code, or predates a change | Trust the **code**; correct the doc in the same PR |
| **missing** | Not written down anywhere | No file, no code comment, no answer | Read the code to derive it, or ask; then record it |
| **tribal** | Lives only in a person's head | "Ask X", implicit convention, an undocumented one-way door | Ask the owner (use `git log`/co-authors to find them); curate the answer back |

## Prioritize
`priority = severity × frequency`.
- **severity** — would getting this wrong break an invariant, a security boundary, or the ship-bar? High severity ⇒ resolve before any code.
- **frequency** — will this gap recur across tasks? High frequency ⇒ worth writing into `.ai/` permanently, not just answering once.

Resolve high-severity gaps **before** writing code; batch low-severity ones as `[needs human]` and keep moving.

## The checklist — what to scan for
- **Memory baseline** — do `.ai/project-state.md`, `.ai/architecture.md`, `.ai/coding-standards.md` exist and are they real (not 3-line stubs)?
- **Verification target** — is there a concrete test/build/screenshot/`TEST:` line for this task? (No target ⇒ stop.)
- **Invariants** — what must NOT break? Is it written down, or only assumed?
- **Undefined terms** — any domain word in the ticket you can't point to a definition for?
- **Interfaces & seams** — are the contracts this change touches pinned, or are you guessing them?
- **Protected paths** — does this touch `auth`, `payments`, migrations, `.env*`? Those are human-gated.
- **Prior decisions** — is there a decision trace explaining why the current design is the way it is (a one-way door you might be about to reopen)?

## The loop (demand-driven context — Guide 02 §9)
Treat knowledge-base construction like TDD:
1. Run the agent on a **real task**; let it hit the gap.
2. Have it **name** the gap (which type, what's owed).
3. **Route** it — read, grep, or ask the owner.
4. **Curate the answer back into Git** (`.ai/`), with review — so the gap is filled once, for every future session.

> Never cache the *answer* to a volatile question as if it were fixed — record the durable fact or rule, and let the agent re-reason specifics from sources.
