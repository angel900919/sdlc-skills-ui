/**
 * Session ids are UUIDs (minted by `randomUUID`). A resume id arrives from a
 * request body and flows into both a transcript file path (`<id>.jsonl`) and the
 * claude CLI args (`--resume`/`--session-id`), so a non-UUID value is a
 * path-traversal AND argument-injection vector (scc-7ru). Validate at the
 * spawn boundary; a UUID can neither escape a directory nor begin with `-`.
 */
const SESSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidSessionId(id: string): boolean {
  return SESSION_ID.test(id);
}
