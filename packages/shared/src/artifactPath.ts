/**
 * Resolves a stage's artifact reference (StageDef.artifact) to a real file in
 * the project's docs tree. Artifact strings are human descriptions first and
 * paths second, so resolution is best-effort: prose ("routes next slice",
 * "COMPLETE | REJECT") never resolves, while path-like references support
 * `<feature>` substitution, `<placeholder>`/`*` single-segment wildcards,
 * `[a|b]` alternations (".ai/architecture[.md|/]") and trailing-slash
 * directory references (resolved to the first file inside).
 */
import type { DocNode } from './types.js';

/** Flatten a docs tree into file relPaths, preserving the tree's sorted order. */
export function flattenDocFiles(tree: DocNode[]): string[] {
  const out: string[] = [];
  for (const node of tree) {
    if (node.type === 'file') out.push(node.relPath);
    else out.push(...flattenDocFiles(node.children ?? []));
  }
  return out;
}

/**
 * Resolve an artifact reference against the docs tree.
 * Returns the relPath of an existing file, or null when the reference is
 * prose or nothing on disk matches it yet.
 */
export function resolveArtifactPath(
  artifact: string,
  featureSlug: string | null,
  tree: DocNode[],
): string | null {
  const spec = artifact.trim();
  if (!spec || /\s/.test(spec)) return null; // prose, not a path

  const files = flattenDocFiles(tree);
  if (files.length === 0) return null;

  const substituted = featureSlug ? spec.replaceAll('<feature>', featureSlug) : spec;
  for (const candidate of expandAlternations(substituted)) {
    const match = matchCandidate(candidate, files);
    if (match) return match;
  }
  return null;
}

function matchCandidate(candidate: string, files: string[]): string | null {
  if (candidate.endsWith('/')) {
    return files.find((f) => f.startsWith(candidate)) ?? null;
  }
  if (candidate.includes('<') || candidate.includes('*')) {
    const re = wildcardRegex(candidate);
    return files.find((f) => re.test(f)) ?? null;
  }
  return files.includes(candidate) ? candidate : null;
}

/** Expand `[a|b]` alternations into concrete candidates, left to right. */
function expandAlternations(spec: string): string[] {
  const m = /^(.*?)\[([^\]]+)\](.*)$/.exec(spec);
  if (!m) return [spec];
  const [, pre, body, post] = m;
  return body.split('|').flatMap((opt) => expandAlternations(pre + opt + post));
}

/** `<placeholder>` and `*` match one path segment; everything else is literal. */
function wildcardRegex(candidate: string): RegExp {
  const pattern = candidate
    .split(/(<[^>]+>|\*)/)
    .map((part) => (part === '*' || /^<[^>]+>$/.test(part) ? '[^/]+' : escapeRegExp(part)))
    .join('');
  return new RegExp(`^${pattern}$`);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
