# Agent Skills: The Consolidated Guide

> Synthesized from the 5 talk/note sets in `AI_CODING/Agent-Skills/`: Anthropic's "Don't Build Agents, Build Skills Instead" (Barry Zhang & Mahesh Murag), Matt Pocock's skill-quality manual, the Supabase skills+MCP talk, the WorkOS workshop, and Nick Nisi's "deleted 95% of my skills" retrospective. Everything is reconciled against current (July 2026) guidance — the Claude Code skills docs, the agentskills.io open specification, Anthropic's authoring best practices, and the 2026 skill-engineering literature. Where notes and current guidance conflict, current guidance wins; changes are flagged inline and collected near the end.

---

## 1. Why skills won

The argument that reframed the field (Anthropic, Nov 2025): general coding agents converged on one architecture — an agent loop plus bash plus a filesystem — so building *another agent* no longer differentiates anything. What's missing is **domain expertise**, and that ships as a **skill**: a folder of procedural knowledge the agent loads on demand. The analogy that stuck: models are processors, the agent runtime is the operating system, and skills are the applications — for everyone outside the model labs, the value accrues at the skill layer.

Two things happened since that make skills the right investment in 2026:

- **Skills became an open standard.** The SKILL.md format was published at agentskills.io (Dec 2025) and is now supported by ~40 tools — Claude Code, OpenAI Codex, Cursor, VS Code/Copilot, Gemini CLI, goose, JetBrains, and more. A skill you write today is a portable, vendor-neutral asset; only the install directory differs per tool.
- **In Claude Code, slash commands merged into skills.** `.claude/commands/*.md` files still work, but `.claude/skills/<name>/SKILL.md` is the recommended form — it adds supporting files, invocation control, and richer frontmatter, and both create the same `/name` command.

The economics are what make skills special: an unused skill costs ~100 tokens (its name and description); a *used* one loads exactly as much as the task needs. That's **progressive disclosure**, and it's the property every other placement mechanism lacks.

---

## 2. Where knowledge goes: the placement decision

The most useful synthesis across all five talks plus current docs is a single routing table:

| The knowledge is... | Put it in... | Why |
|---|---|---|
| A fact/convention relevant to nearly every task ("we use pnpm") | **CLAUDE.md** (keep it tiny) | Always loaded — every line is a permanent tax |
| A repeatable procedure or workflow | **A skill** | Loads only when triggered |
| Behavior that must be *guaranteed* (block edits, run checks) | **A hook** | Deterministic; can't be reasoned around |
| Heavy, delegable work needing isolated context | **A subagent** — a separate agent run in its own clean context (or a skill with `context: fork`) | Context firewall |
| Live external state, auth, queries | **An MCP server** (Model Context Protocol — the standard tool-connection layer) | Connectivity is what MCP is for |
| A fully deterministic task | **A script/CLI** | Zero context cost, perfectly repeatable |

The official trigger for creating a skill: *you keep pasting the same instructions into chat, or a section of CLAUDE.md has grown into a procedure rather than a fact.* Boris Cherny's version: "if you do something more than once a day, turn it into a skill."

Two boundary rules worth engraving:

- **Guidance vs. enforcement**: CLAUDE.md and skills *influence*; hooks *guarantee*. Anything that must always happen belongs in the mechanism that can't be skipped.
- **Skills vs. MCP is a false dichotomy** — the settled consensus is *MCP for connectivity, skills for the expertise that orchestrates it*. Supabase made this concrete: their evals showed MCP+skill beating MCP-only and baseline on every model tested, and their row-level-security demo showed tools alone producing runnable-but-insecure SQL — guidance was the variable that fixed it. Pair every MCP server you ship with a skill.

---

## 3. Anatomy of a skill

```
my-skill/
├── SKILL.md          # required: YAML frontmatter + instructions
├── scripts/          # optional: executable code (run, not loaded)
├── references/       # optional: docs loaded on demand
└── assets/           # optional: templates, data
```

**Three levels of progressive disclosure**, each with a budget:

1. **Metadata** (name + description): ~100 tokens, loaded for every skill at session start. This is the entire trigger surface.
2. **SKILL.md body**: loaded on activation. Keep it **under 500 lines / ~5K tokens** — and remember it stays in context for the rest of the session, so every line is a recurring cost.
3. **Bundled files**: `references/` loaded only when pointed to; `scripts/` *executed*, never loaded — their source code never enters context.

A production-shaped example (adapted from the release-notes example accompanying the Anthropic talk notes, with the `!`cmd`` injection pattern from the WorkOS repo-roast example):

```markdown
---
name: release-notes
description: Generates release notes from git history following the team's
  house style. Use when asked to write release notes, a changelog entry, or a
  "what shipped" summary for a tag, release, or date range in a git repository.
---

## Recent commits (auto-injected — do not re-derive)
!`git log --oneline -20`

## Workflow
1. Run scripts/collect_commits.py — do NOT re-derive with ad-hoc git log
   calls; the script exists so classification is identical every run.
2. Group by area; write entries in the house style.
3. For tone and formatting rules, see references/style.md.

## Maintaining this skill
When the user corrects tone or wording, ask if the change is permanent;
if yes, append it to references/style.md.
```

That example encodes four load-bearing patterns: **`!`cmd` dynamic injection** (shell output computed before the model sees the skill — real data, token-cheap, deterministic); **scripts for determinism, prose for judgment**; **one-level-deep references**; and a **self-maintenance section** that turns user corrections into permanent skill improvements — the learning flywheel that makes the agent "better on day 30 than day one."

Claude Code layers useful extensions on the open spec:

- `disable-model-invocation: true` — human-only invocation; required for side-effect workflows like `/deploy`
- `user-invocable: false` — model-only background knowledge, hidden from the `/` menu
- `allowed-tools` / `disallowed-tools` — per-skill permission scoping
- `context: fork` + `agent:` — run the skill in an isolated subagent
- `argument-hint`, `$ARGUMENTS` — user-input substitution
- `hooks` — automation scoped to the skill's lifecycle

**Quick start (the whole loop):** ① create `.claude/skills/<name>/SKILL.md` with name + description frontmatter; ② invoke with `/<name>` (or let the description trigger it); ③ watch what the agent actually does with it; ④ edit and run `/reload-skills` — no restart needed.

---

## 4. Writing skills that actually work

### The description is a routing hyperparameter

Pre-activation, the description is *all the model sees*. Write it in third person, **what it does + when to use it**, key use case first, with the trigger phrases users would actually type:

> `description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.`

Never "Helps with documents," never first person. And don't trust description-based triggering for anything that *must* fire: Scott Spence's sandboxed evals (Feb 2026) put baseline activation at ~50–55%, driven mostly by keyword matching. The reliability ladder: pushy trigger phrases in the description → explicit `/invocation` → a UserPromptSubmit hook (a hook is a shell command the harness runs automatically at fixed points — here, on every prompt) that forces the skill to be considered, which scored 22/22 in the same tests. For side-effecting skills, go the other way: `disable-model-invocation: true`.

### Body discipline

- **Write gotchas, not documentation.** Nick Nisi's result is the cautionary tale: 10,000 lines of doc-generated skills deleted down to 553 lines of hand-curated landmines — where the model's prior is *wrong* — made runs faster, cheaper, and more accurate. One doc-dump skill scored 77% *with* it loaded versus 97% without. Assume the model already knows how to code; nudge, don't teach.
- **Constraints beat prescriptions.** Three sharp rules ("never invent metrics") outperform step-by-step novels; the WorkOS team saw over-prescription *regress* accuracy. Match freedom to fragility: heuristics for judgment work, exact do-not-modify commands for fragile sequences like migrations.
- **Safety-critical content goes in the body, never in references.** Supabase's finding: agents rarely open even one reference file. "If something can get skipped, it will be skipped." Progressive disclosure is a token budget, not a delivery guarantee — the checklist that must not be missed lives inline.
- **Use leading words** (Pocock): compact, pretraining-rich terms like "vertical slice" steer harder than paragraphs. Verify by grepping the reasoning trace for the word.
- **Hide future steps when the agent rushes.** If it under-invests in step 1 because it can see step 2 (shallow clarifying questions, premature planning), split into two skills — the clarify skill literally cannot see the plan skill. Sharpen the "done" criterion first; split only if rushing persists.
- **State execution intent**: "Run analyze_form.py" (execute) vs. "See analyze_form.py for the algorithm" (read). Explain *why* rules matter instead of ALL-CAPS MUSTs — reasoning generalizes; shouting doesn't.

### Prune like it's code

Run Pocock's **deletion test** sentence by sentence: remove a line; if behavior doesn't change, it was a no-op (rampant in agent-authored skills). Hunt **duplication** (one source of truth) and **sediment** (stale multi-contributor accretion). Audit monthly and delete skills untriggered in ~30 days — practitioners converge on 8–12 well-chosen skills covering most work.

---

## 5. Test skills like software

Skills are testable, and since March 2026 the tooling is real:

1. **Evals before content.** Run Claude on representative tasks *without* the skill, document the failures, write 3+ eval scenarios, then write the minimal instructions that pass. Evals are the source of truth, not your intuition.
2. **With/without comparison is the core metric.** A skill that scores below no-skill gets deleted, not fixed. Grade *behavior* (tools called, workflow followed, safety rule applied), not just output — Supabase weights the scoring toward the most dangerous failure mode.
3. **Use skill-creator** (`/plugin install skill-creator@claude-plugins-official`) — it evolved from a scaffolder into a full lifecycle tool: per-skill evals run in isolated subagents, pass-rate/token benchmarks, blind A/B between skill versions, and automatic description tuning against should-trigger/should-not-trigger prompt sets.
4. **Lint in CI**: static checkers (e.g. pulser as a GitHub Action on `paths: .claude/**`) validate frontmatter, description specificity, and orphaned references in milliseconds.
5. **Test on every model you deploy to** — Haiku needs more guidance, Opus needs less — and iterate with two instances: Claude A authors, a fresh Claude B tests; fix what B *actually did*, not what you assumed.

And the enforcement caveat from the 95%-deletion talk: beyond small single-shot workflows, agents silently skip instructions in long skills. **Must-happen multi-step orchestration belongs in code** (a state machine with evidence gates — e.g. requiring a SHA-256 hash of real test output, not a touch-able marker file), with skills supplying the judgment inside each step.

---

## 6. Distribution and security

- **Scopes and precedence**: personal (`~/.claude/skills/`), project (`.claude/skills/`, committed — version control *is* the team distribution mechanism), plugin (namespaced `plugin:skill`, via marketplaces), enterprise (managed, overrides all). Nested project skills get directory-qualified names (`apps/web:deploy`) when names collide; otherwise plain `/deploy` resolves to the project-root skill.
- **Plugins for cross-repo distribution**: bump the semver `version` in `plugin.json` on every change — Claude Code uses it for update detection, and cached users never see unversioned changes. Pin dependency ranges. The team pattern: open-source the generic base, ship org-specific conventions via a private marketplace.
- **Installers matured**: `npx skills add`, GitHub's `gh skill install/search/publish` (Apr 2026, with `--agent` targeting), Claude Code `/plugin marketplace add`.
- **Treat third-party skills as untrusted code.** Snyk's ToxicSkills study (Feb 2026) scanned 3,984 public skills: ~37% had at least one flaw and 76 carried confirmed malicious payloads (exfiltration, security disablement); a same-month campaign shipped 30+ malicious skills through a community hub. Before installing: read SKILL.md *and every bundled script*, watch for instructions to fetch remote content or disable checks, scan (`uvx mcp-scan@latest --skills`; Vercel's installer now scans automatically), and pin to tags/SHAs. Also review *project* skills when opening an unfamiliar repo — a skill can grant itself broad tool access via `allowed-tools`.

---

## 7. Where the folder's notes are superseded (one-liners)

Corrections to the source notes in `AI_CODING/Agent-Skills/` — skim if you haven't read them.

- **"There's no built-in way to eval skills"** (Nov 2025) → skill-creator 2.0 (Mar 2026) ships evals, benchmarks, blind A/B, and trigger tuning.
- **"Distribution is unsolved — no registry, no version pinning"** (Supabase) → plugin marketplaces, `npx skills add`, `gh skill` with SHA pinning, and scan-on-install all shipped by mid-2026.
- **"Skills are Claude-only"** → open standard at agentskills.io (Dec 2025), ~40 tools; `.agents/skills/` is spreading as the vendor-neutral path.
- **"Frontmatter is just name + description"** → the spec added `license`, `compatibility`, `metadata`, `allowed-tools`; Claude Code adds invocation control, forking, per-skill hooks, and argument substitution.
- **"Write a great description and it will trigger"** → measured ~50–55% baseline activation; must-fire skills need hooks or explicit invocation.
- **"Skills will replace MCP"** (late-2025 hot take) → settled as complementary: MCP for connectivity, skills for procedural knowledge.
- **Security/signing "unaddressed"** (Nov 2025 talk) → now a named supply-chain problem with scanners, scan-on-install, and academic threat taxonomies — but no signing standard yet; vigilance is still manual.
- **Pocock's trigger/structure/steering/pruning vocabulary** → already expanded in his live `writing-great-skills` skill (invocation, information hierarchy, router skills, premature completion) — the checklist survives, the labels moved.

---

## Folder Playbook — apply this week

1. **Adopt the placement table**: facts → CLAUDE.md; procedures → skills; guarantees → hooks; isolation → subagents; connectivity → MCP; determinism → scripts. Audit your current CLAUDE.md and move every "procedure that grew" into a skill.
2. **Harvest repetition**: anything you've pasted into chat twice, or do more than once a day, becomes a skill — ask the agent to write it for its future self (skill-creator scaffolds it).
3. **Rewrite every description as a router**: third person, what + when, trigger phrases users actually type. Set `disable-model-invocation: true` on anything with side effects.
4. **Restructure for progressive disclosure**: body under 500 lines, references one level deep, deterministic steps as scripts, safety-critical rules inline in the body — never in a reference file.
5. **Add `!`cmd` injection** for any skill that starts from live facts (git state, env, schema) instead of asking the model to gather them.
6. **Run the deletion test** on your existing skills, sentence by sentence; delete skills untriggered in 30 days; target a lean 8–12.
7. **Eval with/without before trusting**: 3+ scenarios, behavior-graded, weighted toward your most dangerous failure mode; wire a skill linter into CI on `.claude/**` paths.
8. **Move must-happen orchestration out of prose** into code gates that demand non-fakeable evidence; keep skills for the judgment inside steps.
9. **Version and distribute deliberately**: project skills in git, shared skills as semver-versioned plugins, third-party skills read-and-scanned before install.
10. **Close the learning loop**: end living skills with a "maintaining this skill" section so user corrections accrete into references — the skill, not the session, is where learning persists.
