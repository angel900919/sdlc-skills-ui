/**
 * Parse the declared architecture model — the two markdown tables in
 * `.ai/architecture/02-components.md` (component Definitions + Dependency edges)
 * — into the typed domain shape. The twin derives from this file; it never
 * stores a second copy (ADR-0009). Table-parsing idiom ported from the chain's
 * `project-state.py` (parse_features_table).
 */
import type { ArchEdge, ComponentDecl } from '@sdlc/shared';

/** The raw parse output: declared components (no derived status) + edges. */
export interface ParsedComponentsModel {
  readonly components: ComponentDecl[];
  readonly edges: ArchEdge[];
}

export function parseComponentsModel(markdown: string): ParsedComponentsModel {
  throw new Error('not implemented');
}

export function serializeComponentsModel(model: ParsedComponentsModel): string {
  throw new Error('not implemented');
}
