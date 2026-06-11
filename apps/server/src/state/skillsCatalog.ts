import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { SkillInfo } from '@sdlc/shared';
import { phaseForSkill } from '@sdlc/shared';
import { config } from '../config.js';
import { logger } from '../logger.js';

/**
 * Parses .claude/skills/<name>/SKILL.md frontmatter into a catalog.
 * Prefers the managed project's own skills dir; falls back to this repo's.
 */
export function skillsDirFor(projectRoot: string): string {
  const own = path.join(projectRoot, '.claude', 'skills');
  if (fs.existsSync(own)) return own;
  return config.defaultSkillsDir;
}

const cache = new Map<string, { mtime: number; skills: SkillInfo[] }>();

export function loadSkills(projectRoot: string): SkillInfo[] {
  const dir = skillsDirFor(projectRoot);
  let dirMtime = 0;
  try {
    dirMtime = fs.statSync(dir).mtimeMs;
  } catch {
    return [];
  }
  const cached = cache.get(dir);
  if (cached && cached.mtime === dirMtime) return cached.skills;

  const skills: SkillInfo[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const skillFile = path.join(dir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;
    try {
      const fm = matter(fs.readFileSync(skillFile, 'utf-8')).data as Record<string, unknown>;
      skills.push({
        name: String(fm.name ?? entry.name),
        description: String(fm.description ?? '').slice(0, 600),
        phase: phaseForSkill(entry.name),
        path: skillFile,
        argumentHint: fm['argument-hint'] ? String(fm['argument-hint']) : null,
        hasReferences: fs.existsSync(path.join(dir, entry.name, 'references')),
      });
    } catch (err) {
      logger.warn({ err, skill: entry.name }, 'failed to parse SKILL.md');
    }
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  cache.set(dir, { mtime: dirMtime, skills });
  return skills;
}
