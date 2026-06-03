import { Router } from 'express';
import { getElfaJson } from '../lib/elfa.js';

export const smartRouter = Router();

smartRouter.get('/smart-stats', async (req, res, next) => {
  try {
    const username = req.query.username || '';
    if (!username) {
      res.status(400).json({ error: 'username query parameter is required' });
      return;
    }
    const json = await getElfaJson<{ data?: Record<string, unknown> }>(
      '/v2/account/smart-stats',
      { username: String(username) }
    );
    const d = json.data ?? {};
    // Normalize to frontend shape and wrap in array
    res.json([{
      username: String(username),
      followers: d.followerCount ?? 0,
      smartFollowers: d.smartFollowerCount ?? 0,
      smartFollowing: d.smartFollowingCount ?? 0,
      avgReach: d.averageReach ?? 0,
      avgEngagement: d.averageEngagement ?? 0,
    }]);
  } catch (err) {
    next(err);
  }
});
