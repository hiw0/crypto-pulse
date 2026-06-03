import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const narrativesRouter = Router();

narrativesRouter.get('/trending-narratives', async (_req, res, next) => {
  try {
    const json = await getElfaJson<{ data?: { trending_narratives?: Array<Record<string, unknown>> } }>(
      '/v2/data/trending-narratives'
    );
    const raw = json.data?.trending_narratives ?? [];
    res.json(raw.map((n: Record<string, unknown>) => ({
      narrative: n.narrative ?? '',
      source_links: Array.isArray(n.source_links) ? n.source_links : [],
    })));
  } catch (err) {
    next(err);
  }
});
