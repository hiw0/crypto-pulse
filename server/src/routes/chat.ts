import { Router } from 'express';
import { postElfaJson } from '../lib/elfa.js';

export const chatRouter = Router();

chatRouter.post('/chat', async (req, res, next) => {
  try {
    const json = await postElfaJson('/v2/chat', req.body);
    res.json(json);
  } catch (err) {
    next(err);
  }
});
