#!/usr/bin/env node
//
// Handoff pickup (cross-platform: Windows + macOS + Linux).
//
// IntelliJ cannot be scripted from outside to open a terminal tab, so instead of
// spawning a separate OS window this copies a ready-to-run resume command to the
// clipboard and tells the user to open a new terminal tab INSIDE the IDE and paste.
// One keystroke, runs inside IntelliJ, works on every OS.
//
// Usage: node handoff-pickup.mjs <handoff-file>

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const handoff = process.argv[2];
if (!handoff) { console.error('usage: handoff-pickup.mjs <handoff-file>'); process.exit(1); }

const abs = path.resolve(handoff);
if (!fs.existsSync(abs)) { console.error(`handoff file not found: ${abs}`); process.exit(1); }

// The command the user will paste into a fresh IDE terminal tab. No trailing newline
// is copied, so it won't auto-run — the user reviews it and presses Enter.
const cmd = `claude --dangerously-skip-permissions "Read ${abs} and follow its instructions to continue the work."`;

// Copy to the OS clipboard. Returns the tool used, or null if none worked.
function copyToClipboard(text) {
  const candidates = process.platform === 'darwin'
    ? [['pbcopy', []]]
    : process.platform === 'win32'
      ? [['clip', []]]
      : [['wl-copy', []], ['xclip', ['-selection', 'clipboard']], ['xsel', ['--clipboard', '--input']]];
  for (const [bin, args] of candidates) {
    const r = spawnSync(bin, args, { input: text });
    if (!r.error && r.status === 0) return bin;
  }
  return null;
}

const copied = copyToClipboard(cmd);

const mac = process.platform === 'darwin';
const openTabHint = `open the Terminal tool window (${mac ? '⌥F12' : 'Alt+F12'}), then click the + (New Session) button`;
const pasteHint = mac ? '⌘V' : 'Ctrl+Shift+V';

const lines = [
  '',
  `✅ Handoff written: ${abs}`,
  copied
    ? `📋 Resume command copied to your clipboard (via ${copied}).`
    : '⚠️ No clipboard tool found — copy the command below manually.',
  '',
  `→ In your IDE: ${openTabHint}, then paste (${pasteHint}) and press Enter:`,
  '',
  `   ${cmd}`,
  '',
];
console.log(lines.join('\n'));
