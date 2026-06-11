# STRIDE-lite question bank (plain-English phrasings)

The Phase-4 walk uses these phrasings — **one question at a time, with a proposed answer**
(per `_shared/conventions.md § Talking to the human`). The category name and letter never
appear in the question; they are recorded only in the `.ai` register. Pick 1–2 questions per
category per boundary; skip a category that obviously doesn't apply and say so in one line.

## Per-category phrasings

### S — Spoofing (pretending to be someone/something else)
- "Could someone pretend to be another user here — log in as someone they're not, or reuse a stolen session?"
- "When [external system] calls in over this line, how do we know it's really them and not anyone who found the URL?"
- "Could a fake copy of [the app / the API] trick users or other services into talking to it?"
- Proposed-answer shape: *"I'd assume the auth provider covers humans here, but the webhook has no signature check — right, or am I wrong?"*

### T — Tampering (changing data or messages they shouldn't)
- "Could someone change the data while it travels across this line — edit the request, the price, the amount?"
- "Could a user change a record that isn't theirs by guessing or editing an ID?"
- "Could anything outside the app rewrite what's stored — the database, a file, a queue message?"

### R — Repudiation (doing something and denying it later)
- "If someone did [the most damaging action this boundary allows], could they later claim they didn't? Would we have a trace?"
- "Is there a record of who changed [asset] and when — one the person who did it can't quietly erase?"
- Lite pass: usually only worth asking on money/regulatory paths.

### I — Information disclosure (seeing what they shouldn't)
- "Could someone see another user's [PII field / records] through this boundary — a guessed URL, a too-chatty API response, an over-broad export?"
- "What ends up in logs or error messages crossing this line — could [secret / PII] leak there?"
- "If [third party] on the far side got breached, what of ours would they be holding?"

### D — Denial of service (making it unavailable)
- "Could one person hammering this entry point lock everyone else out — is anything rate-limited?"
- "Is there a request that's cheap to send but expensive for us to process (a huge file, an unbounded query, an LLM call)?"
- "If [external dependency] goes down or slow, what happens to us?" (often already in architecture failure modes — cross-reference, don't duplicate.)

### E — Elevation of privilege (gaining rights they weren't given)
- "Could a normal user reach the admin actions — is the check on every path, or just hidden in the UI?"
- "If someone got into [outer component], what's the most powerful thing they could reach from there?"
- "Does anything crossing this line get treated as trusted just because it arrived — input fed into commands, queries, or an LLM prompt that can trigger actions?"

## The credibility bar (apply to every candidate threat)

Register a threat only when you can fill **all four** slots in one plain sentence:

> **[actor]** can **[action]** via **[boundary B-N]** resulting in **[impact on a named asset]**.

- Actor must be plausible for this project: anonymous internet user, authenticated user, malicious insider, compromised third party, automated bot. "A nation-state" on a hobby tool fails the bar.
- No vague verbs: "hack", "exploit", "attack" are not actions. "Replay a captured webhook payload" is.
- Impact names an asset from `## Assets`, not "bad things happen".
- Can't fill the slots → it's not a threat, it's anxiety. Drop it or park it in `## Out of scope`.

## Asset-naming prompts (Phase 3)

Seed from `context.md` entities + `anchor.uplift_signals` + `security_gate` + `environments.md`
secrets, then confirm in one round:

- "If someone broke in, what's the prize — money, personal details, login access, the ability to act as you?"
- "Which of [entity list] would hurt most if it leaked? If it were silently altered? If it vanished?"
- Always check: credentials + session tokens · PII fields (name which) · money paths (charge, refund, payout) · API keys/secrets per `environments.md` · anything `regulatory` makes mandatory to protect · the ability to impersonate the product (send email as you, push code as you).

## Scoring reminder

Impact × likelihood → **1–9**, the same scale as `architect/references/characteristics.md`
§ Risk storming worksheet. ≥6 needs a mitigation, a recorded acceptance, or a routed
candidate. Don't inflate: a real 3 recorded honestly beats a defensive 7.
