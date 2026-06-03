import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const keywordsRouter = Router();

keywordsRouter.get('/keyword-mentions', async (req, res, next) => {
  try {
    const keyword = req.query.keyword || '';
    if (!keyword) {
      res.status(400).json({ error: 'keyword query parameter is required' });
      return;
    }
    const json = await getElfaJson<{ data?: Array<Record<string, unknown>> }>(
      '/v2/data/keyword-mentions',
      { keywords: String(keyword) }
    );
    const raw = json.data ?? [];
    // Normalize to frontend shape
    const results = raw.map((m: Record<string, unknown>) => ({
      account: (m.account as Record<string, unknown>)?.username ?? '',
      link: m.link ?? '',
      time: m.mentionedAt ? new Date(m.mentionedAt as string).toISOString().slice(11, 16) : '',
      likes: m.likeCount ?? 0,
      views: m.viewCount ?? 0,
    }));
    res.json({ total: results.length, results });
  } catch (err) {
    next(err);
  }
});
