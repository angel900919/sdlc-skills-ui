/**
 * Parse the declared architecture model — the two markdown tables in
 * `.ai/architecture/02-components.md` (component Definitions + Dependency edges)
 * — into the typed domain shape. The twin derives from this file; it never
 * stores a second copy (ADR-0009). Table-parsing idiom ported from the chain's
 * `project-state.py` (parse_features_table).
 */
import fs from 'node:fs';
import path from 'node:path';

import type { ArchEdge, ArchitectureModel, ComponentDecl, ComponentNode } from '@sdlc/shared';

import { deriveComponentStatus } from './deriveComponentStatus.js';

/** The raw parse output: declared components (no derived status) + edges. */
export interface ParsedComponentsModel {
  readonly components: ComponentDecl[];
  readonly edges: ArchEdge[];
}

const MODEL_RELATIVE_PATH = path.join('.ai', 'architecture', '02-components.md');
const CACHE_TTL_MS = 15_000;

interface CacheEntry {
  readonly at: number;
  readonly model: ArchitectureModel;
}
const cache = new Map<string, CacheEntry>();

/**
 * Load the architecture model for a project, lazily and cached (mirrors the
 * projectState TTL idiom). The markdown parse runs at most once per TTL window,
 * keeping it off the request path (NFR-4). Returns null when the project
 * declares no model file.
 */
export function loadArchitecture(projectRoot: string, maxAgeMs = CACHE_TTL_MS): ArchitectureModel | null {
  const cached = cache.get(projectRoot);
  if (cached && Date.now() - cached.at < maxAgeMs) return cached.model;

  const modelPath = path.join(projectRoot, MODEL_RELATIVE_PATH);
  if (!fs.existsSync(modelPath)) return null;

  const parsed = parseComponentsModel(fs.readFileSync(modelPath, 'utf8'));
  const components: ComponentNode[] = parsed.components.map((decl) => ({
    ...decl,
    status: deriveComponentStatus(decl),
  }));
  const model: ArchitectureModel = { components, edges: parsed.edges };
  cache.set(projectRoot, { at: Date.now(), model });
  return model;
}

export function parseComponentsModel(markdown: string): ParsedComponentsModel {
  return {
    components: parseComponents(markdown),
    edges: parseEdges(markdown),
  };
}

/**
 * Serialize back to the two-table markdown form. Canonical (headers normalized,
 * edge `#` regenerated, API-bearing rendered as yes/no) — it reproduces the
 * model, not the source byte-for-byte, so parse∘serialize∘parse is the identity
 * on the model (the NFR-3 round-trip guard).
 */
export function serializeComponentsModel(model: ParsedComponentsModel): string {
  const components = [
    '## Definitions',
    '| Component | Role | Lives at | API-bearing |',
    '| :-- | :-- | :-- | :-- |',
    ...model.components.map(
      (c) => `| ${c.id} | ${c.role} | ${c.livesAt} | ${c.apiBearing ? 'yes' : 'no'} |`,
    ),
  ];
  const edges = [
    '## Dependency edges',
    '| # | From | To | Mode | Evidence |',
    '| :-- | :-- | :-- | :-- | :-- |',
    ...model.edges.map((e, i) => `| ${i + 1} | ${e.from} | ${e.to} | ${e.mode} | ${e.evidence} |`),
  ];
  return [...components, '', ...edges, ''].join('\n');
}

function parseComponents(markdown: string): ComponentDecl[] {
  const table = findTable(markdown, (headers) => headers.some((h) => /^component$/i.test(h)));
  if (!table) return [];
  const id = columnIndex(table.headers, /^component$/i);
  const role = columnIndex(table.headers, /role/i);
  const lives = columnIndex(table.headers, /lives/i);
  const api = columnIndex(table.headers, /api/i);
  return table.rows
    .map((cells) => ({
      id: cells[id] ?? '',
      role: cells[role] ?? '',
      livesAt: cells[lives] ?? '',
      apiBearing: /^yes/i.test(cells[api] ?? ''),
    }))
    .filter((c) => c.id !== '');
}

function parseEdges(markdown: string): ArchEdge[] {
  const table = findTable(
    markdown,
    (headers) => headers.some((h) => /^from$/i.test(h)) && headers.some((h) => /^to$/i.test(h)),
  );
  if (!table) return [];
  const from = columnIndex(table.headers, /^from$/i);
  const to = columnIndex(table.headers, /^to$/i);
  const mode = columnIndex(table.headers, /mode/i);
  const evidence = columnIndex(table.headers, /evidence/i);
  return table.rows
    .map((cells) => ({
      from: cells[from] ?? '',
      to: cells[to] ?? '',
      mode: cells[mode] ?? '',
      evidence: cells[evidence] ?? '',
    }))
    .filter((e) => e.from !== '' && e.to !== '');
}

interface MarkdownTable {
  readonly headers: string[];
  readonly rows: string[][];
}

/**
 * Return the first table whose header row satisfies `matchHeader`, with its
 * separator and blank rows excluded. A table runs from its header to the first
 * line that does not start with `|`. Returns null if no such table exists.
 */
function findTable(markdown: string, matchHeader: (headers: string[]) => boolean): MarkdownTable | null {
  let headers: string[] | null = null;
  const rows: string[][] = [];
  for (const raw of markdown.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('|')) {
      if (headers) break; // the matched table has ended
      continue;
    }
    const cells = splitRow(line);
    if (!headers) {
      if (matchHeader(cells)) headers = cells;
      continue;
    }
    if (!isSeparatorRow(cells)) rows.push(cells);
  }
  return headers ? { headers, rows } : null;
}

/** Split a markdown table row `| a | b |` into trimmed cells `['a', 'b']`. */
function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

/** True for a markdown separator row like `| :-- | :-- |`. */
function isSeparatorRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-+:?$/.test(cell));
}

function columnIndex(headers: string[], pattern: RegExp): number {
  return headers.findIndex((header) => pattern.test(header));
}
