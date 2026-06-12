/**
 * Dev-server detection for the preview pane: probe the usual local dev ports
 * and report which ones answer HTTP. Loopback only — matches the project's
 * 127.0.0.1-bound posture.
 */

export interface DevServerCandidate {
  port: number;
  url: string;
  status: number;
}

/** Common dev-server ports (Vite, CRA/Next, Angular, Astro, Django, Storybook…). */
const COMMON_DEV_PORTS = [3000, 3001, 4200, 4321, 5173, 5174, 6006, 8000, 8080, 8081];

const PROBE_TIMEOUT_MS = 800;

async function probe(port: number): Promise<DevServerCandidate | null> {
  const url = `http://127.0.0.1:${port}/`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS), redirect: 'manual' });
    // Anything that answers HTTP is a candidate — dev servers 404 on / all the time.
    return { port, url: `http://localhost:${port}/`, status: res.status };
  } catch {
    return null;
  }
}

export async function detectDevServers(): Promise<DevServerCandidate[]> {
  const results = await Promise.all(COMMON_DEV_PORTS.map(probe));
  return results.filter((r): r is DevServerCandidate => r !== null);
}
