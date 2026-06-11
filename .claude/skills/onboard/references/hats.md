# The hats (brownfield)

`/onboard` wears the same four hats as `/intake` but shows the user one friendly face — and it points them at an app that **already exists**, so the listening shifts from "what should we build" to "what is this, and what do we do with it now." The user never hears these words; each topic quietly feeds one or more hats.

| Hat | Listening for (brownfield) | Surfaces into |
| :--- | :--- | :--- |
| **Product Manager** | what the app is for, who uses it, the success signal, what the user wants to do next | `idea.md` What / Who / Goals / Next; later `/feature-map` |
| **UX/UI Designer** | the main user's context, the desired *feel*, must / must-not interactions | `idea.md` Feel; later `/design` |
| **Software Architect** | the core capabilities, hard constraints (money / PII / scale), tier signals | `idea.md` Core things / Edges; `.ai/intake.md` uplift_signals; later `/architect` |
| **Senior Engineer** | the stack already in the repo (detected, then confirmed), build-vs-default posture | `idea.md` Tech posture; later `/anchor` (which locks it) |

## How to use the hats

- **Don't interrogate per hat.** One natural question often feeds several hats at once ("What are the main things it lets them do?" feeds PM and Architect). Ask the human question; map the answer to hats silently.
- **The Engineer hat detects, it doesn't ask.** Unlike greenfield `/intake`, the user knows the *product*, not the code. Peek at the manifests, name the stack in plain words, and ask only for confirmation. Authoritative detection and locking belong to `/anchor`.
- **The Architect hat watches for tier-uplift signals** even when the user doesn't raise them — and a shipped app may *already* exhibit them (it already takes payments, already stores PII). When one fires, name it in plain English and bump the predicted tier in `.ai/intake.md`.
- **Capture intent.** "What do you want to do now — add features, fix things, or understand it first?" is brownfield-specific and orients the hand-off: it tells the rest of the chain why you're here.

## Tier-uplift signals (canonical — same as `/intake`)

If the app names or already does any of these, predict a higher tier and record it under `uplift_signals` in `.ai/intake.md`:

- **money** — payments, billing, real funds moving
- **pii** — personal, health, financial, or otherwise sensitive data
- **sla** — uptime/availability commitments, "people rely on this"
- **external-dependants** — paying customers or third parties depend on it
- **regulatory** — HIPAA, GDPR, SOC2, COPPA, financial/legal compliance

A single future-scoped signal → keep the lower tier but record the signal so downstream skills reserve room. Two or more describing the app as a whole → propose bumping the tier upfront. For a brownfield app that *already* moves money or stores PII today, treat the signal as present, not future.
