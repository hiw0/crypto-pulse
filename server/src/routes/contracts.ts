import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const contractsRouter = Router();

contractsRouter.get('/trending-cas/:platform', async (req, res, next) => {
  try {
    const { platform } = req.params;
    if (!['twitter', 'telegram'].includes(platform)) {
      res.status(400).json({ error: 'platform must be "twitter" or "telegram"' });
      return;
    }
    const json = await getElfaJson<{ data?: { data?: Array<Record<string, unknown>> } }>(
      `/v2/aggregations/trending-cas/${platform}`,
      { timeWindow: '24h' }
    );
    const raw = json.data?.data ?? [];
    // Normalize: contractAddress -> ca, mentionCount -> mentions
    res.json(raw.map((c: Record<string, unknown>) => ({
      ca: c.contractAddress ?? '',
      chain: c.chain ?? '',
      mentions: c.mentionCount ?? 0,
    })));
  } catch (err) {
    next(err);
  }
});
