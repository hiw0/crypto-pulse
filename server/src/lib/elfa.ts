import { config } from '../config.js';
import { HttpError } from './httpError.js';

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_ELFA_REQUESTS_PER_MINUTE = 55;
const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

const cache = new Map<string, CacheEntry>();
const upstreamRequestTimes: number[] = [];

function pruneRequestTimes(now: number) {
  const cutoff = now - 60_000;
  while (upstreamRequestTimes.length > 0 && upstreamRequestTimes[0] < cutoff) {
    upstreamRequestTimes.shift();
  }
}

function reserveUpstreamSlot() {
  const now = Date.now();
  pruneRequestTimes(now);
  if (upstreamRequestTimes.length >= MAX_ELFA_REQUESTS_PER_MINUTE) {
    throw new HttpError(429, 'Elfa upstream rate limit guard reached. Try again shortly.');
  }
  upstreamRequestTimes.push(now);
}

function cacheKey(pathname: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(pathname, config.elfaBaseUrl);
  Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

async function fetchElfaJson<T>(
  pathname: string,
  init: RequestInit = {},
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  if (!config.elfaApiKey) {
    throw new HttpError(500, 'ELFA_API_KEY is not configured.');
  }

  reserveUpstreamSlot();

  const url = cacheKey(pathname, params);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'x-elfa-api-key': config.elfaApiKey,
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const suffix = detail ? `: ${detail.slice(0, 160)}` : '';
      throw new HttpError(response.status, `Elfa API ${response.status} ${response.statusText}${suffix}`);
    }

    return await response.json() as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new HttpError(504, 'Elfa API request timed out.');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getElfaJson<T>(
  pathname: string,
  params?: Record<string, string | number | boolean | undefined>,
  options: { cacheTtlMs?: number } = {}
): Promise<T> {
  const key = cacheKey(pathname, params);
  const now = Date.now();
  const existing = cache.get(key);
  if (existing && existing.expiresAt > now) {
    return existing.value as T;
  }

  const value = await fetchElfaJson<T>(pathname, {}, params);
  cache.set(key, { value, expiresAt: now + (options.cacheTtlMs ?? CACHE_TTL_MS) });
  return value;
}

export function postElfaJson<T>(pathname: string, body: unknown): Promise<T> {
  return fetchElfaJson<T>(pathname, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function resetElfaRuntimeState() {
  cache.clear();
  upstreamRequestTimes.length = 0;
}
