import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const mentionsRouter = Router();

mentionsRouter.get('/top-mentions', async (req, res, next) => {
  try {
    const token = req.query.token || 'BTC';
    const json = await getElfaJson<{ data?: Array<Record<string, unknown>> }>(
      '/v2/data/top-mentions',
      { ticker: String(token) }
    );
    const raw = json.data ?? [];
    // Normalize to frontend shape
    // account may be nested object or absent — extract username from link as fallback
    res.json(raw.map((m: Record<string, unknown>) => {
      const acct = m.account as Record<string, unknown> | undefined;
      const link = String(m.link ?? '');
      const username = acct?.username
        ?? link.match(/x\.com\/([^/]+)\//)?.[1]
        ?? '';
      return {
        account: username,
        link,
        likes: m.likeCount ?? 0,
        reposts: m.repostCount ?? 0,
        views: m.viewCount ?? 0,
        smart: (m.repostBreakdown as Record<string, unknown>)?.smart ?? 0,
        bookmarks: m.bookmarkCount ?? 0,
      };
    }));
  } catch (err) {
    next(err);
  }
});
