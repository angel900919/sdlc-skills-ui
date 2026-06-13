---
stage: context
updated: 2026-06-13
sources: [.ai/understanding/sdlc-command-center.md, .ai/recon.md]
---

# Domain context

## Glossary
- Project: a repo root registered with the Command Center so its sessions and chain state can be observed.
- Session: one interactive Claude CLI conversation running in a real terminal (PTY) the app spawned or resumed.
- Permission mode: the safety posture a session runs under (one of six, from prompt-everything to bypass).
- Hook event: a lifecycle signal Claude Code emits (session start, tool use, notification…) that the app ingests.
- Transcript message: one parsed entry of the conversation record Claude Code writes to disk.
- Audit event: the unified observability record everything funnels into (hooks, transcripts, server actions, user actions, file changes).
- Usage sample: per-message token usage harvested from transcripts.
- Verdict token: the uppercase outcome a chain skill ends with (READY-FOR-X, BLOCKED-ON-Y) that routes the pipeline.
- Stage: one node of the SDLC chain graph (foundation, per-feature, execution, qa-release, post-delivery, cross-cutting, utility).
- Feature: a roster entry from the chain's feature map, with a lifecycle status.
- Slice: the issue-level unit a feature decomposes into (SLICE-N).
- Worktree: an isolated per-session git checkout so a session's edits don't touch the main tree.
- Subagent: a child agent a session spawned; its transcript nests under the parent's.
- Attention: the "blocked on you" flag a session raises when Claude is waiting for the human.
- Recap: the structural what-happened-while-you-were-away summary (deliberately not model-generated).
- Session PR: a pull request created from a session's branch — the human-gated way work leaves the machine.
- Skill: one slash-command unit of the chain; directory name equals the command.

## Entities
- name: Project
  definition: a registered repo root under observation
  key_attributes: [root_path (unique), name]
  invariants: [deleting a project deletes its sessions]
- name: Session
  definition: one PTY-hosted Claude CLI conversation
  key_attributes: [project, cwd, permission_mode, worktree?, scrollback]
  states: [starting, running, exited, interrupted]
  invariants: [belongs to exactly one project, interrupted-at-boot stays resumable, resume inherits cwd/worktree/mode]
- name: Hook event
  definition: a Claude Code lifecycle signal ingested over local HTTP
  key_attributes: [session, event_type, payload]
  invariants: [ingest can never block the session that emitted it]
- name: Transcript message
  definition: one conversation entry tailed from disk
  key_attributes: [session, role, uuid]
- name: Audit event
  definition: the unified observability record
  key_attributes: [source (hook|transcript|server|user|fs), timestamp]
- name: Usage sample
  definition: token usage for one message
  key_attributes: [session, transcript_uuid (deduped)]
- name: Verdict token
  definition: a chain skill's terminal outcome detected in assistant text
  key_attributes: [token, next_skill?]
  invariants: [unknown or ambiguous token never advances a stage]
- name: Feature
  definition: a chain feature-roster entry
  states: [Planned, Building, QA-Approved, Shipped, Blocked, Cut]
- name: Slice
  definition: issue-level unit of a feature
  states: [planned, published, blocked, in-progress, merged, removed]
- name: Worktree
  definition: per-session isolated git checkout
  invariants: [never tracked by git, never removed while its session is live]
- name: Session PR
  definition: human-gated pull request from a session branch
  invariants: [requires explicit confirmation, never force-pushed, branch must be ahead]

## Relationships
| from | cardinality | to | verb |
| :-- | :-- | :-- | :-- |
| Project | one-to-many | Session | hosts |
| Session | one-to-many | Hook event | emits |
| Session | one-to-many | Transcript message | records |
| Session | one-to-many | Usage sample | accrues |
| Session | zero-or-one | Worktree | runs in |
| Session | zero-or-one | Session PR | ships as |
| Session | one-to-many | Subagent | spawns |
| Transcript message | zero-to-many | Verdict token | carries |
| Verdict token | one-to-one | Stage | advances |
| Feature | one-to-many | Slice | decomposes into |
