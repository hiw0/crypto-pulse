import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const newsRouter = Router();

newsRouter.get('/token-news', async (_req, res, next) => {
  try {
    const json = await getElfaJson<{ data?: unknown }>('/v2/data/token-news');
    res.json(json.data ?? json);
  } catch (err) {
    next(err);
  }
});
