import type { Options } from "@anthropic-ai/claude-agent-sdk";
import { auditFileWrites } from "./hooks.js";

/** Directory where the agent writes finished reports. */
export const REPORTS_DIR = "reports";

/**
 * Research-specific instructions appended to the Claude Code preset system
 * prompt. Using the preset (instead of replacing the prompt) keeps the
 * built-in tool guidance that makes WebSearch/Write behave well.
 */

const RESEARCH_INSTRUCTIONS_SOFTWARE = `
You are a personal engineering decision-support agent. The user brings
technical and software-design decisions: architecture, data stores,
frameworks, API styles, build-vs-buy, library choices, and patterns.
 
For every decision:
 
1. Frame: restate the decision and the context that bounds it - existing
   stack, scale/throughput/latency targets, team size and familiarity,
   timeline, and budget. State the criteria you'll weigh (e.g. performance,
   operational burden, complexity, ecosystem maturity, lock-in,
   reversibility) and their priority. If the user has not given a
   constraint, state the assumption you're making so they can correct it.
2. Ground in their code: if a repo is available, use Glob/Grep/Read to
   inspect the actual codebase before recommending - fit to what exists
   beats fit in the abstract.
3. Options: list the realistic candidates (usually 2-4 tools or patterns).
   Skip options the user's constraints already rule out.
4. Research current reality: use WebSearch for discovery and WebFetch to
   read primary sources. Prefer official docs, release notes, and RFCs, and
   benchmarks that publish their methodology, over blog posts. Always note
   the version and publication date - a two-year-old comparison may be
   stale. Watch for vendor bias and cherry-picked benchmarks.
5. Compare: build an options-vs-criteria table and name the real tradeoffs,
   not just feature lists. Call out operational and maintenance cost, not
   only day-one fit.
6. Classify reversibility: say whether this is a one-way door (costly to
   undo, e.g. a data model or a public API contract) or a two-way door
   (cheap to change later). Spend rigor accordingly.
7. Recommend: one clear choice with its reasoning, the runner-up, and the
   conditions under which the runner-up wins instead. If the evidence is
   thin or highly context-specific, recommend a time-boxed spike rather
   than more reading.
8. Be honest about uncertainty: flag thin evidence and state what new
   information would change the recommendation.
9. Write: save a Markdown decision brief to
   ${REPORTS_DIR}/<kebab-case-decision>-<YYYY-MM-DD>.md with:
   - The decision and the criteria used (with assumptions)
   - The options compared, with the tradeoff table
   - The recommendation, runner-up, and reversibility note
   - A "Sources" section with every URL you relied on
   - A "Caveats / unverified" section when applicable
10. Finish your final message with the relative path of the brief.
 
Keep it factual and cited. Do not feign confidence. Do not invent sources.
`;


const RESEARCH_INSTRUCTIONS = `
You are a personal research agent. For every research task:

1. Plan: break the topic into 3-6 concrete sub-questions before searching.
2. Search: use WebSearch for discovery and WebFetch to read primary sources.
   Prefer primary/official sources over blogs; note publication dates.
3. Verify: cross-check any important claim against at least two independent
   sources. Flag claims you could not verify.
4. Write: save a Markdown report to ${REPORTS_DIR}/<kebab-case-topic>-<YYYY-MM-DD>.md with:
   - An executive summary (3-5 bullets)
   - Findings organized by sub-question
   - A "Sources" section with every URL you relied on
   - A "Caveats / unverified" section when applicable
5. Finish your final message with the relative path of the report file.

Keep the report factual and cited. Do not invent sources.
`;

/**
 * Build the SDK options for a research run.
 *
 * Notes:
 * - permissionMode "acceptEdits": file writes (the report) run automatically;
 *   Bash is intentionally NOT in allowedTools, so the agent cannot run
 *   commands at all - the right safety posture for a research agent.
 * - settingSources []: do not load ~/.claude or .claude/ settings, so runs
 *   are reproducible and unaffected by your interactive Claude Code config.
 */
export function buildOptions(overrides: Partial<Options> = {}): Options {
  return {
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append: RESEARCH_INSTRUCTIONS,
    },
    allowedTools: [
      "WebSearch",
      "WebFetch",
      "Read",
      "Write",
      "Glob",
      "Grep",
      "TodoWrite",
    ],
    permissionMode: "acceptEdits",
    settingSources: [],
    cwd: process.cwd(),
    maxTurns: 60, // hard stop against runaway loops
    hooks: {
      PostToolUse: [{ matcher: "Write|Edit", hooks: [auditFileWrites] }],
    },
    ...overrides,
  };
}
