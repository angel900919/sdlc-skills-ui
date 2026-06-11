# Template — `.human/intake/idea.md` (brownfield orientation)

The living orientation doc. Plain English, for the human. It describes the app **as it stands today**, not a fresh idea. The user may seed it before running `/onboard`; the skill refines it in place. Keep it readable — no schema, no jargon. An optional diagram (validated via the mermaid skill) is welcome if it clarifies the app.

Copy the skeleton below, fill it in, and write to `.human/intake/idea.md`.

````markdown
# <App name> — what it is

**In one line:** <plain-English what the app is + who it's for>

## Who uses it
<The main person who uses this app. Their situation, in everyday words.>

## What it does
The main things it lets them do today:
1. <core thing> — <why it matters to them>
2. <core thing>
3. <core thing>

## How we'll know it's working
<The signal of success, in plain words — e.g. "agents clear the queue faster" — not a formula.>

## Edges & rules
<Things it must NOT do, or rules it must always follow — money, privacy, safety. Or "none surfaced yet.">

## The stack at a glance
<What it looks built with, in plain words — e.g. "a Next.js web app with a Postgres database." Detected from the project files and confirmed with the user. `/anchor` will lock the details.>

## What we want to do now
<Why you're onboarding: add features, fix things, or understand the code first. Sets direction for the next steps.>

## A picture of it
<Optional. One simple diagram generated via the mermaid skill — e.g. a who-does-what flow, or an app-on-a-page mindmap. Only if it helps. Validate before embedding.>

## What I assumed
<Every default or guess made on the user's behalf, in plain English, so future-you can revisit it.>

## Still open
<Topics not covered yet — known blind spots the recon steps will pick up.>

---
*Machine details for the AI workflow live in `.ai/intake.md`. Next step: `/anchor` to confirm and lock the stack, then `/explore` to map the code.*
````

## Notes

- **Length:** this is a brief, not a spec. If it grows past ~1.5 screens, you're over-capturing — the recon steps (`/explore`, `/comprehend`) will go deeper.
- **The stack section is *confirmed*, not analyzed.** Name what the manifests show and what the user confirms; leave the real detection and locking to `/anchor`.
- **The diagram:** a `flowchart LR` of the main user flow, or a `mindmap` of the app, works well. Always route it through the mermaid skill so it's validated.
- **Tone:** write as if explaining the app back to the person who owns it. They should recognise their own words.
