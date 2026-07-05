import { query, type Options } from "@anthropic-ai/claude-agent-sdk";
import { buildOptions } from "./config.js";

export interface ResearchRun {
  sessionId?: string;
  result?: string;
  isError: boolean;
  costUsd?: number;
  durationMs?: number;
  numTurns?: number;
}

/** One-line console rendering for a tool invocation. */
function describeToolUse(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case "WebSearch":
      return `🔎 WebSearch: ${input.query ?? ""}`;
    case "WebFetch":
      return `🌐 WebFetch: ${input.url ?? ""}`;
    case "Write":
      return `📝 Write: ${input.file_path ?? ""}`;
    case "Read":
      return `📖 Read: ${input.file_path ?? ""}`;
    case "TodoWrite":
      return `🗒️ Updating plan`;
    default:
      return `🔧 ${name}`;
  }
}

/**
 * Run a research task. Streams progress to stdout and returns the final
 * result message plus the session id (usable with --resume for follow-ups).
 */
export async function runResearch(
  prompt: string,
  overrides: Partial<Options> = {},
): Promise<ResearchRun> {
  const run: ResearchRun = { isError: false };

  for await (const message of query({
    prompt,
    options: buildOptions(overrides),
  })) {
    switch (message.type) {
      case "system":
        if (message.subtype === "init") {
          run.sessionId = message.session_id;
          console.log(`▶ session ${message.session_id} (model: ${message.model})`);
        }
        break;

      case "assistant":
        for (const block of message.message.content) {
          if (block.type === "text") {
            process.stdout.write(block.text + "\n");
          } else if (block.type === "tool_use") {
            console.log(
              describeToolUse(block.name, block.input as Record<string, unknown>),
            );
          }
        }
        break;

      case "result":
        run.isError = message.is_error;
        run.durationMs = message.duration_ms;
        run.numTurns = message.num_turns;
        if ("total_cost_usd" in message) {
          run.costUsd = message.total_cost_usd;
        }
        if (message.subtype === "success") {
          run.result = message.result;
        }
        break;

      default:
        break;
    }
  }

  return run;
}
