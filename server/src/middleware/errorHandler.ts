import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../lib/httpError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[API Error]', err.message);
  const status = err instanceof HttpError ? err.status : 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}
