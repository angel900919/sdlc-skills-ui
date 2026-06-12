import type { TranscriptMessage } from './types.js';
import { extractVerdicts, type Verdict } from './verdicts.js';

/**
 * Session recap: "what happened while this session was unfocused",
 * synthesized purely from data the dashboard already collects (transcript
 * messages + hook events). The CLI's native /recap is model-generated; this
 * one is structural so it never touches the billing path.
 */

/** The subset of HookEvent the recap needs (HookEvent satisfies it). */
export interface RecapHookEvent {
  hookEventName: string;
  receivedAt: string;
  toolName: string | null;
  payload: Record<string, unknown>;
}

export interface SessionRecap {
  sessionId: string;
  /** Last-seen cursor the recap was computed from; null = never seen. */
  since: string | null;
  until: string;
  prompts: number;
  assistantTurns: number;
  toolCalls: number;
  /** Bash invocations, a subset of toolCalls. */
  commandsRun: number;
  /** Distinct files touched via Edit/Write/etc. hooks (capped). */
  filesEdited: string[];
  /** Chain verdict tokens found in the new assistant text. */
  verdicts: Verdict[];
  /** Trimmed snippet of the most recent assistant text. */
  lastAssistantText: string | null;
  /** prompts + assistantTurns + toolCalls — the badge number. */
  activityCount: number;
}

const SNIPPET_MAX_CHARS = 280;
const FILES_EDITED_CAP = 20;
const MUTATION_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);

export function buildRecap(input: {
  sessionId: string;
  since: string | null;
  until: string;
  messages: TranscriptMessage[];
  hookEvents: RecapHookEvent[];
}): SessionRecap {
  const { sessionId, since, until } = input;
  // ISO-8601 UTC timestamps compare correctly as strings.
  const isNew = (ts: string) => since === null || ts > since;

  const newAssistant = input.messages.filter((m) => m.role === 'assistant' && isNew(m.timestamp));

  let prompts = 0;
  let toolCalls = 0;
  let commandsRun = 0;
  const filesEdited: string[] = [];
  for (const e of input.hookEvents) {
    if (!isNew(e.receivedAt)) continue;
    if (e.hookEventName === 'UserPromptSubmit') prompts++;
    if (e.hookEventName === 'PreToolUse') {
      toolCalls++;
      if (e.toolName === 'Bash') commandsRun++;
    }
    if (e.hookEventName === 'PostToolUse' && e.toolName && MUTATION_TOOLS.has(e.toolName)) {
      const toolInput = e.payload.tool_input as Record<string, unknown> | undefined;
      const filePath = typeof toolInput?.file_path === 'string' ? toolInput.file_path : null;
      if (filePath && !filesEdited.includes(filePath) && filesEdited.length < FILES_EDITED_CAP) {
        filesEdited.push(filePath);
      }
    }
  }

  const assistantText = (m: TranscriptMessage) =>
    m.blocks
      .filter((b) => b.type === 'text' && typeof b.text === 'string')
      .map((b) => b.text)
      .join('\n');

  const lastWithText = [...newAssistant].reverse().find((m) => assistantText(m).trim());
  const lastAssistantText = lastWithText
    ? assistantText(lastWithText).trim().slice(0, SNIPPET_MAX_CHARS)
    : null;

  const verdicts = extractVerdicts(newAssistant.map(assistantText).join('\n'));

  const assistantTurns = newAssistant.length;
  return {
    sessionId,
    since,
    until,
    prompts,
    assistantTurns,
    toolCalls,
    commandsRun,
    filesEdited,
    verdicts,
    lastAssistantText,
    activityCount: prompts + assistantTurns + toolCalls,
  };
}
