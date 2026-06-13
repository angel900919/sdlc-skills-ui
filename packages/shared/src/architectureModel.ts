/**
 * The architecture domain model — the {component, edge} subset of the unified
 * project graph (ADR-0008/0009). Both apps consume these types; the server
 * derives a model by parsing the declared `.ai/architecture/02-components.md`
 * (it never stores a second copy), and the web renders it.
 */

/** Coarse lifecycle status of an architecture node. */
export type ArchNodeStatus = 'done' | 'in-progress' | 'planned' | 'blocked' | 'unknown';

/** A component exactly as declared in `02-components.md` — no derived status. */
export interface ComponentDecl {
  /** The architecture-level component name, e.g. `RunClaudeSessions`. */
  readonly id: string;
  readonly role: string;
  readonly livesAt: string;
  readonly apiBearing: boolean;
}

/** A declared component enriched with its derived as-built status. */
export interface ComponentNode extends ComponentDecl {
  readonly status: ArchNodeStatus;
}

/** A directed dependency edge between two architecture nodes. */
export interface ArchEdge {
  readonly from: string;
  readonly to: string;
  readonly mode: string;
  readonly evidence: string;
}

/** The full architecture model served to the client. */
export interface ArchitectureModel {
  readonly components: readonly ComponentNode[];
  readonly edges: readonly ArchEdge[];
}

/**
 * Roll up child statuses into one. Highest-severity status wins:
 * blocked > in-progress > planned > done. An empty set, or one whose only
 * members are unrecognized, rolls up to `unknown`.
 */
export function rollupStatus(statuses: readonly ArchNodeStatus[]): ArchNodeStatus {
  const bySeverity: readonly ArchNodeStatus[] = ['blocked', 'in-progress', 'planned', 'done'];
  for (const candidate of bySeverity) {
    if (statuses.includes(candidate)) return candidate;
  }
  return 'unknown';
}
