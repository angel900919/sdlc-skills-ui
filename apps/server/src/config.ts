import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root (two levels up from apps/server/src). */
export const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

export const config = {
  port: Number(process.env.SDLC_PORT ?? 4317),
  host: process.env.SDLC_HOST ?? '127.0.0.1',
  /** Where the SQLite db, logs and generated hook settings live. */
  dataDir: process.env.SDLC_DATA_DIR ?? path.join(REPO_ROOT, 'data'),
  /** Claude CLI binary. */
  claudeBin: process.env.SDLC_CLAUDE_BIN ?? 'claude',
  /** Where Claude Code stores session transcripts. */
  claudeProjectsDir: path.join(os.homedir(), '.claude', 'projects'),
  /** Fallback skills dir (this repo's chain) used when a project has none. */
  defaultSkillsDir: path.join(REPO_ROOT, '.claude', 'skills'),
  /** Python used to run project-state.py (stdlib only). */
  pythonBin: process.env.SDLC_PYTHON_BIN ?? 'python3',
  webDistDir: path.join(REPO_ROOT, 'apps', 'web', 'dist'),
};

/** Claude Code munges the cwd into a transcript folder name. */
export function transcriptDirFor(cwd: string): string {
  return path.join(config.claudeProjectsDir, cwd.replace(/[^a-zA-Z0-9]/g, '-'));
}
