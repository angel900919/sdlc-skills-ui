#!/usr/bin/env node
//
// Stop hook — context-handoff watchdog (cross-platform: Windows + macOS + Linux).
//
// Runs after every assistant turn. Reads the live context size from the session
// transcript (the most recent turn's input + cached-input tokens). Once that crosses
// CLAUDE_HANDOFF_TOKEN_THRESHOLD, it blocks the stop ONCE per session and feeds Claude
// an instruction to ask the user whether to hand off and prep a fresh seeded session
// for a new IDE terminal tab.
//
// Why Node and not a .sh: Claude Code runs hooks via PowerShell or Git Bash on
// Windows, so a bash script isn't portable. Node (invoked via exec-form in
// settings.json) runs identically on every OS.
//
// Wired as: { "type": "command", "command": "node",
//             "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/handoff-watchdog.mjs"] }
//
// A watchdog must never break the session: every failure path exits 0 (do nothing).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Threshold in tokens. Default ≈20% of a 1,000,000-token window. Raise it for a 1M
// model; lower it (e.g. 150000) for 200k-window models.
const THRESHOLD = parseInt(process.env.CLAUDE_HANDOFF_TOKEN_THRESHOLD || '200000', 10);

function die() { process.exit(0); } // silent no-op

// Read only the tail of a (possibly large) transcript; usage is on the latest lines.
function readTail(file, maxBytes = 512 * 1024) {
  const fd = fs.openSync(file, 'r');
  try {
    const { size } = fs.fstatSync(fd);
    const start = Math.max(0, size - maxBytes);
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    let text = buf.toString('utf8');
    if (start > 0) {
      const nl = text.indexOf('\n');
      if (nl !== -1) text = text.slice(nl + 1); // drop the partial first line
    }
    return text;
  } finally {
    fs.closeSync(fd);
  }
}

// Live context = the newest turn's input_tokens + both cache token counts.
// (output_tokens are not part of the next turn's context.)
function liveTokens(text) {
  let used = 0;
  for (const line of text.split('\n')) {
    const s = line.trim();
    if (!s) continue;
    let obj;
    try { obj = JSON.parse(s); } catch { continue; }
    const u = obj?.message?.usage ?? obj?.usage;
    if (!u) continue;
    used = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
  }
  return used;
}

let input;
try { input = JSON.parse(fs.readFileSync(0, 'utf8')); } catch { die(); }

if (input.stop_hook_active === true) die(); // re-entry guard (avoid loops)

const transcript = input.transcript_path;
const session = input.session_id || 'unknown';
if (!transcript || !fs.existsSync(transcript)) die();

// One nudge per session — a stamp file means we've already asked.
// Re-arm by deleting it (or just start a new session).
const stamp = path.join(os.tmpdir(), `claude_handoff_nudged_${session}`);
if (fs.existsSync(stamp)) die();

let used = 0;
try { used = liveTokens(readTail(transcript)); } catch { die(); }
if (!Number.isFinite(used) || used < THRESHOLD) die();

try { fs.writeFileSync(stamp, ''); } catch { /* best effort */ }

const reason =
  `⚠️ Context watchdog: the live context window is ~${used} tokens (threshold ${THRESHOLD}). ` +
  `STOP coding now. Ask the user this verbatim and WAIT for their answer — do not assume: ` +
  `"Context is getting large (~${used} tokens). Want me to write a handoff doc and prep a fresh, ` +
  `seeded Claude session for a new IDE terminal tab?" ` +
  `If they say YES: follow .claude/skills/handoff-session/SKILL.md to write the handoff document ` +
  `to the OS temp dir, then run: node "$CLAUDE_PROJECT_DIR/.claude/hooks/handoff-pickup.mjs" <that-file> ` +
  `— it copies the resume command to the clipboard and tells the user how to open a new terminal tab ` +
  `inside the IDE and paste it. If they say NO, simply continue.`;

process.stdout.write(JSON.stringify({ decision: 'block', reason }));
process.exit(0);
