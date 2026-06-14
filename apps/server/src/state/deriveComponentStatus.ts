import type { ArchNodeStatus, ComponentDecl } from '@sdlc/shared';

/**
 * Slice-1 coarse as-built status. A component declared in `02-components.md`
 * describes code that already exists (the model is written "as-is"), so its
 * honest as-built status is `done`. Slice 2 deepens this seam — joining each
 * component to its feature/slice ProjectState for real status — without ever
 * synthesizing progress that isn't real. The declaration is unused at this
 * coarse stage but is the input the richer derivation will read.
 */
export function deriveComponentStatus(_component: ComponentDecl): ArchNodeStatus {
  return 'done';
}
