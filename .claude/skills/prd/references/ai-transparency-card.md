# AI transparency card

A required PRD section when the feature ships AI behavior **to end users**. Devtools/internal LLM use doesn't count.

## When to include

Check `anchor.md` frontmatter for `ai_in_core_path: true` (anchor sets this only when LLMs are in the project's core path) — its presence is the signal. If anchor says false but the feature description mentions AI to users, ask once: *"`anchor` doesn't flag AI in the core path, but this feature mentions AI. Include the transparency card AND flag that anchor needs an update?"*

## Required fields (user-facing language, not engineer language)

The card is read by end users on a settings page. Write it for them.

- **What the AI does** — one sentence.
- **What the AI does NOT do** — the explicit complement.
- **Data the AI sees** — concrete inputs (e.g. *"subject lines and bodies of emails this contact sent you in the last 30 days"*).
- **Data the AI never sees** — concrete exclusions (e.g. *"your other contacts, calendar, billing info, password"*).
- **Where the AI runs** — provider, region, retention (e.g. *"OpenAI us-east, no retention"*).
- **Opt-out** — concrete UI path (e.g. *"Settings → AI features → Off"*).

## Tier behavior

- **mvp** — required, can be lighter.
- **production** — **mandatory** when AI is involved.

## Good vs bad

- **Bad:** *"Uses GPT-4o-mini for summarization, temperature 0.3."* (engineer language)
- **Good:** *"What the AI does: writes a 2-sentence summary of each new contact's recent emails so you can prep before a call. What it does NOT do: send messages, change contact details, share data with other users. Data it sees: subject lines and bodies of emails the contact sent you in the last 30 days. Data it never sees: your other contacts, calendar, billing info, password. Where it runs: OpenAI us-east, no retention. Opt-out: Settings → AI features → Off."*
