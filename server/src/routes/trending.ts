import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const trendingRouter = Router();

trendingRouter.get('/trending-tokens', async (_req, res, next) => {
  try {
    const json = await getElfaJson<{ data?: { data?: unknown[] } }>(
      '/v2/aggregations/trending-tokens',
      { timeWindow: '24h' }
    );
    // Normalize: Elfa wraps in { data: { data: [...] } }
    const tokens = (json.data?.data ?? []) as Array<{ token: string; current_count: number; previous_count: number; change_percent: number }>;
    // Token names come back lowercase — uppercase them
    res.json(tokens.map(t => ({ ...t, token: t.token.toUpperCase() })));
  } catch (err) {
    next(err);
  }
});
