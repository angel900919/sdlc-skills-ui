/** Parsing for `git diff --numstat` output. */

export interface DiffFileStat {
  path: string;
  additions: number;
  deletions: number;
  binary: boolean;
}

export function parseNumstat(numstat: string): DiffFileStat[] {
  const out: DiffFileStat[] = [];
  for (const line of numstat.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    const [adds, dels, ...paths] = parts;
    const binary = adds === '-' || dels === '-';
    out.push({
      path: paths.join(' → '),
      additions: binary ? 0 : Number(adds) || 0,
      deletions: binary ? 0 : Number(dels) || 0,
      binary,
    });
  }
  return out;
}
