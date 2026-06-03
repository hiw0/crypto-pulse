import test from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response, NextFunction } from 'express';
import { apiRateLimiter, resetApiRateLimiter } from './rateLimiter.js';
import { HttpError } from '../lib/httpError.js';

function request(ip: string): Request {
  return { ip, socket: { remoteAddress: ip } } as Request;
}

test('apiRateLimiter rejects requests over the per-minute limit', () => {
  resetApiRateLimiter();
  const req = request('127.0.0.1');
  const res = {} as Response;
  let lastError: unknown;
  const next: NextFunction = err => {
    lastError = err;
  };

  for (let i = 0; i < 120; i += 1) {
    lastError = undefined;
    apiRateLimiter(req, res, next);
    assert.equal(lastError, undefined);
  }

  apiRateLimiter(req, res, next);
  assert.ok(lastError instanceof HttpError);
  assert.equal((lastError as HttpError).status, 429);
});
