/**
 * Preview-pane URL handling. Users type anything from a bare port to a full
 * URL; everything is normalized to an embeddable http(s) URL or rejected.
 */

export function normalizePreviewUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Bare port: "3000" → local dev server.
  if (/^\d+$/.test(raw)) {
    const port = Number(raw);
    if (port < 1 || port > 65535) return null;
    return `http://localhost:${port}/`;
  }

  // host:port shorthand gets the default dev scheme.
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `http://${raw}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  // URL accepts space-containing hostnames in some runtimes; be strict.
  if (!/^[\w.-]+$/.test(url.hostname)) return null;
  return url.href;
}
