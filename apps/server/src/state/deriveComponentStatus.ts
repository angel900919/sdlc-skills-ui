import type {
  ArchNodeStatus,
  ComponentDecl,
  ComponentSliceRef,
  FeatureSliceState,
  ProjectState,
} from '@sdlc/shared';

/**
 * A component's work join: the feature it maps to (via `features.md`'s
 * `satisfies` column), that feature's slices, and the derived as-built status.
 * A component with no resolvable feature is honestly unlinked — `feature` is
 * absent, `slices` is empty, and `status` falls back to the coarse as-built
 * `done` rather than synthesizing progress that isn't real.
 */
export interface ComponentWorkJoin {
  readonly status: ArchNodeStatus;
  readonly feature?: string;
  readonly slices: readonly ComponentSliceRef[];
}

/** Maps each architecture component id to the feature slugs that satisfy it. */
export type ComponentFeatureMap = ReadonlyMap<string, readonly string[]>;

/**
 * Join a declared component to its real work in `ProjectState`. Inverts the
 * component→feature mapping back to the feature row, gathers its slices and
 * issue refs, and derives status from the real slice statuses. When the
 * component maps to no feature present in project state, returns the as-built
 * `done` with no slices (the honest "unlinked" case).
 */
export function joinComponentWork(
  component: ComponentDecl,
  componentFeatureMap: ComponentFeatureMap,
  projectState: ProjectState | null,
): ComponentWorkJoin {
  const featureSlugs = componentFeatureMap.get(component.id) ?? [];
  const resolved = resolveFeature(featureSlugs, projectState);
  if (!resolved) return { status: 'done', slices: [] };

  const slices = resolved.slices.map(toSliceRef);
  return { status: deriveSliceStatus(resolved.slices), feature: resolved.slug, slices };
}

interface ResolvedFeature {
  readonly slug: string;
  readonly slices: readonly FeatureSliceState[];
}

/** The first mapped feature slug that actually exists in project state. */
function resolveFeature(
  featureSlugs: readonly string[],
  projectState: ProjectState | null,
): ResolvedFeature | null {
  if (!projectState) return null;
  for (const slug of featureSlugs) {
    const feature = projectState.features.find((f) => f.slug === slug);
    if (feature) return { slug: feature.slug, slices: feature.slices };
  }
  return null;
}

function toSliceRef(slice: FeatureSliceState): ComponentSliceRef {
  return {
    id: slice.id,
    title: slice.title,
    status: slice.status,
    issueRefs: slice.backendRefs,
  };
}

/**
 * Derive a component's status from its feature's slice statuses, highest
 * severity wins: any blocked → blocked, else any in-progress → in-progress,
 * else done. `removed` slices are retired work and don't count; a feature whose
 * slices are all merged (or removed) is `done`.
 */
function deriveSliceStatus(slices: readonly FeatureSliceState[]): ArchNodeStatus {
  const live = slices.filter((s) => s.status !== 'removed');
  if (live.some((s) => s.status === 'blocked')) return 'blocked';
  if (live.some((s) => s.status === 'in-progress')) return 'in-progress';
  return 'done';
}
