# Template — `.human/intake/idea.md`

The living idea doc. Plain English, for the human. The user may seed it before running `/intake`; the skill refines it in place. Keep it readable — no schema, no jargon. An optional diagram (validated via the mermaid skill) is welcome if it clarifies the idea.

Copy the skeleton below, fill it in, and write to `.human/intake/idea.md`.

````markdown
# <Project name> — the idea

**In one line:** <plain-English what it is + who it's for>

## Who it's for
<The first person who'll use this. Their situation, in everyday words.>

## The problem
<What's annoying or hard for them today, and how they cope right now.>

## What it should do
The few things it absolutely must let them do:
1. <core thing> — <why it matters to them>
2. <core thing>
3. <core thing>

## Goals — how we'll know it's working
<The one signal of success, in plain words. Not a formula — a sentence like "people RSVP instead of texting me.">

## Business context
<Why this, why now. Who cares if it exists. Any deadline, budget, or audience worth noting. "None yet" is a fine answer.>

## How it should feel
<fast-and-bare | friendly-and-guided | polished-and-premium> — <any specifics>

## Edges & rules
<Things it must NOT do, or rules it must always follow — money, privacy, safety. Or "none surfaced yet.">

## A picture of it
<Optional. One simple diagram generated via the mermaid skill — e.g. a mindmap of the idea, or a who-does-what flow. Only if it helps. Validate before embedding.>

## Tech posture
<If the user chose: their preference. If not: "I picked simple, popular defaults and noted them so they're easy to change later." Plain words, no stack jargon for non-technical users.>

## What I assumed
<Every default picked on the user's behalf, in plain English, so future-you can revisit it.>

## Still open
<Topics not covered yet — the known blind spots discovery will pick up.>

---
*Machine details for the AI workflow live in `.ai/intake.md`. Next step: `/discovery <slug>` to pressure-test whether this is worth building.*
````

## Notes

- **Length:** this is a brief, not a spec. If it grows past ~1.5 screens, you're over-capturing — push detail to discovery.
- **The diagram:** for a fresh idea, a `mindmap` ("idea on a page") or a simple `flowchart LR` of the main user flow works well. Always route it through the mermaid skill so it's validated.
- **Tone:** write as if explaining to the person who gave you the idea. They should recognise their own words.
