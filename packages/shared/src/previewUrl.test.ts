import { describe, expect, it } from 'vitest';
import { normalizePreviewUrl } from './previewUrl.js';

describe('normalizePreviewUrl', () => {
  it('expands a bare port to a localhost URL', () => {
    expect(normalizePreviewUrl('3000')).toBe('http://localhost:3000/');
    expect(normalizePreviewUrl(' 5173 ')).toBe('http://localhost:5173/');
  });

  it('adds the scheme to host:port shorthand', () => {
    expect(normalizePreviewUrl('localhost:5173')).toBe('http://localhost:5173/');
    expect(normalizePreviewUrl('127.0.0.1:8080')).toBe('http://127.0.0.1:8080/');
  });

  it('passes full http(s) URLs through, preserving the path', () => {
    expect(normalizePreviewUrl('http://localhost:3000/app?tab=1')).toBe('http://localhost:3000/app?tab=1');
    expect(normalizePreviewUrl('https://preview.test/page')).toBe('https://preview.test/page');
  });

  it('rejects non-http schemes', () => {
    expect(normalizePreviewUrl('file:///etc/passwd')).toBeNull();
    expect(normalizePreviewUrl('javascript:alert(1)')).toBeNull();
  });

  it('rejects garbage, out-of-range ports and empty input', () => {
    expect(normalizePreviewUrl('')).toBeNull();
    expect(normalizePreviewUrl('   ')).toBeNull();
    expect(normalizePreviewUrl('not a url at all')).toBeNull();
    expect(normalizePreviewUrl('99999')).toBeNull();
    expect(normalizePreviewUrl('0')).toBeNull();
  });
});
