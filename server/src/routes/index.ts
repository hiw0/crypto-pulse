import type { Express } from 'express';
import { trendingRouter } from './trending.js';
import { newsRouter } from './news.js';
import { eventsRouter } from './events.js';
import { narrativesRouter } from './narratives.js';
import { mentionsRouter } from './mentions.js';
import { keywordsRouter } from './keywords.js';
import { smartRouter } from './smart.js';
import { contractsRouter } from './contracts.js';
import { chatRouter } from './chat.js';

export function mountRoutes(app: Express) {
  app.use('/api', trendingRouter);
  app.use('/api', newsRouter);
  app.use('/api', eventsRouter);
  app.use('/api', narrativesRouter);
  app.use('/api', mentionsRouter);
  app.use('/api', keywordsRouter);
  app.use('/api', smartRouter);
  app.use('/api', contractsRouter);
  app.use('/api', chatRouter);
}
