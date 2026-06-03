import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/httpError.js';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

const clients = new Map<string, number[]>();

function clientKey(req: Request) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function apiRateLimiter(req: Request, _res: Response, next: NextFunction) {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  const key = clientKey(req);
  const times = (clients.get(key) ?? []).filter(ts => ts > cutoff);

  if (times.length >= MAX_REQUESTS_PER_WINDOW) {
    next(new HttpError(429, 'Too many API requests. Try again shortly.'));
    return;
  }

  times.push(now);
  clients.set(key, times);
  next();
}

export function resetApiRateLimiter() {
  clients.clear();
}
