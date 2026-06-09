import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { mountRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use('/api', apiRateLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

mountRoutes(app);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[server] listening on :${config.port}`);
  console.log(`[server] API key ${config.elfaApiKey ? 'configured' : 'MISSING — set ELFA_API_KEY in server/.env'}`);
});
