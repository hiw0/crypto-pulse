import 'dotenv/config';

export const config = {
  elfaApiKey: process.env.ELFA_API_KEY || '',
  elfaBaseUrl: 'https://api.elfa.ai',
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
