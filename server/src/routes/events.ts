import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const eventsRouter = Router();

eventsRouter.get('/event-summary', async (_req, res, next) => {
  try {
    // Try event-summary first
    try {
      const esJson = await getElfaJson<{ data?: unknown }>('/v2/data/event-summary');
      const esData = esJson.data;
      if (Array.isArray(esData) && esData.length > 0) {
        const events = esData.map((e: Record<string, unknown>) => ({
          summary: String(e.summary ?? e.title ?? ''),
          link: String(e.link ?? e.url ?? ''),
          tag: String(e.tag ?? e.category ?? 'News'),
        }));
        res.json(events);
        return;
      }
    } catch {
      // Fall back to token-news below. This endpoint is cheaper and more available.
    }

    // Fallback to token-news (returns tweets, not summaries)
    const tnJson = await getElfaJson<{ data?: Array<Record<string, unknown>> }>('/v2/data/token-news');
    const raw = tnJson.data ?? [];
    const events = raw.slice(0, 20).map((t: Record<string, unknown>) => ({
      summary: `@${(t.account as Record<string, unknown>)?.username ?? 'unknown'} — Tweet`,
      link: String(t.link ?? ''),
      tag: String(t.type === 'reply' ? 'Reply' : t.type === 'quote' ? 'Quote' : 'Post'),
    }));
    res.json(events);
  } catch (err) {
    next(err);
  }
});
