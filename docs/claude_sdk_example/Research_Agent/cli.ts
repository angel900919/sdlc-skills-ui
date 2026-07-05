import { mkdir } from "node:fs/promises";
import { parseArgs } from "node:util";
import { runResearch } from "./agent.js";
import { REPORTS_DIR } from "./config.js";

function usage(): never {
  console.error(`Usage:
  npm run research -- "<topic or question>"
  npm run research -- --resume <sessionId> "<follow-up question>"

Examples:
  npm run research -- "State of WebGPU adoption in 2026"
  npm run research -- --resume abc123 "Expand the section on Safari support"`);
  process.exit(1);
}

/** Fail fast with a helpful message when subscription auth isn't configured. */
function checkAuth(): void {
  if (process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "⚠ ANTHROPIC_API_KEY is set - it takes precedence over your subscription.\n" +
        "  For subscription (OAuth) usage run: unset ANTHROPIC_API_KEY",
    );
  }
  if (!process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "ℹ CLAUDE_CODE_OAUTH_TOKEN is not set. If the run fails to authenticate:\n" +
        "    1. claude setup-token        (generates a 1-year subscription token)\n" +
        "    2. export CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-...\n",
    );
  }
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    options: {
      resume: { type: "string" },
    },
    allowPositionals: true,
  });

  const prompt = positionals.join(" ").trim();
  if (!prompt) usage();

  checkAuth();
  await mkdir(REPORTS_DIR, { recursive: true });

  const started = Date.now();
  const run = await runResearch(prompt, values.resume ? { resume: values.resume } : {});

  console.log("\n" + "─".repeat(60));
  if (run.isError) {
    console.error("✗ Run finished with an error.");
    process.exitCode = 1;
  } else {
    console.log("✓ Done.");
  }
  console.log(`  session:  ${run.sessionId ?? "n/a"}  (reuse with --resume)`);
  console.log(`  turns:    ${run.numTurns ?? "n/a"}`);
  console.log(`  duration: ${((run.durationMs ?? Date.now() - started) / 1000).toFixed(1)}s`);
  if (run.costUsd !== undefined) {
    console.log(`  cost:     $${run.costUsd.toFixed(4)} (drawn from your plan's Agent SDK credit)`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : err);
  process.exit(1);
});
