import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { HookCallback } from "@anthropic-ai/claude-agent-sdk";

const LOG_DIR = "logs";
const AUDIT_LOG = path.join(LOG_DIR, "audit.log");

/**
 * PostToolUse hook: append every file the agent writes/edits to an audit log.
 * Cheap, durable record of what the agent touched on disk.
 */
export const auditFileWrites: HookCallback = async (input) => {
  const toolInput = (input as { tool_input?: { file_path?: string } })
    .tool_input;
  const filePath = toolInput?.file_path ?? "unknown";
  await mkdir(LOG_DIR, { recursive: true });
  await appendFile(
    AUDIT_LOG,
    `${new Date().toISOString()}\tmodified\t${filePath}\n`,
  );
  return {};
};
